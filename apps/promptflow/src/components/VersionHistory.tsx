'use client';

import { X, RotateCcw } from 'lucide-react';
import type { VersionEntry } from '@/types';
import { useTemplateStore } from '@/store/templateStore';
import { formatDate } from '@/lib/utils';

/** @description VersionHistory 组件 Props */
interface VersionHistoryProps {
  templateId: string;
  versions: VersionEntry[];
  onClose: () => void;
  onToast: (message: string, type?: 'success' | 'error') => void;
}

/**
 * @description 版本历史侧边面板，展示模板的历史修改记录并支持回滚
 * @param {VersionHistoryProps} props
 */
export function VersionHistory({ templateId, versions, onClose, onToast }: VersionHistoryProps) {
  const { restoreVersion } = useTemplateStore();

  const handleRestore = (versionId: string) => {
    restoreVersion(templateId, versionId);
    onToast('已恢复到该版本');
  };

  return (
    <div
      className="w-72 overflow-y-auto border-l"
      style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
    >
      <div className="flex items-center justify-between border-b p-3" style={{ borderColor: 'var(--border)' }}>
        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          版本历史
        </h3>
        <button onClick={onClose} className="rounded p-1" style={{ color: 'var(--text-tertiary)' }}>
          <X size={16} />
        </button>
      </div>

      {versions.length === 0 ? (
        <div className="p-4 text-center text-sm" style={{ color: 'var(--text-tertiary)' }}>
          暂无版本历史
          <p className="mt-1 text-xs">编辑并保存后将自动创建版本</p>
        </div>
      ) : (
        <div className="p-2">
          {versions.map((version) => (
            <div
              key={version.id}
              className="mb-2 rounded-lg border p-3"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}
            >
              <p className="mb-1 text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                {version.message}
              </p>
              <p className="mb-2 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                {formatDate(version.createdAt)} · {version.author}
              </p>
              <button
                onClick={() => handleRestore(version.id)}
                className="flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors"
                style={{ color: 'var(--accent)' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--accent-light)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <RotateCcw size={12} />
                恢复此版本
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
