"use client";

import { FileText, Trash2, Clock } from "lucide-react";
import { useAppStore } from "@/store";
import { format } from "date-fns";
import { formatDuration } from "@/lib/transcription";

/**
 * @description 笔记列表组件 - 展示所有已转录笔记
 */
export function NoteList() {
  const { notes, currentNote, setCurrentNote, deleteNote } = useAppStore();

  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileText className="mb-4 h-12 w-12 text-[var(--muted)] opacity-50" />
        <p className="text-[var(--muted)]">还没有笔记</p>
        <p className="mt-1 text-sm text-[var(--muted)] opacity-70">
          点击上方按钮开始录音
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h2 className="mb-3 text-sm font-semibold text-[var(--muted)] uppercase tracking-wider">
        笔记列表 ({notes.length})
      </h2>
      {notes.map((note) => (
        <div
          key={note.id}
          onClick={() => setCurrentNote(note)}
          className={`cursor-pointer rounded-xl border p-4 transition-all hover:shadow-md ${
            currentNote?.id === note.id
              ? "border-[var(--primary)] bg-[var(--primary)]/5 shadow-sm"
              : "border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)]/50"
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-[var(--foreground)] truncate">
                {note.summary.title}
              </h3>
              <p className="mt-1 text-sm text-[var(--muted)] line-clamp-2">
                {note.summary.summary}
              </p>
              <div className="mt-2 flex items-center gap-3 text-xs text-[var(--muted)]">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {format(new Date(note.createdAt), "MM/dd HH:mm")}
                </span>
                <span>{formatDuration(note.transcription.duration)}</span>
                {note.summary.todoItems.length > 0 && (
                  <span className="rounded-full bg-[var(--primary)]/10 px-2 py-0.5 text-[var(--primary)]">
                    {note.summary.todoItems.length} 待办
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteNote(note.id);
              }}
              className="ml-2 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-[var(--muted)] transition-colors hover:bg-[var(--danger)]/10 hover:text-[var(--danger)]"
              aria-label="删除笔记"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
          {note.summary.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {note.summary.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-[var(--secondary)] px-2 py-0.5 text-xs text-[var(--muted)]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
