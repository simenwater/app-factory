/**
 * @fileoverview 工具标准选择器组件
 * 支持选择 Cursor / Claude / Copilot 三种工具标准
 */

'use client';

import { useAppStore } from '@/store/app-store';
import type { ToolStandard } from '@/types';

/** 工具标准配置 */
const STANDARDS: {
  id: ToolStandard;
  name: string;
  filename: string;
  description: string;
  color: string;
}[] = [
  {
    id: 'cursor',
    name: 'Cursor',
    filename: 'AGENTS.md',
    description: 'Cursor IDE 的代理配置文件',
    color: 'from-violet-500 to-purple-500',
  },
  {
    id: 'claude',
    name: 'Claude Code',
    filename: 'CLAUDE.md',
    description: 'Claude Code 的上下文配置文件',
    color: 'from-amber-500 to-orange-500',
  },
  {
    id: 'copilot',
    name: 'GitHub Copilot',
    filename: 'copilot-instructions.md',
    description: 'GitHub Copilot 的自定义指令文件',
    color: 'from-blue-500 to-cyan-500',
  },
];

/**
 * 多工具标准选择器
 * @returns {JSX.Element}
 */
export default function StandardSelector() {
  const { selectedStandards, toggleStandard } = useAppStore();

  return (
    <div className="space-y-3">
      <h4 className="font-semibold text-gray-900 dark:text-white">
        选择目标工具标准
      </h4>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {STANDARDS.map((std) => {
          const selected = selectedStandards.includes(std.id);
          return (
            <button
              key={std.id}
              onClick={() => toggleStandard(std.id)}
              className={`group relative overflow-hidden rounded-xl border-2 p-4 text-left transition-all ${
                selected
                  ? 'border-violet-500 bg-violet-50 shadow-md dark:border-violet-400 dark:bg-violet-950/50'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600'
              }`}
            >
              {selected && (
                <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${std.color}`} />
              )}
              <div className="flex items-center justify-between">
                <span
                  className={`text-sm font-bold ${
                    selected ? 'text-violet-700 dark:text-violet-300' : 'text-gray-900 dark:text-white'
                  }`}
                >
                  {std.name}
                </span>
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${
                    selected
                      ? 'border-violet-500 bg-violet-500 dark:border-violet-400 dark:bg-violet-400'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  {selected && (
                    <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {std.filename}
              </p>
              <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                {std.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
