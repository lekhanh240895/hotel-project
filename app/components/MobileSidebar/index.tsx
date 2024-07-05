'use client';

import React, { useState } from 'react';
import Logo from '../Logo';
import { cn } from '@/app/lib/utils/common';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BuildingStorefrontIcon,
  ChartBarIcon,
  CircleStackIcon,
  Cog8ToothIcon,
  DocumentChartBarIcon,
  ListBulletIcon,
  Bars3Icon,
  ChatBubbleBottomCenterTextIcon
} from '@heroicons/react/24/outline';
import BackButton from '../BackButton';
import { useDashboardContext } from '@/app/context/DashboardPageContext';

const links = [
  {
    title: 'Admin',
    href: '/dashboard',
    icon: <ChartBarIcon className="h-5 w-5" />
  },
  {
    title: 'Chatbot',
    href: '/dashboard/chatbot',
    icon: <ChatBubbleBottomCenterTextIcon className="h-5 w-5" />
  },
  {
    title: 'Hotel',
    href: '/dashboard/hotel',
    icon: <DocumentChartBarIcon className="h-5 w-5" />
  },
  {
    title: 'Restaurant',
    href: '/dashboard/restaurant',
    icon: <CircleStackIcon className="h-5 w-5" />
  },
  {
    title: 'Destination',
    href: '/dashboard/destination',
    icon: <BuildingStorefrontIcon className="h-5 w-5" />
  },
  {
    title: 'Tool',
    href: '/dashboard/tool',
    icon: <ListBulletIcon className="h-5 w-5" />
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: <Cog8ToothIcon className="h-5 w-5" />
  }
];

export default function MobileSidebar() {
  const { isMobileSidebarOpen, setIsMobileSidebarOpen } = useDashboardContext();

  const pathname = usePathname();
  return (
    <nav
      className={cn(
        `sidebar fixed bottom-0 left-0 right-0 top-0 z-50 block min-h-screen max-w-xs -translate-x-full bg-primary transition-all md:hidden`,
        isMobileSidebarOpen && 'translate-x-0'
      )}
    >
      <div className="border-b border-gray-700">
        <div className="flex items-center justify-between gap-4 p-4">
          <BackButton
            className="h-10 w-10 p-2 text-white"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <Logo className={cn('rounded')} />
        </div>
      </div>

      <div className="h-full overflow-y-auto px-4 py-6">
        <ul className="flex flex-col gap-4 text-slate-200">
          {links.map((link, index) => (
            <li key={link.title + index}>
              <Link
                className={cn(
                  `flex items-center gap-x-2 rounded-md p-2 transition-all hover:bg-slate-300 hover:text-gray-700 md:hover:bg-white`,
                  {
                    'bg-slate-300 text-gray-700': pathname === link.href
                  }
                )}
                href={link.href}
                onClick={() => setIsMobileSidebarOpen(false)}
              >
                {link.icon}
                <span className="leading-5">{link.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
