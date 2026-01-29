import useSWR from 'swr';
import { getAllConversations } from '../chat';

export interface IConversation {
  _id: string;
  lastMessage: {
    id: string;
    senderId: string;
    message: string;
  };
  users: [
    {
      id: string;
      name: string;
      email: string;
    }
  ];
}
export const useChat = () => {
  const { data, error, isLoading } = useSWR(
    '/chat/all-conversations',
    getAllConversations
  );
  const conversation: IConversation[] = data?.data || [];

  return {
    data: conversation,
    isLoading,
    isError: error
  };
};
