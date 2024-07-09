'use client';

// import { Bars3Icon } from '@heroicons/react/24/solid';
import React, { useState } from 'react';
import Logo from '../Logo';
import { cn } from '@/app/lib/utils';
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
  ArrowLeftEndOnRectangleIcon
} from '@heroicons/react/24/outline';
import { Button } from '../ui/button';

const links = [
  {
    title: 'Admin',
    href: '/dashboard',
    icon: <ChartBarIcon className="h-5 w-5" />
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

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }
  };

  const pathname = usePathname();
  return (
    <aside
      className={cn(
        `sidebar fixed z-50 h-full min-h-screen w-[68px] bg-slate-900 transition-all`,
        {
          open: isOpen
        }
      )}
    >
      <div className="h-16 border-b border-gray-700">
        <div className="flex items-center justify-between gap-4 p-4">
          <span className="flex h-9 w-9 flex-shrink-0 cursor-pointer items-center justify-center text-slate-300">
            <Bars3Icon onClick={handleToggle} className="h-7 w-7" />
          </span>
          <Logo
            className={cn({
              hidden: !isOpen
            })}
          />
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
                onClick={() => setIsOpen(false)}
              >
                {link.icon}
                {isOpen && link.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
