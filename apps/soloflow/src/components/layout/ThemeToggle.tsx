"use client";

/**
 * @description 深色/浅色模式切换按钮
 */

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-muted transition-colors hover:text-text dark:text-text-muted-dark dark:hover:text-text-dark"
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      {theme === "dark" ? "浅色模式" : "深色模式"}
    </button>
  );
}
