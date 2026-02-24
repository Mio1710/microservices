import AxiosInstance from '@/lib/axios';
import { AxiosResponse } from 'axios';
import { IConversation } from '../swr/chat';
export interface Message {
  _id?: string;
  senderId: string;
  message: string;
  createdAt: Date;
  conversationId: string;
}
export const getAllConversations = async (): Promise<
  AxiosResponse<IConversation[]>
> => {
  return await AxiosInstance.get('/chat/all-conversations');
};
export const getMessages = async (
  conversationId: string
): Promise<AxiosResponse<Message[]>> => {
  return await AxiosInstance.get(`/chat/conversation/${conversationId}`);
};
