import math
import random
from dataclasses import dataclass, field
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


@dataclass
class Position:
    symbol: str
    quantity: float
    avg_price: float
    last_price: float | None = None

    @property
    def market_value(self) -> float | None:
        if self.last_price is None:
            return None
        return self.quantity * self.last_price

    @property
    def unrealized_pnl(self) -> float | None:
        if self.last_price is None:
            return None
        return (self.last_price - self.avg_price) * self.quantity


@dataclass
class Portfolio:
    """Weighted / position-based portfolio helper for the secure sandbox."""

    positions: list[Position] = field(default_factory=list)
    cash: float = 0.0

    def add_position(self, symbol: str, quantity: float, avg_price: float, last_price: float | None = None) -> None:
        self.positions.append(Position(symbol, quantity, avg_price, last_price))

    def summary(self) -> dict:
        values = []
        pnls = []
        missing_marks = []
        for p in self.positions:
            mv = p.market_value
            if mv is None:
                missing_marks.append(p.symbol)
            else:
                values.append(mv)
                pnl = p.unrealized_pnl
                if pnl is not None:
                    pnls.append(pnl)

        equity = self.cash + sum(values)
        return {
            "cash": self.cash,
            "positions": len(self.positions),
            "gross_market_value": sum(values) if values else None,
            "equity": equity if not missing_marks else None,
            "unrealized_pnl": sum(pnls) if pnls and not missing_marks else None,
            "missing_marks": missing_marks,
            "note": "Marks must come from live data tools — never invent prices.",
        }

    def risk_snapshot(self) -> dict:
        marked = [p for p in self.positions if p.last_price is not None]
        if not marked:
            return {"ok": False, "error": "No marked positions"}
        total = sum(abs(p.quantity * (p.last_price or 0)) for p in marked)
        weights = {
            p.symbol: abs(p.quantity * (p.last_price or 0)) / total if total else 0.0
            for p in marked
        }
        return {
            "ok": True,
            "weights": weights,
            "largest_weight": max(weights.values()) if weights else 0.0,
            "position_count": len(marked),
        }

    def expected_return(self, returns: dict[str, float]) -> float:
        """Legacy weight-dict helper when constructed via from_weights."""
        if not hasattr(self, "_weights"):
            raise ValueError("expected_return requires from_weights() portfolio")
        weights: dict[str, float] = self._weights  # type: ignore[attr-defined]
        return sum(weights[k] * returns[k] for k in weights)

    @classmethod
    def from_weights(cls, weights: dict[str, float]) -> "Portfolio":
        total = sum(weights.values())
        if abs(total - 1.0) > 1e-6:
            raise ValueError("Weights must sum to 1.0")
        p = cls()
        p._weights = weights  # type: ignore[attr-defined]
        return p

    def to_dict(self) -> dict:
        return self.summary()
