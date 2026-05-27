'use client';

import {
  Paintbrush,
  FileText,
  FolderOpen,
  Bug,
  Eye,
  BookOpen,
  TestTube,
  Sparkles,
  LayoutGrid,
  Star,
  Share2,
} from 'lucide-react';
import { CATEGORIES, type TemplateCategory } from '@/types';
import { useTemplateStore } from '@/store/templateStore';
import type { ComponentType } from 'react';

/** @description 分类图标映射 */
const ICON_MAP: Record<string, ComponentType<{ size?: number }>> = {
  Paintbrush,
  FileText,
  FolderOpen,
  Bug,
  Eye,
  BookOpen,
  TestTube,
  Sparkles,
};

/**
 * @description 侧边栏导航组件，包含分类筛选与快捷操作
 */
export function Sidebar() {
  const { filters, setFilter, templates } = useTemplateStore();

  const getCategoryCount = (key: TemplateCategory) =>
    templates.filter((t) => t.category === key).length;

  const favoritesCount = templates.filter((t) => t.isFavorite).length;
  const sharedCount = templates.filter((t) => t.isShared).length;

  return (
    <aside
      className="flex w-56 flex-col border-r"
      style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
    >
      <div className="flex-1 overflow-y-auto p-3">
        {/* 快捷入口 */}
        <div className="mb-4">
          <h3
            className="mb-1.5 px-2 text-xs font-semibold uppercase tracking-wider"
            style={{ color: 'var(--text-tertiary)' }}
          >
            视图
          </h3>
          <SidebarItem
            icon={<LayoutGrid size={16} />}
            label="全部模板"
            count={templates.length}
            active={filters.category === 'all' && !filters.showFavoritesOnly && !filters.showSharedOnly}
            onClick={() => setFilter({ category: 'all', showFavoritesOnly: false, showSharedOnly: false })}
          />
          <SidebarItem
            icon={<Star size={16} />}
            label="收藏"
            count={favoritesCount}
            active={filters.showFavoritesOnly}
            onClick={() =>
              setFilter({
                showFavoritesOnly: !filters.showFavoritesOnly,
                showSharedOnly: false,
                category: 'all',
              })
            }
          />
          <SidebarItem
            icon={<Share2 size={16} />}
            label="已共享"
            count={sharedCount}
            active={filters.showSharedOnly}
            onClick={() =>
              setFilter({
                showSharedOnly: !filters.showSharedOnly,
                showFavoritesOnly: false,
                category: 'all',
              })
            }
          />
        </div>

        {/* 分类 */}
        <div>
          <h3
            className="mb-1.5 px-2 text-xs font-semibold uppercase tracking-wider"
            style={{ color: 'var(--text-tertiary)' }}
          >
            分类
          </h3>
          {CATEGORIES.map((cat) => {
            const IconComp = ICON_MAP[cat.icon] ?? Sparkles;
            return (
              <SidebarItem
                key={cat.key}
                icon={<IconComp size={16} />}
                label={cat.label}
                count={getCategoryCount(cat.key)}
                active={filters.category === cat.key}
                onClick={() =>
                  setFilter({
                    category: filters.category === cat.key ? 'all' : cat.key,
                    showFavoritesOnly: false,
                    showSharedOnly: false,
                  })
                }
              />
            );
          })}
        </div>
      </div>
    </aside>
  );
}

/** @description 侧边栏条目 Props */
interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}

/**
 * @description 侧边栏单个条目组件
 * @param {SidebarItemProps} props
 */
function SidebarItem({ icon, label, count, active, onClick }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors"
      style={{
        background: active ? 'var(--accent-light)' : 'transparent',
        color: active ? 'var(--accent)' : 'var(--text-secondary)',
        fontWeight: active ? 600 : 400,
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.background = 'var(--bg-hover)';
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.background = 'transparent';
      }}
    >
      {icon}
      <span className="flex-1 text-left">{label}</span>
      <span
        className="min-w-[20px] rounded-full px-1.5 text-center text-xs"
        style={{
          background: active ? 'var(--accent)' : 'var(--bg-tertiary)',
          color: active ? 'white' : 'var(--text-tertiary)',
        }}
      >
        {count}
      </span>
    </button>
  );
}
