import { Message } from '@/api/chat';
import { IUser } from '@/type/login';

export const createSocketHandlers = (
  setIsConnected: (connected: boolean) => void,
  setMessages: (updater: (prev: Message[]) => Message[]) => void,
  updateSidebar: (msg: Message) => void,
  setOnlineUsers: (users: IUser[]) => void
) => {
  const onConnect = () => setIsConnected(true);
  const onDisconnect = () => setIsConnected(false);
  const onMessage = (msg: Message) => {
    setMessages((prev) => [msg, ...prev]);
    updateSidebar(msg);
  };
  const onStatusChange = (users: IUser[]) => setOnlineUsers(users);

  return {
    onConnect,
    onDisconnect,
    onMessage,
    onStatusChange
  };
};
