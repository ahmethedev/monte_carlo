export interface SimulationParams {
  name?: string;
  description?: string;
  initial_balance: number;
  risk_per_trade_percent: number;
  risk_reward_ratio: number;
  max_trades_per_day: number;
  monthly_cashout_percent: number;
  win_rate: number;
  simulation_days: number;
}

export interface DailyResult {
  date: string;
  starting_balance: number;
  ending_balance: number;
  trades_taken: number;
  wins: number;
  losses: number;
  daily_pnl: number;
  win_rate: number;
  cumulative_pnl: number;
  drawdown: number;
  max_drawdown_to_date: number;
}

export interface SimulationMetrics {
  total_trades: number;
  total_wins: number;
  total_losses: number;
  overall_win_rate: number;
  total_pnl: number;
  max_drawdown: number;
  max_drawdown_duration: number;
  longest_winning_streak: number;
  longest_losing_streak: number;
  total_cashout: number;
  final_balance: number;
  sharpe_ratio: number;
  profit_factor: number;
  average_win: number;
  average_loss: number;
  largest_win: number;
  largest_loss: number;
}

export interface SimulationState {
  id: string | null;
  status: 'idle' | 'connecting' | 'running' | 'paused' | 'completed' | 'error';
  currentDay: number;
  totalDays: number;
  dailyResults: DailyResult[];
  metrics: SimulationMetrics | null;
  error: string | null;
}

// Auth Interfaces
export interface AuthFormProps {
  formType: 'signin' | 'signup';
  onSubmit: (event: React.FormEvent<HTMLFormElement>, data: { email: string; password: string; username?: string }) => void;
  buttonText: string;
  title: string;
  isLoading?: boolean;
  error?: string;
  onForgotPassword?: () => void;
  onSwitchAuthMode?: () => void;
}

export interface AuthLayoutProps {
  children: React.ReactNode;
  subtitle: string;
}

// Component Props Interfaces
export interface SimulationFormProps {
  onStartSimulation: (params: SimulationParams) => void;
  isRunning: boolean;
}

export interface SimulationControlsProps {
  status: string;
  onControl: (action: string) => void;
  onReset: () => void;
}

export interface ProgressTrackerProps {
  currentDay: number;
  totalDays: number;
  status: string;
  latestResult?: {
    ending_balance: number;
    daily_pnl: number;
    trades_taken: number;
    win_rate: number;
  };
}

export interface ChartsPanelProps {
  dailyResults: DailyResult[];
}

export interface MetricsPanelProps {
  metrics: SimulationMetrics | null;
}

export interface TooltipProps {
  active: boolean;
  payload: Array<{
    name: string;
    value: number | string;
    color: string;
  }>;
  label: string;
}

export interface GlobalStateContextType {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

// Portfolio Interfaces
export interface PortfolioEntry {
  id: string;
  date: string;
  asset: string;
  amount: number;
  price: number;
  total_value: number;
  notes?: string;
  created_at: string;
}

export interface PortfolioAsset {
  asset: string;
  total_amount: number;
  total_invested: number;
  current_value: number;
  current_price: number;
  profit_loss: number;
  profit_loss_percent: number;
  percentage_of_portfolio: number;
}

export interface PortfolioSummary {
  total_invested: number;
  current_value: number;
  total_profit_loss: number;
  total_profit_loss_percent: number;
  number_of_assets: number;
  last_updated: string;
}

export interface MarketIndex {
  symbol: string;
  name: string;
  current_price: number;
  price_change_percent: number;
}

export interface PortfolioPerformanceData {
  date: string;
  portfolio_value: number;
  btc_price?: number;
  nasdaq_value?: number;
  bist_value?: number;
}