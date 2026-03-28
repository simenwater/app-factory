'use client';

import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import {
  Download,
  FileImage,
  Code2,
  Copy,
  Check,
  RefreshCw,
} from 'lucide-react';
import { exportToPng, exportToSvg, generateEmbedCode, copyToClipboard } from '@/lib/export';
import { useStore } from '@/store/useStore';
import type { Chart } from '@/types';

interface ChartRendererProps {
  chart: Chart;
}

/**
 * @description 图表渲染组件，支持 Mermaid 渲染、导出和代码查看
 */
export function ChartRenderer({ chart }: ChartRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const { user, incrementExports, activeFormat } = useStore();

  const canExport =
    user.subscription === 'pro' || user.exportsUsed < user.exportsLimit;

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'base',
      themeVariables: {
        primaryColor: '#6366f1',
        primaryTextColor: '#1e293b',
        primaryBorderColor: '#4f46e5',
        lineColor: '#64748b',
        secondaryColor: '#f1f5f9',
        tertiaryColor: '#f8fafc',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      },
    });
  }, []);

  useEffect(() => {
    if (!containerRef.current || !chart) return;

    const renderChart = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const uniqueId = `chart-${chart.id}-${Date.now()}`;
        const { svg } = await mermaid.render(uniqueId, chart.code);

        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (err) {
        console.error('渲染失败:', err);
        setError('图表渲染失败，请检查代码语法');
      } finally {
        setIsLoading(false);
      }
    };

    renderChart();
  }, [chart]);

  const handleExportPng = async () => {
    if (!containerRef.current || !canExport) return;
    try {
      await exportToPng(containerRef.current, chart.title);
      incrementExports();
    } catch (err) {
      console.error('导出 PNG 失败:', err);
    }
  };

  const handleExportSvg = async () => {
    if (!containerRef.current || !canExport) return;
    try {
      await exportToSvg(containerRef.current, chart.title);
      incrementExports();
    } catch (err) {
      console.error('导出 SVG 失败:', err);
    }
  };

  const handleCopy = async (type: string, content: string) => {
    await copyToClipboard(content);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleCopyEmbed = () => {
    const embedCode = generateEmbedCode(chart.code, activeFormat);
    handleCopy('embed', embedCode);
  };

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
        <div className="text-red-500 dark:text-red-400 mb-4">
          <RefreshCw className="w-12 h-12 mx-auto mb-2" />
          <p className="font-medium">{error}</p>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          可尝试修改描述或切换图表类型后重新生成
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate">
          {chart.title}
        </h2>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={handleExportPng}
            disabled={isLoading || !canExport}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
            title="导出为 PNG"
          >
            <FileImage className="w-4 h-4" />
            PNG
          </button>
          <button
            onClick={handleExportSvg}
            disabled={isLoading || !canExport}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
            title="导出为 SVG"
          >
            <Download className="w-4 h-4" />
            SVG
          </button>
          <button
            onClick={handleCopyEmbed}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
            title="复制嵌入代码"
          >
            {copied === 'embed' ? (
              <Check className="w-4 h-4" />
            ) : (
              <Code2 className="w-4 h-4" />
            )}
            {copied === 'embed' ? '已复制' : '嵌入'}
          </button>
        </div>
      </div>

      {!canExport && (
        <p className="text-sm text-amber-600 dark:text-amber-400">
          免费版导出次数已用完，升级 Pro 解锁无限导出
        </p>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 overflow-x-auto">
        {isLoading && (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
          </div>
        )}
        <div
          ref={containerRef}
          className={`chart-container ${isLoading ? 'hidden' : ''}`}
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <button
          onClick={() => setShowCode(!showCode)}
          className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Code2 className="w-4 h-4" />
            查看 / 编辑代码
          </span>
          <span className="text-xs text-gray-400">
            {chart.renderFormat === 'mermaid' ? 'Mermaid' : 'PlantUML'}
          </span>
        </button>

        {showCode && (
          <div className="border-t border-gray-200 dark:border-gray-700 animate-fade-in">
            <div className="flex justify-end px-4 py-2 bg-gray-50 dark:bg-gray-900">
              <button
                onClick={() => handleCopy('code', chart.code)}
                className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition cursor-pointer"
              >
                {copied === 'code' ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                {copied === 'code' ? '已复制' : '复制代码'}
              </button>
            </div>
            <pre className="px-4 py-3 text-sm overflow-x-auto code-editor bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
              <code>{chart.code}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
