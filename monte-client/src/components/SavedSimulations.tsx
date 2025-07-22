import React, { useState, useEffect } from 'react';
import { SimulationAPI } from '../services/api';
import { Calendar, DollarSign, TrendingUp, TrendingDown, BarChart3, Eye, Trash2 } from 'lucide-react';

interface SavedSimulation {
  id: number;
  simulation_id: string;
  name: string;
  description: string;
  initial_balance: number;
  final_balance: number;
  total_pnl: number;
  max_drawdown: number;
  win_rate_actual: number;
  total_trades: number;
  simulation_days: number;
  created_at: string;
  is_completed: boolean;
}

export const SavedSimulations: React.FC = () => {
  const [simulations, setSimulations] = useState<SavedSimulation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSimulations();
  }, []);

  const fetchSimulations = async () => {
    try {
      setLoading(true);
      const data = await SimulationAPI.getUserSimulations();
      setSimulations(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch simulations');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="bg-gray-900 rounded-lg shadow-xl p-6 border border-gray-800">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
          <span className="ml-3 text-gray-300">Loading saved simulations...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 rounded-lg shadow-xl p-6 border border-gray-800">
        <div className="text-center py-12">
          <div className="text-red-400 mb-2">Error loading simulations</div>
          <div className="text-gray-400 text-sm">{error}</div>
          <button
            onClick={fetchSimulations}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (simulations.length === 0) {
    return (
      <div className="bg-gray-900 rounded-lg shadow-xl p-6 border border-gray-800">
        <div className="text-center py-12">
          <BarChart3 className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-300 mb-2">No Saved Simulations</h3>
          <p className="text-gray-400">
            Run your first simulation to see results here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg shadow-xl p-6 border border-gray-800">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="h-5 w-5 text-green-400" />
        <h2 className="text-xl font-semibold text-white">Saved Simulations</h2>
        <span className="text-sm text-gray-400">({simulations.length} total)</span>
      </div>

      <div className="grid gap-4">
        {simulations.map((simulation) => (
          <div
            key={simulation.id}
            className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-medium text-white mb-1">
                  {simulation.name || `Simulation #${simulation.id}`}
                </h3>
                {simulation.description && (
                  <p className="text-sm text-gray-400 mb-2">{simulation.description}</p>
                )}
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(simulation.created_at)}
                  </div>
                  <div className="flex items-center gap-1">
                    <BarChart3 className="h-3 w-3" />
                    {simulation.simulation_days} days
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs ${
                    simulation.is_completed 
                      ? 'bg-green-900 text-green-300' 
                      : 'bg-yellow-900 text-yellow-300'
                  }`}>
                    {simulation.is_completed ? 'Completed' : 'In Progress'}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-lg transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {simulation.is_completed && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t border-gray-700">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
                    <DollarSign className="h-3 w-3" />
                    <span className="text-xs">Final Balance</span>
                  </div>
                  <div className="text-sm font-medium text-white">
                    {formatCurrency(simulation.final_balance)}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
                    {simulation.total_pnl >= 0 ? (
                      <TrendingUp className="h-3 w-3 text-green-400" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-400" />
                    )}
                    <span className="text-xs">Total P&L</span>
                  </div>
                  <div className={`text-sm font-medium ${
                    simulation.total_pnl >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {formatCurrency(simulation.total_pnl)}
                  </div>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
                    <span className="text-xs">Win Rate</span>
                  </div>
                  <div className="text-sm font-medium text-white">
                    {simulation.win_rate_actual ? formatPercentage(simulation.win_rate_actual) : 'N/A'}
                  </div>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
                    <span className="text-xs">Trades</span>
                  </div>
                  <div className="text-sm font-medium text-white">
                    {simulation.total_trades || 0}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};