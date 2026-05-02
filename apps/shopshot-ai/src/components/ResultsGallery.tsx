'use client';

import { useAppStore } from '@/store/useAppStore';
import { Download, Image } from 'lucide-react';

/**
 * @description 生成结果画廊 - 展示最近的生成结果
 */
export function ResultsGallery() {
  const tasks = useAppStore((s) => s.tasks);
  const completedTasks = tasks.filter((t) => t.status === 'completed');

  if (completedTasks.length === 0) return null;

  const latestTask = completedTasks[0];
  if (!latestTask || latestTask.results.length === 0) return null;

  return (
    <div className="space-y-3 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">最新结果</h2>
        <button className="flex items-center gap-1 text-sm text-indigo-500 hover:text-indigo-600 font-medium">
          <Download className="w-4 h-4" />
          全部下载
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {latestTask.results.map((result) => (
          <div
            key={result.id}
            className="relative group rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
          >
            <div className="aspect-square flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-2">
              <img
                src={result.url}
                alt={result.angle || result.scene || '生成结果'}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
              <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-white rounded-full shadow-lg">
                <Download className="w-4 h-4 text-gray-700" />
              </button>
            </div>
            {(result.angle || result.scene || result.preset) && (
              <div className="px-2 py-1.5 border-t border-gray-100 dark:border-gray-800">
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {result.angle || result.scene || result.preset?.name}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
