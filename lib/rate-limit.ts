type Bucket = { timestamps: number[] };

const buckets = new Map<string, Bucket>();

/**
 * Simple in-memory sliding-window rate limiter.
 * Note: resets per serverless instance; still blocks casual spam.
 */
export function rateLimit(
  key: string,
  opts: { limit: number; windowMs: number }
): { ok: true } | { ok: false; retryAfterSec: number } {
  const now = Date.now();
  const windowStart = now - opts.windowMs;
  const bucket = buckets.get(key) ?? { timestamps: [] };
  bucket.timestamps = bucket.timestamps.filter((t) => t > windowStart);

  if (bucket.timestamps.length >= opts.limit) {
    const oldest = bucket.timestamps[0] ?? now;
    const retryAfterSec = Math.max(1, Math.ceil((oldest + opts.windowMs - now) / 1000));
    buckets.set(key, bucket);
    return { ok: false, retryAfterSec };
  }

  bucket.timestamps.push(now);
  buckets.set(key, bucket);
  return { ok: true };
}

export function clientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]?.trim() || "unknown";
  const real = request.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}
