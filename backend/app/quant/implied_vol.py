from app.quant.black_scholes import black_scholes_price


def implied_volatility(
    market_price: float,
    spot: float,
    strike: float,
    rate: float,
    dividend: float,
    t: float,
    option_type: str = "call",
    tol: float = 1e-6,
    max_iter: int = 100,
) -> float:
    """Newton-Raphson IV solver."""
    if market_price <= 0 or t <= 0:
        raise ValueError("Invalid IV inputs")

    vol = 0.3
    for _ in range(max_iter):
        price = black_scholes_price(spot, strike, rate, dividend, vol, t, option_type)
        # Vega in price per 1.0 vol (not /100)
        from app.quant.black_scholes import _d1_d2, _norm_pdf
        import math

        d1, _ = _d1_d2(spot, strike, rate, dividend, vol, t)
        vega = spot * math.exp(-dividend * t) * _norm_pdf(d1) * math.sqrt(t)
        if vega < 1e-12:
            break
        diff = price - market_price
        if abs(diff) < tol:
            return vol
        vol = max(1e-4, vol - diff / vega)

    return vol
