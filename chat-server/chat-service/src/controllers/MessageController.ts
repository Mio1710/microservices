import { Request, Response } from "express";
import { Message } from "../database";
// import { AuthRequest } from "../middleware";
import Conversation from "../database/models/ConversationModel";
import { ApiError, handleMessageReceived } from "../utils";
import { ReqParser } from "../utils/req-parser";

const send = async (req: Request, res: Response) => {
  try {
    let { message, conversationId } = req.body;
    const { _id, email, name } = req.user;

    const conversation = await validateSendData(_id, conversationId);

    const newMessage = await Message.create({
      conversationId,
      senderId: _id,
      message,
    });
    await Conversation.updateOne({ _id: conversationId }, { lastMessage: newMessage._id });

    const listReceivers = conversation.users
      .filter((user) => user._id !== _id)
      .map((user) => user._id?.toString() ?? "");
    await handleMessageReceived(name, email, message, conversationId, listReceivers);

    return void res.json({
      status: 200,
      message: "Message sent successfully!",
      data: newMessage,
    });
  } catch (error: any) {
    return void res.json({
      status: 500,
      message: error.message,
    });
  }
};

const validateSendData = async (senderId: string, conversationId: string) => {
  const existingConversation = await Conversation.findOne({
    _id: conversationId,
  });
  if (!existingConversation) {
    throw new Error("Conversation does not exist.");
  }
  const isInConversation = existingConversation.users.filter((user) => user._id == senderId).length > 0;
  console.log("existingConversation:", existingConversation, senderId, existingConversation.users);

  if (!isInConversation) {
    throw new ApiError(400, "User is not part of the conversation.");
  }
  return existingConversation;
};

const getConversation = async (req: Request, res: Response) => {
  try {
    const { page, limit, offset } = ReqParser.parsePaginationParams(req);
    const { conversationId } = req.params;
    console.log("Fetching conversation with ID:", conversationId);

    const messages = await Message.find({
      conversationId,
    })
      .select("_id senderId message createdAt")
      .sort({ createdAt: 1 })
      .limit(limit)
      .skip(offset * (page - 1));
    return void res.json({
      status: 200,
      message: "Messages retrieved successfully!",
      data: messages,
    });
  } catch (error: any) {
    return void res.json({
      status: 500,
      message: error.message,
    });
  }
};

const getAllConversations = async (req: Request, res: Response) => {
  try {
    const { page, limit, offset } = ReqParser.parsePaginationParams(req);
    const userId = req.user._id;
    console.log("Fetching all conversations for user ID:", userId);

    const conversations = await Conversation.find({
      users: { $in: [userId] },
    })
      .populate("users", "name email")
      .populate("lastMessage", "message senderId")
      .sort({ updatedAt: -1 })
      .limit(limit)
      .skip(offset * (page - 1));

    res.json({
      status: 200,
      message: "Conversations retrieved successfully!",
      data: conversations,
    });
  } catch (error: any) {
    res.json({
      status: 500,
      message: error.message,
    });
  }
};

const createConversation = async (req: Request, res: Response) => {
  try {
    const { userIds } = req.body;

    if (userIds.filter((id: string) => id !== req.user._id).length === 0) {
      throw new ApiError(400, "Request invalid");
    }

    userIds.push(req.user._id);
    userIds.sort();

    const existingConversation = await Conversation.findOne({
      users: { $all: userIds },
    });
    console.log("existingConversation:", existingConversation, userIds);

    if (existingConversation) {
      throw new ApiError(400, "Conversation already exists.");
    }
    const newConversation = await Conversation.create({
      users: userIds.map((userId: any) => ({ _id: userId })),
    });
    res.json({
      status: 201,
      message: "Conversation created successfully!",
      data: newConversation,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      status: error.statusCode || 500,
      message: error.message,
    });
  }
};

export default {
  send,
  getConversation,
  createConversation,
  getAllConversations,
};
