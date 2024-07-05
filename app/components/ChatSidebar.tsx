import React, { Dispatch, SetStateAction } from 'react';
import {
  Avatar,
  AvatarImage,
  AvatarFallback
} from '@/app/components/ui/avatar';
import { PencilSquareIcon, UserIcon } from '@heroicons/react/24/outline';
import { useUser } from '../lib/hooks/useUser';
import { Button } from './ui/button';
import Link from 'next/link';
import { Badge } from './ui/badge';
import { cn } from '../lib/utils/common';
import { useDashboardContext } from '../context/DashboardPageContext';

interface Props {
  conversations: Conversation[];
  current: Conversation | null;
  setCurrent: Dispatch<SetStateAction<Conversation | null>>;
  className?: string;
}
export default function ChatSidebar({
  conversations,
  current,
  setCurrent,
  className
}: Props) {
  const { user } = useUser();
  const { setIsChatMobileSidebarOpen } = useDashboardContext();
  return (
    <nav
      className={cn(
        'hidden max-w-[300px] flex-1 flex-col border-r bg-muted/40 px-4 py-6 md:flex',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="relative h-8 w-8 border bg-gray-800 text-white">
            <AvatarImage src={user?.image} />
            <AvatarFallback className="bg-gray-800 p-2 text-white">
              <UserIcon />
            </AvatarFallback>
          </Avatar>
          <div className="text-sm font-medium">Chatbot</div>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full">
          <PencilSquareIcon className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
      </div>
      <div className="mt-4 flex-1 overflow-auto">
        <div className="grid gap-2">
          {conversations.map((c) => {
            const firstUserMessage = c.messages.find((m) => m.role === 'user');
            const firstBotMessage = c.messages.find(
              (m) => m.role === 'assistant'
            );
            return (
              <Link
                key={c._id}
                href="#"
                className={cn(
                  'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted',
                  {
                    'bg-muted': current?._id === c._id
                  }
                )}
                prefetch={false}
                onClick={() => {
                  setCurrent(c);
                  setIsChatMobileSidebarOpen(false);
                }}
              >
                <Avatar className="h-8 w-8 border">
                  <AvatarFallback className="bg-red-1 p-2 text-white">
                    <UserIcon />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 truncate">
                  <div className="font-medium">{firstUserMessage?.content}</div>
                  <div className="truncate text-muted-foreground">
                    {firstBotMessage?.content}
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className="relative -top-2 px-2 py-1 text-xs"
                >
                  New
                </Badge>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
