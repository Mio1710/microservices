import { format } from 'date-fns';
import { useEffect, useRef, useState } from 'react';

import { Message } from '@/api/chat';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuthContext } from '@/context/auth-context';
import { cn } from '@/lib/utils';
import { IUser } from '@/type/login';
import {
  EllipsisVertical,
  ImagePlus,
  Paperclip,
  Phone,
  Plus,
  Send,
  Video
} from 'lucide-react';

interface ChatContentProps {
  messages: Message[];
  handleSendMessage: (text: string) => void;
  partner: IUser | null;
}
export default function ChatContent({
  messages,
  handleSendMessage,
  partner
}: ChatContentProps) {
  const { user } = useAuthContext();
  const [text, setText] = useState('');

  const endRef = useRef<HTMLDivElement | null>(null);

  // Scroll when new messages arrive
  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const submit = () => {
    handleSendMessage(text.trim());
    setText('');
  };

  return (
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
          <div className="flex w-full row justify-start flex-col-reverse gap-4 py-2 pr-4 pb-4">
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
            {messages.length === 0 && (
              <div className="text-center text-sm text-muted-foreground">
                <span className="border-1 rounded-2xl py-2 px-4">
                  <span className="mr-2">+</span>
                  Start a new conversation
                </span>
              </div>
            )}
          </div>
          <div ref={endRef} />
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
                    submit();
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
              onClick={submit}
            >
              <Send size={20} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
