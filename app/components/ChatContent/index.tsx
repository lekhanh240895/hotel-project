import { UIState } from '@/app/lib/chat/actions';

interface Props {
  messages: UIState;
}
export default function ChatContent({ messages }: Props) {
  return messages.length ? (
    <div className="flex flex-col gap-4">
      {messages.map((message) => (
        <div key={message.id}>
          {message.spinner}
          {message.display}
          {message.attachments}
        </div>
      ))}
    </div>
  ) : null;
}
