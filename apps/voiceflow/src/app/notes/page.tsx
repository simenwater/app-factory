"use client";

import { useState } from "react";
import { Search, FileText } from "lucide-react";
import { useStore } from "@/store/useStore";
import NoteCard from "@/components/NoteCard";
import EmptyState from "@/components/EmptyState";

/**
 * @description 笔记列表页面
 */
export default function NotesPage() {
  const notes = useStore((s) => s.notes);
  const [search, setSearch] = useState("");

  const filtered = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.summary.toLowerCase().includes(search.toLowerCase()) ||
      n.transcript.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-4 pt-12">
      <h1 className="mb-6 text-2xl font-bold text-text">我的笔记</h1>

      {notes.length > 0 && (
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="搜索笔记..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl bg-surface py-3 pl-10 pr-4 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      )}

      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      ) : notes.length > 0 ? (
        <EmptyState
          icon={Search}
          title="未找到结果"
          description="尝试使用不同的关键词搜索"
        />
      ) : (
        <EmptyState
          icon={FileText}
          title="暂无笔记"
          description="前往首页上传语音文件或录音，开始您的第一份智能笔记"
        />
      )}
    </div>
  );
}
