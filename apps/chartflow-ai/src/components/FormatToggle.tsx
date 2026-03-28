'use client';

import { useStore } from '@/store/useStore';
import type { RenderFormat } from '@/types';

/**
 * @description 渲染格式切换组件（Mermaid / PlantUML）
 */
export function FormatToggle() {
  const { activeFormat, setActiveFormat } = useStore();

  const formats: { value: RenderFormat; label: string }[] = [
    { value: 'mermaid', label: 'Mermaid' },
    { value: 'plantuml', label: 'PlantUML' },
  ];

  return (
    <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
      {formats.map((fmt) => (
        <button
          key={fmt.value}
          onClick={() => setActiveFormat(fmt.value)}
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition cursor-pointer ${
            activeFormat === fmt.value
              ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          {fmt.label}
        </button>
      ))}
    </div>
  );
}
