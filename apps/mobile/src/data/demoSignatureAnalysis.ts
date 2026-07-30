import type { SignatureAnalysis } from '../types/signatureAnalysis';

/**
 * ILLUSTRATIVE fixture for UI development only.
 * Not live market data. Aetheron never invents prices in production —
 * real analyses must come from tools + live feeds.
 */
export const DEMO_SIGNATURE_ANALYSIS: SignatureAnalysis = {
  ticker: 'NVDA',
  companyName: 'NVIDIA Corporation',
  asOf: '2026-07-30T12:00:00Z',
  isIllustrative: true,
  price: 124.58,
  change: 3.42,
  changePercent: 2.82,
  technical: {
    summary:
      'Price holds an ascending channel with higher lows intact. Momentum confirms accumulation above the 50-day structure; volume expands on advances.',
    trend: 'Ascending Channel',
    structure: [
      'Higher lows preserved across the last three swings',
      'Breakout retest held as support',
      'Relative strength vs. semis remains constructive',
    ],
    movingAverages: [
      { label: 'MA 20', value: 118.4, color: '#EF4444' },
      { label: 'MA 50', value: 112.1, color: '#FFD700' },
      { label: 'MA 100', value: 104.6, color: '#00E5FF' },
      { label: 'MA 200', value: 96.2, color: '#22C55E' },
    ],
    chartPoints: [98, 102, 101, 108, 112, 110, 116, 119, 117, 121, 123, 124.58],
  },
  fundamental: {
    summary:
      'AI infrastructure demand remains the primary narrative. Data-center GPU cycles, CUDA lock-in, and hyperscaler capex form the core fundamental engine.',
    metrics: [
      { label: 'Market Cap', value: 'Illustrative' },
      { label: 'Revenue Growth', value: 'Illustrative' },
      { label: 'Gross Margin', value: 'Illustrative' },
      { label: 'PE (fwd)', value: 'Illustrative' },
    ],
    catalysts: [
      'Next data-center product cycle',
      'Hyperscaler capex commentary',
      'Enterprise AI adoption pace',
    ],
    themes: ['AI Infrastructure', 'Accelerated Computing', 'Platform Moat'],
  },
  liquidity: {
    current: 124.58,
    support: [
      { label: 'S1', price: 112 },
      { label: 'S2', price: 104 },
    ],
    resistance: [
      { label: 'R1', price: 132 },
      { label: 'R2', price: 145 },
    ],
    notes: 'Demand cluster near prior breakout; supply thickens into prior highs.',
  },
  longTermTarget: {
    price: 180,
    horizon: '12–18 months',
    thesis:
      'If AI capex remains durable and margins hold, the path of least resistance favors a measured grind toward the long-term objective — not a straight line.',
  },
  swing: {
    bias: 'BULLISH',
    entryZone: { low: 118, high: 126 },
    targets: { tp1: 132, tp2: 145, tp3: 160 },
    stop: 108,
    invalidation: 'Daily close below $108 with rising volume voids the swing thesis.',
    optionsGuidance:
      'Prefer defined-risk calls or call spreads 1–3 months out, strikes near R1; avoid naked short premium into event risk.',
    confidence: 78,
  },
  signal: 'BULLISH',
  keyInsight:
    'Strong momentum. Support at $112. Resistance near $132. Volume confirms accumulation.',
};
