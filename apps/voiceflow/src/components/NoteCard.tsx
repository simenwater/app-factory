"use client";

import Link from "next/link";
import { Clock, ChevronRight } from "lucide-react";
import { formatDate, formatDuration } from "@/lib/utils";
import StatusBadge from "./StatusBadge";
import type { VoiceNote } from "@/types";

/**
 * @description 笔记卡片组件
 */
export default function NoteCard({ note }: { note: VoiceNote }) {
  return (
    <Link
      href={`/notes/${note.id}`}
      className="block rounded-2xl bg-surface p-4 transition-all hover:bg-surface-alt active:scale-[0.98]"
    >
      <div className="mb-2 flex items-start justify-between">
        <h3 className="line-clamp-1 flex-1 text-base font-semibold text-text">
          {note.title}
        </h3>
        <ChevronRight className="ml-2 h-4 w-4 flex-shrink-0 text-text-muted" />
      </div>

      {note.summary && (
        <p className="mb-3 line-clamp-2 text-sm text-text-muted">
          {note.summary}
        </p>
      )}

      <div className="flex items-center gap-3">
        <StatusBadge status={note.status} />
        <span className="flex items-center gap-1 text-xs text-text-muted">
          <Clock className="h-3 w-3" />
          {formatDuration(note.duration)}
        </span>
        <span className="text-xs text-text-muted">
          {formatDate(note.createdAt)}
        </span>
      </div>

      {note.keyPoints.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {note.keyPoints.slice(0, 3).map((point, i) => (
            <span
              key={i}
              className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary"
            >
              {point.length > 20 ? point.slice(0, 20) + "…" : point}
            </span>
          ))}
          {note.keyPoints.length > 3 && (
            <span className="rounded-full bg-surface-alt px-2 py-0.5 text-xs text-text-muted">
              +{note.keyPoints.length - 3}
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
