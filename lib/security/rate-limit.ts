type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const inMemoryStore = new Map<string, RateLimitEntry>();

function cleanupExpiredEntries(now: number) {
  for (const [key, entry] of inMemoryStore.entries()) {
    if (entry.resetAt <= now) {
      inMemoryStore.delete(key);
    }
  }
}

export function checkRateLimit(
  key: string,
  options: { limit: number; windowMs: number }
): {
  allowed: boolean;
  remaining: number;
  resetAt: number;
} {
  const now = Date.now();
  cleanupExpiredEntries(now);

  const current = inMemoryStore.get(key);

  if (!current || current.resetAt <= now) {
    const resetAt = now + options.windowMs;
    inMemoryStore.set(key, { count: 1, resetAt });
    return {
      allowed: true,
      remaining: Math.max(options.limit - 1, 0),
      resetAt,
    };
  }

  if (current.count >= options.limit) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: current.resetAt,
    };
  }

  current.count += 1;
  inMemoryStore.set(key, current);

  return {
    allowed: true,
    remaining: Math.max(options.limit - current.count, 0),
    resetAt: current.resetAt,
  };
}
