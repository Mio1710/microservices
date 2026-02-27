import { Conversation } from "../database";
import { ApiError } from "../utils";

export const validateSendData = async (senderId: string, conversationId: string) => {
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
