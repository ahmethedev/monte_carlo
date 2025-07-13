import React from 'react';
import { BarChart3, Activity } from 'lucide-react';
import { useSimulation } from './hooks/useSimulation';
import { SimulationForm } from './components/SimulationForm';
import { SimulationControls } from './components/SimulationControls';
import { ProgressTracker } from './components/ProgressTracker';
import { ChartsPanel } from './components/ChartsPanel';
import { MetricsPanel } from './components/MetricsPanel';

function App() {
  const { state, startSimulation, controlSimulation, resetSimulation } = useSimulation();

  const latestResult = state.dailyResults.length > 0 
    ? state.dailyResults[state.dailyResults.length - 1] 
    : undefined;

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-gray-900 shadow-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-green-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">Monte Carlo Trading Simulator</h1>
                <p className="text-sm text-gray-400">Professional trading simulation and analysis platform</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-400" />
              <span className="text-sm font-medium text-gray-300">API Connected</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form and Controls */}
          <div className="space-y-6">
            <SimulationForm 
              onStartSimulation={startSimulation}
              isRunning={state.status === 'running' || state.status === 'connecting'}
            />
            
            <SimulationControls
              status={state.status}
              onControl={controlSimulation}
              onReset={resetSimulation}
            />

            <ProgressTracker
              currentDay={state.currentDay}
              totalDays={state.totalDays}
              status={state.status}
              latestResult={latestResult}
            />
          </div>

          {/* Right Column - Charts and Metrics */}
          <div className="lg:col-span-2 space-y-6">
            <ChartsPanel dailyResults={state.dailyResults} />
            <MetricsPanel metrics={state.metrics} />
          </div>
        </div>

        {/* Error Display */}
        {state.error && (
          <div className="mt-6 bg-red-900/20 border border-red-800 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-400 rounded-full" />
              <span className="text-sm font-medium text-red-300">Error</span>
            </div>
            <p className="text-sm text-red-200 mt-1">{state.error}</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-400">
            Monte Carlo Trading Simulator - Professional Trading Analysis Platform
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;