import express, { Express } from "express";
import http from "http";
import config from "./config/config";
import { errorConverter, errorHandler } from "./middleware";
import userRouter from "./routes/messageRoutes";
import { registerSocketEvents } from "./socket/events";
import { connectDB } from "./database";

const app: Express = express();
connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(userRouter);
app.use(errorConverter);
app.use(errorHandler);

const server = app.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}`);
});

registerSocketEvents(server);
