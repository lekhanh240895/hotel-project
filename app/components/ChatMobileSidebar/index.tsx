'use client';

import React, { Dispatch, SetStateAction } from 'react';
import Logo from '../Logo';
import { cn } from '@/app/lib/utils/common';

import BackButton from '../BackButton';
import { useDashboardContext } from '@/app/context/DashboardPageContext';
import ChatSidebar from '../ChatSidebar';

interface Props {
  conversations: Conversation[];
  current: Conversation | null;
  setCurrent: Dispatch<SetStateAction<Conversation | null>>;
}
export default function ChatMobileSidebar({
  conversations,
  current,
  setCurrent
}: Props) {
  const { isChatMobileSidebarOpen, setIsChatMobileSidebarOpen } =
    useDashboardContext();

  return (
    <aside
      className={cn(
        `sidebar fixed bottom-0 left-0 right-0 top-0 z-50 block min-h-screen max-w-xs bg-background shadow-lg transition-all md:hidden`,
        isChatMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      <div className="flex items-center justify-between gap-4 p-4">
        <BackButton
          className="h-10 w-10 p-2 text-primary"
          onClick={() => {
            setIsChatMobileSidebarOpen(false);
          }}
        />
        <Logo className={cn('rounded')} />
      </div>

      <ChatSidebar
        conversations={conversations}
        current={current}
        setCurrent={setCurrent}
        className="flex h-full w-full max-w-[unset] overflow-auto border-none bg-background px-4 py-6"
      />
    </aside>
  );
}
