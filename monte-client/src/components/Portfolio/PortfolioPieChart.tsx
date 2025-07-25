import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { PortfolioAsset } from '../../types';
import { portfolioService } from '../../services/portfolioService';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316', '#06B6D4', '#84CC16'];

export const PortfolioPieChart = () => {
  const [assets, setAssets] = useState<PortfolioAsset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllocation = async () => {
      try {
        const data = await portfolioService.getAllocation();
        setAssets(data);
      } catch (error) {
        console.error('Error fetching portfolio allocation:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllocation();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (assets.length === 0) {
    return (
      <div className="text-center text-gray-400 py-16">
        <p>No assets in portfolio yet.</p>
        <p className="text-sm mt-2">Add some investments to see your allocation.</p>
      </div>
    );
  }

  const chartData = assets.map((asset, index) => ({
    name: asset.asset,
    value: asset.current_value,
    percentage: asset.percentage_of_portfolio,
    color: COLORS[index % COLORS.length]
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-gray-800 p-3 rounded-lg border border-gray-600 shadow-lg">
          <p className="text-white font-semibold">{data.payload.name}</p>
          <p className="text-blue-400">
            Value: {formatCurrency(data.value)}
          </p>
          <p className="text-gray-300">
            {data.payload.percentage.toFixed(1)}% of portfolio
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-white text-sm">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-6">Asset Allocation</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ percentage }) => `${percentage.toFixed(1)}%`}
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white mb-4">Asset Details</h3>
          {assets.map((asset, index) => (
            <div 
              key={asset.asset}
              className="bg-gray-700/50 p-4 rounded-lg border border-gray-600"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-white font-semibold text-lg">{asset.asset}</span>
                </div>
                <span className="text-gray-300 font-medium">
                  {asset.percentage_of_portfolio.toFixed(1)}%
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Amount</p>
                  <p className="text-white font-medium">{asset.total_amount}</p>
                </div>
                <div>
                  <p className="text-gray-400">Current Price</p>
                  <p className="text-white font-medium">{formatCurrency(asset.current_price)}</p>
                </div>
                <div>
                  <p className="text-gray-400">Invested</p>
                  <p className="text-white font-medium">{formatCurrency(asset.total_invested)}</p>
                </div>
                <div>
                  <p className="text-gray-400">Current Value</p>
                  <p className="text-white font-medium">{formatCurrency(asset.current_value)}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-400">P&L</p>
                  <div className={`flex items-center space-x-2 ${asset.profit_loss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    <span className="font-medium">{formatCurrency(asset.profit_loss)}</span>
                    <span className="text-sm">
                      ({asset.profit_loss >= 0 ? '+' : ''}{asset.profit_loss_percent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};