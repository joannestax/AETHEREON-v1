# Aetheron backend

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # set XAI_API_KEY for Grok tool loop
uvicorn app.main:app --reload --port 8000
```

- Health: `GET /health` (includes `grok_configured`)
- Chat: `POST /v1/chat` — Grok + tools when keyed; mentor fallback otherwise
- Tools: market quotes, BS/Greeks/IV/binomial/MC, portfolio, quant sandbox, signature scaffold
- Policy: never invent market data
