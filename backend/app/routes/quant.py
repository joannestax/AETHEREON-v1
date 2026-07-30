from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.quant.black_scholes import black_scholes_price, greeks
from app.quant.implied_vol import implied_volatility
from app.quant.binomial import binomial_price
from app.quant.monte_carlo import gbm_paths

router = APIRouter()


class BSRequest(BaseModel):
    spot: float
    strike: float
    rate: float
    dividend: float = 0.0
    vol: float
    t: float = Field(..., description="Time to expiry in years")
    option_type: str = "call"


class IVRequest(BaseModel):
    market_price: float
    spot: float
    strike: float
    rate: float
    dividend: float = 0.0
    t: float
    option_type: str = "call"


class BinomialRequest(BSRequest):
    steps: int = 100
    american: bool = False


class MonteCarloRequest(BaseModel):
    spot: float
    mu: float
    vol: float
    t: float
    steps: int = 252
    paths: int = 1000
    seed: int | None = 42


@router.post("/chat/quant")
def quant_chat_alias():
    """Alias placeholder aligning with /v1/chat/quant roadmap."""
    return {
        "message": "Use /v1/quant/* endpoints for deterministic pricing. Chat+quant loop TBD."
    }


@router.post("/quant/black-scholes")
def price_bs(req: BSRequest):
    price = black_scholes_price(
        req.spot, req.strike, req.rate, req.dividend, req.vol, req.t, req.option_type
    )
    g = greeks(req.spot, req.strike, req.rate, req.dividend, req.vol, req.t, req.option_type)
    return {"price": price, "greeks": g}


@router.post("/quant/implied-vol")
def iv(req: IVRequest):
    vol = implied_volatility(
        req.market_price,
        req.spot,
        req.strike,
        req.rate,
        req.dividend,
        req.t,
        req.option_type,
    )
    return {"implied_volatility": vol}


@router.post("/quant/binomial")
def binomial(req: BinomialRequest):
    price = binomial_price(
        req.spot,
        req.strike,
        req.rate,
        req.dividend,
        req.vol,
        req.t,
        req.steps,
        req.option_type,
        req.american,
    )
    return {"price": price, "steps": req.steps, "american": req.american}


@router.post("/quant/monte-carlo")
def monte_carlo(req: MonteCarloRequest):
    result = gbm_paths(req.spot, req.mu, req.vol, req.t, req.steps, req.paths, req.seed)
    return result
