# ORIGO Integration Architecture

Aetheron ships as an **embedded module** inside the ORIGO App.

## Shared Context (target)

- Auth session / user identity
- Watchlists
- Portfolio holdings & risk preferences
- Notification preferences

## Boundaries

- Aetheron owns mentor UX, Signature Analysis, quotes Command Center, quant tool calls
- ORIGO owns account, funding, brokerage connections, primary navigation shell

## Embedding

- Mobile: Expo module screens under `apps/mobile/src/screens`
- API: `backend` as `/v1/*` services; ORIGO BFF can proxy with shared JWT
