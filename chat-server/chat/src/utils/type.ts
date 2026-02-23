export interface MessagePayload {
  conversationId: number;
  message: string;
  parentMessageId?: number;
  senderId: number;
}
