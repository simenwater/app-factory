"use client";

/**
 * @fileoverview 配置文件预览组件
 */

import { GeneratedConfig } from "@/types";
import { Copy, Download, Check } from "lucide-react";
import { useState } from "react";
import { ASSISTANT_META } from "./AssistantCard";

interface ConfigPreviewProps {
  config: GeneratedConfig;
}

/**
 * 配置文件预览组件，支持复制和下载
 * @param props - 组件属性
 * @returns JSX 元素
 */
export default function ConfigPreview({ config }: ConfigPreviewProps) {
  const [copied, setCopied] = useState(false);
  const meta = ASSISTANT_META[config.assistant];

  /**
   * 复制配置内容到剪贴板
   */
  const handleCopy = async () => {
    await navigator.clipboard.writeText(config.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /**
   * 下载配置文件
   */
  const handleDownload = () => {
    const blob = new Blob([config.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = config.fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900 overflow-hidden">
      <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-700">
        <div className="flex items-center gap-2">
          <div className={`h-6 w-6 rounded bg-gradient-to-br ${meta.color} flex items-center justify-center text-white text-xs font-bold`}>
            {meta.name.charAt(0)}
          </div>
          <div>
            <span className="font-medium text-zinc-900 dark:text-white text-sm">{config.fileName}</span>
            <span className="ml-2 text-xs text-zinc-500">{meta.name}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleCopy}
            className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
            title="复制"
          >
            {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
          </button>
          <button
            onClick={handleDownload}
            className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
            title="下载"
          >
            <Download size={14} />
          </button>
        </div>
      </div>
      <pre className="max-h-80 overflow-auto p-4 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300 font-mono">
        {config.content}
      </pre>
    </div>
  );
}
