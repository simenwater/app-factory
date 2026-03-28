'use client';

import { useState } from 'react';
import {
  Download,
  Code2,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';
import { generateEmbedCode, copyToClipboard } from '@/lib/export';

interface PlantUMLRendererProps {
  code: string;
  title: string;
}

/**
 * @description PlantUML 渲染组件，通过 PlantUML 在线服务生成图表
 */
export function PlantUMLRenderer({ code, title }: PlantUMLRendererProps) {
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const encodedCode = plantumlEncode(code);
  const svgUrl = `https://www.plantuml.com/plantuml/svg/${encodedCode}`;
  const pngUrl = `https://www.plantuml.com/plantuml/png/${encodedCode}`;

  const handleCopy = async (type: string, content: string) => {
    await copyToClipboard(content);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDownloadPng = () => {
    const link = document.createElement('a');
    link.href = pngUrl;
    link.download = `${title}.png`;
    link.target = '_blank';
    link.click();
  };

  const handleDownloadSvg = () => {
    const link = document.createElement('a');
    link.href = svgUrl;
    link.download = `${title}.svg`;
    link.target = '_blank';
    link.click();
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate">
          {title}
          <span className="text-sm font-normal text-gray-400 ml-2">
            PlantUML
          </span>
        </h2>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={handleDownloadPng}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition cursor-pointer"
            title="下载 PNG"
          >
            <Download className="w-4 h-4" />
            PNG
          </button>
          <button
            onClick={handleDownloadSvg}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition cursor-pointer"
            title="下载 SVG"
          >
            <Download className="w-4 h-4" />
            SVG
          </button>
          <button
            onClick={() =>
              handleCopy('embed', generateEmbedCode(code, 'plantuml'))
            }
            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition cursor-pointer"
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

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 overflow-x-auto">
        <img
          src={svgUrl}
          alt={title}
          className="max-w-full h-auto mx-auto"
          loading="lazy"
        />
      </div>

      <div className="flex justify-end">
        <a
          href={`https://www.plantuml.com/plantuml/uml/${encodedCode}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-indigo-500 transition"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          在 PlantUML 编辑器中打开
        </a>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <button
          onClick={() => setShowCode(!showCode)}
          className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Code2 className="w-4 h-4" />
            查看 PlantUML 代码
          </span>
        </button>

        {showCode && (
          <div className="border-t border-gray-200 dark:border-gray-700 animate-fade-in">
            <div className="flex justify-end px-4 py-2 bg-gray-50 dark:bg-gray-900">
              <button
                onClick={() => handleCopy('code', code)}
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
              <code>{code}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * @description PlantUML 文本编码（使用 deflate 的简化版本）
 * 实际生产中可使用 plantuml-encoder 包，此处使用 hex 编码简化方案
 */
function plantumlEncode(text: string): string {
  const encoded = unescape(encodeURIComponent(text));
  const arr: number[] = [];
  for (let i = 0; i < encoded.length; i++) {
    arr.push(encoded.charCodeAt(i));
  }
  return '~h' + arr.map((b) => b.toString(16).padStart(2, '0')).join('');
}
