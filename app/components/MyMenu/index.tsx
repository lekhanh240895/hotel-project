'use client';

import React, { Fragment } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Button } from '../ui/button';
import {
  ArrowLeftEndOnRectangleIcon,
  Cog8ToothIcon,
  DocumentChartBarIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { logout } from '@/app/lib/actions';
import { useRouter } from 'next/navigation';
import { useUser } from '@/app/lib/hooks/useUser';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

type Props = {
  children: React.ReactNode;
};

export interface MenuItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  keyBinding?: string;
}

const items = [
  {
    title: 'View profile',
    href: '/profile',
    icon: <UserIcon className="h-5 w-5" />,
    keyBinding: '⌘V'
  },
  {
    title: 'Account Setting',
    href: '/settings',
    icon: <Cog8ToothIcon className="h-5 w-5" />,
    keyBinding: '⌘A'
  },
  {
    title: 'Login Activity',
    href: '/login/activity',
    icon: <DocumentChartBarIcon className="h-5 w-5" />,
    keyBinding: '⌘L'
  }
];

const MyMenu = ({ children }: Props) => {
  const router = useRouter();
  const handleClickItem = async (item: MenuItem) => {};

  const handleSignout = async () => {
    await logout();
    router.push('/');
  };
  const { user, isLoading } = useUser();

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div className="flex items-center">
        <MenuButton as={Fragment}>{children}</MenuButton>
      </div>

      <MenuItems
        transition
        anchor="bottom end"
        className="absolute right-0 top-full z-50 mt-4 w-56 min-w-80 max-w-80 origin-top-right divide-y divide-gray-200 rounded-md border-t-[3px] border-red-2 bg-white shadow-lg focus:outline-none"
      >
        <div className="flex items-stretch gap-4 bg-slate-100 px-7 py-4">
          <Avatar className="relative h-8 w-8 bg-red-1 text-white md:h-14 md:w-14">
            <AvatarImage src={user?.image} />
            <AvatarFallback className="bg-red-1 p-2 text-white md:p-3">
              <UserIcon />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col justify-between">
            <h1 className="font-semibold">{user?.full_name}</h1>
            <p className="text-sm text-gray-400">{user?.email}</p>
          </div>
        </div>
        <div className="space-y-1 px-7 py-4">
          {items.map((item, index) => (
            <MenuItem key={item.title + index}>
              <Button
                type="button"
                variant={'ghost'}
                className="group flex w-full items-center justify-start gap-2 rounded-lg p-0 hover:bg-inherit data-[focus]:text-red-2"
                onClick={() => handleClickItem(item)}
              >
                {item.icon}
                {item.title}
                <kbd className="ml-auto hidden font-sans text-xs text-black/50 group-data-[focus]:inline">
                  {item.keyBinding}
                </kbd>
              </Button>
            </MenuItem>
          ))}
        </div>
        <div className="px-7 py-2">
          <MenuItem>
            <Button
              type="button"
              variant={'ghost'}
              className="group flex w-full items-center justify-start gap-2 rounded-lg p-0 hover:bg-inherit data-[focus]:text-red-2"
              onClick={handleSignout}
            >
              <ArrowLeftEndOnRectangleIcon className="h-5 w-5" />
              Sign out
              <kbd className="ml-auto hidden font-sans text-xs text-black/50 group-data-[focus]:inline">
                ⌘S
              </kbd>
            </Button>
          </MenuItem>
        </div>
      </MenuItems>
    </Menu>
  );
};

export default MyMenu;
