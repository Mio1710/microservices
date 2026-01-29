import { rabbitMQService } from "../services/RabbitMQService";
import { UserStatusStore } from "./userStatusStore";

const userStatusStore = UserStatusStore.getInstance();

export const handleMessageReceived = async (
  senderName: string,
  senderEmail: string,
  messageContent: string,
  conversationId: string,
  receiverIds: string[]
) => {
  receiverIds.forEach(async (receiverId) => {
    const receiverIsOffline = !userStatusStore.isUserOnline(receiverId);
    console.log(
      `Sending ${senderName}, ${senderEmail}, ${messageContent}, ${receiverId} is offline:`,
      receiverIsOffline
    );
    console.log("User Status Store:", receiverIsOffline, userStatusStore, !receiverIsOffline);

    if (receiverIsOffline) {
      console.log(`Receiver ${receiverId} is offline. Sending notification...`);

      await rabbitMQService.notifyReceiver(receiverId, messageContent, senderEmail, senderName, conversationId);
    }
  });
};
