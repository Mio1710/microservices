import { IConversation } from '@/api/swr/chat';
import AxiosInstance from '@/lib/axios';

export class ChatService {
  static async createConversation(userIds: string[]): Promise<IConversation> {
    const res = await AxiosInstance.post('/chat/conversations', { userIds });

    return res.data;
  }
}
