import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const SidebarContext = createContext(null);

export function SidebarProvider({ children }) {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((o) => !o), []);
  const close = useCallback(() => setOpen(false), []);
  const value = useMemo(() => ({ open, toggle, close }), [open, toggle, close]);
  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error('useSidebar must be used within SidebarProvider');
  return ctx;
}
