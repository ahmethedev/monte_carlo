import { useSimulation } from '../hooks/useSimulation';
import { useRef, useEffect } from 'react';
import { SimulationForm } from '../components/SimulationForm';
import { SimulationControls } from '../components/SimulationControls';
import { ProgressTracker } from '../components/ProgressTracker';
import { ChartsPanel } from '../components/ChartsPanel';
import { MetricsPanel } from '../components/MetricsPanel';

const Simulation = () => {
  const { state, startSimulation, controlSimulation, resetSimulation } = useSimulation();
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
    <div className="flex flex-col items-center gap-8 w-full">
      <div className="w-full max-w-4xl space-y-6">
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
    </div>
  );
};

export default Simulation;
