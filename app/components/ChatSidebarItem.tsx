'use client';

import Link from 'next/link';
import React from 'react';
import { Chat } from '../lib/types/chat';
import { LIST_ROUTER } from '../lib/constants/common';
import { cn } from '../lib/utils/common';
import { Badge } from './ui/badge';
import { usePathname } from 'next/navigation';
import { useDashboardContext } from '../context/DashboardContext';
import { ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';

type Props = {
  chat: Chat;
};
export default function ChatSidebarItem({ chat }: Props) {
  const { toggleSidebar } = useDashboardContext();
  const pathname = usePathname();
  const isActive = chat.path === pathname;
  return (
    <>
      <Link
        href={`${LIST_ROUTER.CHAT}/${chat.id}`}
        className={cn(
          'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted md:hidden',
          {
            'bg-muted': isActive
          }
        )}
        onClick={toggleSidebar}
      >
        <div className="flex flex-1 items-center gap-2 truncate">
          <ChatBubbleBottomCenterTextIcon className="h-6 w-6" />
          <div className="truncate font-semibold">{chat.title}</div>
        </div>
        <Badge
          variant="secondary"
          className="relative -top-2 px-2 py-1 text-xs"
        >
          New
        </Badge>
      </Link>
      <Link
        href={`${LIST_ROUTER.CHAT}/${chat.id}`}
        className={cn(
          'hidden items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted md:flex',
          {
            'bg-muted': isActive
          }
        )}
      >
        <div className="flex flex-1 items-center gap-2 truncate">
          <ChatBubbleBottomCenterTextIcon className="h-6 w-6" />
          <div className="truncate font-semibold">{chat.title}</div>
        </div>
        <Badge
          variant="secondary"
          className="relative -top-2 px-2 py-1 text-xs"
        >
          New
        </Badge>
      </Link>
    </>
  );
}
