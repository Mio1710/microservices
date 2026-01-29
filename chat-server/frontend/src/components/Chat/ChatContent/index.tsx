import { format } from 'date-fns';
import React, { useEffect, useRef, useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
// Fake Data
import { getMessages, Message } from '@/api/chat';
import { IConversation } from '@/api/swr/chat';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuthContext } from '@/context/auth-context';
import { ChatService } from '@/modules/chat/chat.service';
import {
  EllipsisVertical,
  ImagePlus,
  MessagesSquare,
  Paperclip,
  Phone,
  Plus,
  Send,
  Video
} from 'lucide-react';
import { useSearchParams } from 'react-router';
import { Socket } from 'socket.io-client';
import { NewChat } from './NewChat';

interface ChatContentProps {
  conversation: IConversation | null;
  setConversation: React.Dispatch<React.SetStateAction<IConversation | null>>;
  room: string;
  setRoom: React.Dispatch<React.SetStateAction<string>>;
  socket: Socket | undefined;
}
export default function ChatContent({
  conversation,
  setConversation,
  room,
  setRoom,
  socket
}: ChatContentProps) {
  const { user } = useAuthContext();
  const [params] = useSearchParams();
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [text, setText] = useState('');
  const [newUserId, setNewUserId] = useState<string | null>(null);
  const [createConversationDialogOpened, setCreateConversationDialog] =
    useState(false);

  const getData = async () => {
    if (conversation) {
      try {
        const data = await getMessages(conversation._id);
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    }
  };

  useEffect(() => {
    if (!socket) return;
    // emit join room
    socket.on('receiveMessage', handleReceiveMessage);
    if (socket && conversation) {
      socket.emit('joinRoom', conversation._id);
    }
    getData();
    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
    };
  }, [conversation, socket]);
  const handleReceiveMessage = (msg: Message) => {
    console.log('Message received:', msg);
    setMessages((prevMessages: Message[] | null) => [
      ...(prevMessages || []),
      msg
    ]);
  };

  const sendMessage = async () => {
    console.log('send message: ', conversation?._id, text);

    let conversationId = conversation?._id;
    if (room === 'new' && newUserId) {
      const result = await ChatService.createConversation([newUserId]);
      setRoom(result._id);
      setConversation(result);
      console.log('Result: ', result);

      conversationId = result._id;
    }
    // if (!socket || !conversation || !user) return;
    console.log('Conversation to send socketsocketsocket: ', socket);

    if (conversation) {
      const message = {
        senderId: user?._id,
        message: text,
        conversationId: conversationId
      };
      socket?.emit('sendMessage', message);
      setText('');
    }
  };
  const endRef = useRef<HTMLDivElement | null>(null);

  // Scroll when new messages arrive
  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  const partner = conversation?.users.find((item) => item.id !== user?._id);
  useEffect(() => {
    console.log('Room value: ', room);
    params.set('room', room);
    if (room === 'new') {
      setCreateConversationDialog(false);
      setMessages([]);
    }
  }, [room]);
  return (
    <>
      {messages != null ? (
        <div
          className={cn(
            'bg-primary-foreground absolute inset-0 h-full left-full z-50 hidden w-full flex-1 flex-col rounded-md border shadow-xs transition-all duration-200 sm:static sm:z-auto sm:flex'
          )}
        >
          {/* Top Part */}
          <div className="bg-secondary mb-1 flex flex-none justify-between rounded-t-md p-4 shadow-lg">
            {/* Left */}
            <div className="flex gap-3">
              <div className="flex items-center gap-2 lg:gap-4">
                <Avatar className="size-9 lg:size-11">
                  <AvatarImage
                    src={'https://randomuser.me/api/portraits/men/32.jpg'}
                    alt={partner?.name}
                  />
                  <AvatarFallback>{partner?.name}</AvatarFallback>
                </Avatar>
                <div>
                  <span className="col-start-2 row-span-2 text-sm font-medium lg:text-base">
                    {partner?.name}
                  </span>
                  <span className="text-muted-foreground col-start-2 row-span-2 row-start-2 line-clamp-1 block max-w-32 text-xs text-nowrap text-ellipsis lg:max-w-none lg:text-sm">
                    {partner?.email}
                  </span>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="-mr-1 flex items-center gap-1 lg:gap-2">
              <Button
                size="icon"
                variant="ghost"
                className="hidden size-8 rounded-full sm:inline-flex lg:size-10"
              >
                <Video size={22} className="stroke-muted-foreground" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="hidden size-8 rounded-full sm:inline-flex lg:size-10"
              >
                <Phone size={22} className="stroke-muted-foreground" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-10 rounded-md sm:h-8 sm:w-4 lg:h-10 lg:w-6"
              >
                <EllipsisVertical className="stroke-muted-foreground sm:size-5" />
              </Button>
            </div>
          </div>

          {/* Conversation */}
          <div className="gap-2 rounded-md pl-4 pt-0 pb-4 h-[calc(100%_-_120px)]">
            <ScrollArea className="h-full">
              <div className="flex w-full  row flex-col justify-start gap-4 py-2 pr-4 pb-4">
                {messages.map((msg, index) => (
                  <div
                    key={`${msg?.senderId}-${msg?.createdAt}-${index}`}
                    className={cn(
                      'chat-box max-w-72 px-3 py-2 break-words shadow-lg',
                      msg?.senderId === user?._id
                        ? 'bg-chart-2 text-chart-2-foreground/75 self-end rounded-[16px_16px_0_16px]'
                        : 'bg-secondary self-start rounded-[16px_16px_16px_0]'
                    )}
                  >
                    {msg.message}{' '}
                    <span
                      className={cn(
                        'text-muted-foreground mt-1 block text-xs font-light italic',
                        msg?.senderId === user?._id && 'text-right'
                      )}
                    >
                      {format(msg.createdAt, 'h:mm a')}
                    </span>
                  </div>
                ))}
                {messages.length === 0 && room === 'new' && (
                  <div className="text-center text-sm text-muted-foreground">
                    <span className="border-1 rounded-2xl py-2 px-4">
                      <span className="mr-2">+</span>
                      Start a new conversation
                    </span>
                  </div>
                )}
                <div ref={endRef} />
              </div>
            </ScrollArea>
            <div className="flex w-full flex-none gap-2 pr-4">
              <div className="border-input focus-within:ring-ring flex flex-1 items-center gap-2 rounded-md border px-2 py-1 focus-within:ring-1 focus-within:outline-hidden lg:gap-4">
                <div className="space-x-1">
                  <Button
                    size="icon"
                    type="button"
                    variant="ghost"
                    className="h-8 rounded-md"
                  >
                    <Plus size={20} className="stroke-muted-foreground" />
                  </Button>
                  <Button
                    size="icon"
                    type="button"
                    variant="ghost"
                    className="hidden h-8 rounded-md lg:inline-flex"
                  >
                    <ImagePlus size={20} className="stroke-muted-foreground" />
                  </Button>
                  <Button
                    size="icon"
                    type="button"
                    variant="ghost"
                    className="hidden h-8 rounded-md lg:inline-flex"
                  >
                    <Paperclip size={20} className="stroke-muted-foreground" />
                  </Button>
                </div>
                <label className="flex-1">
                  <span className="sr-only">Chat Text Box</span>
                  <input
                    type="text"
                    name="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyUp={(e) => {
                      if (e.key === 'Enter' && text.trim()) {
                        sendMessage();
                      }
                    }}
                    placeholder="Type your messages..."
                    className="h-8 w-full bg-inherit focus-visible:outline-hidden"
                  />
                </label>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden sm:inline-flex"
                  onClick={sendMessage}
                >
                  <Send size={20} />
                </Button>
              </div>
            </div>
          </div>
        </div>
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
          </div>
          <NewChat
            onOpenChange={setCreateConversationDialog}
            open={createConversationDialogOpened}
            setRoom={setRoom}
            setNewUserId={setNewUserId}
          />
        </div>
      )}
    </>
  );
}
