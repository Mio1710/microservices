import { Server } from "http";
import { Socket, Server as SocketIOServer } from "socket.io";
import { Conversation } from "../database";
import { insertMessage } from "../services/Message.service";

const onlineUsers = new Map<string, string>();

export const registerSocketEvents = (httpServer: Server) => {
  const io = new SocketIOServer(httpServer, {
    path: "/socket.io",
    pingInterval: 25000,
    pingTimeout: 60000,
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // No authentication middleware; allow all connections

  io.on("connection", async (socket: Socket) => {
    console.log("Socket connected: ", socket.id);

    socket.on("joinRoom", async (activeChat: number) => {
      console.log("Join room", activeChat);
      socket.join(activeChat?.toString?.() || String(activeChat));
    });

    socket.on("sendMessage", async (data, cb) => {
      try {
        const { conversationId, message, senderId, parentMessageId } = data;

        console.log("New message", data, conversationId);
        if (!conversationId) {
          throw new Error("Please provide a conversation id");
        }

        // Use a default senderId and username since no auth
        const newMessage = await insertMessage({
          conversationId,
          message,
          senderId,
          parentMessageId,
        });
        console.log("Create new message success: ", newMessage, conversationId);
        await Conversation.updateOne({ _id: conversationId }, { lastMessage: newMessage._id });
        io.to(conversationId).emit("newMessage", {
          createdAt: newMessage.createdAt,
          message: newMessage.message,
          senderId: newMessage.senderId,
          _id: newMessage._id,
          conversationId,
        });

        // direct message
        // if (message.receiverId) {
        // emit event to sender (anonymous)
        //   io.to(roomKeys.USER_KEY("anonymous")).emit("newMessage", newMessage);

        //   // emit event to receiver
        //   // io.to(roomKeys.USER_KEY(message.receiverId)).emit("newMessage", {
        //   //   ...newMessage,
        //   //   chatName: newMessage.username,
        //   // });
        // }
        // cb({ message });
      } catch (error) {
        // cb({ error });
      }
    });

    socket.on("error", (err) => {
      console.log("socket error:", err);
    });

    socket.on("disconnect", async (data) => {
      console.log("disconnect Socket server successfully", JSON.stringify(data));
    });
  });
  console.log("Start Socket server successfully");
  io.on("error", (err) => {
    console.log("Socket server error:", err);
  });
};
