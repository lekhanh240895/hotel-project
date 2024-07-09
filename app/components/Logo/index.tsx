import Image, { ImageProps } from 'next/image';
import React from 'react';

interface Props extends Omit<ImageProps, 'src' | 'alt'> {
  src?: string;
  alt?: string;
}

export default function Logo(props: Props) {
  const { alt, src, ...rest } = props;
  return (
    <Image alt={'Logo'} width={30} height={30} src="/Logo.png" {...rest} />
  );
}
