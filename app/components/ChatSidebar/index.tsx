'use client';

import { useDashboardContext } from '@/app/context/DashboardContext';
import { Chat } from '@/app/lib/types/chat';
import { cn } from '@/app/lib/utils/common';
import ChatSidebarInner from '../ChatSidebarInner';

interface Props {
  className?: string;
  chats: Chat[];
}
export default function ChatSidebar({ className, chats }: Props) {
  const { isSidebarOpen } = useDashboardContext();

  return (
    <nav
      className={cn(
        'absolute bottom-0 left-0 top-0 hidden w-[300px] bg-muted/40 pt-16 transition-all md:flex',
        className,
        isSidebarOpen ? 'md:translate-x-0' : 'md:-translate-x-full'
      )}
    >
      <ChatSidebarInner chats={chats} />
    </nav>
  );
}
