function getApiBaseUrl(): string {
  // Use environment variable if set, otherwise derive from current host
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== "undefined") {
    // In production on same host: use same protocol and hostname
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    // If running on standard ports (80/443), API is behind reverse proxy at /api
    if (window.location.port === "" || window.location.port === "80" || window.location.port === "443") {
      return `${protocol}//${hostname}/api/v1`;
    }
    // Development: frontend on 3000, backend on 8000
    return `http://${hostname}:8000/api/v1`;
  }
  // Server-side fallback
  return "http://localhost:8000/api/v1";
}

export interface Topic {
  id?: number | null;
  name: string;
  continuous: boolean;
  created_at: string;
  subtopic?: string | null;
  subtopic_count?: number;
}

export interface SubtopicInfo {
  subtopic: string;
  continuous: boolean;
  created_at: string;
}

export interface TopicsResponse {
  topics: Topic[];
  count: number;
}

export interface SubtopicsResponse {
  topic: string;
  subtopics: SubtopicInfo[];
  count: number;
}

export interface Market {
  clob_token_id: string;
  topic: string;
  question: string;
  subtopic?: string | null;
}

export interface MarketsResponse {
  markets: Market[];
  count: number;
}

export interface GridStrategyParams {
  strategy_type: "grid";
  grid_size: number;
  grid_spacing: string;
  order_size: string;
  initial_balance: string;
  protection_threshold?: number | null;
}

export interface MomentumStrategyParams {
  strategy_type: "momentum";
  lookback_window: number;
  momentum_threshold: string;
  order_size: string;
  initial_balance: string;
}

// Custom Strategy Types
export type IndicatorType = "sma" | "ema" | "rsi" | "macd" | "bollinger";

export interface IndicatorConfig {
  type: IndicatorType;
  name: string;
  period?: number;
  // MACD specific
  fast_period?: number;
  slow_period?: number;
  signal_period?: number;
  // Bollinger specific
  num_std?: number;
}

export type ConditionOperator = ">" | "<" | ">=" | "<=" | "cross_above" | "cross_below";

export interface RuleCondition {
  indicator: string;
  operator: ConditionOperator;
  value?: number;
  compare_to_indicator?: string;
}

export interface TradingRule {
  conditions: RuleCondition[];
  description?: string;
}

export interface CustomStrategyParams {
  strategy_type: "custom";
  indicators: IndicatorConfig[];
  buy_rules: TradingRule[];
  sell_rules: TradingRule[];
  order_size: string;
  initial_balance: string;
}

export type StrategyParams = GridStrategyParams | MomentumStrategyParams | CustomStrategyParams;

export interface BacktestRequest {
  clob_token_id?: string;
  topic?: string;
  subtopic?: string | null;
  amount_of_markets?: number;
  strategy: StrategyParams;
  fee_rate: string;
}

export interface BacktestStatistics {
  strategy_name: string;
  initial_balance: string;
  final_equity: string;
  total_pnl: string;
  total_return_pct: number;
  total_trades: number;
  win_rate: number;
  max_drawdown: string;
  max_drawdown_pct: number;
}

export interface BacktestResult {
  statistics: BacktestStatistics;
  dataframe: Record<string, unknown>[];
  row_count: number;
}

export async function fetchTopics(): Promise<TopicsResponse> {
  const response = await fetch(`${getApiBaseUrl()}/topics/`);
  if (!response.ok) {
    throw new Error("Failed to fetch topics");
  }
  return response.json();
}

export async function fetchTopicInfo(topicName: string, subtopic?: string): Promise<Topic | null> {
  const response = await fetchTopics();
  return response.topics.find(t => t.name === topicName) || null;
}

export async function fetchSubtopics(topicName: string): Promise<SubtopicsResponse> {
  const response = await fetch(
    `${getApiBaseUrl()}/topics/${encodeURIComponent(topicName)}/subtopics`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch subtopics");
  }
  return response.json();
}

export async function fetchMarkets(topic?: string, subtopic?: string): Promise<MarketsResponse> {
  const params = new URLSearchParams();
  if (topic) params.append("topic", topic);
  if (subtopic) params.append("subtopic", subtopic);

  const queryString = params.toString();
  const url = `${getApiBaseUrl()}/topics/markets${queryString ? '?' + queryString : ''}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch markets");
  }
  return response.json();
}

export async function runBacktest(request: BacktestRequest): Promise<BacktestResult> {
  const response = await fetch(`${getApiBaseUrl()}/backtest/run`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to run backtest");
  }
  return response.json();
}

export async function checkHealth(): Promise<{ status: string; version: string }> {
  const response = await fetch(`${getApiBaseUrl()}/health`);
  if (!response.ok) {
    throw new Error("API is not healthy");
  }
  return response.json();
}
