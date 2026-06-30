/**
 * @fileoverview 生成的配置文件预览及下载组件
 */

'use client';

import { useState } from 'react';
import { Copy, Download, Check, FileText, RefreshCw } from 'lucide-react';
import type { GeneratedConfig } from '@/types';

/**
 * @param {{ configs: GeneratedConfig[]; onSync?: () => void; syncing?: boolean }} props
 * @returns {JSX.Element}
 */
export default function ConfigPreview({
  configs,
  onSync,
  syncing,
}: {
  configs: GeneratedConfig[];
  onSync?: () => void;
  syncing?: boolean;
}) {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  if (configs.length === 0) return null;

  const activeConfig = configs[activeTab];

  /**
   * 复制内容到剪贴板
   */
  async function handleCopy() {
    await navigator.clipboard.writeText(activeConfig.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  /**
   * 下载配置文件
   */
  function handleDownload() {
    const blob = new Blob([activeConfig.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeConfig.filename.replace(/\//g, '_');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * 下载所有配置文件
   */
  function handleDownloadAll() {
    configs.forEach((config) => {
      const blob = new Blob([config.content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = config.filename.replace(/\//g, '_');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-violet-500" />
          <h3 className="font-semibold text-gray-900 dark:text-white">
            生成结果
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {onSync && (
            <button
              onClick={onSync}
              disabled={syncing}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${syncing ? 'animate-spin' : ''}`} />
              同步
            </button>
          )}
          {configs.length > 1 && (
            <button
              onClick={handleDownloadAll}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              <Download className="h-3.5 w-3.5" />
              全部下载
            </button>
          )}
        </div>
      </div>

      {configs.length > 1 && (
        <div className="flex border-b border-gray-200 dark:border-gray-800">
          {configs.map((config, idx) => (
            <button
              key={config.id}
              onClick={() => setActiveTab(idx)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors ${
                idx === activeTab
                  ? 'border-b-2 border-violet-500 text-violet-600 dark:text-violet-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              {config.filename}
            </button>
          ))}
        </div>
      )}

      <div className="relative">
        <div className="absolute right-4 top-4 flex gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-lg bg-gray-800/80 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-gray-700"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-green-400" />
                已复制
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                复制
              </>
            )}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 rounded-lg bg-gray-800/80 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-gray-700"
          >
            <Download className="h-3.5 w-3.5" />
            下载
          </button>
        </div>
        <pre className="max-h-[500px] overflow-auto p-6 text-sm leading-relaxed text-gray-800 dark:text-gray-200">
          <code>{activeConfig.content}</code>
        </pre>
      </div>

      <div className="border-t border-gray-200 px-6 py-3 dark:border-gray-800">
        <p className="text-xs text-gray-400 dark:text-gray-500">
          文件名: <code className="text-violet-500">{activeConfig.filename}</code>
          {' · '}
          标准: <code className="text-violet-500">{activeConfig.standard}</code>
          {' · '}
          生成于: {new Date(activeConfig.createdAt).toLocaleString('zh-CN')}
        </p>
      </div>
    </div>
  );
}
