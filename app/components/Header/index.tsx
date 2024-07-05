'use client';

import {
  Bars3Icon,
  BellIcon,
  ChevronDownIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import MyMenu from '../MyMenu';
import Logo from '../Logo';
import { useUser } from '@/app/lib/hooks/useUser';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useDashboardContext } from '@/app/context/DashboardPageContext';

export default function Header() {
  const { user } = useUser();
  const { setIsMobileSidebarOpen, setIsChatMobileSidebarOpen } =
    useDashboardContext();
  return (
    <header className="header z-1 fixed left-0 right-0 top-0 z-10 flex items-center justify-between border-b bg-white px-4 py-[10px] transition-all md:left-[68px] md:px-10">
      <h1 className="hidden text-lg font-bold md:block">Dashboard</h1>

      <div className="flex items-center justify-between gap-4 md:hidden">
        <span className="flex h-9 w-9 flex-shrink-0 cursor-pointer items-center justify-center text-slate-300">
          <Bars3Icon
            onClick={() => {
              setIsMobileSidebarOpen(true);
              setIsChatMobileSidebarOpen(true);
            }}
            className="h-7 w-7 text-primary"
          />
        </span>
        <Logo />
      </div>

      <div className="flex items-center">
        <div className="flex items-stretch gap-4">
          <Avatar className="relative h-8 w-8 bg-red-1 text-white md:h-12 md:w-12">
            <AvatarImage src={user?.image} />
            <AvatarFallback className="bg-red-1 p-2 text-white md:p-3">
              <UserIcon />
            </AvatarFallback>
          </Avatar>
          <div className="hidden flex-col justify-between md:flex">
            <h1 className="text-sm font-semibold text-primary">
              Administrator
            </h1>
            <div className="flex items-center gap-4">
              <h2 className="font-semibold ">{user?.full_name}</h2>
              <MyMenu>
                <ChevronDownIcon className="h-3 w-3 cursor-pointer" />
              </MyMenu>
            </div>
          </div>
        </div>
        <div className="relative ml-2 h-8 w-8 md:ml-5">
          <BellIcon className="cursor-pointer" />
          <div className="absolute right-0 top-0 h-3 w-3 rounded-full bg-red-1" />
        </div>
      </div>
    </header>
  );
}
