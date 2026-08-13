import { RATE_LIMIT_WINDOW_MS } from "@/lib/rate-limit-config";

export { RATE_LIMIT_WINDOW_MS };

export type RateLimitDecision = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
};

const memoryRateLimits = new Map<string, { count: number; resetAt: number }>();

export function createRateLimitDecision(count: number, max: number, now: number): RateLimitDecision {
  const resetAt = (Math.floor(now / RATE_LIMIT_WINDOW_MS) + 1) * RATE_LIMIT_WINDOW_MS;
  return {
    allowed: count <= max,
    remaining: Math.max(0, max - count),
    resetAt,
  };
}

function consumeMemoryRateLimit(key: string, max: number, now: number) {
  if (memoryRateLimits.size > 10_000) {
    for (const [storedKey, value] of memoryRateLimits) {
      if (value.resetAt <= now) memoryRateLimits.delete(storedKey);
    }
  }

  const current = memoryRateLimits.get(key);
  const count = !current || current.resetAt <= now ? 1 : current.count + 1;
  const resetAt = (Math.floor(now / RATE_LIMIT_WINDOW_MS) + 1) * RATE_LIMIT_WINDOW_MS;
  memoryRateLimits.set(key, { count, resetAt });
  return createRateLimitDecision(count, max, now);
}

export async function consumeRateLimit(scope: string, fingerprint: string, max: number): Promise<RateLimitDecision> {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL?.trim().replace(/\/+$/, "");
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  const now = Date.now();

  if (Boolean(redisUrl) !== Boolean(redisToken)) {
    throw new Error("Rate limiter configuration is incomplete.");
  }

  if (redisUrl && redisToken) {
    const windowSeconds = Math.ceil(RATE_LIMIT_WINDOW_MS / 1000);
    const bucket = Math.floor(now / RATE_LIMIT_WINDOW_MS);
    const redisKey = `${scope}:${bucket}:${fingerprint}`;
    const script =
      "local count = redis.call('INCR', KEYS[1]); if count == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end; return count";
    const response = await fetch(redisUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${redisToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(["EVAL", script, "1", redisKey, String(windowSeconds)]),
      cache: "no-store",
      signal: AbortSignal.timeout(1500),
    });

    if (!response.ok) throw new Error("Rate limiter request failed.");

    const result = (await response.json()) as { result?: unknown };
    const count = typeof result.result === "number" ? result.result : Number(result.result);
    if (!Number.isInteger(count) || count < 1) throw new Error("Rate limiter returned an invalid result.");

    return createRateLimitDecision(count, max, now);
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("A distributed rate limiter is required in production.");
  }

  return consumeMemoryRateLimit(`${scope}:${fingerprint}`, max, now);
}

export function rateLimitHeaders(decision: RateLimitDecision, max: number) {
  return {
    "X-RateLimit-Limit": String(max),
    "X-RateLimit-Remaining": String(decision.remaining),
    "X-RateLimit-Reset": String(Math.ceil(decision.resetAt / 1000)),
  };
}
