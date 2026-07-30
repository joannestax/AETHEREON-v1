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

const TICKER_STOPWORDS = new Set([
  'I',
  'A',
  'AN',
  'THE',
  'AND',
  'OR',
  'FOR',
  'TO',
  'ON',
  'IN',
  'OF',
  'IS',
  'IT',
  'MY',
  'WE',
  'YOU',
  'ME',
  'US',
  'AM',
  'BE',
  'AS',
  'AT',
  'BY',
  'IF',
  'SO',
  'DO',
  'WANT',
  'NEED',
  'PLEASE',
  'HELP',
  'SHOW',
  'GIVE',
  'TELL',
  'ABOUT',
  'THIS',
  'THAT',
  'WITH',
  'FROM',
  'HAVE',
  'WILL',
  'JUST',
  'LIKE',
  'SOME',
  'ANY',
  'LEVELS',
  'SETUP',
  'THESIS',
  'TRADE',
  'STOCK',
  'PRICE',
  'CHART',
  'TODAY',
  'NOW',
  'OPEN',
  'LIVE',
  'FULL',
  'PART',
  'WHAT',
  'WHEN',
  'HOW',
  'WHY',
  'ASK',
  'CAN',
  'GET',
  'RUN',
  'MAKE',
  'LOOK',
  'INTO',
  'OVER',
  'UNDER',
  'HERE',
  'THERE',
  'YOUR',
  'OUR',
  'HIS',
  'HER',
  'ITS',
  'NOT',
  'BUT',
  'ALL',
  'ONE',
  'TWO',
  'OUT',
  'UP',
  'DOWN',
  'LONG',
  'SHORT',
  'CALL',
  'PUT',
  'BUY',
  'SELL',
  'HOLD',
  'RISK',
  'PLAN',
]);

const KNOWN_TICKERS =
  /\b(NVDA|AAPL|MSFT|TSLA|AMZN|GOOGL|GOOG|META|AMD|NFLX|SPY|QQQ|BTC|ETH|INTC|UBER|COIN)\b/i;

/** Extract a ticker symbol from free-form chat text. */
export function extractTicker(userText: string): string | undefined {
  const dollar = userText.match(/\$([A-Za-z]{1,5})\b/);
  if (dollar) return dollar[1].toUpperCase();

  const known = userText.match(KNOWN_TICKERS);
  if (known) return known[1].toUpperCase();

  const tokens = userText.match(/\b([A-Za-z]{2,5})\b/g) ?? [];
  for (const token of tokens) {
    if (token === token.toUpperCase() && !TICKER_STOPWORDS.has(token)) {
      return token;
    }
  }
  for (const token of tokens) {
    const upper = token.toUpperCase();
    if (!TICKER_STOPWORDS.has(upper)) return upper;
  }
  return undefined;
}

/** Local fallback mentor replies when API is offline — never invents prices. */
export function localMentorReply(userText: string): string {
  const ticker = extractTicker(userText);
  const wantsAnalysis =
    /analy[sz]e|signature|thesis|levels|setup|nvda|aapl|msft|tsla|btc/i.test(userText);

  if (wantsAnalysis && ticker) {
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
