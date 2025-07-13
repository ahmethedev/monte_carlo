import { SimulationParams } from '../types/simulation';

const API_BASE_URL = 'http://localhost:8000';

export class SimulationAPI {
  static async startSimulation(params: SimulationParams) {
    const response = await fetch(`${API_BASE_URL}/simulation/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    
    if (!response.ok) {
      throw new Error('Failed to start simulation');
    }
    
    return response.json();
  }

  static async controlSimulation(simulationId: string, action: string) {
    const response = await fetch(`${API_BASE_URL}/simulation/${simulationId}/control`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to control simulation');
    }
    
    return response.json();
  }

  static async getSimulationStatus(simulationId: string) {
    const response = await fetch(`${API_BASE_URL}/simulation/${simulationId}/status`);
    
    if (!response.ok) {
      throw new Error('Failed to get simulation status');
    }
    
    return response.json();
  }

  static async getSavedSimulations() {
    const response = await fetch(`${API_BASE_URL}/simulations`);
    
    if (!response.ok) {
      throw new Error('Failed to get saved simulations');
    }
    
    return response.json();
  }

  static createWebSocket(simulationId: string) {
    return new WebSocket(`ws://localhost:8000/simulation/${simulationId}/ws`);
  }
}