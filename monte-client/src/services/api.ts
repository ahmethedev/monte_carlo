import { SimulationParams } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const authFetch = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    // Token is invalid or expired, clear token and redirect to login
    localStorage.removeItem('token');
    window.location.href = '/login'; 
    throw new Error('Session expired');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'An unknown error occurred' }));
    throw new Error(errorData.detail || 'Failed to fetch');
  }

  return response.json();
};

export class SimulationAPI {
  static async startSimulation(params: SimulationParams) {
    return authFetch(`${API_BASE_URL}/simulation/start`, {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  static async controlSimulation(simulationId: string, action: string) {
    return authFetch(`${API_BASE_URL}/simulation/${simulationId}/control`, {
      method: 'POST',
      body: JSON.stringify({ action }),
    });
  }

  static async getSimulationStatus(simulationId: string) {
    return authFetch(`${API_BASE_URL}/simulation/${simulationId}/status`);
  }

  static async getSavedSimulations() {
    return authFetch(`${API_BASE_URL}/simulations`);
  }

  static async getUserSimulations() {
    return authFetch(`${API_BASE_URL}/simulations/user`);
  }

  static createWebSocket(simulationId: string) {
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//${API_BASE_URL.replace(/^https?:\/\//, '')}/simulation/${simulationId}/ws`;
    return new WebSocket(wsUrl);
  }
}