'use client';

import { useState } from 'react';
import { Clock } from 'lucide-react';
import { TextInput } from '@/components/TextInput';
import { TimelineRenderer } from '@/components/TimelineRenderer';
import { SubscriptionBanner } from '@/components/SubscriptionBanner';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useStore } from '@/store/useStore';
import { generateTimeline } from '@/lib/llm';
import type { Timeline } from '@/types';

/**
 * 主页面组件
 */
export default function HomePage() {
  const { user, currentTimeline, addTimeline, incrementGenerations } = useStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canGenerate = user.subscription === 'pro' || user.generationsUsed < user.generationsLimit;

  const handleGenerate = async (text: string) => {
    if (!canGenerate) {
      setError('已达到免费版生成次数上限，请升级到 Pro 版本');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const result = await generateTimeline(text);

      const timeline: Timeline = {
        id: `timeline-${Date.now()}`,
        title: result.title,
        events: result.events,
        createdAt: new Date(),
      };

      addTimeline(timeline);
      incrementGenerations();
    } catch (err) {
      console.error('生成失败:', err);
      setError(err instanceof Error ? err.message : '生成失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  TimeFlow AI
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  智能时间线生成工具
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                创建时间线
              </h2>
              <TextInput
                onGenerate={handleGenerate}
                isLoading={isGenerating}
                disabled={!canGenerate}
              />
            </div>

            <SubscriptionBanner />

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="bg-blue-50 dark:bg-gray-800 border border-blue-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                功能特点
              </h3>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400">✓</span>
                  <span>AI 智能提取时间和事件</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400">✓</span>
                  <span>即时预览时间线图表</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400">✓</span>
                  <span>导出 SVG/PNG 格式</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400">✓</span>
                  <span>一键生成分享链接</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400">✓</span>
                  <span>支持深色模式</span>
                </li>
              </ul>
            </div>
          </div>

          <div>
            {currentTimeline ? (
              <TimelineRenderer timeline={currentTimeline} />
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-12 text-center">
                <Clock className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  开始创建你的时间线
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  在左侧输入文本描述，AI 将自动为你生成美观的时间线图表
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            © 2024 TimeFlow AI. 专为技术文档和项目汇报设计的时间线生成工具
          </p>
        </div>
      </footer>
    </div>
  );
}
