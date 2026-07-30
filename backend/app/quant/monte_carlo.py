import math
import random
from statistics import mean, pstdev


def gbm_paths(
    spot: float,
    mu: float,
    vol: float,
    t: float,
    steps: int = 252,
    paths: int = 1000,
    seed: int | None = 42,
) -> dict:
    """Monte-Carlo Geometric Brownian Motion paths (terminal stats)."""
    if seed is not None:
        random.seed(seed)

    dt = t / steps
    terminals: list[float] = []

    for _ in range(paths):
        s = spot
        for _ in range(steps):
            z = random.gauss(0.0, 1.0)
            s *= math.exp((mu - 0.5 * vol * vol) * dt + vol * math.sqrt(dt) * z)
        terminals.append(s)

    return {
        "mean_terminal": mean(terminals),
        "std_terminal": pstdev(terminals),
        "min_terminal": min(terminals),
        "max_terminal": max(terminals),
        "paths": paths,
        "steps": steps,
        "note": "Deterministic sandbox when seed is set. Not live market data.",
    }


class Portfolio:
    """Simple weighted portfolio helper for sandbox use."""

    def __init__(self, weights: dict[str, float]):
        total = sum(weights.values())
        if abs(total - 1.0) > 1e-6:
            raise ValueError("Weights must sum to 1.0")
        self.weights = weights

    def expected_return(self, returns: dict[str, float]) -> float:
        return sum(self.weights[k] * returns[k] for k in self.weights)
