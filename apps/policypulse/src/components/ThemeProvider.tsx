"use client";

import { useEffect } from "react";
import { useStore } from "@/store/useStore";

/**
 * @component ThemeProvider
 * 深色模式主题管理组件，根据 store 中的设置同步 document class
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const darkMode = useStore((s) => s.settings.darkMode);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return <>{children}</>;
}
