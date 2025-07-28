import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { 
  Card, 
  CardBody, 
  CardHeader, 
  Button, 
  Chip,
  Progress,
  Divider
} from '@nextui-org/react';
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  BarChart3,
  PlayCircle,
  Briefcase,
  BookOpen,
  Bot,
  Activity,
  Calendar,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Eye
} from 'lucide-react';

const Dashboard = () => {
  const { user, hasProAccess } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Mock data - in real app this would come from API
  const portfolioData = {
    totalValue: 125430.50,
    totalChange: 2340.80,
    changePercent: 1.87,
    assets: 8
  };

  const recentSimulations = [
    { id: 1, name: 'Conservative Strategy', date: '2 hours ago', profit: 5.2, status: 'completed' },
    { id: 2, name: 'Aggressive Growth', date: '1 day ago', profit: -2.1, status: 'completed' },
    { id: 3, name: 'Balanced Approach', date: '3 days ago', profit: 8.5, status: 'completed' }
  ];

  const marketIndices = [
    { name: 'NASDAQ', value: '14,250.10', change: '+1.25%', isPositive: true },
    { name: 'S&P 500', value: '4,180.50', change: '+0.87%', isPositive: true },
    { name: 'BTC/USD', value: '$43,250', change: '-2.15%', isPositive: false }
  ];

  const quickActions = [
    { title: 'New Simulation', icon: PlayCircle, href: '/app/simulation', color: 'primary' },
    { title: 'View Portfolio', icon: Briefcase, href: '/app/portfolio', color: 'success' },
    { title: 'Trading Journal', icon: BookOpen, href: '/app/journal', color: 'warning', isPro: true },
    { title: 'AI Assistant', icon: Bot, href: '/app/assistant', color: 'secondary' }
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Welcome Header */}
      <div className="card p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {user?.username}!
            </h1>
            <p className="text-gray-400">
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Chip
              color={hasProAccess() ? "primary" : "default"}
              variant="flat"
              startContent={<Target className="w-4 h-4" />}
            >
              {hasProAccess() ? 'Pro Member' : 'Free Plan'}
            </Chip>
            {!hasProAccess() && (
              <Button 
                as={Link}
                to="/app/pricing"
                color="primary" 
                size="sm"
                className="btn-primary"
              >
                Upgrade to Pro
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action) => {
          const Icon = action.icon;
          const canAccess = !action.isPro || hasProAccess();
          
          return (
            <Card 
              key={action.title}
              className={`glass hover:scale-105 transition-transform duration-200 ${
                !canAccess ? 'opacity-60' : 'cursor-pointer'
              }`}
              isPressable={canAccess}
              as={canAccess ? Link : 'div'}
              to={canAccess ? action.href : undefined}
            >
              <CardBody className="flex flex-row items-center gap-3 p-4">
                <div className={`p-2 rounded-lg bg-${action.color}-500/20`}>
                  <Icon className={`w-5 h-5 text-${action.color}-400`} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white">{action.title}</p>
                  {action.isPro && !hasProAccess() && (
                    <p className="text-xs text-orange-400">Pro only</p>
                  )}
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-400" />
              </CardBody>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Portfolio Overview */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between w-full">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Portfolio Overview
                </h3>
                <Button 
                  as={Link}
                  to="/app/portfolio"
                  variant="ghost" 
                  size="sm"
                  endContent={<Eye className="w-4 h-4" />}
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-400">Total Value</p>
                  <p className="text-2xl font-bold text-white">
                    ${portfolioData.totalValue.toLocaleString()}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-400">24h Change</p>
                  <div className="flex items-center justify-center gap-1">
                    {portfolioData.changePercent > 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-400" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-400" />
                    )}
                    <p className={`text-lg font-semibold ${
                      portfolioData.changePercent > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {portfolioData.changePercent > 0 ? '+' : ''}
                      {portfolioData.changePercent}%
                    </p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-400">Assets</p>
                  <p className="text-2xl font-bold text-white">{portfolioData.assets}</p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Recent Simulations */}
          <Card className="glass">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between w-full">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Recent Simulations
                </h3>
                <Button 
                  as={Link}
                  to="/app/simulation"
                  variant="ghost" 
                  size="sm"
                  endContent={<PlayCircle className="w-4 h-4" />}
                >
                  New Simulation
                </Button>
              </div>
            </CardHeader>
            <CardBody className="space-y-3">
              {recentSimulations.map((sim, index) => (
                <div key={sim.id}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">{sim.name}</p>
                      <p className="text-sm text-gray-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {sim.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        {sim.profit > 0 ? (
                          <ArrowUpRight className="w-4 h-4 text-green-400" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 text-red-400" />
                        )}
                        <span className={`font-semibold ${
                          sim.profit > 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {sim.profit > 0 ? '+' : ''}{sim.profit}%
                        </span>
                      </div>
                      <Chip 
                        size="sm" 
                        color="success" 
                        variant="flat"
                      >
                        {sim.status}
                      </Chip>
                    </div>
                  </div>
                  {index < recentSimulations.length - 1 && (
                    <Divider className="bg-gray-700 mt-3" />
                  )}
                </div>
              ))}
            </CardBody>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Market Overview */}
          <Card className="glass">
            <CardHeader>
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Market Overview
              </h3>
            </CardHeader>
            <CardBody className="space-y-3">
              {marketIndices.map((index, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">{index.name}</p>
                      <p className="text-sm text-gray-400">{index.value}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {index.isPositive ? (
                        <TrendingUp className="w-4 h-4 text-green-400" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-400" />
                      )}
                      <span className={`text-sm font-medium ${
                        index.isPositive ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {index.change}
                      </span>
                    </div>
                  </div>
                  {i < marketIndices.length - 1 && (
                    <Divider className="bg-gray-700 mt-3" />
                  )}
                </div>
              ))}
            </CardBody>
          </Card>

          {/* Performance Summary */}
          <Card className="glass">
            <CardHeader>
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <Target className="w-5 h-5" />
                This Month
              </h3>
            </CardHeader>
            <CardBody className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-400">Portfolio Growth</span>
                  <span className="text-sm font-medium text-green-400">+12.5%</span>
                </div>
                <Progress 
                  value={75} 
                  color="success"
                  className="max-w-full"
                />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-400">Simulations Run</span>
                  <span className="text-sm font-medium text-blue-400">8/10</span>
                </div>
                <Progress 
                  value={80} 
                  color="primary"
                  className="max-w-full"
                />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-400">Success Rate</span>
                  <span className="text-sm font-medium text-purple-400">68%</span>
                </div>
                <Progress 
                  value={68} 
                  color="secondary"
                  className="max-w-full"
                />
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;