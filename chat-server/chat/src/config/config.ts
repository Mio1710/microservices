import { config } from "dotenv";

config();

const { MONGO_URI, PORT, JWT_SECRET, NODE_ENV, MESSAGE_BROKER_URL, REDIS_HOST, REDIS_PORT } = process.env;

const queue = { notifications: "NOTIFICATIONS" };

export default {
  MONGO_URI,
  PORT,
  JWT_SECRET,
  env: NODE_ENV,
  msgBrokerURL: MESSAGE_BROKER_URL,
  queue,
  redis: {
    host: REDIS_HOST,
    port: REDIS_PORT,
  },
};
