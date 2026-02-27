import { config } from "dotenv";

const configFile = `./.env`;
config({ path: configFile });

const {
  PORT,
  JWT_SECRET,
  NODE_ENV,
  MESSAGE_BROKER_URL,
  EMAIL_FROM,
  SMTP_HOST,
  SMTP_PORT = 587,
  SMTP_USER,
  SMTP_PASS,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REFRESH_TOKEN,
  MAIL_SERVICE,
} = process.env;

const queue = { notifications: "NOTIFICATIONS" };

export default {
  PORT,
  JWT_SECRET,
  env: NODE_ENV,
  msgBrokerURL: MESSAGE_BROKER_URL,
  EMAIL_FROM,
  queue,
  smtp: {
    service: MAIL_SERVICE || "gmail",
    host: SMTP_HOST,
    port: SMTP_PORT as number,
    user: SMTP_USER,
    pass: SMTP_PASS,
    googleClientId: GOOGLE_CLIENT_ID,
    googleClientSecret: GOOGLE_CLIENT_SECRET,
    googleRefreshToken: GOOGLE_REFRESH_TOKEN,
  },
};
