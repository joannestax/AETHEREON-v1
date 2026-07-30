import type { ObservatoryData } from '../types/observatory';

/**
 * Illustrative Observatory fixture — not live market data.
 * Production must hydrate from ORIGO watchlists + live feeds.
 */
export const DEMO_OBSERVATORY: ObservatoryData = {
  marketSummary:
    'Aetheron detects shifting momentum across macro regimes. Rotation favors quality infrastructure and decentralized compute. Volatility expected to remain elevated into next cycle. Levels require live feeds before conviction.',
  summaryGeneratedAt: new Date().toISOString(),
  quoteOfTheDay: 'Discipline is the rarest alpha.',
  watchlist: [
    {
      ticker: 'BTC',
      name: 'Bitcoin',
      price: null,
      changePercent: null,
      sparkline: [1, 1.02, 0.98, 1.05, 1.08, 1.04, 1.1, 1.12],
      isIllustrative: true,
    },
    {
      ticker: 'ETH',
      name: 'Ethereum',
      price: null,
      changePercent: null,
      sparkline: [1, 0.99, 1.01, 1.03, 1.0, 1.04, 1.06, 1.05],
      isIllustrative: true,
    },
    {
      ticker: 'NVDA',
      name: 'NVIDIA',
      price: null,
      changePercent: null,
      sparkline: [1, 1.04, 1.02, 1.08, 1.1, 1.07, 1.12, 1.15],
      isIllustrative: true,
    },
    {
      ticker: 'ORGN',
      name: 'ORIGO',
      price: null,
      changePercent: null,
      sparkline: [1, 1.01, 1.03, 1.02, 1.06, 1.08, 1.07, 1.09],
      isIllustrative: true,
    },
  ],
  marketStrip: [
    { label: 'TOTAL MARKET CAP', value: '—', change: undefined, tone: 'gold', isIllustrative: true },
    { label: '24H VOLUME', value: '—', tone: 'cyan', isIllustrative: true },
    { label: 'BTC DOMINANCE', value: '—', tone: 'cyan', isIllustrative: true },
    { label: 'FEAR & GREED', value: '—', tone: 'neutral', isIllustrative: true },
  ],
};
