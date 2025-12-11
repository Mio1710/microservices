import { Server } from "http";
import jwt from "jsonwebtoken";
import { Socket, Server as SocketIOServer } from "socket.io";
import app from "./app";
import config from "./config/config";
import { Message, connectDB } from "./database";
import Conversation from "./database/models/ConversationModel";

let server: Server;
connectDB();

server = app.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}`);
});
const io = new SocketIOServer(server, {
  path: "/socket.io",
  pingInterval: 25000,
  pingTimeout: 60000,
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  console.log("Socket token:", socket);

  if (!token) return next(new Error("Unauthorized"));

  try {
    const jwtSecret = config.JWT_SECRET as string;
    const payload = jwt.verify(token, jwtSecret);
    socket.data.user = payload;
    next();
  } catch {
    next(new Error("Unauthorized"));
  }
});
io.on("connection", (socket: Socket) => {
  io.to(socket.id).emit("Client connected");
  socket.on("disconnect", () => {
    io.to(socket.id).emit("Client disconnected");
  });

  socket.on("sendMessage", async (data) => {
    const { senderId, conversationId, message } = data;
    console.log("Message received logger:", data, conversationId);

    const msg = new Message({ senderId, conversationId, message });
    await msg.save();
    await Conversation.updateOne({ _id: conversationId }, { lastMessage: msg._id });

    // Emit to all clients in the room including the sender
    io.to(conversationId).emit("receiveMessage", msg);
  });

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
  });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      console.info("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: unknown) => {
  console.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);
