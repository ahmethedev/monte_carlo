import pandas as pd
import json
from datetime import datetime
from typing import List, Dict, Any, Optional
from io import StringIO
from app.models.trading_data import TradingSide, TradingPlatform

class BinanceCSVParser:
    """Binance CSV dosyalarını parse etmek için utility class"""
    
    @staticmethod
    def parse_spot_trading_history(csv_content: str) -> List[Dict[str, Any]]:
        """
        Binance Spot Trading History CSV'sini parse eder
        Expected columns: Date(UTC), Pair, Side, Order Amount, Average Price, Fee, Fee Coin, Total
        """
        try:
            # CSV'yi DataFrame'e çevir
            df = pd.read_csv(StringIO(csv_content))
            
            # Sütun adlarını normalize et
            df.columns = df.columns.str.strip()
            
            trades = []
            for _, row in df.iterrows():
                trade_data = {
                    'symbol': str(row.get('Pair', '')).replace('/', ''),  # BTCUSDT format
                    'side': TradingSide.BUY if str(row.get('Side', '')).upper() == 'BUY' else TradingSide.SELL,
                    'quantity': float(row.get('Order Amount', 0)),
                    'price': float(row.get('Average Price', 0)),
                    'quote_quantity': float(row.get('Total', 0)),
                    'commission': float(row.get('Fee', 0)),
                    'commission_asset': str(row.get('Fee Coin', '')),
                    'trade_time': BinanceCSVParser._parse_binance_date(str(row.get('Date(UTC)', ''))),
                    'platform': TradingPlatform.BINANCE,
                    'extra_data': json.dumps({
                        'original_pair': str(row.get('Pair', '')),
                        'raw_data': row.to_dict()
                    })
                }
                trades.append(trade_data)
            
            return trades
            
        except Exception as e:
            raise ValueError(f"Binance Spot Trading History parse hatası: {str(e)}")
    
    @staticmethod
    def parse_futures_trading_history(csv_content: str) -> List[Dict[str, Any]]:
        """
        Binance Futures Trading History CSV'sini parse eder
        Expected columns: Time(UTC), Symbol, Side, Average Price, Executed Amount, Executed Quote Amount, Status
        """
        try:
            df = pd.read_csv(StringIO(csv_content))
            df.columns = df.columns.str.strip()
            
            trades = []
            for _, row in df.iterrows():
                # Sadece FILLED order'ları al
                status = str(row.get('Status', '')).upper()
                if status != 'FILLED':
                    continue
                
                # Average Price boş olanları skip et
                avg_price = str(row.get('Average Price', ''))
                if not avg_price or avg_price == '' or avg_price == 'nan':
                    continue
                
                executed_amount = float(row.get('Executed Amount', 0))
                executed_quote = float(row.get('Executed Quote Amount', 0))
                
                # Sıfır miktar olanları skip et
                if executed_amount <= 0 or executed_quote <= 0:
                    continue
                
                trade_data = {
                    'symbol': str(row.get('Symbol', '')),
                    'side': TradingSide.BUY if str(row.get('Side', '')).upper() == 'BUY' else TradingSide.SELL,
                    'quantity': executed_amount,
                    'price': float(avg_price),
                    'quote_quantity': executed_quote,
                    'commission': 0.0,  # Bu formatta commission bilgisi yok
                    'commission_asset': 'USDT',
                    'trade_time': BinanceCSVParser._parse_binance_date(str(row.get('Time(UTC)', ''))),
                    'platform': TradingPlatform.BINANCE,
                    'trade_id': str(row.get('Order No', '')),
                    'order_id': str(row.get('Order No', '')),
                    'extra_data': json.dumps({
                        'order_type': str(row.get('Type', '')),
                        'position_side': str(row.get('Position Side', '')),
                        'stop_price': str(row.get('Stop Price', '')),
                        'client_order_id': str(row.get('Client Order Id', '')),
                        'raw_data': row.to_dict()
                    })
                }
                trades.append(trade_data)
            
            return trades
            
        except Exception as e:
            raise ValueError(f"Binance Futures Trading History parse hatası: {str(e)}")
    
    @staticmethod
    def _parse_binance_date(date_str: str) -> datetime:
        """Binance tarih formatını datetime'a çevirir"""
        try:
            # Binance genelde bu formatları kullanır
            formats = [
                "%Y-%m-%d %H:%M:%S",
                "%Y-%m-%d %H:%M:%S.%f",
                "%m/%d/%Y %H:%M:%S",
                "%d/%m/%Y %H:%M:%S"
            ]
            
            for fmt in formats:
                try:
                    return datetime.strptime(date_str.strip(), fmt)
                except ValueError:
                    continue
            
            # Hiçbiri işe yaramazsa default
            return datetime.now()
            
        except Exception:
            return datetime.now()

class CSVValidator:
    """CSV dosyalarını validate etmek için utility class"""
    
    @staticmethod
    def validate_binance_spot_csv(csv_content: str) -> Dict[str, Any]:
        """Binance Spot CSV'sinin formatını kontrol eder"""
        try:
            df = pd.read_csv(StringIO(csv_content))
            
            required_columns = ['Date(UTC)', 'Pair', 'Side', 'Order Amount', 'Average Price', 'Fee', 'Total']
            missing_columns = [col for col in required_columns if col not in df.columns]
            
            return {
                'is_valid': len(missing_columns) == 0,
                'missing_columns': missing_columns,
                'total_rows': len(df),
                'columns': list(df.columns)
            }
            
        except Exception as e:
            return {
                'is_valid': False,
                'error': str(e),
                'total_rows': 0,
                'columns': []
            }
    
    @staticmethod
    def validate_binance_futures_csv(csv_content: str) -> Dict[str, Any]:
        """Binance Futures CSV'sinin formatını kontrol eder"""
        try:
            df = pd.read_csv(StringIO(csv_content))
            
            required_columns = ['Time(UTC)', 'Symbol', 'Side', 'Average Price', 'Executed Amount', 'Executed Quote Amount', 'Status']
            missing_columns = [col for col in required_columns if col not in df.columns]
            
            return {
                'is_valid': len(missing_columns) == 0,
                'missing_columns': missing_columns,
                'total_rows': len(df),
                'columns': list(df.columns)
            }
            
        except Exception as e:
            return {
                'is_valid': False,
                'error': str(e),
                'total_rows': 0,
                'columns': []
            }

def detect_csv_type(csv_content: str) -> Optional[str]:
    """CSV dosyasının türünü otomatik olarak algılar"""
    try:
        df = pd.read_csv(StringIO(csv_content))
        columns = [col.strip() for col in df.columns]
        
        # Binance Spot kontrol
        spot_columns = ['Date(UTC)', 'Pair', 'Side', 'Order Amount', 'Average Price']
        spot_match = sum(1 for col in spot_columns if col in columns)
        
        # Binance Futures kontrol (yeni format)
        futures_columns = ['Time(UTC)', 'Symbol', 'Side', 'Average Price', 'Executed Amount', 'Executed Quote Amount', 'Status']
        futures_match = sum(1 for col in futures_columns if col in columns)
        
        if spot_match >= 4:
            return 'binance_spot'
        elif futures_match >= 6:
            return 'binance_futures'
        else:
            return None
            
    except Exception:
        return None