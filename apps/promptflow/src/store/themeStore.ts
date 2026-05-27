import { create } from 'zustand';

/** @description 主题类型 */
export type Theme = 'light' | 'dark' | 'system';

/** @description 主题 Store 状态接口 */
interface ThemeState {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

/**
 * @description 解析系统主题
 * @returns {'light' | 'dark'} 实际主题
 */
function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * @description 根据设定计算实际主题
 * @param {Theme} theme - 设定的主题
 * @returns {'light' | 'dark'} 实际主题
 */
function resolveTheme(theme: Theme): 'light' | 'dark' {
  if (theme === 'system') return getSystemTheme();
  return theme;
}

/** @description 主题全局 Store */
export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'dark',
  resolvedTheme: 'dark',
  setTheme: (theme) => set({ theme, resolvedTheme: resolveTheme(theme) }),
}));
