"use client";

import { useEffect } from "react";
import { useStore } from "@/store/useStore";

/**
 * @description 主题提供组件，管理深色/浅色模式切换
 * @param {{ children: React.ReactNode }} props
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const darkMode = useStore((s) => s.settings.darkMode);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return <>{children}</>;
}
