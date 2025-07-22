import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Cell, BarChart, Bar } from 'recharts';
import { ChartsPanelProps, TooltipProps } from '../types';
import { useThrottle } from '../hooks/useThrottle';
import { useMemo, useCallback } from 'react';

export function ChartsPanel({ dailyResults }: ChartsPanelProps) {
  const throttledDailyResults = useThrottle(dailyResults, 200);  
  // Memoize chart data to prevent unnecessary recalculations
  const chartData = useMemo(() => {
    return throttledDailyResults.map((result, index) => ({
      day: index + 1,
      balance: result.ending_balance,
      dailyPnl: result.daily_pnl,
      drawdown: result.drawdown,
      cumulativePnl: result.cumulative_pnl,
    }));
  }, [throttledDailyResults]);

  const CustomTooltip = useCallback(({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-gray-300">{`Day ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="font-medium">
              {`${entry.name}: ${entry.name.includes('$') ? '$' : ''}${typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}${entry.name.includes('%') ? '%' : ''}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  }, []);

  // Early return AFTER all hooks have been called
  if (!throttledDailyResults.length) {
    return (
      <div className="bg-gray-900 rounded-lg shadow-xl p-6 border border-gray-800">
        <h3 className="text-lg font-semibold text-white mb-4">Performance Charts</h3>
        <div className="flex items-center justify-center h-64 text-gray-400">
          Start a simulation to see charts
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Balance Evolution */}
      <div className="bg-gray-900 rounded-lg shadow-xl p-6 border border-gray-800">
        <h3 className="text-lg font-semibold text-white mb-4">Account Balance Over Time</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#9CA3AF" />
              <YAxis
                tickFormatter={(value) => `$${value.toLocaleString()}`}
                stroke="#9CA3AF"
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
                width={80}
                domain={['dataMin', 'dataMax']}
              />
              <Tooltip content={<CustomTooltip active={false} payload={[]} label="" />} />
              <Area 
                type="monotone" 
                dataKey="balance" 
                stroke="#10B981" 
                fill="#10B981" 
                fillOpacity={0.3}
                name="Balance"
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Daily P&L with Bar Chart */}
      <div className="bg-gray-900 rounded-lg shadow-xl p-6 border border-gray-800">
        <h3 className="text-lg font-semibold text-white mb-4">Daily P&L</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#9CA3AF" />
              <YAxis 
                tickFormatter={(value) => `$${value}`} 
                stroke="#9CA3AF"
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip active={false} payload={[]} label="" />} />
              <Bar dataKey="dailyPnl" name="Daily P&L" isAnimationActive={false}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.dailyPnl >= 0 ? '#10B981' : '#EF4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cumulative P&L Line Chart */}
      <div className="bg-gray-900 rounded-lg shadow-xl p-6 border border-gray-800">
        <h3 className="text-lg font-semibold text-white mb-4">Cumulative P&L</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#9CA3AF" />
              <YAxis 
                tickFormatter={(value) => `$${value}`} 
                stroke="#9CA3AF"
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip active={false} payload={[]} label="" />} />
              <Line 
                type="monotone" 
                dataKey="cumulativePnl" 
                stroke="#8B5CF6" 
                strokeWidth={2}
                dot={false}
                name="Cumulative P&L"
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Drawdown */}
      <div className="bg-gray-900 rounded-lg shadow-xl p-6 border border-gray-800">
        <h3 className="text-lg font-semibold text-white mb-4">Drawdown (%)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#9CA3AF" />
              <YAxis 
                tickFormatter={(value) => `${value.toFixed(1)}%`} 
                stroke="#9CA3AF"
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip active={false} payload={[]} label="" />} />
              <Area 
                type="monotone" 
                dataKey="drawdown" 
                stroke="#EF4444" 
                fill="#EF4444" 
                fillOpacity={0.3}
                name="Drawdown %"
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}