"use client";

import { Trash2, ChevronRight } from "lucide-react";
import { formatDate, truncateText, formatDuration } from "@/lib/utils";
import type { VoiceNote } from "@/types";

/**
 * @component NoteCard
 * 历史语音笔记卡片
 */
export function NoteCard({
  note,
  onDelete,
  onSelect,
}: {
  note: VoiceNote;
  onDelete: (id: string) => void;
  onSelect: (note: VoiceNote) => void;
}) {
  return (
    <div className="group rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 hover:border-violet-300 dark:hover:border-violet-700 transition-all">
      <div className="flex items-start justify-between">
        <button
          onClick={() => onSelect(note)}
          className="flex-1 text-left"
        >
          <h3 className="font-medium text-slate-900 dark:text-white text-sm">
            {note.title || "未命名笔记"}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {formatDate(note.createdAt)} · {formatDuration(note.duration)}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 line-clamp-2">
            {truncateText(note.rawTranscript, 120)}
          </p>
          {note.polishedOutputs.length > 0 && (
            <div className="flex items-center gap-1 mt-2">
              <span className="text-xs bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300 px-2 py-0.5 rounded-full">
                {note.polishedOutputs.length} 个润色版本
              </span>
            </div>
          )}
        </button>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onDelete(note.id)}
            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 text-slate-400 hover:text-red-500 transition-colors"
            title="删除"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onSelect(note)}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
