"use client";

import { useStore } from "@/store/useStore";
import Link from "next/link";
import {
  Shield,
  Search,
  BarChart3,
  MessageSquarePlus,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { RiskBadge } from "@/components/RiskBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDate } from "@/lib/utils";

/**
 * @description 首页/仪表盘
 */
export default function HomePage() {
  const reviews = useStore((s) => s.reviews);
  const settings = useStore((s) => s.settings);

  const stats = {
    total: reviews.length,
    critical: reviews.filter((r) => r.sentiment?.riskLevel === "critical").length,
    sent: reviews.filter((r) => r.trackingStatus === "sent" || r.trackingStatus === "effective").length,
    effective: reviews.filter((r) => r.trackingStatus === "effective").length,
  };

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-primary/10 p-2.5">
          <Shield size={28} className="text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-text dark:text-text-dark">
            ReplyGuard
          </h1>
          <p className="text-xs text-text-muted dark:text-text-muted-dark">
            AI 负面评价应急回复工具
          </p>
        </div>
      </div>

      {/* Plan Banner */}
      {settings.plan === "free" && (
        <Link
          href="/pricing"
          className="mb-6 flex items-center justify-between rounded-xl bg-gradient-to-r from-primary to-primary-light p-4 text-white"
        >
          <div>
            <p className="text-sm font-medium">免费版</p>
            <p className="text-xs opacity-80">
              剩余 {settings.freeRepliesRemaining} 次免费生成
            </p>
          </div>
          <span className="rounded-lg bg-white/20 px-3 py-1 text-xs font-medium">
            升级 Pro
          </span>
        </Link>
      )}

      {/* Stats Grid */}
      <div className="mb-6 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-border bg-surface p-4 dark:border-border-dark dark:bg-surface-dark">
          <div className="mb-1 flex items-center gap-2">
            <Search size={16} className="text-primary" />
            <span className="text-xs text-text-muted dark:text-text-muted-dark">
              总评价数
            </span>
          </div>
          <p className="text-2xl font-bold text-text dark:text-text-dark">
            {stats.total}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4 dark:border-border-dark dark:bg-surface-dark">
          <div className="mb-1 flex items-center gap-2">
            <AlertTriangle size={16} className="text-danger" />
            <span className="text-xs text-text-muted dark:text-text-muted-dark">
              高危评价
            </span>
          </div>
          <p className="text-2xl font-bold text-text dark:text-text-dark">
            {stats.critical}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4 dark:border-border-dark dark:bg-surface-dark">
          <div className="mb-1 flex items-center gap-2">
            <MessageSquarePlus size={16} className="text-success" />
            <span className="text-xs text-text-muted dark:text-text-muted-dark">
              已回复
            </span>
          </div>
          <p className="text-2xl font-bold text-text dark:text-text-dark">
            {stats.sent}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4 dark:border-border-dark dark:bg-surface-dark">
          <div className="mb-1 flex items-center gap-2">
            <TrendingUp size={16} className="text-warning" />
            <span className="text-xs text-text-muted dark:text-text-muted-dark">
              挽回率
            </span>
          </div>
          <p className="text-2xl font-bold text-text dark:text-text-dark">
            {stats.sent > 0
              ? `${Math.round((stats.effective / stats.sent) * 100)}%`
              : "—"}
          </p>
        </div>
      </div>

      {/* Quick Action */}
      <Link
        href="/analyze"
        className="mb-6 flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4 transition-colors hover:bg-primary/10"
      >
        <div className="rounded-lg bg-primary p-2">
          <Search size={20} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-text dark:text-text-dark">
            分析新评价
          </p>
          <p className="text-xs text-text-muted dark:text-text-muted-dark">
            粘贴负面评价，AI 立即生成回复
          </p>
        </div>
      </Link>

      {/* Recent Reviews */}
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-text dark:text-text-dark">
          最近评价
        </h2>
        {reviews.length > 0 && (
          <Link
            href="/tracking"
            className="text-xs text-primary hover:underline"
          >
            查看全部
          </Link>
        )}
      </div>

      {reviews.length === 0 ? (
        <EmptyState
          icon={BarChart3}
          title="暂无评价记录"
          description="点击上方「分析新评价」开始使用 ReplyGuard"
        />
      ) : (
        <div className="space-y-3">
          {reviews.slice(0, 5).map((review) => (
            <Link
              key={review.id}
              href={`/replies/${review.id}`}
              className="block rounded-xl border border-border bg-surface p-4 transition-colors hover:border-primary/30 dark:border-border-dark dark:bg-surface-dark"
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {review.sentiment && (
                    <RiskBadge level={review.sentiment.riskLevel} />
                  )}
                  <StatusBadge status={review.trackingStatus} />
                </div>
                <span className="text-xs text-text-muted dark:text-text-muted-dark">
                  {formatDate(review.createdAt)}
                </span>
              </div>
              <p className="line-clamp-2 text-sm text-text dark:text-text-dark">
                {review.originalText}
              </p>
              {review.platform && (
                <p className="mt-1 text-xs text-text-muted dark:text-text-muted-dark">
                  来源: {review.platform}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
