import Chat from '@/app/components/Chat';
import { getMe } from '@/app/lib/actions';
import { AI } from '@/app/lib/chat/actions';
import { LIST_ROUTER } from '@/app/lib/constants/common';
import { getChat } from '@/app/lib/services/chat';
import { type Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

export interface ChatPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params
}: ChatPageProps): Promise<Metadata> {
  const res = await getMe();

  if (res.error) {
    return {};
  }

  const chat = await getChat(params.id, res.data._id);
  return {
    title: chat?.title.toString().slice(0, 50) ?? 'Chat'
  };
}

export default async function ChatPage({ params }: ChatPageProps) {
  const res = await getMe();

  if (res.error) {
    redirect(
      `${LIST_ROUTER.LOGIN}?callbackUrl=${LIST_ROUTER.CHAT}/${params.id}`
    );
  }

  const userId = res.data._id;
  const chat = await getChat(params.id, userId);

  if (!chat) {
    redirect(LIST_ROUTER.CHATBOT);
  }

  if (chat.userId !== res.data._id) {
    notFound();
  }

  return (
    <AI
      initialAIState={{
        chatId: chat.id,
        messages: chat.messages,
        interactions: []
      }}
    >
      <Chat id={chat.id} initialMessages={chat.messages} />
    </AI>
  );
}
