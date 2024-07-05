'use client';

import { cn } from '@/app/lib/utils/common';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function BackButton(
  props: React.HTMLAttributes<HTMLDivElement>
) {
  const router = useRouter();
  const { className, ...rest } = props;
  return (
    <div
      onClick={() => router.back()}
      className={cn('flex items-center justify-center', className)}
      {...rest}
    >
      <ChevronLeftIcon />
    </div>
  );
}
