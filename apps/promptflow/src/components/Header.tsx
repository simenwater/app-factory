'use client';

import { Zap, Crown, Users, Sun, Moon, Monitor } from 'lucide-react';
import { useThemeStore, type Theme } from '@/store/themeStore';

/** @description Header 组件 Props */
interface HeaderProps {
  onShowPricing: () => void;
  onShowTeam: () => void;
}

/**
 * @description 顶部导航栏组件
 * @param {HeaderProps} props
 */
export function Header({ onShowPricing, onShowTeam }: HeaderProps) {
  const { theme, setTheme } = useThemeStore();

  const themeOptions: { value: Theme; icon: React.ReactNode; label: string }[] = [
    { value: 'light', icon: <Sun size={14} />, label: '浅色' },
    { value: 'dark', icon: <Moon size={14} />, label: '深色' },
    { value: 'system', icon: <Monitor size={14} />, label: '系统' },
  ];

  return (
    <header
      className="flex h-14 items-center justify-between border-b px-4"
      style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
    >
      <div className="flex items-center gap-2">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{ background: 'var(--accent)' }}
        >
          <Zap size={18} className="text-white" />
        </div>
        <h1 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
          PromptFlow
        </h1>
        <span
          className="rounded-full px-2 py-0.5 text-xs font-medium"
          style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
        >
          Beta
        </span>
      </div>

      <div className="flex items-center gap-2">
        {/* 主题切换 */}
        <div
          className="flex items-center gap-0.5 rounded-lg p-0.5"
          style={{ background: 'var(--bg-tertiary)' }}
        >
          {themeOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setTheme(opt.value)}
              className="flex items-center gap-1 rounded-md px-2 py-1.5 text-xs transition-colors"
              style={{
                background: theme === opt.value ? 'var(--bg-card)' : 'transparent',
                color: theme === opt.value ? 'var(--text-primary)' : 'var(--text-tertiary)',
                boxShadow: theme === opt.value ? 'var(--shadow)' : 'none',
              }}
              title={opt.label}
            >
              {opt.icon}
            </button>
          ))}
        </div>

        {/* 团队 */}
        <button
          onClick={onShowTeam}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors"
          style={{ color: 'var(--text-secondary)' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-hover)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <Users size={16} />
          <span>团队</span>
        </button>

        {/* 升级 */}
        <button
          onClick={onShowPricing}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-white transition-colors"
          style={{ background: 'var(--accent)' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--accent-hover)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--accent)')}
        >
          <Crown size={16} />
          <span>升级 Pro</span>
        </button>
      </div>
    </header>
  );
}
