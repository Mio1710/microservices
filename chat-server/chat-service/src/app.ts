import express, { Express } from "express";
import { errorConverter, errorHandler } from "./middleware";
import userRouter from "./routes/messageRoutes";

const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(userRouter);
app.use(errorConverter);
app.use(errorHandler);

export default app;
