export interface MessagePayload {
  groupId?: number;
  receiverId?: number;
  content: string;
  parentMessageId?: number;
  senderId: number;
}
