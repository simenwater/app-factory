"use client";

import { useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { useStore } from "@/store/useStore";

/**
 * 深色模式切换按钮
 * @returns ThemeToggle 组件
 */
export default function ThemeToggle() {
  const { darkMode, toggleDarkMode } = useStore();

  useEffect(() => {
    const stored = localStorage.getItem("contextkit_dark_mode");
    if (stored !== null) {
      const isDark = JSON.parse(stored);
      if (isDark !== darkMode) {
        toggleDarkMode();
      }
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      if (!darkMode) toggleDarkMode();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-lg transition-colors"
      style={{
        backgroundColor: "var(--bg-tertiary)",
        color: "var(--text-secondary)",
      }}
      aria-label={darkMode ? "切换到浅色模式" : "切换到深色模式"}
    >
      {darkMode ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
