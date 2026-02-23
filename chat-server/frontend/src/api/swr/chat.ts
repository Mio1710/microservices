import useSWR from 'swr';
import { getAllConversations, getMessages, Message } from '../chat';

export interface IConversation {
  _id: string;
  lastMessage: {
    id: string;
    senderId: string;
    message: string;
  };
  users: [
    {
      _id: string;
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

export const useMessages = (id: string) => {
  const { data, error, isLoading, mutate } = useSWR(
    id && id !== 'new-chat' ? `/chat/conversation/${id}` : null,
    () => getMessages(id)
  );
  const conversation: Message[] = data?.data || [];

  return {
    data: conversation,
    isLoading,
    isError: error,
    mutate
  };
};
