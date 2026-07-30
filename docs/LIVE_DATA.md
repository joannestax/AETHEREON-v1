# Live market data — how Aetheron gets prices

**Rule:** Aetheron never invents prices. Missing marks stay `null` / `—`.

## Architecture

```
Mobile Observatory  →  GET /v1/market/watchlist
                    →  CoinGecko (BTC, ETH, global mcap/volume/dominance)
                    →  Yahoo Finance chart (NVDA and other equities)
ORGN / AETH         →  marked unlisted (no invented price)
```

## Run it

```bash
# Terminal 1 — API (required for live marks)
cd backend
source .venv/bin/activate   # or python -m venv .venv && pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# Terminal 2 — app
cd apps/mobile
EXPO_PUBLIC_AETHERON_API_URL=http://127.0.0.1:8000 npx expo start --web
```

Pull to refresh on Observatory. Auto-refresh every 60s.

## Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/v1/market/watchlist?tickers=BTC,ETH,NVDA` | Watchlist + market strip |
| GET | `/v1/market/overview` | Global crypto overview |
| GET | `/v1/market/quote/{symbol}` | Single quote |

## Upgrade path (production)

1. **Paid equity feed** — Polygon, Finnhub, Intrinio, or Bloomberg (replace Yahoo adapter in `backend/app/services/market_data.py`)
2. **Fear & Greed** — `alternative.me/fng` or premium sentiment API (slot already in market strip)
3. **WebSockets** — push ticks into Observatory instead of 60s poll
4. **ORIGO portfolio context** — hydrate ORGN/AETH from internal ledger, not public venues
5. **API keys** — put secrets in `.env` (`POLYGON_API_KEY`, etc.), never invent when a key is missing

## Edit the adapters

File: `backend/app/services/market_data.py`

- `COINGECKO_IDS` — map tickers → CoinGecko ids
- `YAHOO_SYMBOLS` — equities allowed through Yahoo
- `UNLISTED` — tickers that must stay blank

Frontend client: `apps/mobile/src/api/marketClient.ts`
