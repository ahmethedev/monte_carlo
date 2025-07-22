import numpy as np
import pandas as pd
from dataclasses import dataclass
from typing import List, Dict, Optional, Tuple
from datetime import datetime, timedelta
import asyncio
from enum import Enum

class TradeOutcome(Enum):
    WIN = "win"
    LOSS = "loss"

@dataclass
class TradeParameters:
    name: str = ""
    description: str = ""
    initial_balance: float = 0.0
    risk_per_trade_percent: float = 0.0  # % of balance to risk per trade
    risk_reward_ratio: float = 0.0       # R:R ratio (e.g., 1:2 means 1 risk for 2 reward)
    max_trades_per_day: int = 0
    monthly_cashout_percent: float = 0.0  # % of profit to cash out monthly
    win_rate: float = 0.55  # Default win rate (slightly profitable)
    simulation_days: int = 365

@dataclass
class DailyResult:
    date: datetime
    starting_balance: float
    ending_balance: float
    trades_taken: int
    wins: int
    losses: int
    daily_pnl: float
    win_rate: float
    cumulative_pnl: float
    drawdown: float
    max_drawdown_to_date: float
    
@dataclass
class SimulationMetrics:
    total_trades: int
    total_wins: int
    total_losses: int
    overall_win_rate: float
    total_pnl: float
    max_drawdown: float
    max_drawdown_duration: int
    longest_winning_streak: int
    longest_losing_streak: int
    total_cashout: float
    final_balance: float
    sharpe_ratio: float
    profit_factor: float
    average_win: float
    average_loss: float
    largest_win: float
    largest_loss: float

class MonteCarloTradingSimulator:
    def __init__(self, params: TradeParameters):
        self.params = params
        self.daily_results: List[DailyResult] = []
        self.current_balance = params.initial_balance
        self.peak_balance = params.initial_balance
        self.total_cashout = 0.0
        self.current_streak = 0
        self.streak_type = None
        self.max_winning_streak = 0
        self.max_losing_streak = 0
        self.max_drawdown = 0.0
        self.max_drawdown_duration = 0
        self.current_drawdown_duration = 0
        # Trade tracking
        self.all_trades: List[Dict] = []
    
    def simulate_single_trade(self) -> Tuple[TradeOutcome, float]:
        is_win = np.random.random() < self.params.win_rate
        risk_amount = self.current_balance * (self.params.risk_per_trade_percent / 100)
        if is_win:
            pnl = risk_amount * self.params.risk_reward_ratio
            return TradeOutcome.WIN, pnl
        else:
            pnl = -risk_amount
            return TradeOutcome.LOSS, pnl
    
    def simulate_single_day(self, date: datetime) -> DailyResult:
        starting_balance = self.current_balance
        daily_trades = []
        expected_trades = self.params.max_trades_per_day * 0.7 # to make it more realistic
        num_trades = min(np.random.poisson(expected_trades), self.params.max_trades_per_day)
        wins = 0
        losses = 0
        daily_pnl = 0.0
        
        for trade_idx in range(num_trades):
            if self.current_balance <= 0:
                break
            outcome, pnl = self.simulate_single_trade()
            self.current_balance += pnl
            daily_pnl += pnl
            trade_record = {
                'date': date,
                'outcome': outcome,
                'pnl': pnl,
                'balance_after': self.current_balance
            }
            daily_trades.append(trade_record)
            self.all_trades.append(trade_record)
            
            if outcome == TradeOutcome.WIN:
                wins += 1
            else:
                losses += 1
                
        self._update_streaks(wins,losses)
        
        if self.current_balance > self.peak_balance:
            self.peak_balance = self.current_balance
            self.current_drawdown_duration = 0
        else:
            self.current_drawdown_duration += 1
            current_drawdown = (self.peak_balance - self.current_balance)
            self.max_drawdown = max(self.max_drawdown, current_drawdown)
            self.max_drawdown_duration = max(self.max_drawdown_duration, self.current_drawdown_duration)
        
        if num_trades > 0 :
            day_win_rate = wins / num_trades
        else:
            day_win_rate = 0
        
        cumulative_pnl = self.current_balance - self.params.initial_balance
        
        return DailyResult(
            date=date,
            starting_balance=starting_balance,
            ending_balance=self.current_balance,
            trades_taken=num_trades,
            wins=wins,
            losses=losses,
            daily_pnl=daily_pnl,
            win_rate=day_win_rate,
            cumulative_pnl=cumulative_pnl,
            drawdown=(self.peak_balance - self.current_balance) / self.peak_balance * 100,
            max_drawdown_to_date=self.max_drawdown
        )
    
    def _update_streaks(self, wins: int, losses: int):
        if wins > 0 and losses == 0:
            if self.streak_type == 'win':
                self.current_streak += 1
            else:
                self.current_streak = 1
                self.streak_type = 'win'
        elif losses > 0 and wins == 0:
            if self.streak_type == 'loss':
                self.current_streak += 1
            else:
                self.current_streak = 1
                self.streak_type = 'loss'
        else:
            # Mixed day or no trades - reset streak
            self.current_streak = 0
            self.streak_type = None
        
        if self.streak_type == 'win':
            self.max_winning_streak = max(self.max_winning_streak, self.current_streak)
        elif self.streak_type == 'loss':
            self.max_losing_streak = max(self.max_losing_streak, self.current_streak)
    
    def handle_monthly_cashout(self, date: datetime):
        """Handle monthly profit realization"""
        if self.params.monthly_cashout_percent > 0:
            current_profit = self.current_balance - self.params.initial_balance
            if current_profit > 0:
                cashout_amount = current_profit * (self.params.monthly_cashout_percent / 100)
                self.current_balance -= cashout_amount
                self.total_cashout += cashout_amount
    
    async def run_simulation(self, progress_callback=None) -> Tuple[List[DailyResult], SimulationMetrics]:
        start_date = datetime.now()
        for day in range(self.params.simulation_days):
            current_date = start_date + timedelta(days=day)
            # TODO: make this optional to choose crypto and fx
            if current_date.weekday() >= 5:  # Saturday = 5, Sunday = 6
                continue
            daily_result = self.simulate_single_day(current_date)
            self.daily_results.append(daily_result)
            if current_date.day == 1:
                self.handle_monthly_cashout(current_date)
            if progress_callback:
                await progress_callback(day, daily_result)
            await asyncio.sleep(0.01)
        metrics = self._calculate_metrics()
        return self.daily_results, metrics

    def _calculate_metrics(self) -> SimulationMetrics:
        if not self.all_trades:
            return SimulationMetrics(
                total_trades=0, total_wins=0, total_losses=0,
                overall_win_rate=0, total_pnl=0, max_drawdown=0,
                max_drawdown_duration=0, longest_winning_streak=0,
                longest_losing_streak=0, total_cashout=0,
                final_balance=self.current_balance, sharpe_ratio=0,
                profit_factor=0, average_win=0, average_loss=0,
                largest_win=0, largest_loss=0
            )
        total_trades = len(self.all_trades)
        wins = [t for t in self.all_trades if t['outcome'] == TradeOutcome.WIN]
        losses = [t for t in self.all_trades if t['outcome'] == TradeOutcome.LOSS]
        
        total_wins = len(wins)
        total_losses = len(losses)
        overall_win_rate = total_wins / total_trades if total_trades > 0 else 0
        
        total_pnl = sum(t['pnl'] for t in self.all_trades)
        win_amounts = [t['pnl'] for t in wins]
        loss_amounts = [abs(t['pnl']) for t in losses]
        
        average_win = np.mean(win_amounts) if win_amounts else 0
        average_loss = np.mean(loss_amounts) if loss_amounts else 0
        largest_win = max(win_amounts) if win_amounts else 0
        largest_loss = max(loss_amounts) if loss_amounts else 0
        
        # Profit factor
        gross_profit = sum(win_amounts) if win_amounts else 0
        gross_loss = sum(loss_amounts) if loss_amounts else 0
        profit_factor = gross_profit / gross_loss if gross_loss > 0 else float('inf')
        
        if self.daily_results:
            daily_returns = [r.daily_pnl / r.starting_balance for r in self.daily_results if r.starting_balance > 0]
            if daily_returns:
                sharpe_ratio = np.mean(daily_returns) / np.std(daily_returns) * np.sqrt(252) if np.std(daily_returns) > 0 else 0
            else:
                sharpe_ratio = 0
        else:
            sharpe_ratio = 0
        
        return SimulationMetrics(
            total_trades=total_trades,
            total_wins=total_wins,
            total_losses=total_losses,
            overall_win_rate=overall_win_rate,
            total_pnl=total_pnl,
            max_drawdown=self.max_drawdown,
            max_drawdown_duration=self.max_drawdown_duration,
            longest_winning_streak=self.max_winning_streak,
            longest_losing_streak=self.max_losing_streak,
            total_cashout=self.total_cashout,
            final_balance=self.current_balance,
            sharpe_ratio=sharpe_ratio,
            profit_factor=profit_factor,
            average_win=average_win,
            average_loss=average_loss,
            largest_win=largest_win,
            largest_loss=largest_loss
        )

            
if __name__ == "__main__":
    params = TradeParameters(
        initial_balance=10000,
        risk_per_trade_percent=1.0,
        risk_reward_ratio=2.0,
        max_trades_per_day=3,
        monthly_cashout_percent=10.0,
        win_rate=0.55,
        simulation_days=365
    )
    
    simulator = MonteCarloTradingSimulator(params)
    
    async def run_example():
        daily_results, metrics = await simulator.run_simulation()
        
        print(f"Total Trades: {metrics.total_trades}")
        print(f"Win Rate: {metrics.overall_win_rate:.2%}")
        print(f"Total PnL: ${metrics.total_pnl:,.2f}")
        print(f"Max Drawdown: {metrics.max_drawdown:.2f}%")
        print(f"Final Balance: ${metrics.final_balance:,.2f}")
        print(f"Sharpe Ratio: {metrics.sharpe_ratio:.2f}")
    
    asyncio.run(run_example())