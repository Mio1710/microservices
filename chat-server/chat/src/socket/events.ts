import { Server } from "http";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Socket, Server as SocketIOServer } from "socket.io";
import { Conversation } from "../database";
import { insertMessage } from "../services/Message.service";
import { handleMessageReceived, UserStatusStore } from "../utils";

const onlineUsers = new Map<string, string>();
const statusStore = UserStatusStore.getInstance();

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
    const user = jwt.decode(socket.handshake.auth?.token || "") as JwtPayload;
    console.log("Check auth: ", user, statusStore);

    socket.on("joinRoom", async (activeChat: number, userId: string) => {
      statusStore.setUserOnline(userId);
      console.log("Join room", activeChat);
      socket.join(activeChat?.toString?.() || String(activeChat));
    });

    socket.on("sendMessage", async (data, cb) => {
      try {
        const { conversationId, message, senderId, senderName, parentMessageId } = data;

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
        const conversion = await Conversation.findById(conversationId);
        if (!conversion) {
          throw new Error("Conversation not found");
        }
        await handleMessageReceived(
          senderName,
          message,
          conversationId,
          conversion.users.map((user) => user._id?.toString() ?? "").filter((id) => id !== senderId),
        );

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
      const { id } = user;
      console.log("disconnect Socket server successfully", id);
      statusStore.setUserOffline(id);
    });
  });
  console.log("Start Socket server successfully");
  io.on("error", (err) => {
    console.log("Socket server error:", err);
  });
};
