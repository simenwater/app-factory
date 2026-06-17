"use client";

/**
 * @fileoverview 主题提供者组件，管理深色/浅色模式
 */

import { useEffect } from "react";
import { useAppStore } from "@/store";

/**
 * ThemeProvider - 监听 darkMode 状态并应用到 document
 * @param props.children - 子组件
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const darkMode = useAppStore((s) => s.darkMode);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return <>{children}</>;
}
