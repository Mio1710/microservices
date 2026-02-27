// src/context/SocketContext.tsx
import { getMessages, Message } from '@/api/chat';
import { IConversation, useChat } from '@/api/swr/chat';
import { SendMessage } from '@/components/Chat/types';
import { socketInstance } from '@/socket/handleConnect';
import { createSocketHandlers } from '@/socket/handlers';
import { IUser } from '@/type/login';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react';
import { useAuthContext } from './auth-context';

interface SocketContextType {
  messages: Message[];
  sendMessage: (text: string) => void;
  activeChat: string;
  setActiveChat: React.Dispatch<React.SetStateAction<string>>;
  conversations: IConversation[];
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { data: initConversations } = useChat();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] =
    useState<IConversation[]>(initConversations);
  const [activeChat, setActiveChat] = useState<string>('');
  const [onlineUsers, setOnlineUsers] = useState<IUser[]>([]);
  const [isConnected, setIsConnected] = useState(socketInstance.connected);
  const { user } = useAuthContext();

  const updateSidebar = (msg: Message) => {
    setConversations((prev) => {
      const idx = prev.findIndex((c) => c._id === msg.conversationId);
      if (idx === -1) return prev;

      const updatedConv = {
        ...prev[idx],
        lastMessage: {
          id: msg._id || '',
          senderId: msg.senderId,
          message: msg.message
        }
      };

      const remaining = prev.filter((_, i) => i !== idx);
      return [updatedConv, ...remaining];
    });
  };
  useEffect(() => {
    if (!user) return;
    socketInstance.auth = { userId: user?._id };
    socketInstance.connect();

    const handlers = createSocketHandlers(
      setIsConnected,
      setMessages,
      updateSidebar,
      setOnlineUsers
    );

    socketInstance.on('connect', handlers.onConnect);
    socketInstance.on('disconnect', handlers.onDisconnect);
    socketInstance.on('newMessage', handlers.onMessage);
    socketInstance.on('user_status_change', handlers.onStatusChange);

    return () => {
      socketInstance.off('connect', handlers.onConnect);
      socketInstance.off('disconnect', handlers.onDisconnect);
      socketInstance.off('newMessage', handlers.onMessage);
      socketInstance.off('user_status_change', handlers.onStatusChange);
      socketInstance.disconnect();
    };
  }, [user?._id]);

  useEffect(() => {
    if (activeChat) {
      // Optionally, you can emit an event to join a specific chat room
      socketInstance.emit('joinRoom', activeChat);
      // get message for this conversation
      const fetchMessages = async () => {
        const { data } = await getMessages(activeChat);
        setMessages(data);
      };
      fetchMessages();
    }
    setConversations(initConversations);
    console.log('Check conversation: ', conversations);
  }, [activeChat, initConversations]);

  const sendMessage = (text: string) => {
    // TypeScript will error here if you forget a required field
    const messageData: SendMessage = {
      conversationId: activeChat,
      senderId: user?._id || '',
      senderName: user?.name || '',
      message: text
    };
    socketInstance.emit('sendMessage', messageData);
  };

  return (
    <SocketContext.Provider
      value={{
        messages,
        sendMessage,
        activeChat,
        setActiveChat,
        conversations
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook with a check to ensure it's used within a Provider
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context)
    throw new Error('useSocket must be used within a SocketProvider');
  return context;
};
