'use client';

import { Chat } from '@/app/lib/types/chat';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import ChatSidebarInner from '../ChatSidebarInner';
import { useDashboardContext } from '@/app/context/DashboardContext';
interface Props {
  chats: Chat[];
  children: React.ReactNode;
}
export default function ChatMobileSidebar({ children, chats }: Props) {
  const { isMobileSidebarOpen, toggleMobileSidebar } = useDashboardContext();
  return (
    <Sheet open={isMobileSidebarOpen} onOpenChange={toggleMobileSidebar}>
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
