import { isUserOnline } from "../redis/handlers";
import { rabbitMQService } from "../services/RabbitMQService";

export const handleMessageReceived = async (
  senderName: string,
  messageContent: string,
  conversationId: string,
  receiverIds: string[],
) => {
  receiverIds.forEach(async (receiverId) => {
    const receiverIsOnline = await isUserOnline(receiverId);
    console.log(`Sending ${senderName}, ${messageContent}, ${receiverId} is online:`, receiverIsOnline);
    console.log("User Status Store:", receiverIsOnline);

    if (!receiverIsOnline) {
      console.log(`Receiver ${receiverId} is offline. Sending notification...`);

      await rabbitMQService.notifyReceiver(receiverId, messageContent, senderName, conversationId);
    }
  });
};
