'use client';

import { useState } from 'react';
import { Loader2, Maximize, Download, Check } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { resizeToPreset } from '@/lib/imageProcessing';
import { PLATFORM_PRESETS } from '@/lib/constants';
import type { GeneratedImage, PlatformPreset } from '@/types';

/**
 * @description 平台规范尺寸生成面板
 */
export function ResizePanel() {
  const currentImage = useAppStore((s) => s.currentImage);
  const createTask = useAppStore((s) => s.createTask);
  const updateTaskStatus = useAppStore((s) => s.updateTaskStatus);
  const addTaskResults = useAppStore((s) => s.addTaskResults);
  const consumeCredit = useAppStore((s) => s.useCredit);
  const [loading, setLoading] = useState(false);
  const [selectedPresets, setSelectedPresets] = useState<PlatformPreset[]>([]);
  const [results, setResults] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const togglePreset = (preset: PlatformPreset) => {
    setSelectedPresets((prev) =>
      prev.find((p) => p.id === preset.id)
        ? prev.filter((p) => p.id !== preset.id)
        : [...prev, preset]
    );
  };

  const handleGenerate = async () => {
    if (!currentImage || selectedPresets.length === 0) return;

    const success = consumeCredit(selectedPresets.length);
    if (!success) {
      setError('额度不足，请升级订阅方案');
      return;
    }

    setLoading(true);
    setError(null);

    const taskId = createTask('resize');
    if (!taskId) {
      setLoading(false);
      setError('创建任务失败');
      return;
    }

    try {
      const generated = await Promise.all(
        selectedPresets.map((preset) =>
          resizeToPreset(currentImage.previewUrl, preset)
        )
      );
      addTaskResults(taskId, generated);
      setResults(generated);
    } catch (e) {
      updateTaskStatus(taskId, 'error', '生成失败，请重试');
      setError('生成失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const platforms = [...new Set(PLATFORM_PRESETS.map((p) => p.platform))];

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 space-y-4 animate-fade-in">
      <div>
        <h3 className="font-medium">平台规范尺寸</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          选择目标平台，每个尺寸消耗 1 额度
        </p>
      </div>

      <div className="space-y-3">
        {platforms.map((platform) => (
          <div key={platform}>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
              {platform}
            </p>
            <div className="flex flex-wrap gap-2">
              {PLATFORM_PRESETS.filter((p) => p.platform === platform).map((preset) => {
                const isSelected = selectedPresets.some((p) => p.id === preset.id);
                return (
                  <button
                    key={preset.id}
                    onClick={() => togglePreset(preset)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm transition-all ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                        : 'border-gray-200 dark:border-gray-800 hover:border-indigo-300'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    <span>{preset.name}</span>
                    <span className="text-xs opacity-60">
                      {preset.width}×{preset.height}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading || selectedPresets.length === 0}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-300 dark:disabled:bg-indigo-800 text-white rounded-xl font-medium text-sm transition-colors"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            生成中...
          </>
        ) : (
          <>
            <Maximize className="w-4 h-4" />
            生成 {selectedPresets.length > 0 ? `${selectedPresets.length} 个尺寸` : ''}
          </>
        )}
      </button>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {results.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">生成完成</p>
          <div className="grid grid-cols-2 gap-2">
            {results.map((result) => (
              <div
                key={result.id}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900"
              >
                <div>
                  <p className="text-sm font-medium">{result.preset?.name}</p>
                  <p className="text-xs text-gray-500">
                    {result.preset?.width}×{result.preset?.height}
                  </p>
                </div>
                <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  <Download className="w-4 h-4 text-indigo-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
