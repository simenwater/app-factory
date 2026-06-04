'use client';

/**
 * @fileoverview 主题提供者组件
 * 支持亮色/暗色/跟随系统三种模式
 */

import { useEffect } from 'react';
import { useRecordingStore } from '@/store/recordingStore';

/**
 * @description 主题提供者，根据用户设置应用暗色模式
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useRecordingStore((s) => s.settings.theme);

  useEffect(() => {
    const root = document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = (e: MediaQueryListEvent) => {
        root.classList.toggle('dark', e.matches);
      };
      root.classList.toggle('dark', mq.matches);
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
  }, [theme]);

  return <>{children}</>;
}
