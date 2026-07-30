from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.prompts.system import AETHERON_SYSTEM_PROMPT
from app.services.grok_client import GrokClient
from app.services.signature import build_signature_stub

router = APIRouter()


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    ticker: str | None = None
    include_signature: bool = False
    use_tools: bool = True


class ChatResponse(BaseModel):
    reply: str
    signature: dict | None = None
    system_prompt_version: str = "genesis-1"
    source: str = "mentor_fallback"
    tools_used: list[dict] = Field(default_factory=list)
    model: str | None = None
    note: str = Field(
        default="Aetheron never invents live market data. Prices and quant math come from tools only."
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


def _to_grok_messages(messages: list[ChatMessage], ticker: str | None) -> list[dict]:
    out: list[dict] = []
    for m in messages:
        role = m.role if m.role in {"user", "assistant", "system"} else "user"
        if m.role == "aetheron":
            role = "assistant"
        out.append({"role": role, "content": m.content})
    if ticker:
        out.append(
            {
                "role": "user",
                "content": (
                    f"[Context] Focus ticker: {ticker.upper()}. "
                    "Use get_market_quote / signature_analysis_scaffold tools when needed. "
                    "Never invent prices."
                ),
            }
        )
    return out


@router.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest) -> ChatResponse:
    last_user = next((m.content for m in reversed(req.messages) if m.role == "user"), "")
    grok = GrokClient()
    tools_used: list[dict] = []
    source = "mentor_fallback"
    model = None
    reply = _mentor_reply(last_user, req.ticker)
    note = (
        "Mentor fallback active (no XAI_API_KEY or Grok unavailable). "
        "Aetheron never invents live market data."
    )

    if grok.configured and req.use_tools:
        result = grok.chat_with_tools(_to_grok_messages(req.messages, req.ticker))
        tools_used = list(result.get("tools_used") or [])
        model = result.get("model")
        if result.get("reply"):
            reply = result["reply"]
            source = result.get("source") or "grok"
            note = (
                "Grok tool-calling loop active. Prices and quant math come only from tools — "
                "never invented."
            )
        elif result.get("error") == "missing_api_key":
            pass
        else:
            err = result.get("message") or result.get("error") or "unknown"
            note = f"Grok unavailable ({err}). Using mentor fallback. No invented market data."
            source = "mentor_fallback"
    elif grok.configured and not req.use_tools:
        probe = grok.chat(
            [
                {"role": "system", "content": AETHERON_SYSTEM_PROMPT},
                *_to_grok_messages(req.messages, req.ticker),
            ]
        )
        if probe.get("content"):
            reply = str(probe["content"]).strip()
            source = "grok"
            model = probe.get("model")
            note = "Grok reply without tools. Refuse any invented marks."
        elif probe.get("error"):
            note = f"Grok error ({probe.get('message') or probe.get('error')}). Mentor fallback."

    signature = None
    if req.include_signature and req.ticker:
        signature = build_signature_stub(req.ticker)

    return ChatResponse(
        reply=reply,
        signature=signature,
        source=source,
        tools_used=tools_used,
        model=model,
        note=note,
    )
