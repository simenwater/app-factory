/**
 * @fileoverview 仓库 URL 输入组件，支持分析触发
 */

'use client';

import { useState } from 'react';
import { Search, Loader2, GitBranch } from 'lucide-react';
import { useAppStore } from '@/store/app-store';

/**
 * 仓库 URL 输入框及分析触发
 * @returns {JSX.Element}
 */
export default function RepoInput() {
  const {
    repoUrl,
    setRepoUrl,
    isAnalyzing,
    setIsAnalyzing,
    setAnalysis,
    setError,
    error,
  } = useAppStore();
  const [inputFocused, setInputFocused] = useState(false);

  /**
   * 提交分析请求
   * @param {React.FormEvent} e - 表单提交事件
   */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!repoUrl.trim() || isAnalyzing) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || '分析失败');
        return;
      }

      setAnalysis(data.data);
    } catch {
      setError('网络错误，请稍后重试');
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <div className="w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={`flex items-center overflow-hidden rounded-2xl border-2 bg-white shadow-lg transition-all dark:bg-gray-900 ${
            inputFocused
              ? 'border-violet-500 shadow-violet-100 dark:shadow-violet-900/20'
              : 'border-gray-200 dark:border-gray-700'
          }`}
        >
          <div className="flex items-center pl-4 text-gray-400">
            <GitBranch className="h-5 w-5" />
          </div>
          <input
            type="text"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            placeholder="输入 GitHub 仓库 URL，例如 https://github.com/vercel/next.js"
            className="flex-1 bg-transparent px-4 py-4 text-gray-900 outline-none placeholder:text-gray-400 dark:text-white dark:placeholder:text-gray-500"
            disabled={isAnalyzing}
          />
          <button
            type="submit"
            disabled={isAnalyzing || !repoUrl.trim()}
            className="m-2 flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-2.5 text-sm font-medium text-white transition-all hover:from-violet-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                分析中...
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                分析
              </>
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950/50 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        {[
          'vercel/next.js',
          'facebook/react',
          'microsoft/vscode',
          'tailwindlabs/tailwindcss',
        ].map((repo) => (
          <button
            key={repo}
            onClick={() => setRepoUrl(`https://github.com/${repo}`)}
            className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-600 transition-colors hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:border-violet-600 dark:hover:bg-violet-950 dark:hover:text-violet-300"
          >
            {repo}
          </button>
        ))}
      </div>
    </div>
  );
}
