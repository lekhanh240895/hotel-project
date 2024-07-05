import React from 'react';
import {
  Avatar,
  AvatarImage,
  AvatarFallback
} from '@/app/components/ui/avatar';
import { Button } from '@/app/components/ui/button';
import { MagnifyingGlassIcon, UserIcon } from '@heroicons/react/24/outline';
import { useUser } from '@/app/lib/hooks/useUser';

export default function ChatHeader() {
  const { user } = useUser();

  return (
    <div className="sticky top-0 flex items-center justify-between gap-4 border-b bg-background px-6 py-4">
      <div className="flex items-center gap-2">
        <Avatar className="relative h-8 w-8 border bg-gray-800 text-white">
          <AvatarImage src={user?.image} />
          <AvatarFallback className="bg-gray-800 p-2 text-white">
            <UserIcon />
          </AvatarFallback>
        </Avatar>
        <div className="text-sm font-medium">Chatbot</div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="rounded-full">
          <MagnifyingGlassIcon className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <MoveHorizontalIcon className="h-5 w-5" />
          <span className="sr-only">More</span>
        </Button>
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
