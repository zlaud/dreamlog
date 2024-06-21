"use client";
import { createContext, useContext, useState, ReactNode } from "react";

const SidebarContext = createContext<{
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}>({
  isSidebarOpen: false,
  toggleSidebar: () => "",
});

interface SidebarProviderProps {
  children: ReactNode;
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({
  children,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  return useContext(SidebarContext);
};
