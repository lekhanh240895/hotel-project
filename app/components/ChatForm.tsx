import React from 'react';
import { Controller, useWatch } from 'react-hook-form';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ArrowUpIcon } from '@heroicons/react/24/outline';

interface Props {
  onSubmit: (data: any) => void;
  control: any;
}
export default function ChatForm({ onSubmit, control }: Props) {
  const message = useWatch({
    control,
    name: 'message',
    defaultValue: ''
  });
  return (
    <form
      onSubmit={onSubmit}
      className="sticky bottom-0 flex w-full items-center justify-center bg-background px-6 py-4"
    >
      <div className="relative w-full max-w-2xl">
        <Controller
          control={control}
          name="message"
          render={({ field: { value, onChange } }) => (
            <Input
              placeholder="Message Chatbot..."
              name="message"
              id="message"
              className="min-h-[48px] border border-neutral-400 p-4 pr-16 shadow-sm"
              value={value}
              onChange={onChange}
            />
          )}
        />

        <Button
          type="submit"
          size="icon"
          className="absolute right-3 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full"
          disabled={!message}
        >
          <ArrowUpIcon className="h-4 w-4" />
          <span className="sr-only">Send</span>
        </Button>
      </div>
    </form>
  );
}
