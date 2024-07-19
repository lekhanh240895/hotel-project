import Chat from '@/app/components/Chat';
import { AI } from '@/app/lib/chat/actions';
import { nanoid } from '@/app/lib/utils';

export default async function ChatPage() {
  const id = nanoid();
  return (
    <AI initialAIState={{ chatId: id, interactions: [], messages: [] }}>
      <Chat id={id} />
    </AI>
  );
}
