'use client';

import { cn } from '../lib/utils/common';
import { Chat } from '../lib/types/chat';
import { useDashboardContext } from '../context/DashboardContext';
import ChatSidebarInner from './ChatSidebarInner';

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
