'use client';

/* eslint-disable @next/next/no-img-element */

import { IconUser, SpinnerIcon } from '@/app/components/ui/icons';
import { cn } from '@/app/lib/utils/common';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { StreamableValue } from 'ai/rsc';
import { useStreamableText } from '@/app/lib/hooks/use-streamable-text';
import { CodeBlock } from '../ui/codeblock';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { UserIcon } from '@heroicons/react/24/outline';
import { ChatMessageActions } from '../chat-message-actions';
import Markdown from 'react-markdown';
import { Card } from '../ui/card';

export function UserMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="group relative flex items-start justify-end">
      <div
        className={cn(
          'rounded-userMessageBorder flex max-w-xs flex-row-reverse whitespace-pre-line break-words bg-[#e3fcf7] px-4 py-2 text-foreground shadow-md sm:max-w-sm md:max-w-2xl'
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function BotMessage({
  content,
  className
}: {
  content: string | StreamableValue<string>;
  className?: string;
}) {
  const text = useStreamableText(content);

  return (
    <div className={cn('group relative flex items-start', className)}>
      <Avatar className="h-8 w-8 border">
        <AvatarFallback className={cn('bg-gray-800 p-2 text-white')}>
          <UserIcon />
        </AvatarFallback>
      </Avatar>
      <div className="ml-4 grid gap-2">
        <div
          className={cn(
            'rounded-botMessageBorder flex max-w-xs whitespace-pre-line break-words bg-gray-100 px-4 py-2 text-foreground shadow-md sm:max-w-sm md:max-w-2xl'
          )}
        >
          <Markdown
            className="prose dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 break-words"
            remarkPlugins={[remarkGfm, remarkMath]}
            components={{
              p({ children }) {
                return <p className="mb-2 last:mb-0">{children}</p>;
              },
              code(props) {
                const { children, className, node, ...rest } = props;

                const match = /language-(\w+)/.exec(className || '');
                return match ? (
                  <CodeBlock
                    key={Math.random()}
                    language={(match && match[1]) || ''}
                    value={String(children).replace(/\n$/, '')}
                    {...props}
                  />
                ) : (
                  <code {...rest} className={className}>
                    {children}
                  </code>
                );
              }
            }}
          >
            {text}
          </Markdown>
        </div>
        <ChatMessageActions message={text} />
      </div>
    </div>
  );
}

export function BotCard({
  children,
  showAvatar = true
}: {
  children: React.ReactNode;
  showAvatar?: boolean;
}) {
  return (
    <Card className="group relative flex items-start">
      <div
        className={cn(
          'flex size-[25px] shrink-0 select-none items-center justify-center rounded-lg border bg-background shadow-sm',
          !showAvatar && 'invisible'
        )}
      >
        <img className="size-6" src="/images/gemini.png" alt="gemini logo" />
      </div>
      <div className="ml-4 flex-1 pl-2">{children}</div>
    </Card>
  );
}

export function SystemMessage({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={
        'mt-2 flex items-center justify-center gap-2 text-xs text-gray-500'
      }
    >
      <div className={'max-w-[600px] flex-initial p-2'}>{children}</div>
    </div>
  );
}

export function SpinnerMessage() {
  return (
    <div className="group relative flex items-start">
      <div className="flex size-[25px] shrink-0 select-none items-center justify-center rounded-lg border bg-background shadow-sm">
        <img className="size-6" src="/images/gemini.png" alt="gemini logo" />
      </div>
      <div className="ml-4 flex h-[24px] flex-1 flex-row items-center space-y-2 overflow-hidden px-1">
        <SpinnerIcon />
      </div>
    </div>
  );
}
