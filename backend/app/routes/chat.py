from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.prompts.system import AETHERON_SYSTEM_PROMPT
from app.services.signature import build_signature_stub
from app.services.grok_client import GrokClient

router = APIRouter()


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    ticker: str | None = None
    include_signature: bool = False


class ChatResponse(BaseModel):
    reply: str
    signature: dict | None = None
    system_prompt_version: str = "genesis-1"
    note: str = Field(
        default="Grok tool-calling loop not yet fully wired. Never invent live market data."
    )


def _mentor_reply(user_text: str, ticker: str | None) -> str:
    text = user_text.strip()
    upper = text.upper()
    if ticker or any(k in upper for k in ("ANALY", "SIGNATURE", "THESIS", "NVDA", "AAPL", "MSFT")):
        sym = (ticker or "the ticker").upper()
        return (
            f"Understood. Here is how we proceed on {sym}: "
            "I will render Signature Analysis only with verified inputs — "
            "Technical, Fundamental, Liquidity, Long-Term Target, Swing Setup, Signal. "
            "Until live feeds are connected, I refuse invented prices. "
            "Always Watching the Markets."
        )
    if any(k in text.lower() for k in ("risk", "portfolio", "size", "stop")):
        return (
            "Risk first. Reward second. Story last. "
            "Share positions and constraints you actually hold — "
            "I will not invent marks or Greeks without tools."
        )
    return (
        "The stars align with discipline, not emotion. "
        f"You asked: “{text[:240]}”. "
        "Ask for Signature Analysis on any ticker, or speak of structure, risk, and time."
    )


@router.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest) -> ChatResponse:
    last_user = next((m.content for m in reversed(req.messages) if m.role == "user"), "")
    grok = GrokClient()
    # Prefer local mentor voice until Grok tool loop is live
    reply = _mentor_reply(last_user, req.ticker)
    if grok.configured:
        # Soft probe — full tool loop is priority step 8
        _ = grok.chat([{"role": "system", "content": AETHERON_SYSTEM_PROMPT}, *[m.model_dump() for m in req.messages]])

    signature = None
    if req.include_signature and req.ticker:
        signature = build_signature_stub(req.ticker)

    return ChatResponse(reply=reply, signature=signature)
