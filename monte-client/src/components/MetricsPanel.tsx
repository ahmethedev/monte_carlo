import React from 'react';
import { TrendingUp, TrendingDown, Target, Award } from 'lucide-react';
import { SimulationMetrics } from '../types/simulation';

interface MetricsPanelProps {
  metrics: SimulationMetrics | null;
}

export function MetricsPanel({ metrics }: MetricsPanelProps) {
  if (!metrics) {
    return (
      <div className="bg-gray-900 rounded-lg shadow-xl p-6 border border-gray-800">
        <h3 className="text-lg font-semibold text-white mb-4">Performance Metrics</h3>
        <div className="flex items-center justify-center h-32 text-gray-400">
          Complete simulation to see metrics
        </div>
      </div>
    );
  }

  const metricItems = [
    {
      label: 'Total Trades',
      value: metrics.total_trades.toLocaleString(),
      icon: Target,
      color: 'text-green-400',
    },
    {
      label: 'Win Rate',
      value: `${(metrics.overall_win_rate * 100).toFixed(1)}%`,
      icon: Award,
      color: metrics.overall_win_rate > 0.5 ? 'text-green-400' : 'text-red-400',
    },
    {
      label: 'Total P&L',
      value: `$${metrics.total_pnl.toLocaleString()}`,
      icon: metrics.total_pnl >= 0 ? TrendingUp : TrendingDown,
      color: metrics.total_pnl >= 0 ? 'text-green-400' : 'text-red-400',
    },
    {
      label: 'Final Balance',
      value: `$${metrics.final_balance.toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-green-400',
    },
    {
      label: 'Max Drawdown',
      value: `$${metrics.max_drawdown.toLocaleString()}`,
      icon: TrendingDown,
      color: 'text-red-400',
    },
    {
      label: 'Sharpe Ratio',
      value: metrics.sharpe_ratio.toFixed(2),
      icon: Target,
      color: metrics.sharpe_ratio > 1 ? 'text-green-400' : 'text-yellow-400',
    },
    {
      label: 'Profit Factor',
      value: metrics.profit_factor.toFixed(2),
      icon: Award,
      color: metrics.profit_factor > 1 ? 'text-green-400' : 'text-red-400',
    },
    {
      label: 'Longest Win Streak',
      value: metrics.longest_winning_streak.toString(),
      icon: TrendingUp,
      color: 'text-green-400',
    },
  ];

  return (
    <div className="bg-gray-900 rounded-lg shadow-xl p-6 border border-gray-800">
      <h3 className="text-lg font-semibold text-white mb-6">Performance Metrics</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metricItems.map((item, index) => (
          <div key={index} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <item.icon className={`h-4 w-4 ${item.color}`} />
              <span className="text-sm text-gray-400">{item.label}</span>
            </div>
            <div className={`text-lg font-semibold ${item.color}`}>
              {item.value}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Average Win: </span>
            <span className="font-medium text-green-400">
              ${metrics.average_win.toFixed(2)}
            </span>
          </div>
          <div>
            <span className="text-gray-400">Average Loss: </span>
            <span className="font-medium text-red-400">
              ${metrics.average_loss.toFixed(2)}
            </span>
          </div>
          <div>
            <span className="text-gray-400">Total Cashout: </span>
            <span className="font-medium text-green-400">
              ${metrics.total_cashout.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}