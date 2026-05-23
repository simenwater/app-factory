"use client";

/**
 * @fileoverview 主题提供者组件
 * 支持明暗模式切换，响应系统偏好。
 */

import { useEffect } from "react";
import { useStore } from "@/store/useStore";

/**
 * @description 主题提供者，管理深色/浅色模式
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useStore((s) => s.settings.theme);

  useEffect(() => {
    const root = document.documentElement;

    if (theme === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      root.classList.toggle("dark", mq.matches);

      const handler = (e: MediaQueryListEvent) => {
        root.classList.toggle("dark", e.matches);
      };
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }

    root.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return <>{children}</>;
}
