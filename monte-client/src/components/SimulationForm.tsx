import React, { useState } from 'react';
import { Play, Settings } from 'lucide-react';
import { SimulationParams, SimulationFormProps } from '../types';

export function SimulationForm({ onStartSimulation, isRunning }: SimulationFormProps) {
  const [params, setParams] = useState<SimulationParams>({
    name: '',
    description: '',
    initial_balance: 10000,
    risk_per_trade_percent: 1.0,
    risk_reward_ratio: 2.0,
    max_trades_per_day: 3,
    monthly_cashout_percent: 10.0,
    win_rate: 0.55,
    simulation_days: 365,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartSimulation(params);
  };

  const handleChange = (field: keyof SimulationParams, value: number | string) => {
    setParams(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-gray-900 rounded-lg shadow-xl p-6 border border-gray-800">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="h-5 w-5 text-blue-400" />
        <h2 className="text-xl font-semibold text-white">Simulation Parameters</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Simulation Name
            </label>
            <input
              type="text"
              value={params.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter a name for your simulation"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={params.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe your simulation strategy"
              rows={3}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Initial Balance ($)
            </label>
            <input
              type="number"
              value={params.initial_balance}
              onChange={(e) => handleChange('initial_balance', Number(e.target.value))}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="1000"
              step="100"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Risk Per Trade (%)
            </label>
            <input
              type="number"
              value={params.risk_per_trade_percent}
              onChange={(e) => handleChange('risk_per_trade_percent', Number(e.target.value))}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0.1"
              max="10"
              step="0.1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Risk:Reward Ratio
            </label>
            <input
              type="number"
              value={params.risk_reward_ratio}
              onChange={(e) => handleChange('risk_reward_ratio', Number(e.target.value))}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0.5"
              max="10"
              step="0.1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Max Trades Per Day
            </label>
            <input
              type="number"
              value={params.max_trades_per_day}
              onChange={(e) => handleChange('max_trades_per_day', Number(e.target.value))}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="1"
              max="50"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Monthly Cashout (%)
            </label>
            <input
              type="number"
              value={params.monthly_cashout_percent}
              onChange={(e) => handleChange('monthly_cashout_percent', Number(e.target.value))}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
              max="100"
              step="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Expected Win Rate
            </label>
            <input
              type="number"
              value={params.win_rate}
              onChange={(e) => handleChange('win_rate', Number(e.target.value))}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0.1"
              max="0.99"
              step="0.01"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Simulation Days
            </label>
            <input
              type="number"
              value={params.simulation_days}
              onChange={(e) => handleChange('simulation_days', Number(e.target.value))}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="30"
              max="1095"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isRunning}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <Play className="h-4 w-4" />
          {isRunning ? 'Simulation Running...' : 'Start Simulation'}
        </button>
      </form>
    </div>
  );
}