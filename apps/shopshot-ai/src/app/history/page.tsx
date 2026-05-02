'use client';

import { useAppStore } from '@/store/useAppStore';
import { Image as ImageIcon, RotateCcw, Scissors, Maximize } from 'lucide-react';

/**
 * @description 历史记录页面 - 展示所有生成任务
 */
export default function HistoryPage() {
  const tasks = useAppStore((s) => s.tasks);

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'multi-angle': return <RotateCcw className="w-4 h-4" />;
      case 'background-removal': return <Scissors className="w-4 h-4" />;
      case 'resize': return <Maximize className="w-4 h-4" />;
      default: return <ImageIcon className="w-4 h-4" />;
    }
  };

  const getModeLabel = (mode: string) => {
    switch (mode) {
      case 'multi-angle': return '多角度视图';
      case 'background-removal': return '背景替换';
      case 'resize': return '尺寸调整';
      default: return mode;
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500 dark:text-gray-400">
        <ImageIcon className="w-12 h-12 mb-4 opacity-50" />
        <p className="text-lg font-medium">暂无生成记录</p>
        <p className="text-sm mt-1">上传产品图开始使用</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-2xl font-bold">生成历史</h1>

      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
          >
            <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
              {task.sourceImage.previewUrl ? (
                <img
                  src={task.sourceImage.previewUrl}
                  alt="产品图"
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageIcon className="w-6 h-6 text-gray-400" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                {getModeIcon(task.mode)}
                <span className="font-medium text-sm">{getModeLabel(task.mode)}</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {new Date(task.createdAt).toLocaleString('zh-CN')}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  task.status === 'completed'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : task.status === 'processing'
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                    : task.status === 'error'
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
              >
                {task.status === 'completed' ? '已完成' : task.status === 'processing' ? '处理中' : task.status === 'error' ? '失败' : '等待中'}
              </span>
              {task.results.length > 0 && (
                <span className="text-xs text-gray-500">{task.results.length} 张</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
