'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

/**
 * @description 主题提供者 - 管理深色模式状态
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const darkMode = useAppStore((s) => s.darkMode);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return <>{children}</>;
}
