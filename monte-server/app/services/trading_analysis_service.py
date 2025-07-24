import os
import json
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import func
import pandas as pd
import numpy as np
from openai import OpenAI

from app.models.trading_data import TradingData, TradingSide
from app.models.user import User

class TradingMetricsCalculator:
    """Trading verilerinden metrikler hesaplayan class"""
    
    @staticmethod
    def calculate_metrics(trades: List[TradingData]) -> Dict[str, Any]:
        """Tüm trading metriklerini hesaplar"""
        if not trades:
            return {}
        
        # DataFrame'e çevir
        trade_data = []
        for trade in trades:
            trade_data.append({
                'symbol': trade.symbol,
                'side': trade.side.value,
                'quantity': trade.quantity,
                'price': trade.price,
                'quote_quantity': trade.quote_quantity,
                'commission': trade.commission,
                'trade_time': trade.trade_time,
                'platform': trade.platform.value
            })
        
        df = pd.DataFrame(trade_data)
        
        # Temel metrikler
        total_trades = len(df)
        total_volume = df['quote_quantity'].sum()
        total_commission = df['commission'].sum()
        
        # Sembol analizi
        symbol_stats = df.groupby('symbol').agg({
            'quote_quantity': ['count', 'sum'],
            'commission': 'sum'
        }).round(4)
        
        # Zaman analizi
        df['hour'] = pd.to_datetime(df['trade_time']).dt.hour
        df['day_of_week'] = pd.to_datetime(df['trade_time']).dt.day_name()
        
        hourly_activity = df.groupby('hour').size().to_dict()
        daily_activity = df.groupby('day_of_week').size().to_dict()
        
        # Trading frequency analizi
        df['date'] = pd.to_datetime(df['trade_time']).dt.date
        daily_trade_counts = df.groupby('date').size()
        
        # Pair performance (basit hesaplama - gerçekte P&L lazım)
        top_symbols = df['symbol'].value_counts().head(10).to_dict()
        
        # Platform analizi
        platform_stats = df.groupby('platform').agg({
            'quote_quantity': ['count', 'sum'],
            'commission': 'sum'
        }).to_dict()
        
        return {
            'basic_metrics': {
                'total_trades': total_trades,
                'total_volume': round(total_volume, 2),
                'total_commission': round(total_commission, 4),
                'avg_trade_size': round(total_volume / total_trades, 2) if total_trades > 0 else 0,
                'commission_rate': round((total_commission / total_volume) * 100, 4) if total_volume > 0 else 0
            },
            'time_analysis': {
                'most_active_hours': dict(sorted(hourly_activity.items(), key=lambda x: x[1], reverse=True)[:5]),
                'most_active_days': dict(sorted(daily_activity.items(), key=lambda x: x[1], reverse=True)),
                'avg_trades_per_day': round(daily_trade_counts.mean(), 2),
                'max_trades_per_day': int(daily_trade_counts.max()),
                'trading_days': len(daily_trade_counts)
            },
            'symbol_analysis': {
                'top_traded_symbols': top_symbols,
                'unique_symbols': len(df['symbol'].unique()),
                'symbol_diversity_score': round(1 - (df['symbol'].value_counts().iloc[0] / total_trades), 3) if total_trades > 0 else 0
            },
            'trading_patterns': {
                'buy_sell_ratio': round(len(df[df['side'] == 'BUY']) / len(df[df['side'] == 'SELL']), 2) if len(df[df['side'] == 'SELL']) > 0 else float('inf'),
                'overtrading_score': TradingMetricsCalculator._calculate_overtrading_score(daily_trade_counts),
                'consistency_score': TradingMetricsCalculator._calculate_consistency_score(daily_trade_counts)
            },
            'platform_stats': platform_stats,
            'date_range': {
                'start_date': df['trade_time'].min().isoformat(),
                'end_date': df['trade_time'].max().isoformat(),
                'duration_days': (pd.to_datetime(df['trade_time']).max() - pd.to_datetime(df['trade_time']).min()).days
            }
        }
    
    @staticmethod
    def _calculate_overtrading_score(daily_counts: pd.Series) -> float:
        """Overtrading skorunu hesaplar (0-1 arası, 1 = çok overtrading)"""
        if len(daily_counts) == 0:
            return 0.0
        
        # Günlük ortalama ve standart sapma
        mean_trades = daily_counts.mean()
        std_trades = daily_counts.std()
        
        if std_trades == 0:
            return 0.0
        
        # Yüksek volatilite = overtrading
        volatility_score = min(std_trades / mean_trades, 1.0)
        
        # Çok yüksek günlük trade sayıları
        high_volume_days = (daily_counts > mean_trades + 2 * std_trades).sum()
        high_volume_score = min(high_volume_days / len(daily_counts), 0.5)
        
        return round(volatility_score * 0.7 + high_volume_score * 0.3, 3)
    
    @staticmethod
    def _calculate_consistency_score(daily_counts: pd.Series) -> float:
        """Trading tutarlılık skorunu hesaplar (0-1 arası, 1 = çok tutarlı)"""
        if len(daily_counts) == 0:
            return 0.0
        
        mean_trades = daily_counts.mean()
        std_trades = daily_counts.std()
        
        if mean_trades == 0:
            return 0.0
        
        # Düşük volatilite = yüksek tutarlılık
        consistency = max(0, 1 - (std_trades / mean_trades))
        return round(min(consistency, 1.0), 3)

class OpenAIAnalysisService:
    """OpenAI GPT-4 ile trading analizi yapan servis"""
    
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    
    async def analyze_trading_data(self, user: User, metrics: Dict[str, Any]) -> str:
        """Trading verilerini GPT-4 ile analiz eder"""
        
        # Analiz için prompt hazırla
        analysis_prompt = self._create_analysis_prompt(user.username, metrics)
        
        try:
            response = await self._call_openai_api(analysis_prompt)
            return response
        except Exception as e:
            raise Exception(f"OpenAI API error: {str(e)}")
    
    def _create_analysis_prompt(self, username: str, metrics: Dict[str, Any]) -> str:
        """Analiz için detaylı prompt oluşturur"""
        
        basic = metrics.get('basic_metrics', {})
        time_analysis = metrics.get('time_analysis', {})
        symbol_analysis = metrics.get('symbol_analysis', {})
        patterns = metrics.get('trading_patterns', {})
        date_range = metrics.get('date_range', {})
        
        prompt = f"""
Sen profesyonel bir trading psikoloğu ve risk yönetimi uzmanısın. {username} adlı trader'ın geçmiş trading verilerini analiz edip detaylı bir rapor hazırla.

## TRADING VERİLERİ:

### Temel Metrikler:
- Toplam Trade: {basic.get('total_trades', 0)}
- Toplam Volume: ${basic.get('total_volume', 0):,.2f}
- Ortalama Trade Büyüklüğü: ${basic.get('avg_trade_size', 0):,.2f}
- Toplam Komisyon: ${basic.get('total_commission', 0):,.4f}
- Komisyon Oranı: %{basic.get('commission_rate', 0):.4f}

### Zaman Analizi:
- Trading Süresi: {date_range.get('duration_days', 0)} gün
- Günlük Ortalama Trade: {time_analysis.get('avg_trades_per_day', 0)}
- Maksimum Günlük Trade: {time_analysis.get('max_trades_per_day', 0)}
- En Aktif Saatler: {time_analysis.get('most_active_hours', {})}
- En Aktif Günler: {time_analysis.get('most_active_days', {})}

### Sembol Analizi:
- Unique Sembol Sayısı: {symbol_analysis.get('unique_symbols', 0)}
- En Çok Trade Edilen: {symbol_analysis.get('top_traded_symbols', {})}
- Çeşitlilik Skoru: {symbol_analysis.get('symbol_diversity_score', 0)} (0-1 arası)

### Trading Patterns:
- Buy/Sell Oranı: {patterns.get('buy_sell_ratio', 0)}
- Overtrading Skoru: {patterns.get('overtrading_score', 0)} (0-1 arası, 1=aşırı trading)
- Tutarlılık Skoru: {patterns.get('consistency_score', 0)} (0-1 arası, 1=çok tutarlı)

## ANALİZ TALEBİ:

Lütfen aşağıdaki konularda detaylı analiz yap ve Türkçe rapor hazırla:

### 1. PERFORMANS ANALİZİ
- Trading frequency ve volume analizi
- Komisyon maliyetleri değerlendirmesi
- Trade sizing patterns

### 2. ZAMAN VE DAVRANİŞ ANALİZİ
- En verimli trading saatleri
- Haftalık aktivite patterns
- Overtrading belirtileri

### 3. PSİKOLOJİK PATTERN ANALİZİ
- Revenge trading olasılığı
- FOMO (Fear of Missing Out) belirtileri
- Disciplin seviyesi değerlendirmesi
- Emotional trading patterns

### 4. RİSK YÖNETİMİ
- Position sizing tutarlılığı
- Çeşitlilik (diversification) analizi
- Risk alma patterns

### 5. ÖNERİLER VE İYİLEŞTİRME ALANLARI
- Spesifik iyileştirme önerileri
- Risk azaltma stratejileri
- Trading disiplini önerileri

## FORMAT:
Raporu markdown formatında, başlıklar ve alt başlıklar ile düzenli şekilde hazırla. 
Her bölümde somut bulgular ve sayısal veriler kullan.
Pozitif ve yapıcı bir dil kullan, ancak gerçekçi değerlendirmeler yap.
Öneriler pratik ve uygulanabilir olsun.

RAPOR:
"""
        
        return prompt
    
    async def _call_openai_api(self, prompt: str) -> str:
        """OpenAI API'sini çağırır"""
        try:
            response = self.client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[
                    {
                        "role": "system",
                        "content": """Sen deneyimli bir trading psikoloğu ve risk yönetimi uzmanısın. 
                        Trading verilerini analiz ederek trader'lara değerli insights sağlıyorsun.
                        Türkçe, detaylı, yapıcı ve profesyonel analizler yapıyorsun."""
                    },
                    {
                        "role": "user", 
                        "content": prompt
                    }
                ],
                max_tokens=4000,
                temperature=0.7
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            raise Exception(f"OpenAI API call failed: {str(e)}")

class TradingAnalysisService:
    """Ana trading analiz servisi"""
    
    def __init__(self, db: Session):
        self.db = db
        self.metrics_calculator = TradingMetricsCalculator()
        self.openai_service = OpenAIAnalysisService()
    
    async def analyze_user_trading_data(self, user_id: int) -> Dict[str, Any]:
        """Kullanıcının trading verilerini tam analiz eder"""
        
        # Kullanıcıyı bul
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            raise ValueError("User not found")
        
        # Trading verilerini getir
        trades = self.db.query(TradingData).filter(
            TradingData.user_id == user_id
        ).order_by(TradingData.trade_time.asc()).all()
        
        if not trades:
            raise ValueError("No trading data found for user")
        
        # Metrikleri hesapla
        metrics = self.metrics_calculator.calculate_metrics(trades)
        
        # AI analizi yap
        ai_analysis = await self.openai_service.analyze_trading_data(user, metrics)
        
        return {
            'user_id': user_id,
            'username': user.username,
            'analysis_date': datetime.now().isoformat(),
            'metrics': metrics,
            'ai_analysis': ai_analysis,
            'summary': {
                'total_trades': len(trades),
                'data_period': {
                    'start': trades[0].trade_time.isoformat(),
                    'end': trades[-1].trade_time.isoformat(),
                    'duration_days': (trades[-1].trade_time - trades[0].trade_time).days
                }
            }
        }