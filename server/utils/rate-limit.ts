import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL!);

export async function rateLimitWebhook(key: string) {
  const limit = Number(process.env.WEBHOOK_RATE_LIMIT || 100);
  const window = 60;

  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, window);
  }

  if (count > limit) {
    throw new Error("rate limit exceeded");
  }
}