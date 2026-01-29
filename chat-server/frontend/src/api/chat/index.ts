import AxiosInstance from '@/lib/axios';
export interface Message {
  _id: string;
  senderId: string;
  message: string;
  createdAt: Date;
}
export const getAllConversations = async () => {
  return await AxiosInstance.get('/chat/all-conversations');
};
export const getMessages = async (
  conversationId: string
): Promise<Message[]> => {
  const response = await AxiosInstance.get(
    `/chat/conversation/${conversationId}`
  );
  return response.data;
};
