import { apiGet, API_BASE } from './client';
import type { MarketStripItem, ObservatoryData, WatchlistItem } from '../types/observatory';
import { DEMO_OBSERVATORY } from '../data/demoObservatory';

type MarketWatchlistResponse = {
  watchlist: WatchlistItem[];
  marketStrip: MarketStripItem[];
  overview?: Record<string, unknown>;
  policy?: string;
};

/**
 * Pull live Observatory data from FastAPI.
 * Falls back to offline shell (null prices) — never invents marks.
 */
export async function fetchObservatoryLive(): Promise<ObservatoryData> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(`${API_BASE}/v1/market/watchlist?tickers=BTC,ETH,NVDA,ORGN,AETH`, {
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`market ${res.status}`);
    const data = (await res.json()) as MarketWatchlistResponse;

    const liveCount = data.watchlist.filter((w) => w.isLive && w.price != null).length;
    return {
      marketSummary:
        liveCount > 0
          ? `Live feeds online for ${liveCount} assets. Aetheron reads structure from verified marks only — unlisted ORIGO tickers stay unmarked until a public feed exists.`
          : 'Backend online. Aetheron reads structure from verified marks only — no priced assets in this watchlist yet; unlisted ORIGO tickers stay unmarked until a public feed exists.',
      summaryGeneratedAt: new Date().toISOString(),
      watchlist: data.watchlist,
      marketStrip: data.marketStrip,
      quoteOfTheDay: DEMO_OBSERVATORY.quoteOfTheDay,
      // API responded successfully — distinct from whether individual marks arrived
      live: true,
    };
  } catch {
    return { ...DEMO_OBSERVATORY, live: false };
  }
}

export async function fetchQuote(symbol: string) {
  return apiGet<{ quote: WatchlistItem | null }>(`/v1/market/quote/${symbol}`);
}
