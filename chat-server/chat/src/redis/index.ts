// import { createClient, type RedisClientType } from "redis";

// // Define the variable outside the function to persist the instance
// let redisClient: RedisClientType | null = null;

// export async function getRedisClient(): Promise<RedisClientType> {
//   if (redisClient) {
//     return redisClient;
//   }

//   // Create new instance if one doesn't exist
//   redisClient = createClient({
//     url: process.env.REDIS_URL || "redis://localhost:6379",
//   });

//   redisClient.on("error", (err: Error) => console.error("Redis Client Error", err));

//   // Initialize connection
//   await redisClient.connect();

//   return redisClient;
// }
