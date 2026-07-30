import type { SignatureAnalysis } from './signatureAnalysis';

export type WatchlistItem = {
  ticker: string;
  name: string;
  price: number | null;
  changePercent: number | null;
  sparkline: number[];
  isIllustrative?: boolean;
  isLive?: boolean;
  status?: string;
  note?: string;
  source?: string;
};

export type MarketStripItem = {
  label: string;
  value: string;
  change?: string | null;
  tone?: 'gold' | 'cyan' | 'green' | 'red' | 'neutral';
  isIllustrative?: boolean;
  isLive?: boolean;
  note?: string;
};

export type ObservatoryData = {
  marketSummary: string;
  summaryGeneratedAt: string;
  watchlist: WatchlistItem[];
  marketStrip: MarketStripItem[];
  quoteOfTheDay?: string;
  live?: boolean;
};

export type { SignatureAnalysis };
