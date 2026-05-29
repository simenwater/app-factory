"use client";

import { useState } from "react";
import {
  Download,
  Copy,
  Check,
  CheckCircle2,
  Circle,
  Tag,
} from "lucide-react";
import { useAppStore } from "@/store";
import { exportNote, downloadFile } from "@/lib/export";
import type { ExportFormat, TodoItem } from "@/types";

/**
 * @description 笔记详情组件 - 展示 AI 生成的结构化笔记
 */
export function NoteDetail() {
  const { currentNote, updateNote } = useAppStore();
  const [copied, setCopied] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("markdown");

  if (!currentNote) {
    return (
      <div className="flex h-full items-center justify-center text-center">
        <div>
          <p className="text-lg text-[var(--muted)]">选择一条笔记查看详情</p>
          <p className="mt-2 text-sm text-[var(--muted)] opacity-70">
            或录制一段新的语音
          </p>
        </div>
      </div>
    );
  }

  const { summary, transcription } = currentNote;

  /**
   * @description 切换待办事项完成状态
   */
  const toggleTodo = (todoId: string) => {
    const updatedTodos = summary.todoItems.map((item) =>
      item.id === todoId ? { ...item, completed: !item.completed } : item
    );
    updateNote(currentNote.id, {
      summary: { ...summary, todoItems: updatedTodos },
    });
  };

  /**
   * @description 复制到剪贴板
   */
  const handleCopy = async () => {
    const content = exportNote(currentNote, exportFormat);
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /**
   * @description 下载文件
   */
  const handleDownload = () => {
    const content = exportNote(currentNote, exportFormat);
    const ext = exportFormat === "markdown" ? "md" : "txt";
    downloadFile(content, `${summary.title}.${ext}`);
  };

  /**
   * @description 获取优先级样式
   */
  const getPriorityStyle = (priority: TodoItem["priority"]) => {
    switch (priority) {
      case "high":
        return "text-[var(--danger)] bg-[var(--danger)]/10";
      case "medium":
        return "text-[var(--warning)] bg-[var(--warning)]/10";
      case "low":
        return "text-[var(--success)] bg-[var(--success)]/10";
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="space-y-6 p-6">
        {/* 标题 */}
        <div>
          <h2 className="text-2xl font-bold text-[var(--foreground)]">
            {summary.title}
          </h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {summary.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 rounded-full bg-[var(--primary)]/10 px-2.5 py-1 text-xs text-[var(--primary)]"
              >
                <Tag className="h-3 w-3" />
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* 摘要 */}
        <div className="rounded-xl bg-[var(--secondary)] p-4">
          <h3 className="mb-2 text-sm font-semibold text-[var(--muted)] uppercase tracking-wider">
            摘要
          </h3>
          <p className="text-[var(--foreground)] leading-relaxed">
            {summary.summary}
          </p>
        </div>

        {/* 关键要点 */}
        {summary.keyPoints.length > 0 && (
          <div>
            <h3 className="mb-3 text-sm font-semibold text-[var(--muted)] uppercase tracking-wider">
              关键要点
            </h3>
            <ul className="space-y-2">
              {summary.keyPoints.map((point, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-[var(--foreground)]"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--primary)]" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 待办事项 */}
        {summary.todoItems.length > 0 && (
          <div>
            <h3 className="mb-3 text-sm font-semibold text-[var(--muted)] uppercase tracking-wider">
              待办事项
            </h3>
            <ul className="space-y-2">
              {summary.todoItems.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-3 rounded-lg border border-[var(--border)] p-3 transition-colors hover:bg-[var(--secondary)]"
                >
                  <button
                    onClick={() => toggleTodo(item.id)}
                    className="flex-shrink-0"
                  >
                    {item.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-[var(--success)]" />
                    ) : (
                      <Circle className="h-5 w-5 text-[var(--muted)]" />
                    )}
                  </button>
                  <span
                    className={`flex-1 ${
                      item.completed
                        ? "text-[var(--muted)] line-through"
                        : "text-[var(--foreground)]"
                    }`}
                  >
                    {item.content}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${getPriorityStyle(item.priority)}`}
                  >
                    {item.priority === "high"
                      ? "高"
                      : item.priority === "medium"
                        ? "中"
                        : "低"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 原始转录 */}
        <div>
          <h3 className="mb-3 text-sm font-semibold text-[var(--muted)] uppercase tracking-wider">
            原始转录
          </h3>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--secondary)] p-4">
            <p className="whitespace-pre-wrap text-sm text-[var(--foreground)] leading-relaxed">
              {transcription.text}
            </p>
          </div>
        </div>

        {/* 导出工具栏 */}
        <div className="sticky bottom-0 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value as ExportFormat)}
              className="rounded-lg border border-[var(--border)] bg-[var(--secondary)] px-3 py-2 text-sm text-[var(--foreground)]"
            >
              <option value="markdown">Markdown / Obsidian</option>
              <option value="notion">Notion</option>
              <option value="email">Email</option>
            </select>

            <button
              onClick={handleCopy}
              className="flex items-center gap-2 rounded-lg bg-[var(--secondary)] px-4 py-2 text-sm text-[var(--foreground)] transition-colors hover:bg-[var(--border)]"
            >
              {copied ? (
                <Check className="h-4 w-4 text-[var(--success)]" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {copied ? "已复制" : "复制"}
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm text-white transition-colors hover:bg-[var(--primary-hover)]"
            >
              <Download className="h-4 w-4" />
              下载
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
