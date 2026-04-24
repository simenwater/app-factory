"use client";

import { useState } from "react";
import { Search, Inbox } from "lucide-react";
import { useStore } from "@/store/useStore";
import { NoteCard } from "@/components/NoteCard";
import { PolishResult } from "@/components/PolishResult";
import type { VoiceNote } from "@/types";

/**
 * @page HistoryPage
 * 历史记录页面，展示所有语音笔记
 */
export default function HistoryPage() {
  const notes = useStore((s) => s.notes);
  const removeNote = useStore((s) => s.removeNote);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNote, setSelectedNote] = useState<VoiceNote | null>(null);

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.rawTranscript.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedNote) {
    return (
      <div className="px-4 md:px-8 py-8 space-y-6">
        <button
          onClick={() => setSelectedNote(null)}
          className="text-sm text-violet-600 dark:text-violet-400 hover:underline"
        >
          ← 返回列表
        </button>

        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {selectedNote.title || "未命名笔记"}
          </h2>
        </div>

        <div className="w-full max-w-2xl">
          <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            原始转录
          </h3>
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
            {selectedNote.rawTranscript}
          </div>
        </div>

        {selectedNote.polishedOutputs.map((output) => (
          <PolishResult
            key={output.id}
            content={output.content}
            format={output.format}
            onRegenerate={() => {}}
            isLoading={false}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          历史记录
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          查看和管理您的语音笔记
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="搜索笔记..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
        />
      </div>

      {filteredNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
          <Inbox className="w-12 h-12 mb-3" />
          <p className="text-sm">
            {searchQuery ? "没有找到匹配的笔记" : "暂无历史记录"}
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onDelete={removeNote}
              onSelect={setSelectedNote}
            />
          ))}
        </div>
      )}
    </div>
  );
}
