import { Server } from "http";
import { Socket, Server as SocketIOServer } from "socket.io";
import { insertMessage } from "../services/Message.service";
import { roomKeys } from "../utils/roomKeys";

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

  io.on("connection", async (socket: Socket) => {
    // await markUserOnline(socket.data.user.id);
    socket.broadcast.emit("userOnline", socket.data.user.id);

    socket.on("joinRoom", async (partnerId: number) => {
      socket.join(partnerId.toString());
    });

    socket.on("createMessage", async ({ groupId, receiverId, text, parentMessageId }, cb) => {
      try {
        if (!groupId && !receiverId) {
          throw new Error("Please provide either group id or receiver id");
        }

        const message = await insertMessage({
          groupId,
          receiverId,
          content: text,
          senderId: socket.data.user.id,
          parentMessageId,
        });

        const newMessage = {
          ...message,
          username: socket.data.user.username,
        };

        // group message
        if (message.groupId) {
          io.to(roomKeys.GROUP_KEY(message.groupId)).emit("newMessage", newMessage);
        }

        // direct message
        if (message.receiverId) {
          // emit event to sender
          io.to(roomKeys.USER_KEY(socket.data.user.id)).emit("newMessage", newMessage);

          // emit event to receiver
          io.to(roomKeys.USER_KEY(message.receiverId)).emit("newMessage", {
            ...newMessage,
            chatName: newMessage.username,
          });
        }
        cb({ message });
      } catch (error) {
        cb({ error });
      }
    });

    socket.on("error", (err) => {
      console.log("socket error:", err);
    });

    socket.on("disconnect", async () => {
      //   await markUserOffline(socket.data.user.id);

      socket.broadcast.emit("userOffline", socket.data.user.id);
    });
  });
};
