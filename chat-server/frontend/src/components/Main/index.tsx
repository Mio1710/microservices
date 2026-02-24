import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '@/components/ui/resizable';
import { useSocket } from '@/context/chat-context';
import { cn } from '@/lib/utils';
import { IUser } from '@/type/login';
import { MessagesSquare } from 'lucide-react';
import { useEffect, useState } from 'react';
import ChatContent from '../Chat/ChatContent';
import { NewChat } from '../Chat/ChatContent/NewChat';
import ChatSideBar from '../Chat/ChatSideBar';
import { Button } from '../ui/button';

export function Main() {
  const [createConversationDialogOpened, setCreateConversationDialog] =
    useState(false);
  const [partner, setPartner] = useState<Pick<
    IUser,
    '_id' | 'name' | 'email'
  > | null>(null);

  const { messages, sendMessage, activeChat, setActiveChat, conversations } =
    useSocket();

  useEffect(() => {
    if (activeChat) {
      const currentPartner = conversations
        ?.find((c) => c._id === activeChat)
        ?.users.find((u) => u._id !== partner?._id);
      if (currentPartner) {
        setPartner(currentPartner);
      }
    }
  }, [activeChat]);

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="rounded-lg border md:min-w-[450px]"
    >
      <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
        <div className="flex h-[calc(100vh_-_90px)] justify-center p-6">
          <ChatSideBar
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
              partner={partner}
              handleSendMessage={sendMessage}
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
