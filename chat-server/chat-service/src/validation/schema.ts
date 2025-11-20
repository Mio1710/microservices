import z from "zod";
export const createConversationSchema = z.object({
  userIds: z
    .array(z.string())
    .min(2, "At least two user IDs are required")
    .refine((items) => new Set(items).size === items.length, {
      message: "Must be an array of unique strings",
    }),
});

export const sendMessageSchema = z.object({
  message: z.string().min(0, "Can not send empty message"),
  conversationId: z.string().min(1, "Conversation ID is required"),
});
