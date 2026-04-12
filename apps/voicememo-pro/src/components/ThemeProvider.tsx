"use client";

import { useEffect } from "react";
import { useStore } from "@/store/useStore";

/**
 * @component ThemeProvider
 * @description 主题切换提供者，同步深色模式到 document
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const darkMode = useStore((s) => s.settings.darkMode);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return <>{children}</>;
}
