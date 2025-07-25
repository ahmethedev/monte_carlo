import asyncio
import aiohttp
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.portfolio import AssetPrice, MarketIndex

logger = logging.getLogger(__name__)

class PriceUpdaterService:
    def __init__(self):
        self.crypto_symbols = ['BTC', 'ETH', 'ADA', 'SOL', 'DOGE', 'MATIC']
        self.stock_symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN']
        self.update_interval = 300  # 5 minutes
        
    async def fetch_crypto_prices(self) -> Dict[str, Dict]:
        """Fetch crypto prices from CoinGecko API"""
        try:
            coin_map = {
                'BTC': 'bitcoin',
                'ETH': 'ethereum', 
                'ADA': 'cardano',
                'SOL': 'solana',
                'DOGE': 'dogecoin',
                'MATIC': 'matic-network'
            }
            
            coin_ids = ','.join(coin_map.values())
            url = f"https://api.coingecko.com/api/v3/simple/price?ids={coin_ids}&vs_currencies=usd&include_24hr_change=true"
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url, timeout=10) as response:
                    if response.status == 200:
                        data = await response.json()
                        
                        result = {}
                        for symbol, coin_id in coin_map.items():
                            if coin_id in data:
                                result[symbol] = {
                                    'current_price': data[coin_id]['usd'],
                                    'price_change_percent_24h': data[coin_id].get('usd_24h_change', 0)
                                }
                        
                        return result
                    else:
                        logger.error(f"CoinGecko API error: {response.status}")
                        return {}
                        
        except Exception as e:
            logger.error(f"Error fetching crypto prices: {e}")
            return {}
    
    def get_mock_stock_prices(self) -> Dict[str, Dict]:
        """Get mock stock prices (you can replace with real API)"""
        # Mock data for stocks - replace with real API like Alpha Vantage, Yahoo Finance, etc.
        return {
            'AAPL': {'current_price': 195.0, 'price_change_percent_24h': 2.1},
            'GOOGL': {'current_price': 2800.0, 'price_change_percent_24h': -0.8},
            'MSFT': {'current_price': 420.0, 'price_change_percent_24h': 1.5},
            'TSLA': {'current_price': 260.0, 'price_change_percent_24h': 3.2},
            'AMZN': {'current_price': 3400.0, 'price_change_percent_24h': -1.1}
        }
    
    async def update_asset_prices(self, db: Session):
        """Update asset prices in database"""
        try:
            # Fetch crypto prices
            crypto_prices = await self.fetch_crypto_prices()
            
            # Get mock stock prices  
            stock_prices = self.get_mock_stock_prices()
            
            # Combine all prices
            all_prices = {**crypto_prices, **stock_prices}
            
            # Update database
            for symbol, price_data in all_prices.items():
                asset_price = db.query(AssetPrice).filter(
                    AssetPrice.symbol == symbol
                ).first()
                
                if asset_price:
                    asset_price.current_price = price_data['current_price']
                    asset_price.price_change_percent_24h = price_data.get('price_change_percent_24h', 0)
                    asset_price.last_updated = datetime.now()
                else:
                    asset_price = AssetPrice(
                        symbol=symbol,
                        current_price=price_data['current_price'],
                        price_change_percent_24h=price_data.get('price_change_percent_24h', 0)
                    )
                    db.add(asset_price)
            
            db.commit()
            logger.info(f"Updated prices for {len(all_prices)} assets")
            
        except Exception as e:
            logger.error(f"Error updating asset prices: {e}")
            db.rollback()
    
    async def update_market_indices(self, db: Session):
        """Update market indices"""
        try:
            # Mock data for indices - replace with real APIs
            indices_data = {
                'BTC': {'name': 'Bitcoin', 'current_value': 45000, 'change_percent': 2.5},
                'NASDAQ': {'name': 'NASDAQ Composite', 'current_value': 16200, 'change_percent': 1.2},
                'BIST100': {'name': 'BIST 100', 'current_value': 9100, 'change_percent': -0.8}
            }
            
            for symbol, data in indices_data.items():
                market_index = db.query(MarketIndex).filter(
                    MarketIndex.symbol == symbol
                ).first()
                
                if market_index:
                    market_index.current_value = data['current_value']
                    market_index.change_percent = data['change_percent']
                    market_index.last_updated = datetime.now()
                else:
                    market_index = MarketIndex(
                        symbol=symbol,
                        name=data['name'],
                        current_value=data['current_value'],
                        change_percent=data['change_percent']
                    )
                    db.add(market_index)
            
            db.commit()
            logger.info(f"Updated {len(indices_data)} market indices")
            
        except Exception as e:
            logger.error(f"Error updating market indices: {e}")
            db.rollback()
    
    async def run_periodic_updates(self):
        """Run periodic price updates"""
        logger.info("Starting periodic price updates")
        
        while True:
            try:
                db = next(get_db())
                try:
                    await self.update_asset_prices(db)
                    await self.update_market_indices(db)
                finally:
                    db.close()
                    
                # Wait for next update
                await asyncio.sleep(self.update_interval)
                
            except Exception as e:
                logger.error(f"Error in periodic update loop: {e}")
                await asyncio.sleep(60)  # Wait 1 minute on error

# Global instance
price_updater = PriceUpdaterService()