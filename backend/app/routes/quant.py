from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.quant.black_scholes import black_scholes_price, greeks
from app.quant.implied_vol import implied_volatility
from app.quant.binomial import binomial_price
from app.quant.monte_carlo import gbm_paths, Portfolio
from app.quant.sandbox import run_quant_code

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


class SandboxRequest(BaseModel):
    code: str = Field(..., max_length=8000)
    timeout_sec: int = Field(default=2, ge=1, le=5)


class QuantChatRequest(BaseModel):
    prompt: str
    code: str | None = None


@router.post("/chat/quant")
def chat_quant(req: QuantChatRequest):
    """
    Quant-aware chat endpoint.
    If code is provided, run it in the secure sandbox.
    Never invents market data — calculations only.
    """
    sandbox_result = None
    if req.code:
        sandbox_result = run_quant_code(req.code)

    return {
        "reply": (
            "Quant mind online. Provide verified inputs for pricing, Greeks, IV, trees, or Monte Carlo. "
            "I will not invent spots, vols, or marks."
        ),
        "prompt_echo": req.prompt,
        "sandbox": sandbox_result,
        "tools": [
            "black_scholes_price",
            "greeks",
            "implied_volatility",
            "binomial_price",
            "gbm_paths",
            "Portfolio",
        ],
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
    return gbm_paths(req.spot, req.mu, req.vol, req.t, req.steps, req.paths, req.seed)


@router.post("/quant/sandbox")
def sandbox(req: SandboxRequest):
    return run_quant_code(req.code, req.timeout_sec)


class PortfolioPosition(BaseModel):
    symbol: str
    quantity: float
    avg_price: float
    last_price: float | None = None


class PortfolioRequest(BaseModel):
    positions: list[PortfolioPosition]
    cash: float = 0.0


@router.post("/quant/portfolio/summary")
def portfolio_summary(req: PortfolioRequest):
    book = Portfolio(cash=req.cash)
    for p in req.positions:
        book.add_position(p.symbol, p.quantity, p.avg_price, p.last_price)
    return {"summary": book.summary(), "risk": book.risk_snapshot()}
