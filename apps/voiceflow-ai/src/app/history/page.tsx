'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import Header from '@/components/Header';
import NoteCard from '@/components/NoteCard';
import NoteDetail from '@/components/NoteDetail';
import { useStore } from '@/store/useStore';

/**
 * @description 历史记录页面 — 展示所有笔记，支持搜索
 */
export default function HistoryPage() {
  const { notes } = useStore();
  const [query, setQuery] = useState('');

  const filtered = query.trim()
    ? notes.filter(
        (n) =>
          n.title.toLowerCase().includes(query.toLowerCase()) ||
          n.rewrittenText.toLowerCase().includes(query.toLowerCase())
      )
    : notes;

  return (
    <>
      <Header />
      <NoteDetail />

      <main className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">历史记录</h1>

        {/* 搜索栏 */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索笔记..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            {notes.length === 0 ? '还没有任何笔记，去首页录制你的第一条语音吧' : '没有找到匹配的笔记'}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
