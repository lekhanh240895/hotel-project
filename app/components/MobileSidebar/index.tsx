'use client';

import SidebarList from '../SidebarList';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';

type Props = {
  children: React.ReactNode;
};
export default function MobileSidebar({ children }: Props) {
  return (
    <Sheet>
      <SheetTrigger>{children}</SheetTrigger>
      <SheetContent
        side="left"
        className="inset-y-0 flex h-auto w-[300px] flex-col border-r border-primary bg-primary p-0 text-slate-200"
      >
        <SidebarList />
      </SheetContent>
    </Sheet>
  );
}
