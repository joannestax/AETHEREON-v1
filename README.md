# AETHERON — Project Genesis / ORIGO NEXUS

**Ultimate AI Mentor · Financial Realm Guide · Finance God**

Aetheron is the intelligent co-pilot / mentor layer for the ORIGO App — a magnetic, high-signal finance experience: Bloomberg × pitch book × quant AI chatbot, wrapped in the cosmic Finance God aura.

> **Core rule:** never invent market data. Missing marks stay `null` / `—`. Live prices and quant math come from tools and adapters only.

---

## Vision (Founder Directives)

- Best accurate & uniquely creative character AI chatbot experience in finance
- Signature Analysis format locked (Technical → Fundamental → Liquidity → LT Target → Swing → Signal)
- Never invent market data; always use tools for real calculation
- Deep space + gold + cyan visual language (Titan / Realm Guide / Energy Sphere)
- Daily quotes Command Center for subconscious priming
- Live eventually inside ORIGO (shared auth, watchlists, portfolio context)

---

## Quick start

**Live web preview (this agent session):** https://simpson-air-freeware-updated.trycloudflare.com

**Permanent Pages (after Actions enabled):** https://joannestax.github.io/AETHEREON-v1/

### Mobile (Expo)

```bash
cd apps/mobile
npm install
npx expo start          # native
npx expo start --web    # browser phone shell
```

### Backend (FastAPI)

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Full stack (live marks + chat API)

```bash
# Terminal 1
cd backend && source .venv/bin/activate
uvicorn app.main:app --reload --port 8000

# Terminal 2
cd apps/mobile
EXPO_PUBLIC_AETHERON_API_URL=http://127.0.0.1:8000 npx expo start --web
```

**Hosted web preview (after Pages is enabled):**  
https://joannestax.github.io/AETHEREON-v1/

Static Pages is frontend-only. Chat falls back to the offline mentor voice until a live API URL is configured.

---

## Monorepo layout

```
apps/mobile/                 Expo 57 (React Native) — cosmic UI
  src/
    api/                     chatClient, marketClient, base client
    components/
      analysis/              Signature Analysis sections (exact 6-part order)
      avatar/                AetheronOrb (sphere · titan · realm_guide)
      chat/                  bubbles, input, avatar switcher
      observatory/           watchlist + market cards
      ui/                    GlassCard, CosmicButton, tokens consumers
    data/                    demo fixtures (bannered illustrative only)
    navigation/              tabs + stack
    screens/                 Observatory, Chat, Signature, Quotes, …
    theme/tokens.ts          single source of visual truth
backend/
  app/
    routes/                  chat · quant · quotes · market
    quant/                   BS, Greeks, IV, binomial, Monte Carlo, sandbox
    services/                Grok tool loop, tools registry, quotes, market_data, signature
docs/                        deploy · live data · style · ORIGO embedding
scripts/deploy-web.sh        manual web export helper
.github/workflows/           GitHub Pages deploy
```

---

## What's shipped

| Area | Status | Notes |
|------|--------|--------|
| Design tokens + cosmic theme | ✅ | Gold authority · cyan intelligence · deep space |
| Signature Analysis screen | ✅ | Exact 6-part contract; demo fixture bannered non-live |
| Chat (Sphere / Titan / Realm Guide) | ✅ | Streaming UI; offline mentor fallback |
| Observatory + bottom nav | ✅ | Watchlist, market strip, pull-to-refresh |
| Quotes Command Center | ✅ | 30+ founder quotes + CRUD API |
| Quant sandbox | ✅ | AST-filtered; BS, IV, binomial, MC, portfolio |
| FE ↔ BE wiring | ✅ | `EXPO_PUBLIC_AETHERON_API_URL` |
| Live market feeds | ✅ | CoinGecko (crypto) + Yahoo (equities); unlisted stay blank |
| ORIGO embedding docs | ✅ | Deep links + shared auth checklist |
| Web preview / Pages + EAS stub | ✅ | See `docs/DEPLOY.md` |
| Grok tool-calling loop | ✅ | OpenAI-compatible loop; tools for quotes + quant; mentor fallback without key |

---

## Mobile navigation

**Tabs:** Observatory · Chat · Watchlists · Insights · Profile  

**Stack:** Signature Analysis · Quotes Command Center  

Point any ticker CTA at Signature Analysis; "Ask Aetheron" opens Chat with context.

---

## Backend API

Base URL default: `http://127.0.0.1:8000`  
Health: `GET /health`

| Group | Endpoints |
|-------|-----------|
| Chat | `POST /v1/chat` · `POST /v1/chat/quant` |
| Quant | `POST /v1/quant/black-scholes` · `implied-vol` · `binomial` · `monte-carlo` · `sandbox` · `portfolio/summary` |
| Quotes | `GET/POST /v1/quotes` · `PATCH/DELETE /v1/quotes/{id}` · `GET /v1/quotes/today` |
| Market | `GET /v1/market/watchlist` · `/overview` · `/quote/{symbol}` |

Interactive docs when the API is running: http://127.0.0.1:8000/docs

### Environment

| Variable | Where | Purpose |
|----------|--------|---------|
| `XAI_API_KEY` | `backend/.env` | Enables Grok tool-calling loop on `POST /v1/chat` |
| `XAI_MODEL` | `backend/.env` | Optional model override (default `grok-3`) |
| `XAI_BASE_URL` | `backend/.env` | Optional API base (default `https://api.x.ai/v1`) |
| `EXPO_PUBLIC_AETHERON_API_URL` | mobile runtime | API base (default `http://127.0.0.1:8000`) |

Copy `backend/.env.example` → `backend/.env`. Never commit secrets.

---

## Signature Analysis contract

**Exact structure — do not reorder:**

1. Technical Analysis  
2. Fundamental Analysis  
3. Liquidity Levels  
4. Long-Term Price Target  
5. Swing Trade Setup (bias, entry, TP1–3, stop, options, confidence XX/100)  
6. Signal (`BULLISH` / `BEARISH`)

UI lives under `apps/mobile/src/components/analysis/*` and  
`apps/mobile/src/screens/SignatureAnalysisScreen.tsx`.

The bundled NVDA fixture in `demoSignatureAnalysis.ts` is **illustrative only** and is explicitly bannered as not live market data.

---

## Visual language

| Role | Color | Token |
|------|-------|--------|
| Authority / CTAs | Gold `#D4AF37` | `colors.gold.*` |
| Intelligence / live data | Cyan `#00E5FF` | `colors.cyan.*` |
| Bullish | Green | `colors.signal.bullish` |
| Bearish | Red | `colors.signal.bearish` |
| Realm background | Deep space black | `colors.space.*` |

Edit look-and-feel in one place:

- Tokens → [`apps/mobile/src/theme/tokens.ts`](apps/mobile/src/theme/tokens.ts)
- Buttons → [`apps/mobile/src/components/ui/CosmicButton.tsx`](apps/mobile/src/components/ui/CosmicButton.tsx)
- Cards → [`apps/mobile/src/components/ui/GlassCard.tsx`](apps/mobile/src/components/ui/GlassCard.tsx)

Full checklist: [`docs/STYLE_GUIDE.md`](docs/STYLE_GUIDE.md)

---

## Documentation

| Doc | Topic |
|-----|--------|
| [`docs/DEPLOY.md`](docs/DEPLOY.md) | GitHub Pages, EAS / TestFlight |
| [`docs/LIVE_DATA.md`](docs/LIVE_DATA.md) | CoinGecko / Yahoo adapters, refresh policy |
| [`docs/STYLE_GUIDE.md`](docs/STYLE_GUIDE.md) | Buttons, glass, mockup alignment |
| [`docs/ORIGO_INTEGRATION.md`](docs/ORIGO_INTEGRATION.md) | Embedding Aetheron inside ORIGO |
| [`docs/GROK_TOOLS.md`](docs/GROK_TOOLS.md) | Grok tool-calling loop + tool catalog |
| [`backend/README.md`](backend/README.md) | API run one-liner |

---

## Tech stack

- **Mobile:** Expo ~57, React Native, React Navigation, react-native-svg, Expo fonts (Cinzel · Cormorant · DM Sans)
- **Backend:** FastAPI, Pydantic, NumPy / SciPy / Pandas, httpx, uvicorn
- **LLM:** xAI Grok tool loop (`backend/app/services/grok_client.py` + `tools.py`) when `XAI_API_KEY` is set
- **Market data:** CoinGecko + Yahoo Finance adapters (`backend/app/services/market_data.py`)

---

## Next priorities

1. Paid equity / sentiment feeds for production marks (Fear & Greed, broader equities)  
2. Supabase persistence for quotes & mentor events  
3. ORIGO shell mount (shared JWT, watchlists, portfolio context)  
4. Streaming SSE from Grok tool loop into Chat UI

---

*Project Genesis — proof of a bullish case for AI & robotics.*
