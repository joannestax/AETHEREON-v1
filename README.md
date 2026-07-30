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

## Priority Build Order

1. ✅ Signature Analysis screen (full 6-part format)
2. Chat screen with Titan / Realm Guide avatars
3. Observatory (Home)
4. Wire frontend ↔ backend
5. Real Grok tool-calling loop
6. Live market data connection

## Mobile

```bash
cd apps/mobile
npm install
npx expo start
```

The app currently boots into the **Signature Analysis** screen with an **illustrative** fixture (bannered as not live data).

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
- `POST /v1/quant/black-scholes` · `implied-vol` · `binomial` · `monte-carlo`
- `GET /v1/quotes` · `GET /v1/quotes/today`

Set `XAI_API_KEY` for Grok (scaffold only until tool loop lands).

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
