/**
 * Signature Analysis — exact 6-part structure locked by founder directive.
 * Never invent live prices. Demo fixtures must be labeled as illustrative.
 */

export type MarketBias = 'BULLISH' | 'BEARISH' | 'NEUTRAL';
export type Signal = 'BULLISH' | 'BEARISH';

export interface PriceLevel {
  label: string;
  price: number;
}

export interface TechnicalAnalysis {
  summary: string;
  trend: string;
  structure: string[];
  movingAverages?: { label: string; value: number; color?: string }[];
  chartPoints?: number[];
}

export interface FundamentalAnalysis {
  summary: string;
  metrics: { label: string; value: string }[];
  catalysts: string[];
  themes: string[];
}

export interface LiquidityLevels {
  current: number;
  support: PriceLevel[];
  resistance: PriceLevel[];
  notes?: string;
}

export interface LongTermTarget {
  price: number;
  horizon: string;
  thesis: string;
}

export interface SwingTradeSetup {
  bias: MarketBias;
  entryZone: { low: number; high: number };
  targets: { tp1: number; tp2: number; tp3: number };
  stop: number;
  invalidation: string;
  optionsGuidance: string;
  confidence: number; // 0–100
}

export interface SignatureAnalysis {
  ticker: string;
  companyName: string;
  asOf: string;
  /** When true, UI must show DEMO / ILLUSTRATIVE banner — not live market data */
  isIllustrative: boolean;
  price: number;
  change: number;
  changePercent: number;
  technical: TechnicalAnalysis;
  fundamental: FundamentalAnalysis;
  liquidity: LiquidityLevels;
  longTermTarget: LongTermTarget;
  swing: SwingTradeSetup;
  signal: Signal;
  keyInsight: string;
}
