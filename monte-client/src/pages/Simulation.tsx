import { useSimulation } from '../hooks/useSimulation';
import { useRef, useEffect, useState } from 'react';
import { SimulationForm } from '../components/SimulationForm';
import { SimulationControls } from '../components/SimulationControls';
import { ProgressTracker } from '../components/ProgressTracker';
import { ChartsPanel } from '../components/ChartsPanel';
import { MetricsPanel } from '../components/MetricsPanel';
import { SavedSimulations } from '../components/SavedSimulations';
import SimulationLimitGate from '../components/SimulationLimitGate';
import { Play, History } from 'lucide-react';

const Simulation = () => {
  const { state, startSimulation, controlSimulation, resetSimulation } = useSimulation();
  const [activeTab, setActiveTab] = useState<'new' | 'saved'>('new');
  const chartsRef = useRef<HTMLDivElement>(null);

  const latestResult = state.dailyResults.length > 0
    ? state.dailyResults[state.dailyResults.length - 1]
    : undefined;

  useEffect(() => {
    if (state.status === 'running' && chartsRef.current) {
      chartsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [state.status]);

  return (
    <SimulationLimitGate>
      <div className="flex flex-col items-center gap-8 w-full">
      <div className="w-full max-w-4xl">
        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('new')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'new'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <Play className="h-4 w-4" />
            New Simulation
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'saved'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <History className="h-4 w-4" />
            Saved Simulations
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'new' ? (
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
        ) : (
          <SavedSimulations />
        )}
      </div>

      {activeTab === 'new' && (
        <>
          <div ref={chartsRef} className="w-full">
            <ChartsPanel dailyResults={state.dailyResults} />
          </div>

          <div className="w-full">
            <MetricsPanel metrics={state.metrics} />
          </div>

          {state.error && (
            <div className="w-full max-w-4xl mt-6 bg-red-900/20 border border-red-800 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-400 rounded-full" />
                <span className="text-sm font-medium text-red-300">Error</span>
              </div>
              <p className="text-sm text-red-200 mt-1">{state.error}</p>
            </div>
          )}
        </>
      )}
      </div>
    </SimulationLimitGate>
  );
};

export default Simulation;
