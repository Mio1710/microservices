import { getConversationId } from '@/api/chat';
import { useUser } from '@/api/swr/user';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { useAuthContext } from '@/context/auth-context';
import { ChatService } from '@/modules/chat/chat.service';
import { IUser } from '@/type/login';
import { Check, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  setActiveChat: React.Dispatch<React.SetStateAction<string>>;
  setNewUserId: (user: IUser) => void;
};
export function NewChat({ setOpen, open, setActiveChat, setNewUserId }: Props) {
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [search, setSearch] = useState('');
  // const [users, setUsers] = useState<IUser[]>([])
  const { users } = useUser({ search });
  const { user: authUser } = useAuthContext();

  useEffect(() => {
    if (!open) {
      setSelectedUser(null);
    }
  }, [open, setActiveChat]);

  const onStartChat = async () => {
    if (selectedUser && authUser) {
      setNewUserId(selectedUser);
      setOpen(false);
      const userIds = [selectedUser._id, authUser._id];
      // check if this conversation already exists
      let conversation = await getConversationId(userIds);
      let conversationId = conversation.data.conversationId;
      if (!conversation.data.conversationId) {
        const newConv = await ChatService.createConversation(userIds);
        conversationId = newConv._id;
      }
      setActiveChat(conversationId);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>New message</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted-foreground text-sm">To:</span>
            {selectedUser && (
              <Badge key={selectedUser._id} variant="default">
                {selectedUser.name}
                <button
                  className="ring-offset-background focus:ring-ring ml-1 rounded-full outline-hidden focus:ring-2 focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setSelectedUser(null);
                    }
                  }}
                  onClick={() => setSelectedUser(null)}
                >
                  <X className="text-muted-foreground hover:text-foreground h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
          <Command className="rounded-lg border">
            <CommandInput
              placeholder="Search people..."
              className="text-foreground"
              value={search}
              onValueChange={(value) => setSearch(value)}
            />
            <CommandList>
              <CommandEmpty>No people found.</CommandEmpty>
              <CommandGroup>
                {users.map(
                  (user) =>
                    user._id != authUser?._id && (
                      <CommandItem
                        key={user._id}
                        onSelect={() => setSelectedUser(user)}
                        className="flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={'/default.jpg'}
                            alt={user.name}
                            className="h-8 w-8 rounded-full"
                          />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">
                              {user.name}
                            </span>
                            <span className="text-muted-foreground text-xs">
                              {user.email}
                            </span>
                          </div>
                        </div>

                        {selectedUser && selectedUser._id === user._id && (
                          <Check className="h-4 w-4" />
                        )}
                      </CommandItem>
                    )
                )}
              </CommandGroup>
            </CommandList>
          </Command>
          <Button
            variant={'default'}
            disabled={selectedUser === null}
            onClick={onStartChat}
          >
            Chat
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
