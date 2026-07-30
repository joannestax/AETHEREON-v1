# ORIGO Embedding Architecture — Aetheron Module

Aetheron is an **embedded intelligent co-pilot** inside the ORIGO App (Project Genesis).

## Shared context
- Authentication / session (ORIGO JWT)
- Watchlists
- Portfolio holdings & risk preferences
- User profile

## Deep links
- `origo://aetheron/chat`
- `origo://aetheron/analyze/{TICKER}` → Signature Analysis
- `origo://aetheron/quotes` → Daily Quotes / Command Center
- In-app CTA on any ticker row: **Ask Aetheron**

## Module boundaries
| Layer | Owns |
|-------|------|
| ORIGO shell | Tabs shell, auth, brokerage, funding |
| Aetheron module | Chat, Signature Analysis, Observatory mentor widgets, Quotes, Quant tools |

## Integration checklist
1. Mount Aetheron screens under ORIGO navigation
2. Pass auth token to `AETHERON_API` /v1/*
3. Hydrate watchlist + portfolio into Observatory (never invent marks)
4. Wire “Ask Aetheron” from Markets / Watchlists → Chat with ticker context
5. Supabase (optional) for quotes persistence & realtime mentor events
