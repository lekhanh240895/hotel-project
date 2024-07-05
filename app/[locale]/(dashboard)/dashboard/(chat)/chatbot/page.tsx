'use client';

import { useUser } from '@/app/lib/hooks/useUser';
import { useForm } from 'react-hook-form';
import { useConfirmRedirectIfDirty } from '@/app/lib/hooks/useConfirmRedirectIfDirty';
import { useEffect, useState } from 'react';
import ChatSidebar from '@/app/components/ChatSidebar';
import ChatContent from '@/app/components/ChatContent';
import ChatForm from '@/app/components/ChatForm';
import ChatHeader from '@/app/components/ChatHeader';
import ChatMobileSidebar from '@/app/components/ChatMobileSidebar';
import { useDashboardContext } from '@/app/context/DashboardPageContext';

interface IFormData {
  message: string;
}

export default function ChatBot() {
  const { user } = useUser();

  const initialConversation = [
    {
      _id: '1',
      messages: [
        {
          _id: Math.random().toString(),
          sender: user?._id,
          content: 'Hello, chatbot!',
          role: 'user',
          conversation: Math.random().toString(),
          createdAt: '2024-07-08T19:54:09.190Z',
          updatedAt: '2024-07-08T19:54:09.190Z'
        },
        {
          _id: Math.random().toString(),
          sender: 'chatbot-id',
          content: 'Hello, human! How can I assist you today?',
          role: 'assistant',
          conversation: Math.random().toString(),
          createdAt: '2024-07-08T19:54:09.190Z',
          updatedAt: '2024-07-08T19:54:09.190Z'
        },
        {
          _id: Math.random().toString(),
          sender: user?._id,
          content: 'I need help with my order.',
          role: 'user',
          conversation: Math.random().toString(),
          createdAt: '2024-07-08T19:54:09.190Z',
          updatedAt: '2024-07-08T19:54:09.190Z'
        },
        {
          _id: Math.random().toString(),
          sender: 'chatbot-id',
          content: 'Sure, can you provide your order number?',
          role: 'assistant',
          conversation: Math.random().toString(),
          createdAt: '2024-07-08T19:54:09.190Z',
          updatedAt: '2024-07-08T19:54:09.190Z'
        }
      ],
      createdAt: '2024-07-08T19:54:09.190Z',
      updatedAt: '2024-07-08T19:54:09.190Z'
    },
    {
      _id: '2',
      messages: [
        {
          _id: Math.random().toString(),
          sender: user?._id,
          content: 'What is the weather like today?',
          role: 'user',
          conversation: Math.random().toString(), // This should be the conversation ID, replaced below
          createdAt: '2024-07-08T19:54:09.190Z',
          updatedAt: '2024-07-08T19:54:09.190Z'
        },
        {
          _id: Math.random().toString(),
          sender: 'chatbot-id',
          content: 'The weather is sunny with a high of 25°C.',
          role: 'assistant',
          conversation: Math.random().toString(), // This should be the conversation ID, replaced below
          createdAt: '2024-07-08T19:54:09.190Z',
          updatedAt: '2024-07-08T19:54:09.190Z'
        },
        {
          _id: Math.random().toString(),
          sender: user?._id,
          content: 'Great, thanks!',
          role: 'user',
          conversation: Math.random().toString(), // This should be the conversation ID, replaced below
          createdAt: '2024-07-08T19:54:09.190Z',
          updatedAt: '2024-07-08T19:54:09.190Z'
        },
        {
          _id: Math.random().toString(),
          sender: 'chatbot-id',
          content: 'You’re welcome! Have a nice day!',
          role: 'assistant',
          conversation: Math.random().toString(), // This should be the conversation ID, replaced below
          createdAt: '2024-07-08T19:54:09.190Z',
          updatedAt: '2024-07-08T19:54:09.190Z'
        }
      ],
      createdAt: '2024-07-08T19:54:09.190Z',
      updatedAt: '2024-07-08T19:54:09.190Z'
    }
  ];

  const [conversations, setConversations] =
    useState<Conversation[]>(initialConversation);
  const [current, setCurrent] = useState<Conversation | null>(null);
  const { isChatMobileSidebarOpen } = useDashboardContext();

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting, errors, isDirty }
  } = useForm({
    defaultValues: {
      message: ''
    }
  });

  useConfirmRedirectIfDirty(isDirty);

  const onSubmit = async (data: IFormData) => {
    if (user) {
    }

    reset();
  };

  return (
    <div className="flex h-screen max-h-screen w-full bg-background pt-[69px]">
      <ChatSidebar
        conversations={conversations}
        current={current}
        setCurrent={setCurrent}
      />

      <ChatMobileSidebar
        conversations={conversations}
        current={current}
        setCurrent={setCurrent}
      />

      <div className="flex flex-1 flex-col">
        <ChatHeader />

        <ChatContent current={current} />

        <ChatForm onSubmit={handleSubmit(onSubmit)} control={control} />
      </div>
    </div>
  );
}
