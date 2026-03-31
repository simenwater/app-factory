"use client";

import { useState } from "react";
import { X, Download, Copy, Check } from "lucide-react";
import { exportNote, downloadFile } from "@/lib/utils";
import type { VoiceNote, ExportFormat } from "@/types";

/**
 * @description 导出格式配置
 */
const FORMAT_OPTIONS: { value: ExportFormat; label: string; ext: string }[] = [
  { value: "notion", label: "Notion", ext: "md" },
  { value: "obsidian", label: "Obsidian", ext: "md" },
  { value: "markdown", label: "Markdown", ext: "md" },
  { value: "text", label: "纯文本", ext: "txt" },
];

/**
 * @description 导出弹窗组件
 */
export default function ExportModal({
  note,
  onClose,
}: {
  note: VoiceNote;
  onClose: () => void;
}) {
  const [format, setFormat] = useState<ExportFormat>("markdown");
  const [copied, setCopied] = useState(false);

  const content = exportNote(note, format);
  const selected = FORMAT_OPTIONS.find((f) => f.value === format)!;

  /**
   * @description 复制到剪贴板
   */
  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /**
   * @description 下载文件
   */
  const handleDownload = () => {
    const filename = `${note.title.replace(/[^a-zA-Z0-9\u4e00-\u9fff]/g, "_")}.${selected.ext}`;
    downloadFile(content, filename);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center">
      <div className="w-full max-w-lg rounded-t-2xl bg-surface p-6 sm:rounded-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-text">导出笔记</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 hover:bg-surface-alt"
          >
            <X className="h-5 w-5 text-text-muted" />
          </button>
        </div>

        {/* 格式选择 */}
        <div className="mb-4 grid grid-cols-4 gap-2">
          {FORMAT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFormat(opt.value)}
              className={`rounded-xl px-3 py-2 text-sm font-medium transition-all ${
                format === opt.value
                  ? "bg-primary text-white"
                  : "bg-surface-alt text-text-muted hover:text-text"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* 预览 */}
        <div className="mb-4 max-h-64 overflow-auto rounded-xl bg-bg p-4">
          <pre className="whitespace-pre-wrap text-xs text-text-muted">
            {content}
          </pre>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-3">
          <button
            onClick={handleCopy}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-surface-alt py-3 text-sm font-medium text-text transition-all hover:bg-border"
          >
            {copied ? (
              <Check className="h-4 w-4 text-emerald-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            {copied ? "已复制" : "复制"}
          </button>
          <button
            onClick={handleDownload}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-medium text-white transition-all hover:bg-primary-hover"
          >
            <Download className="h-4 w-4" />
            下载
          </button>
        </div>
      </div>
    </div>
  );
}
