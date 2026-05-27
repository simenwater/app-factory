'use client';

import { useState } from 'react';
import {
  Copy,
  Edit3,
  Save,
  X,
  Star,
  Share2,
  History,
  Download,
  Clipboard,
  Tag,
} from 'lucide-react';
import { useTemplateStore } from '@/store/templateStore';
import { CATEGORIES, PLATFORMS, type TemplateCategory, type AIPlatform } from '@/types';
import { copyToClipboard, formatForPlatform, formatDate, exportAsJson } from '@/lib/utils';
import { VersionHistory } from '@/components/VersionHistory';

/** @description TemplateDetail 组件 Props */
interface TemplateDetailProps {
  onToast: (message: string, type?: 'success' | 'error') => void;
}

/**
 * @description 模板详情视图，支持预览、编辑和版本管理
 * @param {TemplateDetailProps} props
 */
export function TemplateDetail({ onToast }: TemplateDetailProps) {
  const {
    getSelectedTemplate,
    isEditing,
    editingContent,
    setEditing,
    setEditingContent,
    updateTemplate,
    toggleFavorite,
    toggleShared,
    duplicateTemplate,
    saveVersion,
  } = useTemplateStore();

  const template = getSelectedTemplate();
  const [showVersions, setShowVersions] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCategory, setEditCategory] = useState<TemplateCategory>('custom');
  const [editPlatform, setEditPlatform] = useState<AIPlatform>('generic');
  const [editTags, setEditTags] = useState('');

  if (!template) return null;

  const handleStartEdit = () => {
    setEditTitle(template.title);
    setEditDescription(template.description);
    setEditCategory(template.category);
    setEditPlatform(template.platform);
    setEditTags(template.tags.join(', '));
    setEditing(true);
  };

  const handleSave = () => {
    saveVersion(template.id, '编辑保存');
    updateTemplate(template.id, {
      title: editTitle,
      description: editDescription,
      content: editingContent,
      category: editCategory,
      platform: editPlatform,
      tags: editTags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    });
    setEditing(false);
    onToast('模板已保存');
  };

  const handleCopy = async () => {
    const formatted = formatForPlatform(template.content, template.platform);
    const ok = await copyToClipboard(formatted);
    onToast(ok ? '已复制到剪贴板' : '复制失败', ok ? 'success' : 'error');
  };

  const handleCopyRaw = async () => {
    const ok = await copyToClipboard(template.content);
    onToast(ok ? '已复制原始内容' : '复制失败', ok ? 'success' : 'error');
  };

  const handleExport = () => {
    exportAsJson(template, `${template.title}.json`);
    onToast('模板已导出');
  };

  const handleDuplicate = () => {
    duplicateTemplate(template.id);
    onToast('模板已复制');
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      {/* 顶部操作栏 */}
      <div
        className="flex items-center justify-between border-b px-6 py-3"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="flex items-center gap-3">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-white"
                style={{ background: 'var(--success)' }}
              >
                <Save size={14} />
                保存
              </button>
              <button
                onClick={() => setEditing(false)}
                className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm"
                style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
              >
                <X size={14} />
                取消
              </button>
            </>
          ) : (
            <>
              {!template.isBuiltIn && (
                <button
                  onClick={handleStartEdit}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-white"
                  style={{ background: 'var(--accent)' }}
                >
                  <Edit3 size={14} />
                  编辑
                </button>
              )}
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm"
                style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
              >
                <Copy size={14} />
                一键复制（平台格式）
              </button>
              <button
                onClick={handleCopyRaw}
                className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm"
                style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
              >
                <Clipboard size={14} />
                复制原文
              </button>
            </>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => toggleFavorite(template.id)}
            className="rounded-lg p-2 transition-colors"
            style={{ color: template.isFavorite ? 'var(--warning)' : 'var(--text-tertiary)' }}
            title={template.isFavorite ? '取消收藏' : '收藏'}
          >
            <Star size={16} fill={template.isFavorite ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={() => toggleShared(template.id)}
            className="rounded-lg p-2 transition-colors"
            style={{ color: template.isShared ? 'var(--accent)' : 'var(--text-tertiary)' }}
            title={template.isShared ? '取消共享' : '共享给团队'}
          >
            <Share2 size={16} />
          </button>
          <button
            onClick={() => setShowVersions(!showVersions)}
            className="rounded-lg p-2 transition-colors"
            style={{ color: showVersions ? 'var(--accent)' : 'var(--text-tertiary)' }}
            title="版本历史"
          >
            <History size={16} />
          </button>
          <button
            onClick={handleExport}
            className="rounded-lg p-2 transition-colors"
            style={{ color: 'var(--text-tertiary)' }}
            title="导出"
          >
            <Download size={16} />
          </button>
          <button
            onClick={handleDuplicate}
            className="rounded-lg p-2 transition-colors"
            style={{ color: 'var(--text-tertiary)' }}
            title="复制为新模板"
          >
            <Copy size={16} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* 主内容区 */}
        <div className="flex-1 overflow-y-auto p-6">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                  标题
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                  style={{
                    borderColor: 'var(--border)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                  描述
                </label>
                <input
                  type="text"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                  style={{
                    borderColor: 'var(--border)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="mb-1 block text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                    分类
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as TemplateCategory)}
                    className="w-full rounded-lg border px-3 py-2 text-sm"
                    style={{
                      borderColor: 'var(--border)',
                      background: 'var(--bg-secondary)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.key} value={c.key}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="mb-1 block text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                    平台
                  </label>
                  <select
                    value={editPlatform}
                    onChange={(e) => setEditPlatform(e.target.value as AIPlatform)}
                    className="w-full rounded-lg border px-3 py-2 text-sm"
                    style={{
                      borderColor: 'var(--border)',
                      background: 'var(--bg-secondary)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {PLATFORMS.map((p) => (
                      <option key={p.key} value={p.key}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1 flex items-center gap-1 text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                  <Tag size={12} />
                  标签（逗号分隔）
                </label>
                <input
                  type="text"
                  value={editTags}
                  onChange={(e) => setEditTags(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                  style={{
                    borderColor: 'var(--border)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                  }}
                  placeholder="例：typescript, react, 编码规范"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                  内容
                </label>
                <textarea
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                  className="h-96 w-full resize-none rounded-lg border p-4 font-mono text-sm leading-relaxed"
                  style={{
                    borderColor: 'var(--border)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <h2 className="mb-1 text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  {template.title}
                </h2>
                <p className="mb-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {template.description}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                    style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
                  >
                    {CATEGORIES.find((c) => c.key === template.category)?.label}
                  </span>
                  <span
                    className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                    style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
                  >
                    {PLATFORMS.find((p) => p.key === template.platform)?.label}
                  </span>
                  {template.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full px-2 py-0.5 text-xs"
                      style={{ background: 'var(--bg-tertiary)', color: 'var(--text-tertiary)' }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <p className="mt-2 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  更新于 {formatDate(template.updatedAt)} · 作者: {template.author}
                </p>
              </div>

              <div
                className="rounded-lg border p-5 font-mono text-sm leading-relaxed whitespace-pre-wrap"
                style={{
                  borderColor: 'var(--border)',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                }}
              >
                {template.content}
              </div>
            </div>
          )}
        </div>

        {/* 版本历史侧栏 */}
        {showVersions && (
          <VersionHistory
            templateId={template.id}
            versions={template.versions}
            onClose={() => setShowVersions(false)}
            onToast={onToast}
          />
        )}
      </div>
    </div>
  );
}
