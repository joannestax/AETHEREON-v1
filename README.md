# AETHERON — Project Genesis / ORIGO NEXUS

**Ultimate AI Mentor · Financial Realm Guide · Finance God**

Aetheron is the intelligent co-pilot / mentor layer for the ORIGO App — a magnetic, high-signal finance experience: Bloomberg × pitch book × quant AI chatbot, wrapped in the cosmic Finance God aura.

## Vision (Founder Directives)

- Best accurate & uniquely creative character AI chatbot experience in finance
- Signature Analysis format locked (Technical → Fundamental → Liquidity → LT Target → Swing → Signal)
- Never invent market data; always use tools for real calculation
- Deep space + gold + cyan visual language (Titan / Realm Guide / Energy Sphere)
- Daily quotes Command Center for subconscious priming
- Live eventually inside ORIGO (shared auth, watchlists, portfolio context)

## Monorepo

```
apps/mobile/     Expo (React Native) — cosmic UI
backend/         FastAPI — chat, quant sandbox, quotes
docs/            Architecture notes
```

## Open the app

**Live web preview (this agent session):**  
https://strengthening-prediction-latin-sleep.trycloudflare.com  

**Permanent (after Pages enabled / Actions deploy):**  
https://joannestax.github.io/AETHEREON-v1/

```bash
cd apps/mobile && npm install && npx expo start --web
```

See [docs/DEPLOY.md](docs/DEPLOY.md) for GitHub Pages, EAS / TestFlight.

## Priority Build Order

1. ✅ Project scaffolding + design tokens + theme
2. ✅ Signature Analysis screen
3. ✅ Chat screen with Sphere / Titan / Realm Guide + streaming UI
4. ✅ Observatory / Home + bottom navigation
5. ✅ Backend + secure quant sandbox
6. ✅ Daily quotes system + Command Center
7. ✅ Wire frontend ↔ backend (API client + chat stream fallback)
8. ⏳ Real LLM tool-calling loop (Grok scaffold ready)
9. ✅ ORIGO embedding architecture docs

## Mobile

```bash
cd apps/mobile
npm install
npx expo start
```

Tabs: Observatory · Chat · Watchlists · Insights · Profile  
Stack: Signature Analysis · Quotes Command Center

## Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Endpoints:

- `GET /health`
- `POST /v1/chat`
- `POST /v1/chat/quant`
- `POST /v1/quant/black-scholes` · `implied-vol` · `binomial` · `monte-carlo` · `sandbox` · `portfolio/summary`
- `GET/POST /v1/quotes` · `PATCH/DELETE /v1/quotes/{id}` · `GET /v1/quotes/today`

## Signature Analysis Contract

Exact structure — do not reorder:

1. Technical Analysis  
2. Fundamental Analysis  
3. Liquidity Levels  
4. Long-Term Price Target  
5. Swing Trade Setup (bias, entry, TPs, stop, options, confidence XX/100)  
6. Signal (BULLISH / BEARISH)

## Visual Language

| Role | Color |
|------|-------|
| Authority | Gold `#D4AF37` |
| Intelligence / live | Cyan `#00E5FF` |
| Bullish | Green |
| Bearish | Red |
| Realm | Deep space black |

---

*Project Genesis — proof of a bullish case for AI & robotics.*
