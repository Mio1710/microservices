import express, { Express } from "express";
import http from "http";
import config from "./config/config";
import { errorConverter, errorHandler } from "./middleware";
import userRouter from "./routes/messageRoutes";
import { registerSocketEvents } from "./socket/events";

const app: Express = express();
const server = http.createServer(app);

registerSocketEvents(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(userRouter);
app.use(errorConverter);
app.use(errorHandler);

server.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}`);
});
