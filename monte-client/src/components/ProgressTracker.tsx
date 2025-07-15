import { Activity, TrendingUp, TrendingDown } from 'lucide-react';
import { ProgressTrackerProps } from '../types';
import { useThrottle } from '../hooks/useThrottle'; // Import the throttle hook
import { useMemo } from 'react';

export function ProgressTracker({ currentDay, totalDays, status, latestResult }: ProgressTrackerProps) {
  // Throttle the progress updates to 100ms intervals
  const throttledCurrentDay = useThrottle(currentDay, 100);
  const throttledLatestResult = useThrottle(latestResult, 100);
  
  const progress = useMemo(() => {
    return totalDays > 0 ? (throttledCurrentDay / totalDays) * 100 : 0;
  }, [throttledCurrentDay, totalDays]);

  return (
    <div className="bg-gray-900 rounded-lg shadow-xl p-6 border border-gray-800">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="h-5 w-5 text-green-400" />
        <h3 className="text-lg font-semibold text-white">Simulation Progress</h3>
      </div>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm text-gray-400 mb-1">
            <span>Day {throttledCurrentDay} of {totalDays}</span>
            <span>{progress.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${
            status === 'running' ? 'bg-green-400 animate-pulse' :
            status === 'paused' ? 'bg-yellow-400' :
            status === 'completed' ? 'bg-green-400' :
            status === 'error' ? 'bg-red-400' :
            'bg-gray-500'
          }`} />
          <span className="text-sm font-medium text-gray-300 capitalize">{status}</span>
        </div>
        {throttledLatestResult && (
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-800">
            <div>
              <div className="text-sm text-gray-400">Current Balance</div>
              <div className="text-lg font-semibold text-white">
                ${throttledLatestResult.ending_balance.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Daily P&L</div>
              <div className={`text-lg font-semibold flex items-center gap-1 ${
                throttledLatestResult.daily_pnl >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {throttledLatestResult.daily_pnl >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                ${throttledLatestResult.daily_pnl.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Trades Today</div>
              <div className="text-lg font-semibold text-white">{throttledLatestResult.trades_taken}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Win Rate</div>
              <div className="text-lg font-semibold text-white">
                {(throttledLatestResult.win_rate * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}