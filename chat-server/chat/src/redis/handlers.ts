import { getRedisClient } from ".";
import { CHAT_MODE } from "../config/constants";

const redisClient = getRedisClient();

// REDIS KEYS

export const redisKeys = {
  ONLINE_USERS: "online_users",
  SOCKET_MAP: (userId: number) => `user:${userId}:sockets`,
  TYPING_USERS: (chatId: number, mode: CHAT_MODE) => `typing_users:${mode}:${chatId}:`,
  MEMBER_ROLES: (groupId: number) => `group:${groupId}:member_roles`,
  USER_TOKEN: (userId: number) => `user:${userId}:tokens`,
};

// ONLINE USER

export const getOnlineUsers = async () => {
  const onlineUsers = await redisClient.hGetAll(redisKeys.ONLINE_USERS);
  return new Set(Object.keys(onlineUsers));
};
export const markUserOnline = (userId: number) => {
  return redisClient.hSet(redisKeys.ONLINE_USERS, userId, "1");
};
export const markUserOffline = (userId: number) => {
  return redisClient.hDel(redisKeys.ONLINE_USERS, userId.toString());
};

// TYPING USERS

export const getTypingUsers = async (chatId: number, mode: CHAT_MODE) => {
  const typingUsers = await redisClient.hGetAll(redisKeys.TYPING_USERS(chatId, mode));

  return Object.keys(typingUsers).map((key) => ({
    id: Number(key),
    username: typingUsers[key],
  }));
};
export const setTypingUser = async ({
  chatId,
  mode,
  userId,
  username,
}: {
  chatId: number;
  mode: CHAT_MODE;
  userId: number;
  username: string;
}) => {
  const cacheKey = redisKeys.TYPING_USERS(chatId, mode);
  await redisClient.hSet(cacheKey, userId, username);
  await redisClient.expire(cacheKey, 180); // 3 minutes expiry
};
export const removeTypingUser = async ({
  chatId,
  mode,
  userId,
}: {
  chatId: number;
  mode: CHAT_MODE;
  userId: number;
}) => {
  await redisClient.hDel(redisKeys.TYPING_USERS(chatId, mode), userId.toString());
};
