from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.services.signature import build_signature_stub

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
    note: str = Field(
        default="Grok tool-calling loop not yet wired. Never invent live market data."
    )


@router.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest) -> ChatResponse:
    """
    Primary mentor chat endpoint.
    Real Grok client + tool loop lands in a later priority step.
    """
    last_user = next((m.content for m in reversed(req.messages) if m.role == "user"), "")
    ticker = (req.ticker or "TICKER").upper()

    reply = (
        f"The stars align with discipline, not emotion. "
        f"You asked: “{last_user[:240]}”. "
        f"Live analysis requires market data tools — Aetheron will not invent prices."
    )

    signature = None
    if req.include_signature and req.ticker:
        signature = build_signature_stub(ticker)

    return ChatResponse(reply=reply, signature=signature)
