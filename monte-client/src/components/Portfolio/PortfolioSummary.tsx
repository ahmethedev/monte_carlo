import { useState, useEffect } from 'react';
import { Card, CardBody } from '@nextui-org/react';
import { TrendingUp, TrendingDown, DollarSign, Package } from 'lucide-react';
import { portfolioService } from '../../services/portfolioService';
import { PortfolioSummary as PortfolioSummaryType } from '../../types';

export const PortfolioSummary = () => {
  const [summary, setSummary] = useState<PortfolioSummaryType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await portfolioService.getSummary();
        setSummary(data);
      } catch (error) {
        console.error('Error fetching portfolio summary:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-gray-800/50 border-gray-700">
            <CardBody className="p-4">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-600 rounded mb-2"></div>
                <div className="h-8 bg-gray-600 rounded"></div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  const isProfit = summary.total_profit_loss >= 0;
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="bg-gray-800/50 border-gray-700">
        <CardBody className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Invested</p>
              <p className="text-white text-2xl font-bold">
                {formatCurrency(summary.total_invested)}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-500" />
          </div>
        </CardBody>
      </Card>

      <Card className="bg-gray-800/50 border-gray-700">
        <CardBody className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Current Value</p>
              <p className="text-white text-2xl font-bold">
                {formatCurrency(summary.current_value)}
              </p>
            </div>
            <Package className="w-8 h-8 text-green-500" />
          </div>
        </CardBody>
      </Card>

      <Card className="bg-gray-800/50 border-gray-700">
        <CardBody className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total P&L</p>
              <p className={`text-2xl font-bold ${isProfit ? 'text-green-500' : 'text-red-500'}`}>
                {formatCurrency(summary.total_profit_loss)}
              </p>
              <p className={`text-sm ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
                {formatPercent(summary.total_profit_loss_percent)}
              </p>
            </div>
            {isProfit ? (
              <TrendingUp className="w-8 h-8 text-green-500" />
            ) : (
              <TrendingDown className="w-8 h-8 text-red-500" />
            )}
          </div>
        </CardBody>
      </Card>

      <Card className="bg-gray-800/50 border-gray-700">
        <CardBody className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Assets</p>
              <p className="text-white text-2xl font-bold">
                {summary.number_of_assets}
              </p>
              <p className="text-gray-400 text-xs">
                Last updated: {new Date(summary.last_updated).toLocaleDateString('tr-TR')}
              </p>
            </div>
            <Package className="w-8 h-8 text-purple-500" />
          </div>
        </CardBody>
      </Card>
    </div>
  );
};