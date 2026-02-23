import { useChat, useMessages } from '@/api/swr/chat';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '@/components/ui/resizable';
import { useAuthContext } from '@/context/auth-context';
import { cn } from '@/lib/utils';
import { ChatService } from '@/modules/chat/chat.service';
import { IUser } from '@/type/login';
import { MessagesSquare } from 'lucide-react';
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import ChatContent from '../Chat/ChatContent';
import { NewChat } from '../Chat/ChatContent/NewChat';
import ChatSideBar from '../Chat/ChatSideBar';
import { Button } from '../ui/button';

const SOCKET_URL = import.meta.env.VITE_CHAT_SERVER_URL || 'http://localhost';
const token = localStorage.getItem('access_token') || '';

export function Main() {
  const [activeChat, setActiveChat] = useState<string>('');
  const [partner, setPartner] = useState<IUser | null>(null);
  const { data: conversations } = useChat();
  const { data: messages, mutate: mutateMessages } = useMessages(activeChat);

  const { user } = useAuthContext();

  const [createConversationDialogOpened, setCreateConversationDialog] =
    useState(false);

  const socketInstance = io(SOCKET_URL, {
    path: '/chat/socket.io',
    transports: ['websocket'],
    auth: { token },
    withCredentials: true
  });

  const [socket, setSocket] = useState<Socket>(socketInstance);
  socketInstance.connect();
  console.log(socketInstance);
  socketInstance.on('connect_error', (err) => {
    console.error('Socket connection error:', err.message);
  });
  socketInstance.on('connect', () => {
    console.log('Socket connected:', socketInstance.id);
  });
  socketInstance.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason);
  });

  socketInstance.on('newMessage', (message) => {
    console.log('Socket newMessage newMessagenewMessage:', message);
    mutateMessages();
  });

  const handleSendMessage = async (text: string) => {
    console.log('send message: ', activeChat, text);

    const message = {
      senderId: user?._id,
      message: text,
      conversationId: activeChat
    };
    socket?.emit('sendMessage', message);

    // if (!socket || !conversation || !user) return;
    console.log('Conversation to send socketsocketsocket: ', socket);
  };

  useEffect(() => {
    if (!socket) return;
    if (activeChat == 'new-chat' && partner?._id && partner._id !== user?._id) {
      const createNewChat = async () => {
        const result = await ChatService.createConversation([partner._id]);
        console.log('Result: ', result);
        setActiveChat(result._id);
      };
      createNewChat();
    }
    socket.emit('joinRoom', activeChat);
  }, [activeChat, socket]);

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="rounded-lg border md:min-w-[450px]"
    >
      <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
        <div className="flex h-[calc(100vh_-_90px)] justify-center p-6">
          <ChatSideBar
            activeChat={activeChat}
            setActiveChat={setActiveChat}
            conversations={conversations}
          />
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={75}>
        <div className="flex h-[calc(100vh_-_90px)] justify-center p-6">
          {activeChat ? (
            <ChatContent
              messages={messages}
              handleSendMessage={handleSendMessage}
              partner={partner}
            />
          ) : (
            <div
              className={cn(
                'bg-primary-foreground h-full absolute inset-0 left-full z-50 hidden w-full flex-1 flex-col justify-center rounded-md border shadow-xs transition-all duration-200 sm:static sm:z-auto sm:flex'
              )}
            >
              <div className="flex flex-col items-center space-y-6">
                <div className="border-border flex size-16 items-center justify-center rounded-full border-2">
                  <MessagesSquare className="size-8" />
                </div>
                <div className="space-y-2 text-center">
                  <h1 className="text-xl font-semibold">Your messages</h1>
                  <p className="text-muted-foreground text-sm">
                    Send a message to start a chat.
                  </p>
                </div>
                <Button
                  className="bg-blue-500 px-6 text-white hover:bg-blue-600"
                  onClick={() => setCreateConversationDialog(true)}
                >
                  Send message
                </Button>
                <div>
                  {activeChat} --- {partner?.name}
                </div>
              </div>
              <NewChat
                setOpen={setCreateConversationDialog}
                open={createConversationDialogOpened}
                setActiveChat={setActiveChat}
                setNewUserId={setPartner}
              />
            </div>
          )}
        </div>
      </ResizablePanel>
      <ResizableHandle />
    </ResizablePanelGroup>
  );
}
