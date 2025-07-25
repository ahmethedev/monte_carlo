from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from app.models.portfolio import PortfolioEntry, AssetPrice, MarketIndex, PortfolioSnapshot
from app.models.user import User
import requests
import asyncio
from decimal import Decimal
import logging

logger = logging.getLogger(__name__)

class PortfolioService:
    def __init__(self, db: Session):
        self.db = db

    def create_portfolio_entry(
        self, 
        user_id: int, 
        asset_symbol: str, 
        amount: float, 
        purchase_price: float, 
        purchase_date: datetime,
        notes: Optional[str] = None
    ) -> PortfolioEntry:
        """Create a new portfolio entry for a user"""
        entry = PortfolioEntry(
            user_id=user_id,
            asset_symbol=asset_symbol.upper(),
            amount=amount,
            purchase_price=purchase_price,
            purchase_date=purchase_date,
            notes=notes
        )
        self.db.add(entry)
        self.db.commit()
        self.db.refresh(entry)
        return entry

    def get_user_portfolio_entries(self, user_id: int) -> List[PortfolioEntry]:
        """Get all portfolio entries for a user"""
        return self.db.query(PortfolioEntry).filter(
            PortfolioEntry.user_id == user_id
        ).order_by(desc(PortfolioEntry.purchase_date)).all()

    def update_portfolio_entry(
        self, 
        entry_id: int, 
        user_id: int, 
        **kwargs
    ) -> Optional[PortfolioEntry]:
        """Update a portfolio entry"""
        entry = self.db.query(PortfolioEntry).filter(
            PortfolioEntry.id == entry_id,
            PortfolioEntry.user_id == user_id
        ).first()
        
        if not entry:
            return None
            
        for key, value in kwargs.items():
            if hasattr(entry, key):
                setattr(entry, key, value)
        
        self.db.commit()
        self.db.refresh(entry)
        return entry

    def delete_portfolio_entry(self, entry_id: int, user_id: int) -> bool:
        """Delete a portfolio entry"""
        entry = self.db.query(PortfolioEntry).filter(
            PortfolioEntry.id == entry_id,
            PortfolioEntry.user_id == user_id
        ).first()
        
        if not entry:
            return False
            
        self.db.delete(entry)
        self.db.commit()
        return True

    def get_portfolio_summary(self, user_id: int) -> Dict[str, Any]:
        """Get portfolio summary with current values"""
        entries = self.get_user_portfolio_entries(user_id)
        
        if not entries:
            return {
                "total_invested": 0,
                "current_value": 0,
                "total_profit_loss": 0,
                "total_profit_loss_percent": 0,
                "number_of_assets": 0,
                "last_updated": datetime.now().isoformat()
            }

        # Group entries by asset
        assets = {}
        for entry in entries:
            symbol = entry.asset_symbol
            if symbol not in assets:
                assets[symbol] = {
                    "total_amount": 0,
                    "total_invested": 0
                }
            assets[symbol]["total_amount"] += entry.amount
            assets[symbol]["total_invested"] += entry.amount * entry.purchase_price

        # Get current prices and calculate values
        total_invested = 0
        current_value = 0
        
        for symbol, data in assets.items():
            total_invested += data["total_invested"]
            current_price = self.get_current_asset_price(symbol)
            if current_price:
                current_value += data["total_amount"] * current_price
            else:
                # If no current price, use invested value as fallback
                current_value += data["total_invested"]

        total_profit_loss = current_value - total_invested
        total_profit_loss_percent = (total_profit_loss / total_invested * 100) if total_invested > 0 else 0

        return {
            "total_invested": total_invested,
            "current_value": current_value,
            "total_profit_loss": total_profit_loss,
            "total_profit_loss_percent": total_profit_loss_percent,
            "number_of_assets": len(assets),
            "last_updated": datetime.now().isoformat()
        }

    def get_portfolio_allocation(self, user_id: int) -> List[Dict[str, Any]]:
        """Get portfolio asset allocation"""
        entries = self.get_user_portfolio_entries(user_id)
        
        if not entries:
            return []

        # Group by asset
        assets = {}
        total_current_value = 0
        
        for entry in entries:
            symbol = entry.asset_symbol
            if symbol not in assets:
                assets[symbol] = {
                    "asset": symbol,
                    "total_amount": 0,
                    "total_invested": 0,
                    "current_value": 0
                }
            
            assets[symbol]["total_amount"] += entry.amount
            invested = entry.amount * entry.purchase_price
            assets[symbol]["total_invested"] += invested
            
            # Get current price
            current_price = self.get_current_asset_price(symbol)
            if current_price:
                current_value = entry.amount * current_price
                assets[symbol]["current_value"] += current_value
                total_current_value += current_value
            else:
                assets[symbol]["current_value"] += invested
                total_current_value += invested

        # Calculate percentages and profit/loss
        result = []
        for asset_data in assets.values():
            profit_loss = asset_data["current_value"] - asset_data["total_invested"]
            profit_loss_percent = (profit_loss / asset_data["total_invested"] * 100) if asset_data["total_invested"] > 0 else 0
            percentage_of_portfolio = (asset_data["current_value"] / total_current_value * 100) if total_current_value > 0 else 0
            
            current_price = self.get_current_asset_price(asset_data["asset"])
            
            result.append({
                **asset_data,
                "current_price": current_price or 0,
                "profit_loss": profit_loss,
                "profit_loss_percent": profit_loss_percent,
                "percentage_of_portfolio": percentage_of_portfolio
            })

        return sorted(result, key=lambda x: x["current_value"], reverse=True)

    def get_current_asset_price(self, symbol: str) -> Optional[float]:
        """Get current price for an asset"""
        try:
            asset_price = self.db.query(AssetPrice).filter(
                AssetPrice.symbol == symbol.upper()
            ).first()
            
            if asset_price:
                # Check if price is not too old (1 hour)
                if datetime.now() - asset_price.last_updated < timedelta(hours=1):
                    return asset_price.current_price
            
            # If no recent price, try to fetch from API
            new_price = self.fetch_asset_price(symbol)
            if new_price:
                self.update_asset_price(symbol, new_price)
                return new_price
                
            return None
        except Exception as e:
            logger.error(f"Error getting asset price for {symbol}: {e}")
            # Try to fetch from API as fallback
            try:
                new_price = self.fetch_asset_price(symbol)
                if new_price:
                    # Try to create the asset price record
                    try:
                        self.update_asset_price(symbol, new_price)
                    except Exception as update_error:
                        logger.error(f"Error updating asset price for {symbol}: {update_error}")
                    return new_price
            except Exception as fetch_error:
                logger.error(f"Error fetching asset price for {symbol}: {fetch_error}")
            return None

    def fetch_asset_price(self, symbol: str) -> Optional[float]:
        """Fetch current price from external API"""
        try:
            # CoinGecko API for crypto
            if symbol.upper() in ['BTC', 'ETH', 'ADA', 'SOL', 'DOGE', 'MATIC']:
                coin_map = {
                    'BTC': 'bitcoin',
                    'ETH': 'ethereum', 
                    'ADA': 'cardano',
                    'SOL': 'solana',
                    'DOGE': 'dogecoin',
                    'MATIC': 'matic-network'
                }
                coin_id = coin_map.get(symbol.upper())
                if coin_id:
                    response = requests.get(
                        f"https://api.coingecko.com/api/v3/simple/price?ids={coin_id}&vs_currencies=usd",
                        timeout=10
                    )
                    if response.status_code == 200:
                        data = response.json()
                        return data[coin_id]['usd']
            
            # Alpha Vantage for stocks (you'll need API key)
            # For now, return mock prices for stocks
            stock_prices = {
                'AAPL': 195.0,
                'GOOGL': 2800.0,
                'MSFT': 420.0,
                'TSLA': 260.0,
                'AMZN': 3400.0
            }
            
            return stock_prices.get(symbol.upper())
            
        except Exception as e:
            logger.error(f"Error fetching price for {symbol}: {e}")
            return None

    def update_asset_price(self, symbol: str, price: float, **kwargs):
        """Update or create asset price record"""
        try:
            asset_price = self.db.query(AssetPrice).filter(
                AssetPrice.symbol == symbol.upper()
            ).first()
            
            if asset_price:
                asset_price.current_price = price
                asset_price.last_updated = datetime.now()
                for key, value in kwargs.items():
                    if hasattr(asset_price, key):
                        setattr(asset_price, key, value)
            else:
                asset_price = AssetPrice(
                    symbol=symbol.upper(),
                    current_price=price,
                    **kwargs
                )
                self.db.add(asset_price)
            
            self.db.commit()
        except Exception as e:
            logger.error(f"Error updating asset price for {symbol}: {e}")
            self.db.rollback()
            raise

    def get_portfolio_performance(self, user_id: int, days: int = 30) -> List[Dict[str, Any]]:
        """Get historical portfolio performance"""
        # Get snapshots from the last N days
        snapshots = self.db.query(PortfolioSnapshot).filter(
            PortfolioSnapshot.user_id == user_id,
            PortfolioSnapshot.snapshot_date >= datetime.now() - timedelta(days=days)
        ).order_by(PortfolioSnapshot.snapshot_date).all()
        
        # If no snapshots, create initial data
        if not snapshots:
            current_summary = self.get_portfolio_summary(user_id)
            return [{
                "date": datetime.now().isoformat(),
                "portfolio_value": current_summary["current_value"],
                "btc_price": self.get_current_asset_price("BTC"),
                "nasdaq_value": None,  # Implement index tracking
                "bist_value": None
            }]
        
        result = []
        for snapshot in snapshots:
            result.append({
                "date": snapshot.snapshot_date.isoformat(),
                "portfolio_value": snapshot.total_value,
                "btc_price": self.get_current_asset_price("BTC"),
                "nasdaq_value": None,
                "bist_value": None
            })
        
        return result

    def create_portfolio_snapshot(self, user_id: int) -> PortfolioSnapshot:
        """Create a portfolio snapshot for historical tracking"""
        summary = self.get_portfolio_summary(user_id)
        
        snapshot = PortfolioSnapshot(
            user_id=user_id,
            total_value=summary["current_value"],
            total_invested=summary["total_invested"],
            profit_loss=summary["total_profit_loss"],
            profit_loss_percent=summary["total_profit_loss_percent"]
        )
        
        self.db.add(snapshot)
        self.db.commit()
        self.db.refresh(snapshot)
        return snapshot