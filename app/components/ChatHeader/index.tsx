import React, { useState } from 'react';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { Button } from '@/app/components/ui/button';
import { MagnifyingGlassIcon, UserIcon } from '@heroicons/react/24/outline';
import { useDashboardContext } from '@/app/context/DashboardContext';
import { IconShare } from '../ui/icons';
import { ChatShareDialog } from '../ChatShareDialog';
import { useAIState } from 'ai/rsc';
import { shareChat } from '@/app/lib/services/chat';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

type Props = {
  id: string;
  title?: string;
};

export default function ChatHeader({ id, title }: Props) {
  const { isSidebarOpen, toggleSidebar } = useDashboardContext();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [aiState] = useAIState();
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between gap-4 bg-background px-6 py-4 shadow-md">
      <div className="flex items-center gap-2">
        <Avatar className="relative h-8 w-8 border bg-gray-800 text-white">
          <AvatarFallback className="bg-gray-800 p-2 text-white">
            <UserIcon />
          </AvatarFallback>
        </Avatar>
        <div className="text-sm font-medium">Chatbot</div>
      </div>
      <div className="flex items-center gap-2">
        {aiState.messages.length >= 2 && id && title && (
          <>
            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={() => setShareDialogOpen(!shareDialogOpen)}
                >
                  <IconShare className="h-5 w-5" />
                  <span className="sr-only">Share</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Share</TooltipContent>
            </Tooltip>

            <ChatShareDialog
              open={shareDialogOpen}
              onOpenChange={setShareDialogOpen}
              onCopy={() => setShareDialogOpen(false)}
              shareChat={shareChat}
              chat={{
                id,
                title,
                messages: aiState.messages
              }}
            />
          </>
        )}
        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <MagnifyingGlassIcon className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Search</TooltipContent>
        </Tooltip>

        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="hidden rounded-full md:flex"
            >
              <MoveHorizontalIcon className="h-5 w-5" onClick={toggleSidebar} />
              <span className="sr-only">
                {isSidebarOpen ? 'Expand' : 'Collapse'}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {isSidebarOpen ? 'Expand' : 'Collapse'}
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}

function MoveHorizontalIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="18 8 22 12 18 16" />
      <polyline points="6 8 2 12 6 16" />
      <line x1="2" x2="22" y1="12" y2="12" />
    </svg>
  );
}
