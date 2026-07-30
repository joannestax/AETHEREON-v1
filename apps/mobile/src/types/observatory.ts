import type { SignatureAnalysis } from './signatureAnalysis';

export type WatchlistItem = {
  ticker: string;
  name: string;
  /** Illustrative only when isIllustrative is true */
  price: number | null;
  changePercent: number | null;
  sparkline: number[];
  isIllustrative: boolean;
};

export type MarketStripItem = {
  label: string;
  value: string;
  change?: string;
  tone?: 'gold' | 'cyan' | 'green' | 'red' | 'neutral';
  isIllustrative: boolean;
};

export type ObservatoryData = {
  marketSummary: string;
  summaryGeneratedAt: string;
  watchlist: WatchlistItem[];
  marketStrip: MarketStripItem[];
  quoteOfTheDay?: string;
};

export type { SignatureAnalysis };
