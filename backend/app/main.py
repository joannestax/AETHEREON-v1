"""
AETHERON — FastAPI backend
Project Genesis / ORIGO NEXUS AI Mentor layer
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import chat, quant, quotes, market

app = FastAPI(
    title="Aetheron API",
    description="Finance God co-pilot for ORIGO Nexus — Project Genesis",
    version="0.1.0",
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
    return {"status": "ok", "service": "aetheron", "project": "genesis"}
