"use client";

/**
 * @fileoverview 首页 — 展示欢迎信息并重定向到乐谱库
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Music2 } from "lucide-react";

/**
 * @returns {JSX.Element} 首页
 */
export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => router.replace("/library"), 2000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center text-center animate-fade-in">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25">
        <Music2 size={40} />
      </div>
      <h1 className="mb-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        LeadSync Pro
      </h1>
      <p className="mb-8 max-w-xs text-sm text-zinc-500 dark:text-zinc-400">
        Lead sheet management for jazz &amp; pop musicians.
        Edit, sync, and share with iReal Pro.
      </p>
      <div className="flex items-center gap-2 text-xs text-zinc-400">
        <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-500" />
        Loading your library...
      </div>
    </div>
  );
}
