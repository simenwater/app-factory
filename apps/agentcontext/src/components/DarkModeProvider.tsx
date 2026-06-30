/**
 * @fileoverview 深色模式全局 Provider
 */

'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/app-store';

/**
 * 监听 store 中的 darkMode 状态并同步到 <html>
 * @param {{ children: React.ReactNode }} props
 * @returns {JSX.Element}
 */
export function DarkModeProvider({ children }: { children: React.ReactNode }) {
  const darkMode = useAppStore((s) => s.darkMode);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return <>{children}</>;
}
