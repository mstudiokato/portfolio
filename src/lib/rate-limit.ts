/**
 * Prosty rate-limiter in-memory (bez zewnętrznej bazy — free tier).
 * Okno przesuwne: MAX prób na WINDOW_MS dla danego klucza (IP).
 * Pamięć żyje w obrębie ciepłej instancji funkcji — wystarczające jako
 * podstawowa ochrona formularza (uzupełnione honeypotem i Turnstile).
 */

const WINDOW_MS = 10 * 60 * 1000; // 10 minut
const MAX = 3;

const store = new Map<string, number[]>();

export function rateLimit(key: string): {
  ok: boolean;
  retryAfterSec?: number;
} {
  const now = Date.now();
  const recent = (store.get(key) ?? []).filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX) {
    store.set(key, recent);
    const retryAfterSec = Math.ceil((WINDOW_MS - (now - recent[0])) / 1000);
    return { ok: false, retryAfterSec };
  }

  recent.push(now);
  store.set(key, recent);
  return { ok: true };
}
