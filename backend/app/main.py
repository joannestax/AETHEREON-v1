"""
AETHERON — FastAPI backend
Project Genesis / ORIGO NEXUS AI Mentor layer
"""

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

from app.routes import chat, quant, quotes, market  # noqa: E402
from app.services.grok_client import GrokClient  # noqa: E402

app = FastAPI(
    title="Aetheron API",
    description="Finance God co-pilot for ORIGO Nexus — Project Genesis",
    version="0.2.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router, prefix="/v1", tags=["chat"])
app.include_router(quant.router, prefix="/v1", tags=["quant"])
app.include_router(quotes.router, prefix="/v1", tags=["quotes"])
app.include_router(market.router, prefix="/v1", tags=["market"])


@app.get("/health")
def health():
    grok = GrokClient()
    return {
        "status": "ok",
        "service": "aetheron",
        "project": "genesis",
        "version": "0.2.0",
        "grok_configured": grok.configured,
        "policy": "Never invent market data. Prices and quant via tools only.",
    }
