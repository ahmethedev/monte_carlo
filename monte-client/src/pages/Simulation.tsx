import { useSimulation } from '../hooks/useSimulation';
import { SimulationForm } from '../components/SimulationForm';
import { SimulationControls } from '../components/SimulationControls';
import { ProgressTracker } from '../components/ProgressTracker';
import { ChartsPanel } from '../components/ChartsPanel';
import { MetricsPanel } from '../components/MetricsPanel';

const Simulation = () => {
  const { state, startSimulation, controlSimulation, resetSimulation } = useSimulation();

  const latestResult = state.dailyResults.length > 0
    ? state.dailyResults[state.dailyResults.length - 1]
    : undefined;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
      <div className="lg:col-span-2 space-y-6">
        <ChartsPanel dailyResults={state.dailyResults} />
        <MetricsPanel metrics={state.metrics} />
      </div>
      {state.error && (
        <div className="mt-6 bg-red-900/20 border border-red-800 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-400 rounded-full" />
            <span className="text-sm font-medium text-red-300">Error</span>
          </div>
          <p className="text-sm text-red-200 mt-1">{state.error}</p>
        </div>
      )}
    </div>
  );
};

export default Simulation;
