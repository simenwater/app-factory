"use client";

import { Moon, Sun } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useEffect } from "react";

/**
 * @description 深色模式切换按钮
 */
export function ThemeToggle() {
  const { darkMode, toggleDarkMode } = useStore();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-lg transition-colors hover:bg-[var(--secondary)]"
      aria-label="Toggle dark mode"
    >
      {darkMode ? (
        <Sun className="w-5 h-5 text-[var(--foreground)]" />
      ) : (
        <Moon className="w-5 h-5 text-[var(--foreground)]" />
      )}
    </button>
  );
}
