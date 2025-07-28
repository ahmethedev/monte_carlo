import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button, Checkbox, Card, CardBody } from '@nextui-org/react';
import { PortfolioPerformanceData } from '../../types';
import { portfolioService } from '../../services/portfolioService';

const indexOptions = [
  { key: 'btc', label: 'Bitcoin', color: '#F7931A', dataKey: 'btc_normalized' },
  { key: 'nasdaq', label: 'NASDAQ', color: '#00D4AA', dataKey: 'nasdaq_normalized' },
  { key: 'bist', label: 'BIST 100', color: '#E31837', dataKey: 'bist_normalized' }
];

export const PortfolioPerformanceChart = () => {
  const [selectedIndexes, setSelectedIndexes] = useState<string[]>(['btc']);
  const [timeframe, setTimeframe] = useState<'1M' | '3M' | '6M' | '1Y' | 'ALL'>('1M');
  const [performanceData, setPerformanceData] = useState<PortfolioPerformanceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        let days = 30;
        switch (timeframe) {
          case '3M': days = 90; break;
          case '6M': days = 180; break;
          case '1Y': days = 365; break;
          case 'ALL': days = 999; break;
        }
        
        const data = await portfolioService.getPerformance(days);
        setPerformanceData(data);
      } catch (error) {
        console.error('Error fetching performance data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPerformance();
  }, [timeframe]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (performanceData.length === 0) {
    return (
      <div className="text-center text-gray-400 py-16">
        <p>No performance data available yet.</p>
        <p className="text-sm mt-2">Add some portfolio entries to see performance tracking.</p>
      </div>
    );
  }

  // Normalize data to percentage change from start
  const normalizedData = performanceData.map((data, index) => {
    const base = performanceData[0];
    return {
      ...data,
      date: new Date(data.date).toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' }),
      portfolio_normalized: ((data.portfolio_value - base.portfolio_value) / base.portfolio_value) * 100,
      btc_normalized: data.btc_price ? ((data.btc_price - base.btc_price!) / base.btc_price!) * 100 : 0,
      nasdaq_normalized: data.nasdaq_value ? ((data.nasdaq_value - base.nasdaq_value!) / base.nasdaq_value!) * 100 : 0,
      bist_normalized: data.bist_value ? ((data.bist_value - base.bist_value!) / base.bist_value!) * 100 : 0,
    };
  });

  const handleIndexToggle = (indexKey: string) => {
    setSelectedIndexes(prev => 
      prev.includes(indexKey) 
        ? prev.filter(key => key !== indexKey)
        : [...prev, indexKey]
    );
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-3 rounded-lg border border-gray-600 shadow-lg">
          <p className="text-white font-semibold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value >= 0 ? '+' : ''}{entry.value.toFixed(2)}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Calculate current performance stats
  const currentPortfolioReturn = normalizedData[normalizedData.length - 1]?.portfolio_normalized || 0;
  const bestPerformer = indexOptions.reduce((best, option) => {
    const currentReturn = normalizedData[normalizedData.length - 1]?.[option.dataKey as keyof typeof normalizedData[0]] as number || 0;
    const bestReturn = normalizedData[normalizedData.length - 1]?.[best.dataKey as keyof typeof normalizedData[0]] as number || 0;
    return currentReturn > bestReturn ? option : best;
  }, indexOptions[0]);

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <h2 className="text-xl font-semibold text-white mb-4 lg:mb-0">Performance Comparison</h2>
        
        <div className="flex flex-wrap gap-2">
          {['1M', '3M', '6M', '1Y', 'ALL'].map((period) => (
            <Button
              key={period}
              size="sm"
              variant={timeframe === period ? "solid" : "bordered"}
              color={timeframe === period ? "primary" : "default"}
              onPress={() => setTimeframe(period as any)}
            >
              {period}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardBody className="p-4">
            <div className="text-center">
              <p className="text-gray-400 text-sm">Portfolio Return</p>
              <p className={`text-2xl font-bold ${currentPortfolioReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {currentPortfolioReturn >= 0 ? '+' : ''}{currentPortfolioReturn.toFixed(2)}%
              </p>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardBody className="p-4">
            <div className="text-center">
              <p className="text-gray-400 text-sm">Best Performer</p>
              <p className="text-white font-semibold">{bestPerformer.label}</p>
              <p style={{ color: bestPerformer.color }} className="text-sm font-medium">
                +{(normalizedData[normalizedData.length - 1]?.[bestPerformer.dataKey as keyof typeof normalizedData[0]] as number || 0).toFixed(2)}%
              </p>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700 lg:col-span-2">
          <CardBody className="p-4">
            <p className="text-gray-400 text-sm mb-3">Compare with:</p>
            <div className="flex flex-wrap gap-4">
              {indexOptions.map((option) => (
                <Checkbox
                  key={option.key}
                  isSelected={selectedIndexes.includes(option.key)}
                  onValueChange={() => handleIndexToggle(option.key)}
                  classNames={{
                    wrapper: "before:border-gray-500",
                    label: "text-white text-sm"
                  }}
                >
                  <span style={{ color: option.color }}>●</span> {option.label}
                </Checkbox>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      <Card className="bg-gray-800/50 border-gray-700">
        <CardBody className="p-4">
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={normalizedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                
                <Line
                  type="monotone"
                  dataKey="portfolio_normalized"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  name="Portfolio"
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                />
                
                {selectedIndexes.map((indexKey) => {
                  const option = indexOptions.find(opt => opt.key === indexKey);
                  if (!option) return null;
                  
                  return (
                    <Line
                      key={indexKey}
                      type="monotone"
                      dataKey={option.dataKey}
                      stroke={option.color}
                      strokeWidth={2}
                      name={option.label}
                      dot={{ fill: option.color, strokeWidth: 1, r: 3 }}
                    />
                  );
                })}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardBody>
      </Card>

      <div className="mt-6 text-center">
        <p className="text-gray-400 text-sm">
          Performance comparison shows percentage change from the starting point. 
          <br />
          Portfolio value is calculated based on your actual investments and current market prices.
        </p>
      </div>
    </div>
  );
};