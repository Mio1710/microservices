import { Router } from "express";
import MessageController from "../controllers/MessageController";
import { authMiddleware } from "../middleware";
import { validate } from "../validation";
import { createConversationSchema, sendMessageSchema } from "../validation/schema";

const messageRoutes = Router();

messageRoutes.post("/send", [authMiddleware, validate(sendMessageSchema)], MessageController.send);
messageRoutes.post(
  "/conversation",
  [authMiddleware, validate(createConversationSchema)],
  MessageController.createConversation
);
messageRoutes.get("/all-conversations", authMiddleware, MessageController.getAllConversations);
messageRoutes.get("/conversation/:conversationId", authMiddleware, MessageController.getConversation);

export default messageRoutes;
