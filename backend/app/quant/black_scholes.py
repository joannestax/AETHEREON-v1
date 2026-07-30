import math
from typing import Literal

OptionType = Literal["call", "put"]


def _norm_cdf(x: float) -> float:
    return 0.5 * (1.0 + math.erf(x / math.sqrt(2.0)))


def _norm_pdf(x: float) -> float:
    return math.exp(-0.5 * x * x) / math.sqrt(2.0 * math.pi)


def _d1_d2(spot: float, strike: float, rate: float, dividend: float, vol: float, t: float):
    if t <= 0 or vol <= 0 or spot <= 0 or strike <= 0:
        raise ValueError("Invalid BS inputs")
    d1 = (math.log(spot / strike) + (rate - dividend + 0.5 * vol * vol) * t) / (vol * math.sqrt(t))
    d2 = d1 - vol * math.sqrt(t)
    return d1, d2


def black_scholes_price(
    spot: float,
    strike: float,
    rate: float,
    dividend: float,
    vol: float,
    t: float,
    option_type: str = "call",
) -> float:
    d1, d2 = _d1_d2(spot, strike, rate, dividend, vol, t)
    disc_q = math.exp(-dividend * t)
    disc_r = math.exp(-rate * t)
    if option_type.lower() == "call":
        return spot * disc_q * _norm_cdf(d1) - strike * disc_r * _norm_cdf(d2)
    return strike * disc_r * _norm_cdf(-d2) - spot * disc_q * _norm_cdf(-d1)


def greeks(
    spot: float,
    strike: float,
    rate: float,
    dividend: float,
    vol: float,
    t: float,
    option_type: str = "call",
) -> dict[str, float]:
    d1, d2 = _d1_d2(spot, strike, rate, dividend, vol, t)
    disc_q = math.exp(-dividend * t)
    disc_r = math.exp(-rate * t)
    sqrt_t = math.sqrt(t)
    pdf = _norm_pdf(d1)

    if option_type.lower() == "call":
        delta = disc_q * _norm_cdf(d1)
        theta = (
            -spot * disc_q * pdf * vol / (2 * sqrt_t)
            - rate * strike * disc_r * _norm_cdf(d2)
            + dividend * spot * disc_q * _norm_cdf(d1)
        ) / 365.0
        rho = strike * t * disc_r * _norm_cdf(d2) / 100.0
    else:
        delta = -disc_q * _norm_cdf(-d1)
        theta = (
            -spot * disc_q * pdf * vol / (2 * sqrt_t)
            + rate * strike * disc_r * _norm_cdf(-d2)
            - dividend * spot * disc_q * _norm_cdf(-d1)
        ) / 365.0
        rho = -strike * t * disc_r * _norm_cdf(-d2) / 100.0

    gamma = disc_q * pdf / (spot * vol * sqrt_t)
    vega = spot * disc_q * pdf * sqrt_t / 100.0

    return {
        "delta": delta,
        "gamma": gamma,
        "vega": vega,
        "theta": theta,
        "rho": rho,
    }
