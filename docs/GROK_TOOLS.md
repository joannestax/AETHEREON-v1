# Grok tool-calling loop

Aetheron chats through xAI Grok when `XAI_API_KEY` is set. The model never invents prices — marks and quant math come only from local tools.

## Enable

```bash
cd backend
cp .env.example .env
# set XAI_API_KEY=...
uvicorn app.main:app --reload --port 8000
```

`GET /health` reports `grok_configured: true|false`.

## Flow

1. Mobile / client `POST /v1/chat` with messages  
2. Backend builds system prompt + history  
3. `GrokClient.chat_with_tools` sends OpenAI-compatible completions to `XAI_BASE_URL`  
4. On `tool_calls`, `app/services/tools.py` executes handlers and returns JSON tool results  
5. Loop continues (max `XAI_MAX_TOOL_ROUNDS`, default 6) until a final text reply  
6. Without a key or on Grok failure → mentor fallback voice (still no invented marks)

## Tools

| Tool | Purpose |
|------|---------|
| `get_market_quote` | Single ticker via CoinGecko / Yahoo allowlist |
| `get_watchlist` | Observatory basket |
| `black_scholes` | Price + Greeks |
| `implied_volatility` | IV solver |
| `binomial_price` | CRR tree (EU/US) |
| `monte_carlo_gbm` | GBM terminal stats |
| `portfolio_summary` | Positions + cash (marks must be supplied) |
| `run_quant_sandbox` | AST-filtered Python |
| `signature_analysis_scaffold` | Locked 6-part structure (null marks until filled) |

## Env

| Var | Default | Notes |
|-----|---------|--------|
| `XAI_API_KEY` | — | Required for Grok |
| `XAI_MODEL` | `grok-3` | Model id |
| `XAI_BASE_URL` | `https://api.x.ai/v1` | OpenAI-compatible base |
| `XAI_MAX_TOOL_ROUNDS` | `6` | Safety cap |
| `XAI_TIMEOUT_SEC` | `45` | HTTP timeout |

## Response fields (`POST /v1/chat`)

- `reply` — mentor text  
- `source` — `grok` | `mentor_fallback`  
- `tools_used` — names / ok flags for executed tools  
- `model` — upstream model when Grok answered  
- `note` — operator-facing status (never a price source)
