import { createClient, type RedisClientType } from "redis";

// Create and connect the Redis client immediately at module load
const redisClient: RedisClientType = createClient({
  url: process.env.REDIS_URL || "redis://redis:password@localhost:6379",
});

redisClient.on("error", (err: Error) => console.error("Redis Client Error", err));

// Connect immediately (fire and forget)
redisClient.connect().catch((err: Error) => {
  console.error("Failed to connect Redis client on startup", err);
});

export function getRedisClient(): RedisClientType {
  return redisClient;
}
