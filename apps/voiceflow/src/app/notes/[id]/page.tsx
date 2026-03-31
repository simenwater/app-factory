"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Share2,
  Trash2,
  Clock,
  FileText,
  CheckSquare,
  Key,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { formatDate, formatDuration, formatFileSize } from "@/lib/utils";
import StatusBadge from "@/components/StatusBadge";
import ExportModal from "@/components/ExportModal";

/**
 * @description 笔记详情页面
 */
export default function NoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const note = useStore((s) => s.notes.find((n) => n.id === id));
  const deleteNote = useStore((s) => s.deleteNote);
  const [showExport, setShowExport] = useState(false);
  const [activeTab, setActiveTab] = useState<"summary" | "transcript">(
    "summary"
  );

  if (!note) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-text-muted">笔记不存在</p>
      </div>
    );
  }

  /**
   * @description 删除笔记并返回列表
   */
  const handleDelete = () => {
    if (confirm("确定要删除这条笔记吗？")) {
      deleteNote(id);
      router.push("/notes");
    }
  };

  return (
    <div className="px-4 pt-6">
      {/* 顶部导航 */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-sm text-text-muted hover:text-text"
        >
          <ArrowLeft className="h-4 w-4" />
          返回
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowExport(true)}
            className="rounded-full bg-primary p-2 text-white hover:bg-primary-hover"
          >
            <Share2 className="h-4 w-4" />
          </button>
          <button
            onClick={handleDelete}
            className="rounded-full bg-surface-alt p-2 text-red-500 hover:bg-red-500/10"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 标题 & 元信息 */}
      <h1 className="mb-3 text-2xl font-bold text-text">{note.title}</h1>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <StatusBadge status={note.status} />
        <span className="flex items-center gap-1 text-xs text-text-muted">
          <Clock className="h-3 w-3" />
          {formatDuration(note.duration)}
        </span>
        <span className="text-xs text-text-muted">
          {formatFileSize(note.fileSize)}
        </span>
        <span className="text-xs text-text-muted">
          {formatDate(note.createdAt)}
        </span>
      </div>

      {/* Tab 切换 */}
      <div className="mb-4 flex rounded-xl bg-surface-alt p-1">
        <button
          onClick={() => setActiveTab("summary")}
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
            activeTab === "summary"
              ? "bg-surface text-text shadow-sm"
              : "text-text-muted"
          }`}
        >
          AI 摘要
        </button>
        <button
          onClick={() => setActiveTab("transcript")}
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
            activeTab === "transcript"
              ? "bg-surface text-text shadow-sm"
              : "text-text-muted"
          }`}
        >
          完整转录
        </button>
      </div>

      {activeTab === "summary" ? (
        <div className="space-y-4">
          {/* 摘要 */}
          {note.summary && (
            <div className="rounded-2xl bg-surface p-4">
              <div className="mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-text">摘要</h3>
              </div>
              <p className="text-sm leading-relaxed text-text-muted">
                {note.summary}
              </p>
            </div>
          )}

          {/* 关键要点 */}
          {note.keyPoints.length > 0 && (
            <div className="rounded-2xl bg-surface p-4">
              <div className="mb-3 flex items-center gap-2">
                <Key className="h-4 w-4 text-amber-500" />
                <h3 className="text-sm font-semibold text-text">关键要点</h3>
              </div>
              <ul className="space-y-2">
                {note.keyPoints.map((point, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-text-muted"
                  >
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-xs font-medium text-amber-500">
                      {i + 1}
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 行动项 */}
          {note.actionItems.length > 0 && (
            <div className="rounded-2xl bg-surface p-4">
              <div className="mb-3 flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-emerald-500" />
                <h3 className="text-sm font-semibold text-text">行动项</h3>
              </div>
              <ul className="space-y-2">
                {note.actionItems.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-text-muted"
                  >
                    <span className="mt-0.5 h-4 w-4 flex-shrink-0 rounded border border-border" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-2xl bg-surface p-4">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-muted">
            {note.transcript || "暂无转录内容"}
          </p>
        </div>
      )}

      {showExport && (
        <ExportModal note={note} onClose={() => setShowExport(false)} />
      )}
    </div>
  );
}
