"use client";

import { useEffect } from "react";
import { useStore } from "@/store/useStore";

/**
 * @description 主题提供者组件，根据用户设置切换深色/浅色模式
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const darkMode = useStore((s) => s.settings.darkMode);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return <>{children}</>;
}
