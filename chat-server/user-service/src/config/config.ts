import { config } from "dotenv";

const configFile = `./.env`;
config({ path: configFile });

const {
  MONGO_URI,
  PORT,
  JWT_SECRET,
  NODE_ENV,
  MESSAGE_BROKER_URL,
  MAX_AGE_REFRESH_TOKEN,
  MAX_AGE_TOKEN,
  REFRESH_TOKEN_SECRET,
} = process.env;

export const loadConfig = () => {
  try {
    if (!MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }
    if (!PORT) {
      console.warn("PORT is not defined in environment variables, defaulting to 3000");
      process.env.PORT = "3000";
    }
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }
    if (!REFRESH_TOKEN_SECRET) {
      throw new Error("REFRESH_TOKEN_SECRET is not defined in environment variables");
    }
    if (!MESSAGE_BROKER_URL) {
      throw new Error("MESSAGE_BROKER_URL is not defined in environment variables");
    }
    if (!NODE_ENV) {
      console.warn("NODE_ENV is not defined in environment variables, defaulting to development");
      process.env.NODE_ENV = "dev";
    }
    if (!MAX_AGE_REFRESH_TOKEN) {
      console.warn("MAX_AGE_REFRESH_TOKEN is not defined in environment variables, defaulting to 604800000");
      process.env.MAX_AGE_REFRESH_TOKEN = "604800000"; // 7 days
    }
    if (!MAX_AGE_TOKEN) {
      console.warn("MAX_AGE_TOKEN is not defined in environment variables, defaulting to 60000");
      process.env.MAX_AGE_TOKEN = "60000"; // 1 minute
    }
  } catch (error) {
    console.error("Error loading configuration:", error);
    process.exit(1);
  }
};

export default {
  MONGO_URI,
  PORT,
  JWT_SECRET: JWT_SECRET as string,
  env: NODE_ENV,
  msgBrokerURL: MESSAGE_BROKER_URL,
  MAX_AGE_REFRESH_TOKEN: parseInt(MAX_AGE_REFRESH_TOKEN ?? "", 10),
  MAX_AGE_TOKEN: parseInt(MAX_AGE_TOKEN ?? "", 10),
  REFRESH_TOKEN_SECRET: REFRESH_TOKEN_SECRET as string,
};
