'use client';

import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { Download, Share2, FileImage } from 'lucide-react';
import { exportToPng, exportToSvg, generateShareLink } from '@/lib/export';
import type { Timeline } from '@/types';

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
        <div className="flex gap-2">
          <button
            onClick={handleExportPng}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            title="导出为 PNG"
          >
            <FileImage className="w-4 h-4" />
            PNG
          </button>
          <button
            onClick={handleExportSvg}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            title="导出为 SVG"
          >
            <Download className="w-4 h-4" />
            SVG
          </button>
          <button
            onClick={handleShare}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            title="分享链接"
          >
            <Share2 className="w-4 h-4" />
            分享
          </button>
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
    </div>
  );
}
