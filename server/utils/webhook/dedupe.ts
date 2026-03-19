import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL!);

export async function isDuplicateEvent(eventId: string) {
  const key = `webhook:event:${eventId}`;

  const exists = await redis.get(key);
  if (exists) return true;

  await redis.set(key, "1", "EX", 86400); // 24h
  return false;
}

export async function markEventProcessed(eventId: string) {
  await redis.set(`webhook:processed:${eventId}`, "1", "EX", 86400);
}