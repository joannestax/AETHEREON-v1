"""
Live market data adapters.
Never invent prices — only return values from upstream feeds.
Sources: CoinGecko (crypto + global), Yahoo Finance chart (equities).
"""

from __future__ import annotations

import time
from typing import Any

import httpx

_CACHE: dict[str, tuple[float, Any]] = {}
_CACHE_TTL = 90.0  # seconds — respect free-tier rate limits
_STALE_TTL = 900.0  # serve stale on upstream 429 rather than inventing

COINGECKO_IDS = {
    "BTC": "bitcoin",
    "ETH": "ethereum",
}

# Equities / tickers resolved via Yahoo
YAHOO_SYMBOLS = {"NVDA", "AAPL", "MSFT", "TSLA", "AMZN", "META", "GOOGL"}

# Project / unlisted tickers — never invent marks
UNLISTED = {"ORGN", "AETH"}


def _cached(key: str, *, allow_stale: bool = False):
    hit = _CACHE.get(key)
    if not hit:
        return None
    age = time.time() - hit[0]
    if age < _CACHE_TTL:
        return hit[1]
    if allow_stale and age < _STALE_TTL:
        return hit[1]
    return None


def _store(key: str, value: Any):
    _CACHE[key] = (time.time(), value)
    return value


def _client() -> httpx.Client:
    return httpx.Client(
        timeout=12.0,
        headers={"User-Agent": "AetheronGenesis/0.1 (ORIGO Nexus; market-read-only)"},
    )


def fetch_fear_greed() -> dict | None:
    """Crypto Fear & Greed from alternative.me — live sentiment, never invented."""
    key = "fng:latest"
    cached = _cached(key)
    if cached is not None:
        return cached

    try:
        with _client() as client:
            r = client.get("https://api.alternative.me/fng/", params={"limit": 1})
            r.raise_for_status()
            payload = r.json()
        row = (payload.get("data") or [None])[0]
        if not row:
            return _cached(key, allow_stale=True)
        out = {
            "value": int(row["value"]),
            "classification": row.get("value_classification"),
            "source": "alternative.me",
            "isLive": True,
        }
        return _store(key, out)
    except Exception:  # noqa: BLE001
        return _cached(key, allow_stale=True)


def fetch_crypto_quotes(tickers: list[str]) -> dict[str, dict]:
    ids = [COINGECKO_IDS[t] for t in tickers if t in COINGECKO_IDS]
    if not ids:
        return {}
    key = "cg:" + ",".join(sorted(ids))
    cached = _cached(key)
    if cached is not None:
        return cached

    with _client() as client:
        r = client.get(
            "https://api.coingecko.com/api/v3/simple/price",
            params={
                "ids": ",".join(ids),
                "vs_currencies": "usd",
                "include_24hr_change": "true",
            },
        )
        if r.status_code == 429:
            stale = _cached(key, allow_stale=True)
            if stale is not None:
                return stale
            r.raise_for_status()
        r.raise_for_status()
        raw = r.json()

    out: dict[str, dict] = {}
    for ticker, cg_id in COINGECKO_IDS.items():
        if cg_id in raw:
            out[ticker] = {
                "ticker": ticker,
                "price": raw[cg_id]["usd"],
                "changePercent": raw[cg_id].get("usd_24h_change"),
                "source": "coingecko",
                "isLive": True,
            }
    return _store(key, out)


def fetch_crypto_sparkline(ticker: str, days: int = 7) -> list[float]:
    cg_id = COINGECKO_IDS.get(ticker)
    if not cg_id:
        return []
    key = f"cg-spark:{cg_id}:{days}"
    cached = _cached(key)
    if cached is not None:
        return cached

    with _client() as client:
        r = client.get(
            f"https://api.coingecko.com/api/v3/coins/{cg_id}/market_chart",
            params={"vs_currency": "usd", "days": days},
        )
        if r.status_code == 429:
            stale = _cached(key, allow_stale=True)
            if stale is not None:
                return stale
            return []
        r.raise_for_status()
        prices = r.json().get("prices", [])

    # downsample to ~24 points
    if not prices:
        return _store(key, [])
    step = max(1, len(prices) // 24)
    series = [float(p[1]) for p in prices[::step]][:24]
    return _store(key, series)


def fetch_equity_quote(symbol: str) -> dict | None:
    symbol = symbol.upper()
    key = f"yahoo:{symbol}"
    cached = _cached(key)
    if cached is not None:
        return cached

    with _client() as client:
        r = client.get(
            f"https://query1.finance.yahoo.com/v8/finance/chart/{symbol}",
            params={"interval": "1d", "range": "5d"},
        )
        r.raise_for_status()
        payload = r.json()

    result = (payload.get("chart") or {}).get("result") or []
    if not result:
        return _store(key, None)

    meta = result[0].get("meta") or {}
    price = meta.get("regularMarketPrice")
    prev = meta.get("chartPreviousClose") or meta.get("previousClose")
    change_pct = None
    if price is not None and prev:
        change_pct = ((price - prev) / prev) * 100.0

    closes = ((result[0].get("indicators") or {}).get("quote") or [{}])[0].get("close") or []
    spark = [float(c) for c in closes if c is not None]

    data = {
        "ticker": symbol,
        "price": price,
        "changePercent": change_pct,
        "sparkline": spark,
        "source": "yahoo",
        "isLive": True,
        "name": meta.get("longName") or meta.get("shortName") or symbol,
    }
    return _store(key, data)


def fetch_global_overview() -> dict:
    key = "cg:global"
    cached = _cached(key)
    if cached is not None:
        overview = dict(cached)
    else:
        overview = None
        try:
            with _client() as client:
                r = client.get("https://api.coingecko.com/api/v3/global")
                if r.status_code == 429:
                    stale = _cached(key, allow_stale=True)
                    overview = dict(stale) if stale else None
                else:
                    r.raise_for_status()
                    data = r.json().get("data") or {}
                    total = (data.get("total_market_cap") or {}).get("usd")
                    volume = (data.get("total_volume") or {}).get("usd")
                    btc_dom = (data.get("market_cap_percentage") or {}).get("btc")
                    mcap_change = data.get("market_cap_change_percentage_24h_usd")
                    overview = _store(
                        key,
                        {
                            "totalMarketCap": total,
                            "totalMarketCapChangePercent": mcap_change,
                            "volume24h": volume,
                            "btcDominance": btc_dom,
                            "source": "coingecko",
                            "isLive": True,
                            "asOf": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                        },
                    )
        except Exception as exc:  # noqa: BLE001
            stale = _cached(key, allow_stale=True)
            overview = dict(stale) if stale else {"isLive": False, "error": type(exc).__name__}

    if overview is None:
        overview = {"isLive": False}

    fng = fetch_fear_greed()
    if fng:
        overview["fearGreed"] = fng
    return overview


def build_watchlist(tickers: list[str] | None = None) -> dict:
    """
    Compose Observatory watchlist.
    Unlisted ORIGO tickers return null prices (never invented).
    """
    requested = [t.upper() for t in (tickers or ["BTC", "ETH", "NVDA", "ORGN", "AETH"])]
    names = {
        "BTC": "Bitcoin",
        "ETH": "Ethereum",
        "NVDA": "NVIDIA",
        "ORGN": "ORIGO Network",
        "AETH": "Aetheron Token",
        "AAPL": "Apple",
        "MSFT": "Microsoft",
    }

    crypto = fetch_crypto_quotes([t for t in requested if t in COINGECKO_IDS])
    items = []

    for t in requested:
        if t in UNLISTED:
            items.append(
                {
                    "ticker": t,
                    "name": names.get(t, t),
                    "price": None,
                    "changePercent": None,
                    "sparkline": [],
                    "isLive": False,
                    "isIllustrative": False,
                    "status": "unlisted",
                    "note": "Not on public market feeds — no invented price.",
                }
            )
            continue

        if t in COINGECKO_IDS:
            q = crypto.get(t, {})
            spark: list[float] = []
            if q:
                try:
                    spark = fetch_crypto_sparkline(t)
                except Exception:  # noqa: BLE001
                    spark = []
            items.append(
                {
                    "ticker": t,
                    "name": names.get(t, t),
                    "price": q.get("price"),
                    "changePercent": q.get("changePercent"),
                    "sparkline": spark,
                    "isLive": bool(q.get("isLive")),
                    "isIllustrative": False,
                    "source": q.get("source"),
                }
            )
            continue

        if t in YAHOO_SYMBOLS:
            try:
                eq = fetch_equity_quote(t)
            except Exception as exc:  # noqa: BLE001
                items.append(
                    {
                        "ticker": t,
                        "name": names.get(t, t),
                        "price": None,
                        "changePercent": None,
                        "sparkline": [],
                        "isLive": False,
                        "isIllustrative": False,
                        "status": "unavailable",
                        "note": f"Live feed error: {type(exc).__name__}",
                    }
                )
                continue

            if not eq or eq.get("price") is None:
                items.append(
                    {
                        "ticker": t,
                        "name": names.get(t, t),
                        "price": None,
                        "changePercent": None,
                        "sparkline": [],
                        "isLive": False,
                        "isIllustrative": False,
                        "status": "unavailable",
                        "note": "No live quote returned.",
                    }
                )
            else:
                items.append(
                    {
                        "ticker": t,
                        "name": eq.get("name") or names.get(t, t),
                        "price": eq["price"],
                        "changePercent": eq.get("changePercent"),
                        "sparkline": eq.get("sparkline") or [],
                        "isLive": True,
                        "isIllustrative": False,
                        "source": "yahoo",
                    }
                )
            continue

        # Unknown ticker — never invent a mark or hit upstream blindly
        items.append(
            {
                "ticker": t,
                "name": names.get(t, t),
                "price": None,
                "changePercent": None,
                "sparkline": [],
                "isLive": False,
                "isIllustrative": False,
                "status": "unlisted",
                "note": "Not on configured market feeds — no invented price.",
            }
        )

    overview = None
    try:
        overview = fetch_global_overview()
    except Exception as exc:  # noqa: BLE001
        overview = {"isLive": False, "error": str(exc)}

    return {
        "watchlist": items,
        "marketStrip": _strip_from_overview(overview),
        "overview": overview,
        "policy": "Aetheron never invents prices. Missing marks stay null.",
    }


def _strip_from_overview(overview: dict | None) -> list[dict]:
    fng = (overview or {}).get("fearGreed") if overview else None
    fng_cell = {
        "label": "FEAR & GREED",
        "value": f"{fng['value']}" if fng and fng.get("value") is not None else "—",
        "change": fng.get("classification") if fng else None,
        "tone": "gold" if fng else "neutral",
        "isLive": bool(fng and fng.get("isLive")),
        "note": None if fng else "Feed pending",
    }

    if not overview or not overview.get("isLive"):
        return [
            {"label": "TOTAL MARKET CAP", "value": "—", "change": None, "tone": "gold", "isLive": False},
            {"label": "24H VOLUME", "value": "—", "change": None, "tone": "cyan", "isLive": False},
            {"label": "BTC DOMINANCE", "value": "—", "change": None, "tone": "cyan", "isLive": False},
            fng_cell,
        ]

    def money(n: float | None) -> str:
        if n is None:
            return "—"
        if n >= 1e12:
            return f"${n / 1e12:.2f}T"
        if n >= 1e9:
            return f"${n / 1e9:.1f}B"
        return f"${n:,.0f}"

    mcap_chg = overview.get("totalMarketCapChangePercent")
    return [
        {
            "label": "TOTAL MARKET CAP",
            "value": money(overview.get("totalMarketCap")),
            "change": f"{mcap_chg:+.2f}%" if isinstance(mcap_chg, (int, float)) else None,
            "tone": "gold",
            "isLive": True,
        },
        {
            "label": "24H VOLUME",
            "value": money(overview.get("volume24h")),
            "change": None,
            "tone": "cyan",
            "isLive": True,
        },
        {
            "label": "BTC DOMINANCE",
            "value": f"{overview['btcDominance']:.2f}%" if overview.get("btcDominance") is not None else "—",
            "change": None,
            "tone": "cyan",
            "isLive": True,
        },
        fng_cell,
    ]

