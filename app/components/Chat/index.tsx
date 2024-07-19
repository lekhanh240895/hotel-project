'use client';

import { useUser } from '@/app/lib/hooks/useUser';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import ChatContent from '@/app/components/ChatContent';
import ChatForm from '@/app/components/ChatForm';
import ChatHeader from '@/app/components/ChatHeader';
import { useActions, useAIState, useUIState } from 'ai/rsc';
import { useLocalStorage } from '@/app/lib/hooks/use-local-storage';
import { Message } from '@/app/lib/types/chat';
import { usePathname, useRouter } from 'next/navigation';
import { AI } from '@/app/lib/chat/actions';
import { nanoid } from '@/app/lib/utils';
import { UserMessage } from '../message';
import ButtonScrollToBottom from '../button-scroll-to-bottom';
import { useScrollAnchor } from '@/app/lib/hooks/use-scroll-anchor';
import { LIST_ROUTER } from '@/app/lib/constants/common';
import { cn } from '@/app/lib/utils/common';
import { useDashboardContext } from '@/app/context/DashboardContext';

export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[];
  id: string;
}

type FormData = {
  input: string;
};
export default function Chat({ id, initialMessages }: ChatProps) {
  const { user } = useUser();
  const router = useRouter();
  const path = usePathname();

  const [messages, setMessages] = useUIState<typeof AI>();
  const [aiState] = useAIState();
  const [_, setNewChatId] = useLocalStorage('newChatId', id);
  const { submitUserMessage } = useActions();

  const { control, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      input: ''
    }
  });

  const { isSidebarOpen } = useDashboardContext();
  const { messagesRef, scrollRef, visibilityRef, isAtBottom, scrollToBottom } =
    useScrollAnchor();

  useEffect(() => {
    if (user) {
      if (path.includes('chatbot') && messages.length === 1) {
        window.history.replaceState({}, '', `${LIST_ROUTER.CHAT}/${id}`);
      }
    }
  }, [id, path, user, messages]);

  useEffect(() => {
    const messagesLength = aiState.messages?.length;
    if (messagesLength === 2) {
      router.refresh();
    }
  }, [aiState.messages, router]);

  useEffect(() => {
    setNewChatId(id);
  });

  const onSubmit = async (data: { input: string }) => {
    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: nanoid(),
        display: <UserMessage>{data.input}</UserMessage>
      }
    ]);

    const responseMessage = await submitUserMessage(data.input);

    setMessages((currentMessages) => [...currentMessages, responseMessage]);

    reset();
  };

  return (
    <div
      className={cn(
        'flex flex-1 flex-col',
        isSidebarOpen ? 'md:pl-[300px]' : 'md:pl-0'
      )}
    >
      <ChatHeader />

      <div className="relative flex-1 overflow-y-auto p-6" ref={scrollRef}>
        <div ref={messagesRef} className="mx-auto max-w-7xl">
          <ChatContent messages={messages} />
        </div>

        <ButtonScrollToBottom
          isAtBottom={isAtBottom}
          scrollToBottom={scrollToBottom}
        />

        <div className="h-px w-full" ref={visibilityRef} />
      </div>

      <ChatForm onSubmit={handleSubmit(onSubmit)} control={control} />
    </div>
  );
}
