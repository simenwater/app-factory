"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/store";
import { Header } from "@/components/Header";
import { RecordButton } from "@/components/RecordButton";
import { NoteList } from "@/components/NoteList";
import { NoteDetail } from "@/components/NoteDetail";
import { PricingModal } from "@/components/PricingModal";

/**
 * @description VoiceFlow AI 主页面
 */
export default function Home() {
  const { darkMode } = useAppStore();
  const [showPricing, setShowPricing] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div className="flex h-screen flex-col bg-[var(--background)]">
      <Header />

      <main className="flex flex-1 overflow-hidden">
        {/* 左侧面板 - 录音 + 笔记列表 */}
        <aside className="flex w-80 flex-col border-r border-[var(--border)] bg-[var(--card)]">
          <div className="border-b border-[var(--border)] p-6">
            <RecordButton />
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <NoteList />
          </div>
          <div className="border-t border-[var(--border)] p-4">
            <button
              onClick={() => setShowPricing(true)}
              className="w-full rounded-lg border border-[var(--primary)]/30 bg-[var(--primary)]/5 px-4 py-2.5 text-sm font-medium text-[var(--primary)] transition-colors hover:bg-[var(--primary)]/10"
            >
              升级 Pro 版本
            </button>
          </div>
        </aside>

        {/* 右侧面板 - 笔记详情 */}
        <section className="flex-1 overflow-hidden">
          <NoteDetail />
        </section>
      </main>

      <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
    </div>
  );
}
