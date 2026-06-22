"use client";

/**
 * @fileoverview 主题供应组件 — 根据 store 设置切换深色/浅色模式
 */

import { useEffect } from "react";
import { useStore } from "@/store/useStore";

/**
 * @component ThemeProvider
 * @description 监听 darkMode 状态，切换 document 的 dark class
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const darkMode = useStore((s) => s.settings.darkMode);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return <>{children}</>;
}
