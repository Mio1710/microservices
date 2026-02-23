import AxiosInstance from '@/lib/axios';
import { AxiosResponse } from 'axios';
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
): Promise<AxiosResponse<Message[]>> => {
  return await AxiosInstance.get(`/chat/conversation/${conversationId}`);
};
