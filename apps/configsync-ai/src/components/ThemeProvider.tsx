"use client";

/**
 * @fileoverview 主题切换组件
 */

import { useEffect } from "react";
import { useStore } from "@/store/useStore";

/**
 * 主题提供者组件，管理明暗模式
 * @param props - 子组件
 * @returns JSX 元素
 */
export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useStore((s) => s.settings.theme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  return <>{children}</>;
}
