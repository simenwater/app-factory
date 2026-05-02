'use client';

import { useState } from 'react';
import { RotateCcw, Scissors, Maximize } from 'lucide-react';
import { MultiAnglePanel } from './panels/MultiAnglePanel';
import { BackgroundPanel } from './panels/BackgroundPanel';
import { ResizePanel } from './panels/ResizePanel';
import type { GenerationMode } from '@/types';

/**
 * @description 工具选择器 - 三种 AI 功能入口
 */
const TOOLS = [
  {
    id: 'multi-angle' as GenerationMode,
    icon: RotateCcw,
    label: '多角度视图',
    description: '生成 6 个角度的 3D 展示图',
  },
  {
    id: 'background-removal' as GenerationMode,
    icon: Scissors,
    label: '背景替换',
    description: '移除背景并替换营销场景',
  },
  {
    id: 'resize' as GenerationMode,
    icon: Maximize,
    label: '平台尺寸',
    description: '一键生成符合平台规范的尺寸',
  },
];

export function ToolSelector() {
  const [activeMode, setActiveMode] = useState<GenerationMode | null>(null);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">选择工具</h2>

      <div className="grid grid-cols-3 gap-3">
        {TOOLS.map(({ id, icon: Icon, label, description }) => (
          <button
            key={id}
            onClick={() => setActiveMode(activeMode === id ? null : id)}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all text-center ${
              activeMode === id
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-sm'
                : 'border-gray-200 dark:border-gray-800 hover:border-indigo-300 dark:hover:border-indigo-700'
            }`}
          >
            <Icon
              className={`w-6 h-6 ${
                activeMode === id ? 'text-indigo-500' : 'text-gray-500 dark:text-gray-400'
              }`}
            />
            <span className="text-sm font-medium">{label}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
              {description}
            </span>
          </button>
        ))}
      </div>

      {activeMode === 'multi-angle' && <MultiAnglePanel />}
      {activeMode === 'background-removal' && <BackgroundPanel />}
      {activeMode === 'resize' && <ResizePanel />}
    </div>
  );
}
