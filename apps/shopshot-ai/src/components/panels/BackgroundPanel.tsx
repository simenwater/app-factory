'use client';

import { useState } from 'react';
import { Loader2, Scissors, Download } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { removeBackgroundAndReplace } from '@/lib/imageProcessing';
import { SCENE_TEMPLATES } from '@/lib/constants';
import type { GeneratedImage, SceneTemplate } from '@/types';

/**
 * @description 背景移除与场景替换面板
 */
export function BackgroundPanel() {
  const currentImage = useAppStore((s) => s.currentImage);
  const createTask = useAppStore((s) => s.createTask);
  const updateTaskStatus = useAppStore((s) => s.updateTaskStatus);
  const addTaskResults = useAppStore((s) => s.addTaskResults);
  const consumeCredit = useAppStore((s) => s.useCredit);
  const [loading, setLoading] = useState(false);
  const [selectedScene, setSelectedScene] = useState<SceneTemplate | null>(null);
  const [result, setResult] = useState<GeneratedImage | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!currentImage || !selectedScene) return;

    const success = consumeCredit(1);
    if (!success) {
      setError('额度不足，请升级订阅方案');
      return;
    }

    setLoading(true);
    setError(null);

    const taskId = createTask('background-removal');
    if (!taskId) {
      setLoading(false);
      setError('创建任务失败');
      return;
    }

    try {
      const generated = await removeBackgroundAndReplace(
        currentImage.previewUrl,
        selectedScene
      );
      addTaskResults(taskId, [generated]);
      setResult(generated);
    } catch (e) {
      updateTaskStatus(taskId, 'error', '生成失败，请重试');
      setError('生成失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 space-y-4 animate-fade-in">
      <div>
        <h3 className="font-medium">背景替换</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          选择场景模板，消耗 1 额度
        </p>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {SCENE_TEMPLATES.map((scene) => (
          <button
            key={scene.id}
            onClick={() => setSelectedScene(scene)}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all ${
              selectedScene?.id === scene.id
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                : 'border-gray-200 dark:border-gray-800 hover:border-indigo-300'
            }`}
          >
            <div className="w-full aspect-square rounded bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800" />
            <span className="text-xs text-center truncate w-full">{scene.name}</span>
          </button>
        ))}
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading || !selectedScene}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-300 dark:disabled:bg-indigo-800 text-white rounded-xl font-medium text-sm transition-colors"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            处理中...
          </>
        ) : (
          <>
            <Scissors className="w-4 h-4" />
            移除背景并替换
          </>
        )}
      </button>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {result && (
        <div className="rounded-lg overflow-hidden border border-gray-100 dark:border-gray-800">
          <div className="aspect-video flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <img
              src={result.url}
              alt="生成结果"
              className="max-w-full max-h-full object-contain"
            />
          </div>
          <div className="flex items-center justify-between px-3 py-2 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
            <span className="text-xs text-gray-500">场景：{result.scene}</span>
            <button className="flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-600">
              <Download className="w-3 h-3" />
              下载
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
