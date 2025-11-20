import { getMessages } from '@/api/chat';
import { IConversation } from '@/api/swr/chat';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '@/components/ui/resizable';
import { useState } from 'react';
import ChatContent from '../Chat/ChatContent';
import ChatSideBar from '../Chat/ChatSideBar';

export function Main() {
  const [conversation, setConversation] = useState<IConversation | null>(null);
  const getConversation = (id: string) => {
    try {
      const messages = getMessages(id);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="rounded-lg border md:min-w-[450px]"
    >
      <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
        <div className="flex h-[calc(100vh_-_90px)] justify-center p-6">
          <ChatSideBar setConversation={setConversation} />
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={75}>
        <div className="flex h-[calc(100vh_-_90px)] justify-center p-6">
          <ChatContent conversation={conversation} />
        </div>
      </ResizablePanel>
      <ResizableHandle />
    </ResizablePanelGroup>
  );
}
