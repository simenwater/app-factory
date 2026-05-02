'use client';

import { useState } from 'react';
import { Loader2, RotateCcw, Download } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { generateMultiAngleViews } from '@/lib/imageProcessing';
import { VIEW_ANGLES } from '@/lib/constants';
import type { GeneratedImage } from '@/types';

/**
 * @description 多角度 3D 视图生成面板
 */
export function MultiAnglePanel() {
  const currentImage = useAppStore((s) => s.currentImage);
  const createTask = useAppStore((s) => s.createTask);
  const updateTaskStatus = useAppStore((s) => s.updateTaskStatus);
  const addTaskResults = useAppStore((s) => s.addTaskResults);
  const consumeCredit = useAppStore((s) => s.useCredit);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!currentImage) return;

    const success = consumeCredit(3);
    if (!success) {
      setError('额度不足，请升级订阅方案');
      return;
    }

    setLoading(true);
    setError(null);

    const taskId = createTask('multi-angle');
    if (!taskId) {
      setLoading(false);
      setError('创建任务失败');
      return;
    }

    try {
      const generated = await generateMultiAngleViews(currentImage.previewUrl);
      addTaskResults(taskId, generated);
      setResults(generated);
    } catch (e) {
      updateTaskStatus(taskId, 'error', '生成失败，请重试');
      setError('生成失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">多角度 3D 视图</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            消耗 3 额度，生成 6 个角度
          </p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-300 text-white rounded-xl font-medium text-sm transition-colors"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              生成中...
            </>
          ) : (
            <>
              <RotateCcw className="w-4 h-4" />
              开始生成
            </>
          )}
        </button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {results.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {results.map((result, i) => (
            <div
              key={result.id}
              className="relative group rounded-lg overflow-hidden border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900"
            >
              <div className="aspect-square flex items-center justify-center p-2">
                <img
                  src={result.url}
                  alt={result.angle || `角度 ${i + 1}`}
                  className="max-w-full max-h-full object-contain"
                  style={{ transform: `rotateY(${VIEW_ANGLES[i]?.angle || 0}deg)` }}
                />
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-end justify-between p-2">
                <span className="text-xs font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 px-2 py-0.5 rounded">
                  {result.angle}
                </span>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-white/90 rounded-md">
                  <Download className="w-3 h-3 text-gray-700" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
