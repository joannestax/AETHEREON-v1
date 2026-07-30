from fastapi import APIRouter, Query

from app.services.market_data import build_watchlist, fetch_equity_quote, fetch_global_overview

router = APIRouter()


@router.get("/market/watchlist")
def market_watchlist(tickers: str | None = Query(default=None, description="Comma-separated tickers")):
    parsed = [t.strip().upper() for t in tickers.split(",")] if tickers else None
    return build_watchlist(parsed)


@router.get("/market/overview")
def market_overview():
    try:
        return fetch_global_overview()
    except Exception as exc:  # noqa: BLE001
        return {"isLive": False, "error": str(exc), "policy": "Never invent market data."}


@router.get("/market/quote/{symbol}")
def market_quote(symbol: str):
    symbol = symbol.upper()
    try:
        data = build_watchlist([symbol])
        item = data["watchlist"][0] if data.get("watchlist") else None
        return {"quote": item, "policy": data.get("policy")}
    except Exception as exc:  # noqa: BLE001
        return {"quote": None, "isLive": False, "error": str(exc)}
