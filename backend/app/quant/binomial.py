import math


def binomial_price(
    spot: float,
    strike: float,
    rate: float,
    dividend: float,
    vol: float,
    t: float,
    steps: int = 100,
    option_type: str = "call",
    american: bool = False,
) -> float:
    """CRR binomial tree for European/American options."""
    if steps < 1 or t <= 0 or vol <= 0:
        raise ValueError("Invalid binomial inputs")

    dt = t / steps
    u = math.exp(vol * math.sqrt(dt))
    d = 1.0 / u
    a = math.exp((rate - dividend) * dt)
    p = (a - d) / (u - d)
    disc = math.exp(-rate * dt)

    # Terminal payoffs
    values = []
    for i in range(steps + 1):
        st = spot * (u ** (steps - i)) * (d ** i)
        if option_type.lower() == "call":
            values.append(max(0.0, st - strike))
        else:
            values.append(max(0.0, strike - st))

    for n in range(steps - 1, -1, -1):
        next_values = []
        for i in range(n + 1):
            cont = disc * (p * values[i] + (1 - p) * values[i + 1])
            if american:
                st = spot * (u ** (n - i)) * (d ** i)
                exercise = max(0.0, st - strike) if option_type.lower() == "call" else max(0.0, strike - st)
                next_values.append(max(cont, exercise))
            else:
                next_values.append(cont)
        values = next_values

    return values[0]
