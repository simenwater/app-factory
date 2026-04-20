'use client';

import { X, FileCode, FileText, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { exportNote, downloadFile, formatDuration } from '@/lib/export';

/**
 * @description 笔记详情弹窗组件
 */
export default function NoteDetail() {
  const { currentNote, setCurrentNote } = useStore();
  const [copied, setCopied] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);

  if (!currentNote) return null;

  /**
   * @description 复制内容到剪贴板
   */
  const handleCopy = async () => {
    await navigator.clipboard.writeText(currentNote.rewrittenText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col animate-fade-in">
        {/* 头部 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <div>
            <h2 className="text-lg font-bold">{currentNote.title}</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {new Date(currentNote.createdAt).toLocaleString('zh-CN')} · {formatDuration(currentNote.duration)}
            </p>
          </div>
          <button
            onClick={() => setCurrentNote(null)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 切换标签 */}
        <div className="flex border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setShowOriginal(false)}
            className={`flex-1 py-2.5 text-sm font-medium text-center transition-colors ${
              !showOriginal
                ? 'text-violet-600 border-b-2 border-violet-600'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            整理后
          </button>
          <button
            onClick={() => setShowOriginal(true)}
            className={`flex-1 py-2.5 text-sm font-medium text-center transition-colors ${
              showOriginal
                ? 'text-violet-600 border-b-2 border-violet-600'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            原始转录
          </button>
        </div>

        {/* 内容 */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
            {showOriginal ? currentNote.originalText : currentNote.rewrittenText}
          </div>
        </div>

        {/* 底部操作栏 */}
        <div className="flex items-center gap-2 p-4 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm bg-violet-600 text-white hover:bg-violet-700 transition-colors"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? '已复制' : '复制'}
          </button>
          <button
            onClick={() => {
              const content = exportNote(currentNote, 'markdown');
              downloadFile(content, `${currentNote.title}.md`, 'text/markdown;charset=utf-8');
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <FileCode className="w-4 h-4" />
            导出 MD
          </button>
          <button
            onClick={() => {
              const content = exportNote(currentNote, 'text');
              downloadFile(content, `${currentNote.title}.txt`, 'text/plain;charset=utf-8');
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <FileText className="w-4 h-4" />
            导出 TXT
          </button>
        </div>
      </div>
    </div>
  );
}
