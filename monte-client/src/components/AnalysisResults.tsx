import React from 'react';
import { Brain, TrendingUp, Clock, AlertTriangle, Target, BarChart3 } from 'lucide-react';

interface AnalysisResultsProps {
  analysis: {
    analysis_id: number;
    analysis_text: string;
    metrics: any;
    created_at: string;
    summary: {
      total_trades: number;
      data_period: {
        start: string;
        end: string;
        duration_days: number;
      };
    };
  };
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ analysis }) => {
  const { metrics, analysis_text, summary } = analysis;
  const basic = metrics?.basic_metrics || {};
  const timeAnalysis = metrics?.time_analysis || {};
  const symbolAnalysis = metrics?.symbol_analysis || {};
  const patterns = metrics?.trading_patterns || {};

  // Markdown'ı basit HTML'e çevir
  const formatAnalysisText = (text: string) => {
    return text
      .replace(/### (.*?)$/gm, '<h3 class="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">$1</h3>')
      .replace(/## (.*?)$/gm, '<h2 class="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">$1</h2>')
      .replace(/# (.*?)$/gm, '<h1 class="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/\n\n/g, '</p><p class="text-gray-700 dark:text-gray-300 mb-4">')
      .replace(/\n/g, '<br/>')
      .replace(/^/, '<p class="text-gray-700 dark:text-gray-300 mb-4">')
      .replace(/$/, '</p>');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="h-8 w-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              AI Trading Analysis
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Analysis completed on {new Date(analysis.created_at).toLocaleDateString('tr-TR')}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{summary.total_trades}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Trades</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{summary.data_period.duration_days}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Days</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              ${basic.total_volume?.toLocaleString() || '0'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Volume</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">{symbolAnalysis.unique_symbols || 0}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Unique Pairs</p>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Performance Metrics */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <BarChart3 className="h-6 w-6 text-green-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Performance
            </h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Avg Trade Size</span>
              <span className="font-medium text-gray-900 dark:text-white">
                ${basic.avg_trade_size?.toLocaleString() || '0'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Commission Rate</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {basic.commission_rate?.toFixed(4) || '0'}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total Commission</span>
              <span className="font-medium text-gray-900 dark:text-white">
                ${basic.total_commission?.toFixed(2) || '0'}
              </span>
            </div>
          </div>
        </div>

        {/* Time Analysis */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Clock className="h-6 w-6 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Timing
            </h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Avg Daily Trades</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {timeAnalysis.avg_trades_per_day?.toFixed(1) || '0'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Max Daily Trades</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {timeAnalysis.max_trades_per_day || '0'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Trading Days</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {timeAnalysis.trading_days || '0'}
              </span>
            </div>
          </div>
        </div>

        {/* Behavioral Patterns */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="h-6 w-6 text-orange-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Behavior
            </h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Buy/Sell Ratio</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {patterns.buy_sell_ratio?.toFixed(2) || '0'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Overtrading Score</span>
              <span className={`font-medium ${
                (patterns.overtrading_score || 0) > 0.7 ? 'text-red-500' : 
                (patterns.overtrading_score || 0) > 0.4 ? 'text-yellow-500' : 'text-green-500'
              }`}>
                {((patterns.overtrading_score || 0) * 100).toFixed(0)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Consistency Score</span>
              <span className={`font-medium ${
                (patterns.consistency_score || 0) > 0.7 ? 'text-green-500' : 
                (patterns.consistency_score || 0) > 0.4 ? 'text-yellow-500' : 'text-red-500'
              }`}>
                {((patterns.consistency_score || 0) * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Symbols */}
      {symbolAnalysis.top_traded_symbols && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Target className="h-6 w-6 text-purple-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Most Traded Pairs
            </h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {Object.entries(symbolAnalysis.top_traded_symbols)
              .slice(0, 6)
              .map(([symbol, count]) => (
                <div key={symbol} className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{symbol}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{count} trades</p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Most Active Hours */}
      {timeAnalysis.most_active_hours && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="h-6 w-6 text-indigo-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Most Active Hours
            </h3>
          </div>
          
          <div className="grid grid-cols-5 gap-2">
            {Object.entries(timeAnalysis.most_active_hours)
              .map(([hour, count]) => (
                <div key={hour} className="text-center p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded">
                  <p className="font-medium text-indigo-700 dark:text-indigo-300">{hour}:00</p>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400">{count}</p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* AI Analysis Text */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Brain className="h-6 w-6 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Detailed AI Analysis
          </h3>
        </div>
        
        <div 
          className="prose prose-sm max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: formatAnalysisText(analysis_text) }}
        />
      </div>
    </div>
  );
};

export default AnalysisResults;