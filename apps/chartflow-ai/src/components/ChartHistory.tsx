'use client';

import { Trash2, FileBarChart } from 'lucide-react';
import { useStore } from '@/store/useStore';
import type { Chart } from '@/types';

/**
 * @description 图表历史记录侧边栏组件
 */
export function ChartHistory() {
  const { charts, currentChart, setCurrentChart, deleteChart } = useStore();

  if (charts.length === 0) return null;

  const chartTypeLabel: Record<string, string> = {
    flowchart: '流程图',
    sequence: '时序图',
    class: '类图',
    state: '状态图',
    er: 'ER 图',
    gantt: '甘特图',
    pie: '饼图',
    mindmap: '思维导图',
    timeline: '时间线',
    'binary-protocol': '协议图',
    block: '块图',
    plantuml: 'PlantUML',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <FileBarChart className="w-4 h-4" />
          历史记录 ({charts.length})
        </h3>
      </div>
      <div className="max-h-64 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700">
        {charts.map((chart: Chart) => (
          <div
            key={chart.id}
            className={`flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer ${
              currentChart?.id === chart.id
                ? 'bg-indigo-50 dark:bg-indigo-900/20'
                : ''
            }`}
            onClick={() => setCurrentChart(chart)}
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {chart.title}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {chartTypeLabel[chart.chartType] || chart.chartType}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteChart(chart.id);
              }}
              className="ml-2 p-1 text-gray-400 hover:text-red-500 transition flex-shrink-0 cursor-pointer"
              title="删除"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
