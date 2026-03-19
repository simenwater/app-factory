"use client";

import { Sun, Moon } from "lucide-react";
import { useStore } from "@/store/useStore";

/**
 * @component ThemeToggle
 * 深色模式切换按钮
 */
export function ThemeToggle() {
  const darkMode = useStore((s) => s.settings.darkMode);
  const toggleDarkMode = useStore((s) => s.toggleDarkMode);

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label={darkMode ? "切换到浅色模式" : "切换到深色模式"}
    >
      {darkMode ? (
        <Sun className="w-5 h-5 text-amber-400" />
      ) : (
        <Moon className="w-5 h-5 text-slate-600" />
      )}
    </button>
  );
}
