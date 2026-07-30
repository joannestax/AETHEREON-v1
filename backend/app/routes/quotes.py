from fastapi import APIRouter

from app.services.quotes import get_daily_quotes, get_quote_of_the_day

router = APIRouter()


@router.get("/quotes")
def list_quotes():
    return {"quotes": get_daily_quotes(), "count": 30}


@router.get("/quotes/today")
def quote_today():
    return get_quote_of_the_day()
