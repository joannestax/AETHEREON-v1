import type { ChatMessage } from '../types/chat';

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome',
    role: 'aetheron',
    content:
      'The stars align with discipline, not emotion. What realm shall we chart today?',
    createdAt: new Date().toISOString(),
  },
];

/** Local fallback mentor replies when API is offline — never invents prices. */
export function localMentorReply(userText: string): string {
  const tickerMatch = userText.match(/\b([A-Z]{1,5})\b/);
  const wantsAnalysis =
    /analy[sz]e|signature|thesis|levels|setup|nvda|aapl|msft|tsla|btc/i.test(userText);

  if (wantsAnalysis && tickerMatch) {
    const ticker = tickerMatch[1].toUpperCase();
    return (
      `Understood. I can open a Signature Analysis for $${ticker}. ` +
      `Live prices require the market-data tools — I will not invent levels. ` +
      `Tap “Request Signature Analysis” or connect the backend for a full 6-part report.`
    );
  }

  if (/portfolio|adjust|risk/i.test(userText)) {
    return (
      'Risk first. Reward second. Story last. Share the positions and constraints you actually hold — ' +
      'I size clarity before conviction, and I never invent marks.'
    );
  }

  return (
    'I am listening. Ask for a Signature Analysis on any ticker, or speak of risk, structure, and time. ' +
    'Always Watching the Markets.'
  );
}
