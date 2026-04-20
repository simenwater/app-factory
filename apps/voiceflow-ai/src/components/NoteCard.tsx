'use client';

import { Trash2, FileText, FileCode, Eye } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { exportNote, downloadFile, formatDuration } from '@/lib/export';
import type { VoiceNote } from '@/types';

/**
 * @description 笔记卡片组件
 * @param note - 语音笔记数据
 */
export default function NoteCard({ note }: { note: VoiceNote }) {
  const { deleteNote, setCurrentNote } = useStore();

  /**
   * @description 导出为 Markdown
   */
  const handleExportMarkdown = () => {
    const content = exportNote(note, 'markdown');
    downloadFile(content, `${note.title}.md`, 'text/markdown;charset=utf-8');
  };

  /**
   * @description 导出为纯文本
   */
  const handleExportText = () => {
    const content = exportNote(note, 'text');
    downloadFile(content, `${note.title}.txt`, 'text/plain;charset=utf-8');
  };

  const styleLabels: Record<string, string> = {
    summary: '摘要',
    formal: '正式',
    bullet: '要点',
    blog: '博客',
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 hover:shadow-md transition-shadow animate-fade-in">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{note.title}</h3>
          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-500">
            <span>{new Date(note.createdAt).toLocaleDateString('zh-CN')}</span>
            <span>·</span>
            <span>{formatDuration(note.duration)}</span>
            <span>·</span>
            <span className="px-1.5 py-0.5 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded">
              {styleLabels[note.style] || note.style}
            </span>
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-3">
        {note.rewrittenText.substring(0, 200)}
        {note.rewrittenText.length > 200 && '...'}
      </p>

      <div className="flex items-center gap-1 pt-2 border-t border-gray-100 dark:border-gray-800">
        <button
          onClick={() => setCurrentNote(note)}
          className="flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors"
          title="查看详情"
        >
          <Eye className="w-3.5 h-3.5" />
          查看
        </button>
        <button
          onClick={handleExportMarkdown}
          className="flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title="导出 Markdown"
        >
          <FileCode className="w-3.5 h-3.5" />
          MD
        </button>
        <button
          onClick={handleExportText}
          className="flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title="导出文本"
        >
          <FileText className="w-3.5 h-3.5" />
          TXT
        </button>
        <div className="flex-1" />
        <button
          onClick={() => deleteNote(note.id)}
          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          title="删除"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
