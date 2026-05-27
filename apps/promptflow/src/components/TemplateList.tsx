'use client';

import { Search, Plus, Star, Copy, Trash2 } from 'lucide-react';
import { useTemplateStore } from '@/store/templateStore';
import { CATEGORIES, PLATFORMS } from '@/types';
import { copyToClipboard, formatForPlatform, truncate } from '@/lib/utils';

/** @description TemplateList 组件 Props */
interface TemplateListProps {
  onToast: (message: string, type?: 'success' | 'error') => void;
}

/**
 * @description 模板列表组件，展示筛选后的模板卡片
 * @param {TemplateListProps} props
 */
export function TemplateList({ onToast }: TemplateListProps) {
  const {
    filters,
    setFilter,
    getFilteredTemplates,
    selectTemplate,
    selectedTemplateId,
    addTemplate,
    deleteTemplate,
    toggleFavorite,
  } = useTemplateStore();

  const filtered = getFilteredTemplates();

  const handleCopy = async (e: React.MouseEvent, template: typeof filtered[0]) => {
    e.stopPropagation();
    const formatted = formatForPlatform(template.content, template.platform);
    const ok = await copyToClipboard(formatted);
    onToast(ok ? `已复制「${template.title}」到剪贴板` : '复制失败', ok ? 'success' : 'error');
  };

  const handleDelete = (e: React.MouseEvent, id: string, isBuiltIn: boolean) => {
    e.stopPropagation();
    if (isBuiltIn) {
      onToast('内置模板不可删除', 'error');
      return;
    }
    deleteTemplate(id);
    onToast('模板已删除');
  };

  const handleNew = () => {
    addTemplate({
      title: '新建模板',
      description: '在此添加模板描述',
      content: '# 在此编写你的提示词\n\n',
      category: 'custom',
      platform: 'generic',
      tags: [],
      isBuiltIn: false,
      isFavorite: false,
      isShared: false,
      author: '我',
    });
    onToast('已创建新模板');
  };

  return (
    <div
      className="flex w-80 flex-col border-r"
      style={{ borderColor: 'var(--border)', background: 'var(--bg-primary)' }}
    >
      {/* 搜索与筛选栏 */}
      <div className="space-y-2 border-b p-3" style={{ borderColor: 'var(--border)' }}>
        <div className="relative">
          <Search
            size={16}
            className="absolute left-2.5 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--text-tertiary)' }}
          />
          <input
            type="text"
            placeholder="搜索模板..."
            value={filters.search}
            onChange={(e) => setFilter({ search: e.target.value })}
            className="w-full rounded-lg border py-1.5 pl-8 pr-3 text-sm"
            style={{
              borderColor: 'var(--border)',
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
            }}
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filters.platform}
            onChange={(e) => setFilter({ platform: e.target.value as typeof filters.platform })}
            className="flex-1 rounded-md border px-2 py-1 text-xs"
            style={{
              borderColor: 'var(--border)',
              background: 'var(--bg-secondary)',
              color: 'var(--text-secondary)',
            }}
          >
            <option value="all">所有平台</option>
            {PLATFORMS.map((p) => (
              <option key={p.key} value={p.key}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 模板列表 */}
      <div className="flex-1 overflow-y-auto p-2">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12" style={{ color: 'var(--text-tertiary)' }}>
            <Search size={32} className="mb-2" />
            <p className="text-sm">没有找到匹配的模板</p>
          </div>
        ) : (
          filtered.map((template) => {
            const cat = CATEGORIES.find((c) => c.key === template.category);
            const isActive = template.id === selectedTemplateId;
            return (
              <button
                key={template.id}
                onClick={() => selectTemplate(template.id)}
                className="mb-1.5 w-full rounded-lg p-3 text-left transition-colors"
                style={{
                  background: isActive ? 'var(--accent-light)' : 'var(--bg-card)',
                  border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border)'}`,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = 'var(--bg-hover)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.background = 'var(--bg-card)';
                }}
              >
                <div className="mb-1 flex items-center gap-2">
                  <span
                    className="rounded px-1.5 py-0.5 text-xs"
                    style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
                  >
                    {cat?.label ?? '未分类'}
                  </span>
                  <span
                    className="rounded px-1.5 py-0.5 text-xs"
                    style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
                  >
                    {PLATFORMS.find((p) => p.key === template.platform)?.label ?? template.platform}
                  </span>
                  {template.isBuiltIn && (
                    <span className="rounded bg-green-50 px-1.5 py-0.5 text-xs text-green-600 dark:bg-green-900/30 dark:text-green-400">
                      内置
                    </span>
                  )}
                </div>
                <h3
                  className="mb-0.5 text-sm font-semibold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {template.title}
                </h3>
                <p className="mb-2 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  {truncate(template.description, 60)}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(template.id);
                    }}
                    className="rounded p-1 transition-colors"
                    style={{ color: template.isFavorite ? 'var(--warning)' : 'var(--text-tertiary)' }}
                    title={template.isFavorite ? '取消收藏' : '收藏'}
                  >
                    <Star size={14} fill={template.isFavorite ? 'currentColor' : 'none'} />
                  </button>
                  <button
                    onClick={(e) => handleCopy(e, template)}
                    className="rounded p-1 transition-colors"
                    style={{ color: 'var(--text-tertiary)' }}
                    title="一键复制"
                  >
                    <Copy size={14} />
                  </button>
                  {!template.isBuiltIn && (
                    <button
                      onClick={(e) => handleDelete(e, template.id, template.isBuiltIn)}
                      className="rounded p-1 transition-colors"
                      style={{ color: 'var(--text-tertiary)' }}
                      title="删除"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* 新建按钮 */}
      <div className="border-t p-3" style={{ borderColor: 'var(--border)' }}>
        <button
          onClick={handleNew}
          className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium text-white transition-colors"
          style={{ background: 'var(--accent)' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--accent-hover)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--accent)')}
        >
          <Plus size={16} />
          新建模板
        </button>
      </div>
    </div>
  );
}
