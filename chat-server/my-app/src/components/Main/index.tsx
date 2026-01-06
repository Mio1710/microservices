import { IConversation } from '@/api/swr/chat';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '@/components/ui/resizable';
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import ChatContent from '../Chat/ChatContent';
import ChatSideBar from '../Chat/ChatSideBar';

const SOCKET_URL = import.meta.env.VITE_CHAT_SERVER_URL || 'http://localhost';
const token = localStorage.getItem('access_token') || '';

export function Main() {
  const [conversation, setConversation] = useState<IConversation | null>(null);
  const [room, setRoom] = useState<string>('');
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    const socketInstance = io(SOCKET_URL, {
      path: '/chat/socket.io',
      transports: ['websocket'],
      auth: { token },
      withCredentials: true
    });

    setSocket(socketInstance);
    return () => {
      socketInstance.disconnect();
    };
  }, [token]);

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="rounded-lg border md:min-w-[450px]"
    >
      <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
        <div className="flex h-[calc(100vh_-_90px)] justify-center p-6">
          <ChatSideBar
            setConversation={setConversation}
            conversation={conversation}
          />
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={75}>
        <div className="flex h-[calc(100vh_-_90px)] justify-center p-6">
          <ChatContent
            socket={socket}
            conversation={conversation}
            setConversation={setConversation}
            room={room}
            setRoom={setRoom}
          />
        </div>
      </ResizablePanel>
      <ResizableHandle />
    </ResizablePanelGroup>
  );
}
