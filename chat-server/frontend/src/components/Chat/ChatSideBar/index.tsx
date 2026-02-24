import { IConversation } from '@/api/swr/chat';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useAuthContext } from '@/context/auth-context';
import { cn } from '@/lib/utils';
import { Edit, MessagesSquare, Search } from 'lucide-react';
import { useState } from 'react';
import { Fragment } from 'react/jsx-runtime';

export default function ChatSideBar({
  setActiveChat,
  conversations
}: {
  setActiveChat: React.Dispatch<React.SetStateAction<string>>;
  conversations: IConversation[] | null;
}) {
  const [search, setSearch] = useState('');
  const { user } = useAuthContext();

  return (
    <>
      <div className="flex w-full flex-col gap-2">
        <div className="bg-background sticky top-0 z-10 -mx-4 px-4 pb-3 shadow-md sm:static sm:z-auto sm:mx-0 sm:p-0 sm:shadow-none">
          <div className="flex items-center justify-between py-2">
            <div className="flex gap-2">
              <h1 className="text-2xl font-bold">Inbox</h1>
              <MessagesSquare size={20} />
            </div>

            <Button size="icon" variant="ghost" className="rounded-lg">
              <Edit size={24} className="stroke-muted-foreground" />
            </Button>
          </div>

          <label className="border-input focus-within:ring-ring flex h-12 w-full items-center space-x-0 rounded-md border pl-2 focus-within:ring-1 focus-within:outline-hidden">
            <Search size={15} className="mr-2 stroke-slate-500" />
            <span className="sr-only">Search</span>
            <input
              type="text"
              className="w-full flex-1 bg-inherit text-sm focus-visible:outline-hidden"
              placeholder="Search chat..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
        </div>

        <ScrollArea className="-mx-3 h-[calc(100%_-_100px)] p-3">
          {conversations?.map((conversation) => {
            const { _id, users, lastMessage } = conversation;
            const otherUser = users.find((u) => u._id !== user?._id);
            const lastMsg =
              lastMessage?.senderId === user?._id
                ? `You: ${lastMessage?.message}`
                : lastMessage?.message;
            return (
              <Fragment key={_id}>
                <button
                  type="button"
                  className={cn(
                    `hover:bg-secondary/75 -mx-1 flex w-full rounded-md px-2 py-2 text-left text-sm`,
                    conversation?._id === _id && 'sm:bg-muted'
                  )}
                  onClick={() => {
                    setActiveChat(conversation._id);
                  }}
                >
                  <div className="flex gap-2">
                    <Avatar>
                      <AvatarImage
                        src={
                          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxSaIyHu2I35lFsiOuo4kUQ8GnWun7NxdCMQ&s'
                        }
                        alt={otherUser?.name}
                      />
                      <AvatarFallback>{otherUser?.name}</AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="col-start-2 row-span-2 font-medium">
                        {otherUser?.name}
                      </span>
                      <span className="text-muted-foreground col-start-2 row-span-2 row-start-2 line-clamp-1 block max-w-full text-xs text-nowrap text-ellipsis lg:max-w-none lg:text-sm">
                        {lastMsg}
                      </span>
                    </div>
                  </div>
                </button>
                <Separator className="my-1" />
              </Fragment>
            );
          })}
        </ScrollArea>
      </div>
    </>
  );
}
