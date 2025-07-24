from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any
import json
import pandas as pd
from io import StringIO

from app.core.database import get_db
from app.models.trading_data import TradingData, TradingAnalysis
from app.models.user import User
from app.utils.csv_parser import BinanceCSVParser, CSVValidator, detect_csv_type
from app.services.auth_service import get_current_user
from app.services.trading_analysis_service import TradingAnalysisService

router = APIRouter(prefix="/trading", tags=["trading"])

@router.post("/test-csv")
async def test_csv_upload(file: UploadFile = File(...)):
    """CSV dosyasını test etmek için basit endpoint"""
    try:
        content = await file.read()
        csv_content = content.decode('utf-8')
        
        csv_type = detect_csv_type(csv_content)
        if not csv_type:
            return {"error": "Unsupported CSV format", "columns": pd.read_csv(StringIO(csv_content)).columns.tolist()}
        
        if csv_type == 'binance_spot':
            trades = BinanceCSVParser.parse_spot_trading_history(csv_content)
        elif csv_type == 'binance_futures':
            trades = BinanceCSVParser.parse_futures_trading_history(csv_content)
        
        return {
            "csv_type": csv_type,
            "total_trades": len(trades),
            "sample_trade": trades[0] if trades else None
        }
        
    except Exception as e:
        return {"error": str(e)}

@router.post("/import-csv")
async def import_trading_csv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Trading CSV dosyasını import eder
    Desteklenen formatlar: Binance Spot, Binance Futures
    """
    
    # Dosya formatı kontrolü
    if not file.filename.endswith('.csv'):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Sadece CSV dosyalar desteklenmektedir"
        )
    
    try:
        # CSV içeriğini oku
        content = await file.read()
        csv_content = content.decode('utf-8')
        
        # CSV türünü algıla
        csv_type = detect_csv_type(csv_content)
        if not csv_type:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Desteklenmeyen CSV formatı. Lütfen Binance Spot veya Futures CSV'si yükleyin."
            )
        
        # CSV'yi validate et
        if csv_type == 'binance_spot':
            validation = CSVValidator.validate_binance_spot_csv(csv_content)
        elif csv_type == 'binance_futures':
            validation = CSVValidator.validate_binance_futures_csv(csv_content)
        
        if not validation['is_valid']:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"CSV formatı geçersiz: {validation.get('error', 'Eksik sütunlar: ' + ', '.join(validation.get('missing_columns', [])))}"
            )
        
        # CSV'yi parse et
        if csv_type == 'binance_spot':
            trades_data = BinanceCSVParser.parse_spot_trading_history(csv_content)
        elif csv_type == 'binance_futures':
            trades_data = BinanceCSVParser.parse_futures_trading_history(csv_content)
        
        # Veritabanına kaydet
        saved_trades = []
        duplicate_count = 0
        
        for trade_data in trades_data:
            # Duplicate kontrolü (aynı kullanıcı, platform, symbol, time, quantity)
            existing_trade = db.query(TradingData).filter(
                TradingData.user_id == current_user.id,
                TradingData.platform == trade_data['platform'],
                TradingData.symbol == trade_data['symbol'],
                TradingData.trade_time == trade_data['trade_time'],
                TradingData.quantity == trade_data['quantity'],
                TradingData.price == trade_data['price']
            ).first()
            
            if existing_trade:
                duplicate_count += 1
                continue
            
            # Yeni trade kaydı oluştur
            trade_record = TradingData(
                user_id=current_user.id,
                **trade_data
            )
            
            db.add(trade_record)
            saved_trades.append(trade_record)
        
        db.commit()
        
        return {
            "message": "CSV başarıyla import edildi",
            "csv_type": csv_type,
            "total_rows": validation['total_rows'],
            "saved_trades": len(saved_trades),
            "duplicate_trades": duplicate_count,
            "period": {
                "start": min(trade.trade_time for trade in saved_trades).isoformat() if saved_trades else None,
                "end": max(trade.trade_time for trade in saved_trades).isoformat() if saved_trades else None
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"CSV import sırasında hata oluştu: {str(e)}"
        )

@router.get("/data")
async def get_trading_data(
    limit: int = 100,
    offset: int = 0,
    symbol: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Kullanıcının trading verilerini getirir"""
    
    query = db.query(TradingData).filter(TradingData.user_id == current_user.id)
    
    if symbol:
        query = query.filter(TradingData.symbol == symbol)
    
    trades = query.order_by(TradingData.trade_time.desc()).offset(offset).limit(limit).all()
    
    total_trades = db.query(TradingData).filter(TradingData.user_id == current_user.id).count()
    
    return {
        "trades": [
            {
                "id": trade.id,
                "symbol": trade.symbol,
                "side": trade.side.value,
                "quantity": trade.quantity,
                "price": trade.price,
                "quote_quantity": trade.quote_quantity,
                "commission": trade.commission,
                "commission_asset": trade.commission_asset,
                "trade_time": trade.trade_time.isoformat(),
                "platform": trade.platform.value
            }
            for trade in trades
        ],
        "total": total_trades,
        "has_more": offset + limit < total_trades
    }

@router.get("/stats")
async def get_trading_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Kullanıcının trading istatistiklerini getirir"""
    
    trades = db.query(TradingData).filter(TradingData.user_id == current_user.id).all()
    
    if not trades:
        return {
            "total_trades": 0,
            "unique_symbols": 0,
            "total_volume": 0.0,
            "total_commission": 0.0,
            "date_range": None
        }
    
    unique_symbols = set(trade.symbol for trade in trades)
    total_volume = sum(trade.quote_quantity for trade in trades)
    total_commission = sum(trade.commission for trade in trades)
    
    # En eski ve en yeni trade tarihleri
    trade_times = [trade.trade_time for trade in trades]
    
    return {
        "total_trades": len(trades),
        "unique_symbols": len(unique_symbols),
        "top_symbols": list(unique_symbols)[:10],
        "total_volume": round(total_volume, 2),
        "total_commission": round(total_commission, 4),
        "date_range": {
            "start": min(trade_times).isoformat(),
            "end": max(trade_times).isoformat()
        },
        "platforms": list(set(trade.platform.value for trade in trades))
    }

@router.delete("/data")
async def delete_all_trading_data(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Kullanıcının tüm trading verilerini siler"""
    
    # Trading data sil
    deleted_trades = db.query(TradingData).filter(TradingData.user_id == current_user.id).delete()
    
    # Analysis data sil
    deleted_analyses = db.query(TradingAnalysis).filter(TradingAnalysis.user_id == current_user.id).delete()
    
    db.commit()
    
    return {
        "message": "Tüm trading verileri silindi",
        "deleted_trades": deleted_trades,
        "deleted_analyses": deleted_analyses
    }

@router.post("/analyze")
async def analyze_trading_data(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Kullanıcının trading verilerini AI ile analiz eder"""
    
    try:
        # Trading data kontrolü
        trades_count = db.query(TradingData).filter(TradingData.user_id == current_user.id).count()
        
        if trades_count == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Analiz için trading verisi bulunamadı. Lütfen önce CSV dosyanızı yükleyin."
            )
        
        if trades_count < 10:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Anlamlı bir analiz için en az 10 trade gerekli. Mevcut trade sayısı: {trades_count}"
            )
        
        # Analiz servisini başlat
        analysis_service = TradingAnalysisService(db)
        
        # Analizi yap
        analysis_result = await analysis_service.analyze_user_trading_data(current_user.id)
        
        # Sonuçları veritabanına kaydet
        analysis_record = TradingAnalysis(
            user_id=current_user.id,
            analysis_text=analysis_result['ai_analysis'],
            metrics=json.dumps(analysis_result['metrics']),
            data_period_start=pd.to_datetime(analysis_result['summary']['data_period']['start']),
            data_period_end=pd.to_datetime(analysis_result['summary']['data_period']['end']),
            total_trades_analyzed=analysis_result['summary']['total_trades']
        )
        
        db.add(analysis_record)
        db.commit()
        db.refresh(analysis_record)
        
        return {
            "message": "Trading analizi başarıyla tamamlandı",
            "analysis_id": analysis_record.id,
            "analysis": analysis_result['ai_analysis'],
            "metrics": analysis_result['metrics'],
            "summary": analysis_result['summary']
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Analiz sırasında hata oluştu: {str(e)}"
        )

@router.get("/analysis/latest")
async def get_latest_analysis(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Kullanıcının en son analizini getirir"""
    
    analysis = db.query(TradingAnalysis).filter(
        TradingAnalysis.user_id == current_user.id
    ).order_by(TradingAnalysis.created_at.desc()).first()
    
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Henüz analiz yapılmamış"
        )
    
    return {
        "analysis_id": analysis.id,
        "analysis_text": analysis.analysis_text,
        "metrics": json.loads(analysis.metrics) if analysis.metrics else {},
        "created_at": analysis.created_at.isoformat(),
        "data_period": {
            "start": analysis.data_period_start.isoformat() if analysis.data_period_start else None,
            "end": analysis.data_period_end.isoformat() if analysis.data_period_end else None
        },
        "total_trades_analyzed": analysis.total_trades_analyzed
    }

@router.get("/analysis/history")
async def get_analysis_history(
    limit: int = 10,
    offset: int = 0,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Kullanıcının analiz geçmişini getirir"""
    
    analyses = db.query(TradingAnalysis).filter(
        TradingAnalysis.user_id == current_user.id
    ).order_by(TradingAnalysis.created_at.desc()).offset(offset).limit(limit).all()
    
    total_analyses = db.query(TradingAnalysis).filter(
        TradingAnalysis.user_id == current_user.id
    ).count()
    
    return {
        "analyses": [
            {
                "analysis_id": analysis.id,
                "created_at": analysis.created_at.isoformat(),
                "total_trades_analyzed": analysis.total_trades_analyzed,
                "data_period": {
                    "start": analysis.data_period_start.isoformat() if analysis.data_period_start else None,
                    "end": analysis.data_period_end.isoformat() if analysis.data_period_end else None
                }
            }
            for analysis in analyses
        ],
        "total": total_analyses,
        "has_more": offset + limit < total_analyses
    }

@router.get("/analysis/{analysis_id}")
async def get_analysis_by_id(
    analysis_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Belirli bir analizi getirir"""
    
    analysis = db.query(TradingAnalysis).filter(
        TradingAnalysis.id == analysis_id,
        TradingAnalysis.user_id == current_user.id
    ).first()
    
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analiz bulunamadı"
        )
    
    return {
        "analysis_id": analysis.id,
        "analysis_text": analysis.analysis_text,
        "metrics": json.loads(analysis.metrics) if analysis.metrics else {},
        "created_at": analysis.created_at.isoformat(),
        "data_period": {
            "start": analysis.data_period_start.isoformat() if analysis.data_period_start else None,
            "end": analysis.data_period_end.isoformat() if analysis.data_period_end else None
        },
        "total_trades_analyzed": analysis.total_trades_analyzed
    }