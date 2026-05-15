"use client";

import { useState } from "react";
import { Eye, Code, Copy, Check, Download } from "lucide-react";
import ReactMarkdown from "react-markdown";

/**
 * Markdown 编辑器与预览组件
 * @param props - 编辑器属性
 * @param props.content - Markdown 内容
 * @param props.onChange - 内容变更回调
 * @param props.readOnly - 是否只读
 * @returns MarkdownEditor 组件
 */
export default function MarkdownEditor({
  content,
  onChange,
  readOnly = false,
}: {
  content: string;
  onChange: (content: string) => void;
  readOnly?: boolean;
}) {
  const [mode, setMode] = useState<"edit" | "preview" | "split">("split");
  const [copied, setCopied] = useState(false);

  /**
   * 复制内容到剪贴板
   */
  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /**
   * 下载为 .md 文件
   */
  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "AGENTS.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border-color)",
      }}
    >
      {/* 工具栏 */}
      <div
        className="flex items-center justify-between px-4 py-2 border-b"
        style={{ borderColor: "var(--border-color)" }}
      >
        <div className="flex items-center gap-1">
          <button
            onClick={() => setMode("edit")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
            style={{
              backgroundColor: mode === "edit" ? "var(--accent-light)" : "transparent",
              color: mode === "edit" ? "var(--accent)" : "var(--text-secondary)",
            }}
          >
            <Code size={14} />
            编辑
          </button>
          <button
            onClick={() => setMode("preview")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
            style={{
              backgroundColor: mode === "preview" ? "var(--accent-light)" : "transparent",
              color: mode === "preview" ? "var(--accent)" : "var(--text-secondary)",
            }}
          >
            <Eye size={14} />
            预览
          </button>
          <button
            onClick={() => setMode("split")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
            style={{
              backgroundColor: mode === "split" ? "var(--accent-light)" : "transparent",
              color: mode === "split" ? "var(--accent)" : "var(--text-secondary)",
            }}
          >
            分栏
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors"
            style={{
              backgroundColor: "var(--bg-tertiary)",
              color: "var(--text-secondary)",
            }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "已复制" : "复制"}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors"
            style={{
              backgroundColor: "var(--bg-tertiary)",
              color: "var(--text-secondary)",
            }}
          >
            <Download size={14} />
            下载
          </button>
        </div>
      </div>

      {/* 编辑区域 */}
      <div className="flex" style={{ minHeight: "500px" }}>
        {(mode === "edit" || mode === "split") && (
          <div className={`${mode === "split" ? "w-1/2 border-r" : "w-full"}`} style={{ borderColor: "var(--border-color)" }}>
            <textarea
              value={content}
              onChange={(e) => onChange(e.target.value)}
              readOnly={readOnly}
              className="editor-textarea w-full h-full p-4 resize-none outline-none text-sm"
              style={{
                backgroundColor: "var(--bg-card)",
                color: "var(--text-primary)",
                minHeight: "500px",
              }}
              placeholder="在这里编写你的 AGENTS.md 内容..."
              spellCheck={false}
            />
          </div>
        )}

        {(mode === "preview" || mode === "split") && (
          <div
            className={`${mode === "split" ? "w-1/2" : "w-full"} p-6 overflow-auto markdown-preview`}
            style={{ minHeight: "500px" }}
          >
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
