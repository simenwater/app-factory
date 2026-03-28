'use client';

import { useState } from 'react';
import { Workflow } from 'lucide-react';
import { TextInput } from '@/components/TextInput';
import { ChartRenderer } from '@/components/ChartRenderer';
import { PlantUMLRenderer } from '@/components/PlantUMLRenderer';
import { SubscriptionBanner } from '@/components/SubscriptionBanner';
import { ThemeToggle } from '@/components/ThemeToggle';
import { FormatToggle } from '@/components/FormatToggle';
import { ChartHistory } from '@/components/ChartHistory';
import { useStore } from '@/store/useStore';
import { generateChart } from '@/lib/llm';
import type { Chart, RenderFormat } from '@/types';

/**
 * @description 主页面组件
 */
export default function HomePage() {
  const {
    user,
    currentChart,
    activeFormat,
    addChart,
    incrementGenerations,
  } = useStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plantumlCode, setPlantumlCode] = useState<string | null>(null);

  const canGenerate =
    user.subscription === 'pro' ||
    user.generationsUsed < user.generationsLimit;

  const handleGenerate = async (text: string) => {
    if (!canGenerate) {
      setError('已达到免费版生成次数上限，请升级到 Pro 版本');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const result = await generateChart(text);

      const chart: Chart = {
        id: `chart-${Date.now()}`,
        title: result.title,
        description: text,
        chartType: result.chartType,
        renderFormat: 'mermaid' as RenderFormat,
        code: result.mermaidCode,
        createdAt: new Date(),
      };

      setPlantumlCode(result.plantumlCode);
      addChart(chart);
      incrementGenerations();
    } catch (err) {
      console.error('生成失败:', err);
      setError(
        err instanceof Error ? err.message : '生成失败，请重试'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg">
                <Workflow className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  ChartFlow AI
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  文本描述 → 可视化图表
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FormatToggle />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* 左侧：输入区 */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-5">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                创建图表
              </h2>
              <TextInput
                onGenerate={handleGenerate}
                isLoading={isGenerating}
                disabled={!canGenerate}
              />
            </div>

            <SubscriptionBanner />

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <ChartHistory />

            <div className="bg-indigo-50 dark:bg-gray-800 border border-indigo-200 dark:border-gray-700 rounded-lg p-5">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">
                支持的图表类型
              </h3>
              <div className="grid grid-cols-2 gap-1.5 text-xs text-gray-700 dark:text-gray-300">
                {[
                  { icon: '🔀', name: '流程图' },
                  { icon: '↔️', name: '时序图' },
                  { icon: '📅', name: '时间线' },
                  { icon: '🏗️', name: '类图' },
                  { icon: '🗄️', name: 'ER 图' },
                  { icon: '📊', name: '甘特图' },
                  { icon: '🥧', name: '饼图' },
                  { icon: '🧠', name: '思维导图' },
                  { icon: '🔄', name: '状态图' },
                  { icon: '📦', name: '协议格式' },
                ].map((item) => (
                  <span
                    key={item.name}
                    className="flex items-center gap-1.5"
                  >
                    <span>{item.icon}</span>
                    {item.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 右侧：渲染区 */}
          <div className="lg:col-span-3">
            {currentChart ? (
              activeFormat === 'mermaid' ? (
                <ChartRenderer chart={currentChart} />
              ) : (
                <PlantUMLRenderer
                  code={plantumlCode || currentChart.code}
                  title={currentChart.title}
                />
              )
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-12 text-center">
                <Workflow className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  开始创建你的图表
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mx-auto">
                  在左侧用自然语言描述你想要的图表，AI
                  将自动解析并生成可视化的 Mermaid / PlantUML 图表
                </p>
                <div className="mt-8 grid grid-cols-3 gap-4 text-center max-w-sm mx-auto">
                  <div>
                    <div className="text-2xl mb-1">📝</div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      文本描述
                    </p>
                  </div>
                  <div>
                    <div className="text-2xl mb-1">🤖</div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      AI 解析
                    </p>
                  </div>
                  <div>
                    <div className="text-2xl mb-1">📊</div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      生成图表
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-xs text-gray-500 dark:text-gray-400">
            &copy; 2024 ChartFlow AI — 专为工程师设计的文本转图表工具
          </p>
        </div>
      </footer>
    </div>
  );
}
