"use client";

/**
 * @fileoverview 首页 — 仪表盘
 */

import Link from "next/link";
import {
  Sparkles,
  Music,
  Library,
  Star,
  TrendingUp,
  Plus,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { SubscriptionBanner } from "@/components/SubscriptionBanner";
import { EmptyState } from "@/components/EmptyState";

/**
 * @description 首页仪表盘
 */
export default function HomePage() {
  const sheets = useStore((s) => s.sheets);
  const settings = useStore((s) => s.settings);
  const generationsThisMonth = useStore((s) => s.generationsThisMonth);

  const favorites = sheets.filter((s) => s.isFavorite);
  const recent = [...sheets]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const stats = [
    {
      label: "乐谱总数",
      value: sheets.length,
      icon: Music,
      color: "text-violet-500",
      bg: "bg-violet-50 dark:bg-violet-900/20",
    },
    {
      label: "收藏",
      value: favorites.length,
      icon: Star,
      color: "text-amber-500",
      bg: "bg-amber-50 dark:bg-amber-900/20",
    },
    {
      label: "本月生成",
      value: generationsThisMonth,
      icon: TrendingUp,
      color: "text-green-500",
      bg: "bg-green-50 dark:bg-green-900/20",
    },
    {
      label: "默认风格",
      value: settings.defaultStyle.replace("jazz-", "").replace(/^\w/, (c) => c.toUpperCase()),
      icon: Sparkles,
      color: "text-purple-500",
      bg: "bg-purple-50 dark:bg-purple-900/20",
    },
  ];

  return (
    <div className="px-4 pt-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">LeadSheet AI</h1>
          <p className="text-sm text-text-muted dark:text-text-muted-dark">
            智能乐谱助手 · 为爵士乐手而生
          </p>
        </div>
        <Link
          href="/generate"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-105"
        >
          <Plus size={20} />
        </Link>
      </div>

      {/* Subscription Banner */}
      <SubscriptionBanner />

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-2 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`rounded-2xl ${stat.bg} p-4 transition-shadow hover:shadow-md`}
          >
            <div className="mb-2 flex items-center gap-2">
              <stat.icon size={18} className={stat.color} />
              <span className="text-xs font-medium text-text-muted dark:text-text-muted-dark">
                {stat.label}
              </span>
            </div>
            <p className="text-xl font-bold text-text dark:text-text-dark">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
          快捷操作
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/generate"
            className="flex items-center gap-3 rounded-xl bg-surface p-4 shadow-sm transition-shadow hover:shadow-md dark:bg-surface-dark"
          >
            <div className="rounded-lg bg-primary/10 p-2">
              <Sparkles size={18} className="text-primary" />
            </div>
            <span className="text-sm font-medium">AI 生成乐谱</span>
          </Link>
          <Link
            href="/library"
            className="flex items-center gap-3 rounded-xl bg-surface p-4 shadow-sm transition-shadow hover:shadow-md dark:bg-surface-dark"
          >
            <div className="rounded-lg bg-amber-500/10 p-2">
              <Library size={18} className="text-amber-500" />
            </div>
            <span className="text-sm font-medium">浏览乐谱库</span>
          </Link>
        </div>
      </div>

      {/* Recent Sheets */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
            最近乐谱
          </h2>
          <Link
            href="/library"
            className="text-xs font-medium text-primary hover:underline"
          >
            查看全部
          </Link>
        </div>
        {recent.length === 0 ? (
          <EmptyState
            icon={Music}
            title="暂无乐谱"
            description="点击上方的 AI 生成按钮，创建你的第一份乐谱"
            action={
              <Link
                href="/generate"
                className="rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-white transition-transform hover:scale-105"
              >
                开始生成
              </Link>
            }
          />
        ) : (
          <div className="space-y-3">
            {recent.map((sheet) => (
              <Link
                key={sheet.id}
                href={`/player/${sheet.id}`}
                className="block rounded-xl bg-surface p-4 shadow-sm transition-shadow hover:shadow-md dark:bg-surface-dark"
              >
                <div className="mb-1 flex items-center justify-between">
                  <h3 className="font-medium text-text dark:text-text-dark">
                    {sheet.isFavorite && (
                      <Star size={14} className="mr-1 inline text-amber-500" fill="currentColor" />
                    )}
                    {sheet.title}
                  </h3>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                    {sheet.style.replace("jazz-", "")}
                  </span>
                </div>
                <p className="text-sm text-text-muted dark:text-text-muted-dark">
                  {sheet.key} · {sheet.tempo} BPM · {sheet.measures.length} 小节
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
