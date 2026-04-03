"use client";

/**
 * @fileoverview 主题提供组件，根据 store 中的 theme 状态切换 dark/light 类名
 */

import { useEffect } from "react";
import { useStore } from "@/store/useStore";

/**
 * 主题提供者组件
 * @param {{ children: React.ReactNode }} props
 * @returns {React.ReactElement}
 */
export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return <>{children}</>;
}
