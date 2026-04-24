"use client";

import { Copy, Download, Check, RefreshCw } from "lucide-react";
import { useState } from "react";
import { copyToClipboard, downloadAsFile } from "@/lib/utils";
import { FORMAT_CONFIG } from "@/types";
import type { OutputFormat } from "@/types";

/**
 * @component PolishResult
 * 润色结果展示卡片，支持复制和下载
 */
export function PolishResult({
  content,
  format,
  onRegenerate,
  isLoading,
}: {
  content: string;
  format: OutputFormat;
  onRegenerate: () => void;
  isLoading: boolean;
}) {
  const [copied, setCopied] = useState(false);

  /**
   * @function handleCopy
   * 复制内容到剪贴板
   */
  const handleCopy = async () => {
    const success = await copyToClipboard(content);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  /**
   * @function handleDownload
   * 下载为文本文件
   */
  const handleDownload = () => {
    const ext = format === "email" ? "eml" : format === "blog" ? "md" : "txt";
    downloadAsFile(content, `voicepolish-${format}.${ext}`, "text/plain");
  };

  const formatLabel = FORMAT_CONFIG[format].label;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {formatLabel}输出
        </h3>
        <div className="flex items-center gap-1">
          <button
            onClick={onRegenerate}
            disabled={isLoading}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400 disabled:opacity-50"
            title="重新生成"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={handleCopy}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400"
            title="复制"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={handleDownload}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400"
            title="下载"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
        {isLoading ? (
          <div className="flex items-center gap-3 py-8 justify-center">
            <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce [animation-delay:150ms]" />
            <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce [animation-delay:300ms]" />
            <span className="text-sm text-slate-500 dark:text-slate-400 ml-2">
              AI 润色中...
            </span>
          </div>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap text-slate-700 dark:text-slate-300">
            {content}
          </div>
        )}
      </div>
    </div>
  );
}
