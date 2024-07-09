import React from 'react';

interface Props {
  children: React.ReactNode;
}
export default function Wrapper({ children }: Props) {
  return (
    <div className="flex max-h-96 flex-col overflow-auto rounded-lg bg-white pt-2 shadow-md transition-all duration-200 ease-linear">
      {children}
    </div>
  );
}
