'use client';

import Logo from '../Logo';
import { cn } from '@/app/lib/utils/common';
import { Bars3Icon } from '@heroicons/react/24/outline';
import SidebarList from '../SidebarList';
import { useDashboardContext } from '@/app/context/DashboardContext';

export default function Sidebar() {
  const { isSidebarOpen, toggleSidebar } = useDashboardContext();

  return (
    <nav
      className={cn(
        `sidebar fixed z-50 hidden h-full min-h-screen w-[68px] bg-primary transition-all md:block`,
        {
          open: isSidebarOpen
        }
      )}
    >
      <div className="flex h-16 items-center justify-between gap-4 border-b border-gray-700 p-4">
        <span className="flex h-9 w-9 flex-shrink-0 cursor-pointer items-center justify-center text-slate-300">
          <Bars3Icon onClick={toggleSidebar} className="h-7 w-7" />
        </span>
        <Logo
          className={cn('rounded', {
            hidden: !isSidebarOpen
          })}
        />
      </div>

      <SidebarList />
    </nav>
  );
}
