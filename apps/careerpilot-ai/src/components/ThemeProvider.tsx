/**
 * @fileoverview 主题提供者组件 — 管理深色/浅色模式
 */
"use client";

import { useEffect } from "react";
import { useStore } from "@/store/useStore";

/**
 * @param props - 子组件
 * @returns 根据 darkMode 状态切换 HTML class 的包裹组件
 */
export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const darkMode = useStore((s) => s.darkMode);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return <>{children}</>;
}
