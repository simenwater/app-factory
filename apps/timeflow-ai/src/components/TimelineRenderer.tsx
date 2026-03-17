'use client';

import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { Download, Share2, FileImage, Edit } from 'lucide-react';
import { exportToPng, exportToSvg, generateShareLink } from '@/lib/export';
import { EditEventDialog } from '@/components/EditEventDialog';
import { useStore } from '@/store/useStore';
import type { Timeline, TimelineEvent } from '@/types';

interface TimelineRendererProps {
  timeline: Timeline;
}

/**
 * 时间线渲染组件
 */
export function TimelineRenderer({ timeline }: TimelineRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);
  const { updateEvent } = useStore();

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'base',
      themeVariables: {
        primaryColor: '#3b82f6',
        primaryTextColor: '#1e293b',
        primaryBorderColor: '#2563eb',
        lineColor: '#64748b',
        secondaryColor: '#f1f5f9',
        tertiaryColor: '#f8fafc',
      },
    });
  }, []);

  useEffect(() => {
    if (!containerRef.current || !timeline) return;

    const renderTimeline = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { generateMermaidCode } = await import('@/lib/mermaid');
        const mermaidCode = generateMermaidCode(timeline.title, timeline.events);

        const { svg } = await mermaid.render('timeline-svg', mermaidCode);
        
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (err) {
        console.error('渲染失败:', err);
        setError('时间线渲染失败');
      } finally {
        setIsLoading(false);
      }
    };

    renderTimeline();
  }, [timeline]);

  const handleExportPng = async () => {
    if (!containerRef.current) return;
    try {
      await exportToPng(containerRef.current, timeline.title);
    } catch (err) {
      console.error('导出 PNG 失败:', err);
    }
  };

  const handleExportSvg = async () => {
    if (!containerRef.current) return;
    try {
      await exportToSvg(containerRef.current, timeline.title);
    } catch (err) {
      console.error('导出 SVG 失败:', err);
    }
  };

  const handleShare = () => {
    const link = generateShareLink(timeline.id);
    navigator.clipboard.writeText(link);
    alert('分享链接已复制到剪贴板！');
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {timeline.title}
        </h2>
        <div className="relative group">
          <button
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <Download className="w-4 h-4" />
            导出
          </button>
          <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
            <button
              onClick={handleExportPng}
              disabled={isLoading}
              className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition first:rounded-t-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileImage className="w-4 h-4 text-blue-600" />
              <span className="text-gray-900 dark:text-white">导出为 PNG</span>
            </button>
            <button
              onClick={handleExportSvg}
              disabled={isLoading}
              className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4 text-green-600" />
              <span className="text-gray-900 dark:text-white">导出为 SVG</span>
            </button>
            <button
              onClick={handleShare}
              disabled={isLoading}
              className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition last:rounded-b-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Share2 className="w-4 h-4 text-purple-600" />
              <span className="text-gray-900 dark:text-white">生成分享链接</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 overflow-x-auto">
        {isLoading && (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}
        <div ref={containerRef} className={isLoading ? 'hidden' : ''} />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          事件列表
        </h3>
        <div className="space-y-3">
          {timeline.events.map((event) => (
            <div
              key={event.id}
              className="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition"
            >
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {event.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {event.date}
                </p>
                {event.description && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {event.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => setEditingEvent(event)}
                className="ml-4 p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
                title="编辑事件"
              >
                <Edit className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {editingEvent && (
        <EditEventDialog
          event={editingEvent}
          isOpen={!!editingEvent}
          onClose={() => setEditingEvent(null)}
          onSave={updateEvent}
        />
      )}
    </div>
  );
}
