"""
Categorized daily quotes + in-memory Command Center store.
Founder can add/edit/remove via API. Persist later via Supabase.
"""

from __future__ import annotations

from datetime import date, datetime, timezone
from typing import Literal

QuoteCategory = Literal[
    "Opening",
    "Identity",
    "Risk",
    "Wisdom",
    "Signature",
    "Action",
    "Mindset",
    "Closing",
]

SEED: list[dict] = [
    {"text": "The realm opens. Trade only what you can see clearly.", "category": "Opening"},
    {"text": "I am Aetheron — always watching the markets.", "category": "Identity"},
    {"text": "The light between the stars and the markets.", "category": "Identity"},
    {"text": "Discipline is the rarest alpha.", "category": "Wisdom"},
    {"text": "The chart is a diary of fear and greed — read it without becoming it.", "category": "Wisdom"},
    {"text": "Liquidity is truth; narrative is weather.", "category": "Signature"},
    {"text": "Size the risk before you size the dream.", "category": "Risk"},
    {"text": "Patience compounds louder than urgency.", "category": "Mindset"},
    {"text": "A stop loss is a vow to future you.", "category": "Risk"},
    {"text": "Conviction without invalidation is superstition.", "category": "Risk"},
    {"text": "The market rewards clarity under pressure.", "category": "Wisdom"},
    {"text": "Volume confirms what price merely suggests.", "category": "Signature"},
    {"text": "Protect the downside; let the upside earn its keep.", "category": "Risk"},
    {"text": "Bias is a hypothesis — data is the verdict.", "category": "Signature"},
    {"text": "Trade the plan you wrote when you were calm.", "category": "Action"},
    {"text": "Edge dies when ego speaks.", "category": "Mindset"},
    {"text": "Time in the right idea beats timing the noise.", "category": "Wisdom"},
    {"text": "Support is rented; structure is owned.", "category": "Signature"},
    {"text": "Options are tools — not lottery tickets.", "category": "Action"},
    {"text": "Silence after a win is wisdom.", "category": "Closing"},
    {"text": "The best entries feel slightly uncomfortable.", "category": "Action"},
    {"text": "Macro sets the weather; price sets the path.", "category": "Signature"},
    {"text": "Never invent what you can measure.", "category": "Identity"},
    {"text": "Aetheron watches; you decide.", "category": "Identity"},
    {"text": "Capital is a soldier — command it with honor.", "category": "Mindset"},
    {"text": "Uncertainty is the fee for asymmetric reward.", "category": "Wisdom"},
    {"text": "Reduce until the thesis is undeniable.", "category": "Action"},
    {"text": "The realm favors those who update beliefs.", "category": "Mindset"},
    {"text": "Risk first. Reward second. Story last.", "category": "Risk"},
    {"text": "Your edge is process, not prediction.", "category": "Mindset"},
    {"text": "When volatility rises, shrink until clarity returns.", "category": "Risk"},
    {"text": "Long-term targets need short-term humility.", "category": "Wisdom"},
    {"text": "Become the calmest mind in the storm.", "category": "Closing"},
    {"text": "Close the session with gratitude, not revenge.", "category": "Closing"},
    {"text": "Open with breath. Then open the book.", "category": "Opening"},
]

_store: list[dict] = []
_next_id = 1


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def reset_store() -> None:
    global _store, _next_id
    _store = []
    _next_id = 1
    for seed in SEED:
        add_quote(seed["text"], seed["category"])  # type: ignore[arg-type]


def get_daily_quotes(category: str | None = None) -> list[dict]:
    if not _store:
        reset_store()
    if category:
        return [q for q in _store if q["category"] == category]
    return list(_store)


def get_quote_of_the_day() -> dict:
    quotes = get_daily_quotes()
    idx = date.today().toordinal() % len(quotes)
    q = quotes[idx]
    return {**q, "date": date.today().isoformat(), "command_center": True}


def add_quote(text: str, category: QuoteCategory = "Wisdom", speaker: str = "Aetheron") -> dict:
    global _next_id
    if not _store and _next_id == 1:
        # allow seed path
        pass
    item = {
        "id": _next_id,
        "text": text.strip(),
        "speaker": speaker,
        "category": category,
        "created_at": _now(),
        "updated_at": _now(),
    }
    _next_id += 1
    _store.append(item)
    return item


def update_quote(quote_id: int, text: str | None = None, category: QuoteCategory | None = None) -> dict | None:
    for q in _store:
        if q["id"] == quote_id:
            if text is not None:
                q["text"] = text.strip()
            if category is not None:
                q["category"] = category
            q["updated_at"] = _now()
            return q
    return None


def delete_quote(quote_id: int) -> bool:
    global _store
    before = len(_store)
    _store = [q for q in _store if q["id"] != quote_id]
    return len(_store) < before


# Initialize on import
reset_store()
