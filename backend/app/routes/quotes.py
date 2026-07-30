from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.services.quotes import (
    add_quote,
    delete_quote,
    get_daily_quotes,
    get_quote_of_the_day,
    update_quote,
)

router = APIRouter()

CATEGORIES = [
    "Opening",
    "Identity",
    "Risk",
    "Wisdom",
    "Signature",
    "Action",
    "Mindset",
    "Closing",
]


class QuoteCreate(BaseModel):
    text: str = Field(..., min_length=3, max_length=500)
    category: str = "Wisdom"
    speaker: str = "Aetheron"


class QuoteUpdate(BaseModel):
    text: str | None = Field(default=None, min_length=3, max_length=500)
    category: str | None = None


@router.get("/quotes")
def list_quotes(category: str | None = None):
    quotes = get_daily_quotes(category)
    return {"quotes": quotes, "count": len(quotes), "categories": CATEGORIES}


@router.get("/quotes/today")
def quote_today():
    return get_quote_of_the_day()


@router.get("/quotes/categories")
def categories():
    return {"categories": CATEGORIES}


@router.post("/quotes")
def create_quote(body: QuoteCreate):
    if body.category not in CATEGORIES:
        raise HTTPException(400, f"category must be one of {CATEGORIES}")
    return add_quote(body.text, body.category, body.speaker)  # type: ignore[arg-type]


@router.patch("/quotes/{quote_id}")
def patch_quote(quote_id: int, body: QuoteUpdate):
    if body.category is not None and body.category not in CATEGORIES:
        raise HTTPException(400, f"category must be one of {CATEGORIES}")
    updated = update_quote(quote_id, body.text, body.category)  # type: ignore[arg-type]
    if not updated:
        raise HTTPException(404, "Quote not found")
    return updated


@router.delete("/quotes/{quote_id}")
def remove_quote(quote_id: int):
    if not delete_quote(quote_id):
        raise HTTPException(404, "Quote not found")
    return {"ok": True, "id": quote_id}
