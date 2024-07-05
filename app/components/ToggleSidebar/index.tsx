'use client';

import { Bars3Icon } from '@heroicons/react/24/outline';
import React from 'react';

export default function ToggleSidebar() {
  return (
    <span className="flex h-9 w-9 flex-shrink-0 cursor-pointer items-center justify-center text-slate-300">
      <Bars3Icon className="h-7 w-7 text-primary" />
    </span>
  );
}
