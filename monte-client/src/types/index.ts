export interface SimulationParams {
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
  onSubmit: (event: React.FormEvent<HTMLFormElement>, email: string, password: string) => void;
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