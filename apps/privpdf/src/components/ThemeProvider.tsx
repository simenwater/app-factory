"use client";

import { useEffect } from "react";
import { useStore } from "@/store/useStore";

/**
 * @description 主题提供组件，根据用户偏好和系统设置切换深色/浅色模式
 */
export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useStore((s) => s.theme);

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
