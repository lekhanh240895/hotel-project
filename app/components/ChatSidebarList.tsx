import React from 'react';
import { Chat } from '../lib/types/chat';
import ChatSidebarItem from './ChatSidebarItem';

type Props = {
  chats: Chat[];
};

export default function ChatSidebarList({ chats }: Props) {
  return (
    <div className="grid gap-2">
      {chats.length ? (
        chats.map((chat, index) => {
          return <ChatSidebarItem chat={chat} key={chat.id + index} />;
        })
      ) : (
        <div className="p-8 text-center">
          <p className="text-sm text-muted-foreground">No chat history</p>
        </div>
      )}
    </div>
  );
}
