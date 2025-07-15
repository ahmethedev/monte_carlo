import { Play, Pause, Square, FastForward, Rewind } from 'lucide-react';
import { SimulationControlsProps } from '../types';

export function SimulationControls({ status, onControl, onReset }: SimulationControlsProps) {
  if (status === 'idle' || status === 'completed') {
    return null;
  }

  return (
    <div className="bg-gray-900 rounded-lg shadow-xl p-4 border border-gray-800">
      <h3 className="text-lg font-semibold text-white mb-3">Simulation Controls</h3>
      <div className="flex items-center gap-2 flex-wrap">
        {status === 'running' && (
          <button
            onClick={() => onControl('pause')}
            className="flex items-center gap-2 px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md transition-colors duration-200"
          >
            <Pause className="h-4 w-4" />
            Pause
          </button>
        )}
        {status === 'paused' && (
          <button
            onClick={() => onControl('resume')}
            className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-200"
          >
            <Play className="h-4 w-4" />
            Resume
          </button>
        )}
        <button
          onClick={() => onControl('speed_up')}
          className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-200"
        >
          <FastForward className="h-4 w-4" />
          Speed Up
        </button>
        <button
          onClick={() => onControl('slow_down')}
          className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-200"
        >
          <Rewind className="h-4 w-4" />
          Slow Down
        </button>
        <button
          onClick={() => onControl('stop')}
          className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200"
        >
          <Square className="h-4 w-4" />
          Stop
        </button>
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors duration-200 ml-auto"
        >
          Reset
        </button>
      </div>
    </div>
  );
}