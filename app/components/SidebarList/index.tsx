import React from 'react';
import {
  BuildingStorefrontIcon,
  ChartBarIcon,
  CircleStackIcon,
  Cog8ToothIcon,
  DocumentChartBarIcon,
  ListBulletIcon,
  ChatBubbleBottomCenterTextIcon
} from '@heroicons/react/24/outline';
import SidebarItem from '../SidebarItem';

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

export default function SidebarList() {
  return (
    <ul className="flex h-full flex-col gap-4 overflow-y-auto px-4 py-6 text-slate-200">
      {links.map((link, index) => (
        <li key={link.title + index}>
          <SidebarItem link={link} />
        </li>
      ))}
    </ul>
  );
}
