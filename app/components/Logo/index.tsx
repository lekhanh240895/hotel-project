import { cn } from '@/app/lib/utils/common';
import Image, { ImageProps } from 'next/image';
import React from 'react';

interface Props extends Omit<ImageProps, 'src' | 'alt'> {
  src?: string;
  alt?: string;
}

export default function Logo(props: Props) {
  const { alt, src = '/logo2.png', className, ...rest } = props;
  return (
    <Image
      alt={'Logo'}
      src={src}
      {...rest}
      width={40}
      height={40}
      className={cn('h-10 w-10 rounded', className)}
    />
  );
}
