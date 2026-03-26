"use client";

import { useStore } from "@/store/useStore";
import Link from "next/link";
import { ArrowLeft, BarChart3, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { RiskBadge } from "@/components/RiskBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDate } from "@/lib/utils";
import type { TrackingStatus } from "@/types";
import { useState } from "react";

/**
 * @description 回复效果追踪与优化建议页面
 */
export default function TrackingPage() {
  const reviews = useStore((s) => s.reviews);
  const [filter, setFilter] = useState<TrackingStatus | "all">("all");

  const filteredReviews =
    filter === "all"
      ? reviews
      : reviews.filter((r) => r.trackingStatus === filter);

  const stats = {
    total: reviews.length,
    draft: reviews.filter((r) => r.trackingStatus === "draft").length,
    sent: reviews.filter((r) => r.trackingStatus === "sent").length,
    effective: reviews.filter((r) => r.trackingStatus === "effective").length,
    needsRevision: reviews.filter((r) => r.trackingStatus === "needs_revision").length,
  };

  const effectiveRate =
    stats.sent + stats.effective > 0
      ? Math.round((stats.effective / (stats.sent + stats.effective)) * 100)
      : 0;

  /**
   * @description 根据评价数据生成优化建议
   */
  const getOptimizationTips = (): string[] => {
    const tips: string[] = [];

    if (stats.draft > 0) {
      tips.push(
        `您有 ${stats.draft} 条评价尚未回复，建议尽快处理以避免负面影响扩大。`
      );
    }

    if (stats.needsRevision > 0) {
      tips.push(
        `${stats.needsRevision} 条回复需要修改，建议调整回复策略以提高效果。`
      );
    }

    if (effectiveRate < 50 && stats.sent > 0) {
      tips.push(
        "当前挽回率低于 50%，建议：1) 回复更及时 2) 语气更真诚 3) 提供具体解决方案。"
      );
    }

    const criticalReviews = reviews.filter(
      (r) => r.sentiment?.riskLevel === "critical" && r.trackingStatus === "draft"
    );
    if (criticalReviews.length > 0) {
      tips.push(
        `有 ${criticalReviews.length} 条高危评价未处理，这些评价对声誉影响最大，应优先处理。`
      );
    }

    if (tips.length === 0) {
      tips.push("表现不错！继续保持及时、专业的回复习惯。");
    }

    return tips;
  };

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/"
          className="rounded-lg p-1.5 hover:bg-surface dark:hover:bg-surface-dark"
        >
          <ArrowLeft size={20} className="text-text dark:text-text-dark" />
        </Link>
        <h1 className="text-lg font-bold text-text dark:text-text-dark">
          效果追踪
        </h1>
      </div>

      {/* Overview Stats */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-border bg-surface p-3 text-center dark:border-border-dark dark:bg-surface-dark">
          <BarChart3 size={18} className="mx-auto mb-1 text-primary" />
          <p className="text-lg font-bold text-text dark:text-text-dark">
            {stats.total}
          </p>
          <p className="text-xs text-text-muted dark:text-text-muted-dark">
            总评价
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-3 text-center dark:border-border-dark dark:bg-surface-dark">
          <CheckCircle size={18} className="mx-auto mb-1 text-success" />
          <p className="text-lg font-bold text-text dark:text-text-dark">
            {stats.effective}
          </p>
          <p className="text-xs text-text-muted dark:text-text-muted-dark">
            已挽回
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-3 text-center dark:border-border-dark dark:bg-surface-dark">
          <TrendingUp size={18} className="mx-auto mb-1 text-warning" />
          <p className="text-lg font-bold text-text dark:text-text-dark">
            {effectiveRate}%
          </p>
          <p className="text-xs text-text-muted dark:text-text-muted-dark">
            挽回率
          </p>
        </div>
      </div>

      {/* Optimization Tips */}
      <div className="mb-6 rounded-xl border border-primary/20 bg-primary/5 p-4">
        <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-text dark:text-text-dark">
          <TrendingUp size={16} className="text-primary" />
          优化建议
        </h2>
        <ul className="space-y-2">
          {getOptimizationTips().map((tip, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-xs leading-relaxed text-text-muted dark:text-text-muted-dark"
            >
              <Clock size={12} className="mt-0.5 shrink-0 text-primary" />
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* Filter Tabs */}
      <div className="mb-4 flex gap-2 overflow-x-auto">
        {[
          { key: "all", label: "全部" },
          { key: "draft", label: "草稿" },
          { key: "sent", label: "已发送" },
          { key: "effective", label: "有效" },
          { key: "needs_revision", label: "需修改" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key as TrackingStatus | "all")}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === key
                ? "bg-primary text-white"
                : "bg-surface text-text-muted hover:bg-primary/10 dark:bg-surface-dark dark:text-text-muted-dark"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Review List */}
      {filteredReviews.length === 0 ? (
        <EmptyState
          icon={BarChart3}
          title="暂无记录"
          description={
            filter === "all"
              ? "分析评价后，追踪记录会显示在这里"
              : "该筛选条件下暂无记录"
          }
        />
      ) : (
        <div className="space-y-3">
          {filteredReviews.map((review) => (
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
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-text-muted dark:text-text-muted-dark">
                  {review.platform}
                </span>
                <span className="text-xs text-text-muted dark:text-text-muted-dark">
                  {review.replies.length} 条回复
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
