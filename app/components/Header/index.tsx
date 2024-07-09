import { ChevronDownIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import React from 'react';
import MyMenu from '../MyMenu';

export default async function Header() {
  return (
    <header className="z-1 fixed left-[300px] right-0 top-0 z-10 flex items-center justify-end px-10 py-2">
      <div className="flex items-stretch gap-4">
        <Image
          src="/avatar-placeholder.jpeg"
          alt="Avatar"
          width={28}
          height={28}
          className="h-12 w-12 rounded-full object-cover"
        />
        <div className="flex flex-col justify-between">
          <h1 className="text-sm font-semibold text-primary">Administrator</h1>
          <div className="flex items-center gap-4">
            <h2 className="font-semibold ">Le Khanh</h2>
            <MyMenu>
              <ChevronDownIcon className="h-3 w-3 cursor-pointer" />
            </MyMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
