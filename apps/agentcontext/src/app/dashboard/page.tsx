/**
 * @fileoverview 工作台页面 - 仓库分析与配置生成的核心交互界面
 */

'use client';

import { useCallback } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import RepoInput from '@/components/RepoInput';
import AnalysisView from '@/components/AnalysisView';
import StandardSelector from '@/components/StandardSelector';
import ConfigPreview from '@/components/ConfigPreview';
import { useAppStore } from '@/store/app-store';

/**
 * 工作台页面
 * @returns {JSX.Element}
 */
export default function DashboardPage() {
  const {
    analysis,
    configs,
    selectedStandards,
    isGenerating,
    setIsGenerating,
    setConfigs,
    setError,
    error,
    customInstructions,
    setCustomInstructions,
  } = useAppStore();

  /**
   * 触发配置文件生成
   */
  const handleGenerate = useCallback(async () => {
    if (!analysis || selectedStandards.length === 0) return;

    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          analysis,
          standards: selectedStandards,
          customInstructions: customInstructions || undefined,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.error || '生成失败');
        return;
      }

      setConfigs(data.data);
    } catch {
      setError('网络错误，请稍后重试');
    } finally {
      setIsGenerating(false);
    }
  }, [analysis, selectedStandards, customInstructions, setIsGenerating, setError, setConfigs]);

  /**
   * 同步配置到其他工具标准
   */
  const handleSync = useCallback(async () => {
    if (!analysis) return;

    setIsGenerating(true);
    try {
      const res = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          analysis,
          targetStandards: selectedStandards,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setConfigs(data.data);
      }
    } catch {
      setError('同步失败');
    } finally {
      setIsGenerating(false);
    }
  }, [analysis, selectedStandards, setIsGenerating, setConfigs, setError]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          工作台
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          输入 GitHub 仓库地址，开始生成 AI 代理配置文件
        </p>
      </div>

      {/* Step 1: 输入仓库 */}
      <section className="mb-10">
        <div className="mb-4 flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-600 dark:bg-violet-900 dark:text-violet-300">
            1
          </span>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            连接仓库
          </h2>
        </div>
        <RepoInput />
      </section>

      {/* Step 2: 分析结果 */}
      {analysis && (
        <section className="mb-10">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-600 dark:bg-violet-900 dark:text-violet-300">
              2
            </span>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              分析结果
            </h2>
          </div>
          <AnalysisView analysis={analysis} />
        </section>
      )}

      {/* Step 3: 选择标准并生成 */}
      {analysis && (
        <section className="mb-10">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-600 dark:bg-violet-900 dark:text-violet-300">
              3
            </span>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              生成配置
            </h2>
          </div>

          <div className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <StandardSelector />

            <div>
              <label
                htmlFor="custom-instructions"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                自定义指令（可选）
              </label>
              <textarea
                id="custom-instructions"
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder="例如：请特别强调代码风格规范和 API 约定..."
                rows={3}
                className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-900 outline-none transition-colors focus:border-violet-500 focus:bg-white dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-violet-400 dark:focus:bg-gray-900"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || selectedStandards.length === 0}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3.5 text-base font-semibold text-white shadow-md transition-all hover:from-violet-700 hover:to-indigo-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  生成配置文件
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950/50 dark:text-red-400">
              {error}
            </div>
          )}
        </section>
      )}

      {/* Step 4: 预览结果 */}
      {configs.length > 0 && (
        <section>
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-600 dark:bg-violet-900 dark:text-violet-300">
              4
            </span>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              预览与下载
            </h2>
          </div>
          <ConfigPreview
            configs={configs}
            onSync={handleSync}
            syncing={isGenerating}
          />
        </section>
      )}
    </div>
  );
}
