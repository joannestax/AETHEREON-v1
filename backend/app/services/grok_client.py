"""
Grok client scaffold — requires XAI_API_KEY.
Tool-calling loop is a later priority after Signature Analysis + chat UI.
"""

from __future__ import annotations

import os
from typing import Any


class GrokClient:
    def __init__(self, api_key: str | None = None, model: str = "grok-3"):
        self.api_key = api_key or os.getenv("XAI_API_KEY")
        self.model = model
        self.base_url = "https://api.x.ai/v1"

    @property
    def configured(self) -> bool:
        return bool(self.api_key)

    def chat(self, messages: list[dict[str, Any]], tools: list[dict] | None = None) -> dict:
        if not self.configured:
            return {
                "error": "missing_api_key",
                "message": "Set XAI_API_KEY to enable Grok. Aetheron will not invent data.",
            }
        # Placeholder — wire OpenAI-compatible HTTP client in priority step 5
        return {
            "status": "not_implemented",
            "model": self.model,
            "messages_received": len(messages),
            "tools": len(tools or []),
        }
