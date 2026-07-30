from datetime import date

# 30 high-signal daily quotes for Command Center subconscious priming
DAILY_QUOTES: list[str] = [
    "Discipline is the rarest alpha.",
    "The chart is a diary of fear and greed — read it without becoming it.",
    "Liquidity is truth; narrative is weather.",
    "Size the risk before you size the dream.",
    "Patience compounds louder than urgency.",
    "A stop loss is a vow to future you.",
    "Conviction without invalidation is superstition.",
    "The market rewards clarity under pressure.",
    "Volume confirms what price merely suggests.",
    "Protect the downside; let the upside earn its keep.",
    "Bias is a hypothesis — data is the verdict.",
    "Trade the plan you wrote when you were calm.",
    "Edge dies when ego speaks.",
    "Time in the right idea beats timing the noise.",
    "Support is rented; structure is owned.",
    "Options are tools — not lottery tickets.",
    "Silence after a win is wisdom.",
    "The best entries feel slightly uncomfortable.",
    "Macro sets the weather; price sets the path.",
    "Never invent what you can measure.",
    "Aetheron watches; you decide.",
    "Capital is a soldier — command it with honor.",
    "Uncertainty is the fee for asymmetric reward.",
    "Reduce until the thesis is undeniable.",
    "The realm favors those who update beliefs.",
    "Risk first. Reward second. Story last.",
    "Your edge is process, not prediction.",
    "When volatility rises, shrink until clarity returns.",
    "Long-term targets need short-term humility.",
    "Become the calmest mind in the storm.",
]


def get_daily_quotes() -> list[dict]:
    return [{"id": i + 1, "text": q, "speaker": "Aetheron"} for i, q in enumerate(DAILY_QUOTES)]


def get_quote_of_the_day() -> dict:
    idx = date.today().toordinal() % len(DAILY_QUOTES)
    return {
        "id": idx + 1,
        "text": DAILY_QUOTES[idx],
        "speaker": "Aetheron",
        "date": date.today().isoformat(),
        "command_center": True,
    }
