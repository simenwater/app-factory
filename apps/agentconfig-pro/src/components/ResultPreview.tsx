"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { Copy, Check, Download, FileText } from "lucide-react";

/**
 * @description 生成结果预览和导出组件
 */
export function ResultPreview() {
  const result = useStore((s) => s.result);
  const [copied, setCopied] = useState(false);

  if (!result) return null;

  /**
   * @description 复制内容到剪贴板
   */
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(result!.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = result!.content;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  /**
   * @description 下载文件
   */
  function handleDownload() {
    const blob = new Blob([result!.content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = result!.filename.replace(/\//g, "_");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <h3 className="text-sm font-bold text-text dark:text-text-dark">
            {result.filename}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-muted transition-all hover:bg-border/30 dark:border-border-dark dark:text-text-muted-dark"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-success" />
                已复制
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                复制
              </>
            )}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white transition-all hover:bg-primary-dark"
          >
            <Download className="h-3.5 w-3.5" />
            下载
          </button>
        </div>
      </div>

      <div className="max-h-[500px] overflow-auto rounded-xl border border-border bg-bg p-4 dark:border-border-dark dark:bg-bg-dark">
        <pre className="whitespace-pre-wrap text-xs leading-relaxed text-text dark:text-text-dark">
          {result.content}
        </pre>
      </div>
    </div>
  );
}
