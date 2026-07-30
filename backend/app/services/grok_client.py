"""
Grok (xAI) client — OpenAI-compatible chat completions with tool-calling loop.

Prices and quant math only via tools. Never invent market data.
Requires XAI_API_KEY.
"""

from __future__ import annotations

import json
import os
from typing import Any

import httpx

from app.prompts.system import AETHERON_SYSTEM_PROMPT
from app.services.tools import TOOL_DEFINITIONS, execute_tool, tool_result_message

DEFAULT_MODEL = os.getenv("XAI_MODEL", "grok-3")
DEFAULT_BASE_URL = os.getenv("XAI_BASE_URL", "https://api.x.ai/v1")
MAX_TOOL_ROUNDS = int(os.getenv("XAI_MAX_TOOL_ROUNDS", "6"))
REQUEST_TIMEOUT = float(os.getenv("XAI_TIMEOUT_SEC", "45"))


class GrokClient:
    def __init__(
        self,
        api_key: str | None = None,
        model: str | None = None,
        base_url: str | None = None,
    ):
        self.api_key = api_key if api_key is not None else os.getenv("XAI_API_KEY")
        self.model = model or os.getenv("XAI_MODEL") or DEFAULT_MODEL
        self.base_url = (base_url or os.getenv("XAI_BASE_URL") or DEFAULT_BASE_URL).rstrip("/")
        self.max_rounds = int(os.getenv("XAI_MAX_TOOL_ROUNDS") or MAX_TOOL_ROUNDS)
        self.timeout = float(os.getenv("XAI_TIMEOUT_SEC") or REQUEST_TIMEOUT)

    @property
    def configured(self) -> bool:
        return bool(self.api_key)

    def chat(
        self,
        messages: list[dict[str, Any]],
        tools: list[dict] | None = None,
        *,
        temperature: float = 0.4,
        max_tokens: int = 2048,
    ) -> dict[str, Any]:
        """
        Single-shot chat completion (no local tool execution).
        Prefer chat_with_tools for the full mentor loop.
        """
        if not self.configured:
            return {
                "error": "missing_api_key",
                "message": "Set XAI_API_KEY to enable Grok. Aetheron will not invent data.",
            }

        body: dict[str, Any] = {
            "model": self.model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
        }
        if tools:
            body["tools"] = tools
            body["tool_choice"] = "auto"

        try:
            raw = self._post_chat(body)
        except httpx.HTTPError as exc:
            return {"error": "http_error", "message": str(exc)}

        return self._normalize_response(raw)

    def chat_with_tools(
        self,
        user_messages: list[dict[str, Any]],
        *,
        system_prompt: str | None = None,
        temperature: float = 0.4,
        max_tokens: int = 2048,
        max_rounds: int | None = None,
    ) -> dict[str, Any]:
        """
        Full tool-calling loop:
        1. Send messages + tool schemas to Grok
        2. Execute any tool_calls locally
        3. Append tool results and repeat until final text or round cap
        """
        if not self.configured:
            return {
                "error": "missing_api_key",
                "message": "Set XAI_API_KEY to enable Grok. Aetheron will not invent data.",
                "source": "unconfigured",
            }

        rounds_cap = max(1, max_rounds if max_rounds is not None else self.max_rounds)
        messages: list[dict[str, Any]] = [
            {"role": "system", "content": system_prompt or AETHERON_SYSTEM_PROMPT},
            *user_messages,
        ]
        tools_used: list[dict[str, Any]] = []
        last_error: str | None = None

        for round_idx in range(rounds_cap):
            body: dict[str, Any] = {
                "model": self.model,
                "messages": messages,
                "tools": TOOL_DEFINITIONS,
                "tool_choice": "auto",
                "temperature": temperature,
                "max_tokens": max_tokens,
            }
            try:
                raw = self._post_chat(body)
            except httpx.HTTPStatusError as exc:
                status = exc.response.status_code if exc.response is not None else "?"
                last_error = f"HTTP {status} from Grok API"
                break
            except httpx.HTTPError:
                last_error = "Grok API transport error"
                break

            choice = ((raw.get("choices") or [{}])[0]) or {}
            message = choice.get("message") or {}
            finish = choice.get("finish_reason")
            tool_calls = message.get("tool_calls") or []

            assistant_msg: dict[str, Any] = {
                "role": "assistant",
                "content": message.get("content"),
            }
            if tool_calls:
                assistant_msg["tool_calls"] = tool_calls
            messages.append(assistant_msg)

            if not tool_calls:
                content = (message.get("content") or "").strip()
                return {
                    "reply": content,
                    "source": "grok",
                    "model": raw.get("model") or self.model,
                    "finish_reason": finish,
                    "tools_used": tools_used,
                    "rounds": round_idx + 1,
                    "usage": raw.get("usage"),
                }

            for call in tool_calls:
                fn = call.get("function") or {}
                name = fn.get("name") or ""
                raw_args = fn.get("arguments") or "{}"
                call_id = call.get("id") or f"call_{round_idx}_{name}"
                result = execute_tool(name, raw_args)
                tools_used.append(
                    {
                        "id": call_id,
                        "name": name,
                        "arguments": _safe_parse_args(raw_args),
                        "ok": result.get("ok", True) is not False and "error" not in result,
                    }
                )
                messages.append(tool_result_message(call_id, result))

        if last_error:
            return {
                "error": "grok_request_failed",
                "message": last_error,
                "source": "error",
                "tools_used": tools_used,
            }

        return {
            "error": "tool_round_limit",
            "message": (
                f"Stopped after {rounds_cap} tool rounds without a final reply. "
                "Partial tool results were collected; no invented market data."
            ),
            "source": "tool_limit",
            "tools_used": tools_used,
        }

    def _post_chat(self, body: dict[str, Any]) -> dict[str, Any]:
        token = self.api_key or ""
        headers = {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json",
        }
        with httpx.Client(timeout=self.timeout) as client:
            response = client.post(
                f"{self.base_url}/chat/completions",
                headers=headers,
                json=body,
            )
            response.raise_for_status()
            return response.json()

    @staticmethod
    def _normalize_response(raw: dict[str, Any]) -> dict[str, Any]:
        choice = ((raw.get("choices") or [{}])[0]) or {}
        message = choice.get("message") or {}
        return {
            "status": "ok",
            "model": raw.get("model"),
            "content": message.get("content"),
            "tool_calls": message.get("tool_calls") or [],
            "finish_reason": choice.get("finish_reason"),
            "usage": raw.get("usage"),
            "raw": raw,
        }


def _safe_parse_args(raw_args: str | dict[str, Any]) -> dict[str, Any]:
    if isinstance(raw_args, dict):
        return raw_args
    try:
        parsed = json.loads(raw_args) if raw_args else {}
        return parsed if isinstance(parsed, dict) else {"_": parsed}
    except json.JSONDecodeError:
        return {"_raw": str(raw_args)[:200]}
