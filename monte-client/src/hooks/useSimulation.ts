import { useState, useCallback, useRef } from 'react';
import { SimulationParams, SimulationState, DailyResult, SimulationMetrics } from '../types/simulation';
import { SimulationAPI } from '../services/api';

export function useSimulation() {
  const [state, setState] = useState<SimulationState>({
    id: null,
    status: 'idle',
    currentDay: 0,
    totalDays: 0,
    dailyResults: [],
    metrics: null,
    error: null,
  });

  const websocketRef = useRef<WebSocket | null>(null);

  const startSimulation = useCallback(async (params: SimulationParams) => {
    try {
      setState(prev => ({ ...prev, status: 'connecting', error: null }));
      
      const response = await SimulationAPI.startSimulation(params);
      const simulationId = response.simulation_id;

      setState(prev => ({ 
        ...prev, 
        id: simulationId, 
        totalDays: params.simulation_days,
        dailyResults: [],
        metrics: null 
      }));

      // Create WebSocket connection
      const ws = SimulationAPI.createWebSocket(simulationId);
      websocketRef.current = ws;

      ws.onopen = () => {
        setState(prev => ({ ...prev, status: 'running' }));
        // Send start message with parameters
        ws.send(JSON.stringify({
          type: 'start_simulation',
          params: params
        }));
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.type === 'daily_update') {
          setState(prev => ({
            ...prev,
            currentDay: data.day,
            dailyResults: [...prev.dailyResults, data.data]
          }));
        } else if (data.type === 'simulation_complete') {
          setState(prev => ({
            ...prev,
            status: 'completed',
            dailyResults: data.daily_results,
            metrics: data.metrics
          }));
        } else if (data.type === 'simulation_stopped') {
          setState(prev => ({ ...prev, status: 'idle' }));
        } else if (data.error) {
          setState(prev => ({ ...prev, status: 'error', error: data.error }));
        }
      };

      ws.onerror = () => {
        setState(prev => ({ ...prev, status: 'error', error: 'WebSocket connection failed' }));
      };

      ws.onclose = () => {
        if (state.status === 'running') {
          setState(prev => ({ ...prev, status: 'idle' }));
        }
      };

    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }));
    }
  }, [state.status]);

  const controlSimulation = useCallback(async (action: string) => {
    if (!state.id) return;

    try {
      await SimulationAPI.controlSimulation(state.id, action);
      
      if (action === 'stop') {
        websocketRef.current?.close();
        setState(prev => ({ ...prev, status: 'idle' }));
      } else if (action === 'pause') {
        setState(prev => ({ ...prev, status: 'paused' }));
      } else if (action === 'resume') {
        setState(prev => ({ ...prev, status: 'running' }));
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Control action failed' 
      }));
    }
  }, [state.id]);

  const resetSimulation = useCallback(() => {
    websocketRef.current?.close();
    setState({
      id: null,
      status: 'idle',
      currentDay: 0,
      totalDays: 0,
      dailyResults: [],
      metrics: null,
      error: null,
    });
  }, []);

  return {
    state,
    startSimulation,
    controlSimulation,
    resetSimulation,
  };
}