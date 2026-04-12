"use client";

import { useStore } from "@/store/useStore";
import { Sun, Moon } from "lucide-react";

/**
 * @component ThemeToggle
 * @description 深色/浅色模式切换按钮
 */
export function ThemeToggle() {
  const darkMode = useStore((s) => s.settings.darkMode);
  const toggleDarkMode = useStore((s) => s.toggleDarkMode);

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      aria-label={darkMode ? "切换为浅色模式" : "切换为深色模式"}
    >
      {darkMode ? (
        <Sun className="w-5 h-5 text-amber-400" />
      ) : (
        <Moon className="w-5 h-5 text-slate-600" />
      )}
    </button>
  );
}
