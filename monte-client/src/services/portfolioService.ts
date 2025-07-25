import { 
  PortfolioEntry, 
  PortfolioSummary, 
  PortfolioAsset, 
  PortfolioPerformanceData 
} from '../types';

export interface CreatePortfolioEntryRequest {
  asset_symbol: string;
  amount: number;
  purchase_price: number;
  purchase_date: string;
  notes?: string;
}

export interface UpdatePortfolioEntryRequest {
  asset_symbol?: string;
  amount?: number;
  purchase_price?: number;
  purchase_date?: string;
  notes?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

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

  const response = await fetch(`${API_BASE_URL}${url}`, { ...options, headers });

  if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/signin';
    throw new Error('Session expired');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'An unknown error occurred' }));
    throw new Error(errorData.detail || 'Failed to fetch');
  }

  return response.json();
};

class PortfolioService {
  // Portfolio Entries
  async createEntry(data: CreatePortfolioEntryRequest): Promise<PortfolioEntry> {
    return authFetch('/api/portfolio/entries', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async getEntries(): Promise<PortfolioEntry[]> {
    return authFetch('/api/portfolio/entries');
  }

  async updateEntry(id: string, data: UpdatePortfolioEntryRequest): Promise<PortfolioEntry> {
    return authFetch(`/api/portfolio/entries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteEntry(id: string): Promise<void> {
    await authFetch(`/api/portfolio/entries/${id}`, {
      method: 'DELETE'
    });
  }

  // Portfolio Summary
  async getSummary(): Promise<PortfolioSummary> {
    return authFetch('/api/portfolio/summary');
  }

  // Asset Allocation
  async getAllocation(): Promise<PortfolioAsset[]> {
    return authFetch('/api/portfolio/allocation');
  }

  // Performance Data
  async getPerformance(days: number = 30): Promise<PortfolioPerformanceData[]> {
    return authFetch(`/api/portfolio/performance?days=${days}`);
  }

  // Snapshots
  async createSnapshot(): Promise<{ message: string; snapshot_id: number; total_value: number }> {
    return authFetch('/api/portfolio/snapshot', {
      method: 'POST'
    });
  }

  // Asset Prices
  async getAssetPrice(symbol: string): Promise<{ symbol: string; current_price: number; last_updated: string }> {
    return authFetch(`/api/portfolio/assets/${symbol}/price`);
  }
}

export const portfolioService = new PortfolioService();