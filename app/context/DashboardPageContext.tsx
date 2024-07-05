'use client';

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useMemo,
  useState
} from 'react';

export interface DashboardProviderProps {
  children?: ReactNode;
}
export interface DashboardContextModel {
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: Dispatch<SetStateAction<boolean>>;
  isChatMobileSidebarOpen: boolean;
  setIsChatMobileSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

export const DashboardContext = createContext<DashboardContextModel>({
  isMobileSidebarOpen: false,
  setIsMobileSidebarOpen: () => {},
  isChatMobileSidebarOpen: false,
  setIsChatMobileSidebarOpen: () => {}
} as DashboardContextModel);

export const useDashboardContext = (): DashboardContextModel => {
  return useContext(DashboardContext);
};

export const DashboardProvider = ({ children }: DashboardProviderProps) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isChatMobileSidebarOpen, setIsChatMobileSidebarOpen] = useState(false);

  const values = useMemo(
    () => ({
      isMobileSidebarOpen,
      setIsMobileSidebarOpen,
      isChatMobileSidebarOpen,
      setIsChatMobileSidebarOpen
    }),
    [isMobileSidebarOpen, isChatMobileSidebarOpen]
  );

  return (
    <DashboardContext.Provider value={values}>
      {children}
    </DashboardContext.Provider>
  );
};
