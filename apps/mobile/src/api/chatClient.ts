import { apiPost, API_BASE } from './client';

type ChatApiResponse = {
  reply: string;
  signature?: Record<string, unknown> | null;
  note?: string;
};

/**
 * Streams a reply character-by-character for cinematic mentor presence.
 * Uses backend when available; otherwise falls back to local text.
 */
export async function streamChatReply(
  userText: string,
  onUpdate: (text: string, done: boolean) => void,
  fallback: string,
): Promise<void> {
  let full = fallback;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2500);
    const res = await fetch(`${API_BASE}/v1/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: userText }],
        include_signature: false,
      }),
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (res.ok) {
      const data = (await res.json()) as ChatApiResponse;
      if (data.reply) full = data.reply;
    }
  } catch {
    // Offline / backend not running — use local mentor voice
  }

  let acc = '';
  for (let i = 0; i < full.length; i += 1) {
    acc += full[i];
    onUpdate(acc, false);
    await sleep(8 + (i % 5));
  }
  onUpdate(acc, true);
}

export async function requestChat(userText: string, ticker?: string) {
  return apiPost<ChatApiResponse>('/v1/chat', {
    messages: [{ role: 'user', content: userText }],
    ticker,
    include_signature: Boolean(ticker),
  });
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
