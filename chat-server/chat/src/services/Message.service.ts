import { Message } from "../database";
import { IMessage } from "../database/models/MessageModel";
import { MessagePayload } from "../utils/type";

export const insertMessage = async (data: MessagePayload): Promise<IMessage> => {
  try {
    const { conversationId, senderId, message, parentMessageId } = data;
    const newMessage = await Message.create({
      conversation: conversationId,
      senderId,
      message,
      parentMessageId,
    });
    return newMessage;
  } catch (error) {
    console.error("Error inserting message: ", error, data);
    throw error;
  }
};
