"""
Aetheron tool registry for the Grok tool-calling loop.

Prices and quant math come only from these adapters — never invented.
"""

from __future__ import annotations

import json
from typing import Any, Callable

from app.quant.binomial import binomial_price
from app.quant.black_scholes import black_scholes_price, greeks
from app.quant.implied_vol import implied_volatility
from app.quant.monte_carlo import Portfolio, gbm_paths
from app.quant.sandbox import run_quant_code
from app.services.market_data import build_watchlist
from app.services.signature import build_signature_stub

# OpenAI / xAI function-calling tool schemas
TOOL_DEFINITIONS: list[dict[str, Any]] = [
    {
        "type": "function",
        "function": {
            "name": "get_market_quote",
            "description": (
                "Fetch a live market quote for one ticker via CoinGecko (crypto) or Yahoo "
                "(allowlisted equities). Returns null price when unlisted or unavailable — "
                "never invent marks."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "symbol": {
                        "type": "string",
                        "description": "Ticker symbol, e.g. BTC, ETH, NVDA, AAPL",
                    }
                },
                "required": ["symbol"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_watchlist",
            "description": (
                "Fetch Observatory watchlist quotes. Omit tickers for the default basket. "
                "Missing marks stay null."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "tickers": {
                        "type": "array",
                        "items": {"type": "string"},
                        "description": "Optional list of tickers",
                    }
                },
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "black_scholes",
            "description": "Black–Scholes European option price and Greeks. Requires verified numeric inputs.",
            "parameters": {
                "type": "object",
                "properties": {
                    "spot": {"type": "number"},
                    "strike": {"type": "number"},
                    "rate": {"type": "number", "description": "Continuous risk-free rate"},
                    "vol": {"type": "number", "description": "Annualized volatility (e.g. 0.25)"},
                    "t": {"type": "number", "description": "Time to expiry in years"},
                    "dividend": {"type": "number", "description": "Continuous dividend yield", "default": 0},
                    "option_type": {"type": "string", "enum": ["call", "put"], "default": "call"},
                },
                "required": ["spot", "strike", "rate", "vol", "t"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "implied_volatility",
            "description": "Solve Black–Scholes implied volatility from a market option price.",
            "parameters": {
                "type": "object",
                "properties": {
                    "market_price": {"type": "number"},
                    "spot": {"type": "number"},
                    "strike": {"type": "number"},
                    "rate": {"type": "number"},
                    "t": {"type": "number"},
                    "dividend": {"type": "number", "default": 0},
                    "option_type": {"type": "string", "enum": ["call", "put"], "default": "call"},
                },
                "required": ["market_price", "spot", "strike", "rate", "t"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "binomial_price",
            "description": "CRR binomial tree price for European or American options.",
            "parameters": {
                "type": "object",
                "properties": {
                    "spot": {"type": "number"},
                    "strike": {"type": "number"},
                    "rate": {"type": "number"},
                    "vol": {"type": "number"},
                    "t": {"type": "number"},
                    "dividend": {"type": "number", "default": 0},
                    "steps": {"type": "integer", "default": 100},
                    "option_type": {"type": "string", "enum": ["call", "put"], "default": "call"},
                    "american": {"type": "boolean", "default": False},
                },
                "required": ["spot", "strike", "rate", "vol", "t"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "monte_carlo_gbm",
            "description": "Monte Carlo GBM terminal path statistics. Not live market data.",
            "parameters": {
                "type": "object",
                "properties": {
                    "spot": {"type": "number"},
                    "mu": {"type": "number"},
                    "vol": {"type": "number"},
                    "t": {"type": "number"},
                    "steps": {"type": "integer", "default": 252},
                    "paths": {"type": "integer", "default": 1000},
                    "seed": {"type": "integer", "default": 42},
                },
                "required": ["spot", "mu", "vol", "t"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "portfolio_summary",
            "description": (
                "Summarize a portfolio from caller-provided positions. "
                "last_price must come from a quote tool or the user — never invent."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "positions": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "symbol": {"type": "string"},
                                "quantity": {"type": "number"},
                                "avg_price": {"type": "number"},
                                "last_price": {"type": ["number", "null"]},
                            },
                            "required": ["symbol", "quantity", "avg_price"],
                        },
                    },
                    "cash": {"type": "number", "default": 0},
                },
                "required": ["positions"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "run_quant_sandbox",
            "description": (
                "Run short Python in the AST-filtered quant sandbox. "
                "Exposed: black_scholes_price, greeks, implied_volatility, "
                "binomial_price, gbm_paths, Portfolio, math."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "code": {"type": "string", "description": "Restricted Python source"},
                    "timeout_sec": {"type": "integer", "default": 2, "minimum": 1, "maximum": 5},
                },
                "required": ["code"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "signature_analysis_scaffold",
            "description": (
                "Return the locked 6-part Signature Analysis scaffold for a ticker. "
                "Prices remain null until filled from quote/quant tools. Never invent marks."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "ticker": {"type": "string"},
                },
                "required": ["ticker"],
            },
        },
    },
]


def _tool_get_market_quote(symbol: str) -> dict[str, Any]:
    data = build_watchlist([symbol.upper()])
    item = (data.get("watchlist") or [None])[0]
    return {"quote": item, "policy": data.get("policy")}


def _tool_get_watchlist(tickers: list[str] | None = None) -> dict[str, Any]:
    parsed = [t.upper() for t in tickers] if tickers else None
    return build_watchlist(parsed)


def _tool_black_scholes(
    spot: float,
    strike: float,
    rate: float,
    vol: float,
    t: float,
    dividend: float = 0.0,
    option_type: str = "call",
) -> dict[str, Any]:
    price = black_scholes_price(spot, strike, rate, dividend, vol, t, option_type)
    g = greeks(spot, strike, rate, dividend, vol, t, option_type)
    return {"price": price, "greeks": g, "option_type": option_type}


def _tool_implied_volatility(
    market_price: float,
    spot: float,
    strike: float,
    rate: float,
    t: float,
    dividend: float = 0.0,
    option_type: str = "call",
) -> dict[str, Any]:
    vol = implied_volatility(market_price, spot, strike, rate, dividend, t, option_type)
    return {"implied_volatility": vol, "option_type": option_type}


def _tool_binomial_price(
    spot: float,
    strike: float,
    rate: float,
    vol: float,
    t: float,
    dividend: float = 0.0,
    steps: int = 100,
    option_type: str = "call",
    american: bool = False,
) -> dict[str, Any]:
    price = binomial_price(spot, strike, rate, dividend, vol, t, steps, option_type, american)
    return {"price": price, "steps": steps, "american": american, "option_type": option_type}


def _tool_monte_carlo_gbm(
    spot: float,
    mu: float,
    vol: float,
    t: float,
    steps: int = 252,
    paths: int = 1000,
    seed: int | None = 42,
) -> dict[str, Any]:
    paths = min(int(paths), 5000)
    steps = min(int(steps), 1000)
    return gbm_paths(spot, mu, vol, t, steps, paths, seed)


def _tool_portfolio_summary(positions: list[dict[str, Any]], cash: float = 0.0) -> dict[str, Any]:
    book = Portfolio(cash=float(cash or 0.0))
    for p in positions:
        book.add_position(
            str(p["symbol"]),
            float(p["quantity"]),
            float(p["avg_price"]),
            None if p.get("last_price") is None else float(p["last_price"]),
        )
    return {"summary": book.summary(), "risk": book.risk_snapshot()}


def _tool_run_quant_sandbox(code: str, timeout_sec: int = 2) -> dict[str, Any]:
    timeout_sec = max(1, min(int(timeout_sec or 2), 5))
    if len(code) > 8000:
        return {"ok": False, "error": "code exceeds 8000 character limit"}
    result = run_quant_code(code, timeout_sec)
    if isinstance(result, dict):
        result.pop("trace", None)
    return result


def _tool_signature_scaffold(ticker: str) -> dict[str, Any]:
    return build_signature_stub(ticker)


_HANDLERS: dict[str, Callable[..., Any]] = {
    "get_market_quote": _tool_get_market_quote,
    "get_watchlist": _tool_get_watchlist,
    "black_scholes": _tool_black_scholes,
    "implied_volatility": _tool_implied_volatility,
    "binomial_price": _tool_binomial_price,
    "monte_carlo_gbm": _tool_monte_carlo_gbm,
    "portfolio_summary": _tool_portfolio_summary,
    "run_quant_sandbox": _tool_run_quant_sandbox,
    "signature_analysis_scaffold": _tool_signature_scaffold,
}


def execute_tool(name: str, arguments: dict[str, Any] | str | None) -> dict[str, Any]:
    """Dispatch a single tool call. Always returns a JSON-serializable dict."""
    handler = _HANDLERS.get(name)
    if handler is None:
        return {"ok": False, "error": f"unknown_tool: {name}"}

    if arguments is None:
        args: dict[str, Any] = {}
    elif isinstance(arguments, str):
        try:
            args = json.loads(arguments) if arguments.strip() else {}
        except json.JSONDecodeError as exc:
            return {"ok": False, "error": f"invalid_json_arguments: {exc}"}
    else:
        args = dict(arguments)

    try:
        result = handler(**args)
        if isinstance(result, dict):
            return result
        return {"result": result}
    except TypeError:
        return {"ok": False, "error": "invalid_arguments"}
    except Exception:
        return {"ok": False, "error": "tool_execution_failed"}


def tool_result_message(tool_call_id: str, payload: dict[str, Any]) -> dict[str, Any]:
    return {
        "role": "tool",
        "tool_call_id": tool_call_id,
        "content": json.dumps(payload, default=str),
    }
