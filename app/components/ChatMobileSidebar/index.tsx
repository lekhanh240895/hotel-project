'use client';

import { Chat } from '@/app/lib/types/chat';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { PencilSquareIcon, UserIcon } from '@heroicons/react/24/outline';
import { Button } from '../ui/button';
import Link from 'next/link';
import { LIST_ROUTER } from '@/app/lib/constants/common';
import ChatSidebarList from '../ChatSidebarList';
import ChatSidebarInner from '../ChatSidebarInner';
interface Props {
  chats: Chat[];
  children: React.ReactNode;
}
export default function ChatMobileSidebar({ children, chats }: Props) {
  return (
    <Sheet>
      <SheetTrigger>{children}</SheetTrigger>
      <SheetContent
        side="left"
        className="inset-y-0 flex h-auto w-[300px] flex-col bg-background p-0"
      >
        <ChatSidebarInner chats={chats} />
      </SheetContent>
    </Sheet>
  );
}
