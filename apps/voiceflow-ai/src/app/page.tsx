'use client';

import Header from '@/components/Header';
import RecordButton from '@/components/RecordButton';
import StyleSelector from '@/components/StyleSelector';
import NoteCard from '@/components/NoteCard';
import NoteDetail from '@/components/NoteDetail';
import { useStore } from '@/store/useStore';

/**
 * @description 首页 — 录音与最近笔记展示
 */
export default function HomePage() {
  const { notes } = useStore();
  const recentNotes = notes.slice(0, 6);

  return (
    <>
      <Header />
      <NoteDetail />

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Hero 区域 */}
        <section className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              语音笔记，AI 整理
            </span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            录音或上传音频，AI 自动去除口语废话、提炼要点，输出结构化笔记
          </p>
        </section>

        {/* 风格选择 */}
        <section className="mb-8">
          <StyleSelector />
        </section>

        {/* 录音按钮 */}
        <section className="mb-12">
          <RecordButton />
        </section>

        {/* 最近笔记 */}
        {recentNotes.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">最近笔记</h2>
              {notes.length > 6 && (
                <a
                  href="/history"
                  className="text-sm text-violet-600 dark:text-violet-400 hover:underline"
                >
                  查看全部 →
                </a>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recentNotes.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
