"use client";

import { useState } from "react";
import { Clock, Trash2, Copy, Check } from "lucide-react";
import { useStore } from "@/store/useStore";
import { EmptyState } from "@/components/EmptyState";
import { formatRelativeTime, formatDuration, truncateText, copyToClipboard } from "@/lib/utils";
import { TEMPLATES } from "@/lib/templates";

/**
 * @description 历史记录页面，展示所有已保存的录音记录
 */
export default function HistoryPage() {
  const recordings = useStore((s) => s.recordings);
  const deleteRecording = useStore((s) => s.deleteRecording);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  /**
   * @description 复制指定记录的格式化文本
   * @param {string} id - 记录ID
   * @param {string} text - 文本内容
   */
  const handleCopy = async (id: string, text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  if (recordings.length === 0) {
    return (
      <div className="px-4 pt-6">
        <h1 className="text-xl font-bold text-text dark:text-text-dark">
          历史记录
        </h1>
        <EmptyState
          icon={Clock}
          title="暂无录音记录"
          description="完成你的第一次语音录制后，记录将显示在这里"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 px-4 pt-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-text dark:text-text-dark">
          历史记录
        </h1>
        <span className="text-xs text-text-muted dark:text-text-muted-dark">
          共 {recordings.length} 条
        </span>
      </div>

      <div className="space-y-3">
        {recordings.map((recording) => {
          const template = TEMPLATES.find((t) => t.id === recording.template);
          const isExpanded = expandedId === recording.id;

          return (
            <div
              key={recording.id}
              className="rounded-xl bg-surface p-4 shadow-sm dark:bg-surface-dark"
            >
              <div className="mb-2 flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary dark:bg-primary/20 dark:text-primary-light">
                    {template?.name || recording.template}
                  </span>
                  <span className="text-xs text-text-muted dark:text-text-muted-dark">
                    {formatDuration(recording.duration)}
                  </span>
                </div>
                <span className="text-xs text-text-muted dark:text-text-muted-dark">
                  {formatRelativeTime(recording.createdAt)}
                </span>
              </div>

              <button
                onClick={() =>
                  setExpandedId(isExpanded ? null : recording.id)
                }
                className="mb-3 w-full text-left text-sm text-text dark:text-text-dark"
              >
                {isExpanded
                  ? recording.formatted
                  : truncateText(recording.formatted, 120)}
              </button>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => handleCopy(recording.id, recording.formatted)}
                  className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs text-text-muted transition-colors hover:bg-border dark:text-text-muted-dark dark:hover:bg-border-dark"
                >
                  {copiedId === recording.id ? (
                    <Check size={14} />
                  ) : (
                    <Copy size={14} />
                  )}
                  {copiedId === recording.id ? "已复制" : "复制"}
                </button>
                <button
                  onClick={() => deleteRecording(recording.id)}
                  className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs text-danger transition-colors hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                  <Trash2 size={14} />
                  删除
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
