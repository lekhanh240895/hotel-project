import * as React from 'react';

import { cn } from '@/app/lib/utils';
import { Button, type ButtonProps } from '@/app/components/ui/button';
import { IconArrowDown } from '@/app/components/ui/icons';

interface ButtonScrollToBottomProps extends ButtonProps {
  isAtBottom: boolean;
  scrollToBottom: () => void;
}

export default function ButtonScrollToBottom({
  className,
  isAtBottom,
  scrollToBottom,
  ...props
}: ButtonScrollToBottomProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      className={cn(
        'fixed bottom-20 right-4 z-10 bg-background transition-opacity duration-300 sm:right-8',
        isAtBottom ? 'opacity-0' : 'opacity-100',
        className
      )}
      onClick={() => scrollToBottom()}
      {...props}
    >
      <IconArrowDown />
      <span className="sr-only">Scroll to bottom</span>
    </Button>
  );
}
