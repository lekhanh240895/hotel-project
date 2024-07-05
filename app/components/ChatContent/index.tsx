import {
  Avatar,
  AvatarImage,
  AvatarFallback
} from '@/app/components/ui/avatar';
import {
  ArrowPathIcon,
  ClipboardIcon,
  HandThumbDownIcon,
  HandThumbUpIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { Button } from '../ui/button';
import { cn } from '@/app/lib/utils/common';

interface Props {
  current: Conversation | null;
}
export default function ChatContent({ current }: Props) {
  return (
    <div className="flex-1 overflow-auto p-6">
      {current && (
        <div className="flex flex-col gap-4">
          {current.messages.map((message) => {
            const isUserMessage = message.role === 'user';
            return (
              <Message
                key={message._id}
                message={message}
                isUserMessage={isUserMessage}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

const Message = ({
  message,
  isUserMessage
}: {
  message: Message;
  isUserMessage: boolean;
}) => (
  <div
    className={cn('mb-4 flex items-start gap-4', {
      'justify-end': isUserMessage
    })}
  >
    {!isUserMessage && (
      <Avatar className="h-8 w-8 border">
        <AvatarFallback
          className={cn('bg-red-1 p-2 text-white', {
            'bg-gray-800': message.role === 'assistant'
          })}
        >
          <UserIcon />
        </AvatarFallback>
      </Avatar>
    )}
    <div className="grid gap-1">
      <div
        className={cn(
          'flex max-w-sm whitespace-pre-line break-words',
          isUserMessage
            ? 'rounded-messageBorder flex-row-reverse bg-gray-200 px-4 py-2 text-foreground'
            : 'flex-row text-foreground'
        )}
      >
        {message.content}
      </div>

      {message.role === 'assistant' && (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 text-stone-400 hover:bg-transparent hover:text-stone-900"
          >
            <ClipboardIcon className="h-4 w-4" />
            <span className="sr-only">Copy</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 text-stone-400 hover:bg-transparent hover:text-stone-900"
          >
            <HandThumbUpIcon className="h-4 w-4" />
            <span className="sr-only">Upvote</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 text-stone-400 hover:bg-transparent hover:text-stone-900"
          >
            <HandThumbDownIcon className="h-4 w-4" />
            <span className="sr-only">Downvote</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 text-stone-400 hover:bg-transparent hover:text-stone-900"
          >
            <ArrowPathIcon className="h-4 w-4" />
            <span className="sr-only">Regenerate</span>
          </Button>
        </div>
      )}
    </div>
  </div>
);
