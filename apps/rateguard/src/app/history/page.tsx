"use client";

/**
 * @fileoverview 分析历史列表页
 */

import { useRouter } from "next/navigation";
import { History, Trash2, ChevronRight } from "lucide-react";
import { useStore } from "@/store/useStore";
import { EmptyState } from "@/components/EmptyState";
import { RiskBadge } from "@/components/RiskBadge";
import { formatDate, truncateText } from "@/lib/utils";

export default function HistoryPage() {
  const router = useRouter();
  const { analyses, removeAnalysis } = useStore();

  if (analyses.length === 0) {
    return (
      <div>
        <h1 className="mb-6 text-xl font-bold text-foreground">分析历史</h1>
        <EmptyState
          icon={History}
          title="暂无分析记录"
          description="返回首页粘贴客户消息开始分析"
        />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">分析历史</h1>
        <span className="text-sm text-muted">{analyses.length} 条记录</span>
      </div>

      <div className="space-y-3">
        {analyses.map((analysis) => (
          <div
            key={analysis.id}
            className="group relative rounded-xl bg-surface p-4 shadow-sm border border-border transition-colors hover:border-primary/30"
          >
            <div
              className="cursor-pointer"
              onClick={() => router.push(`/history/${analysis.id}`)}
            >
              <div className="mb-2 flex items-center justify-between">
                <RiskBadge level={analysis.riskLevel} score={analysis.riskScore} />
                <span className="text-xs text-muted">
                  {formatDate(analysis.createdAt)}
                </span>
              </div>
              <p className="mb-2 text-sm text-foreground">
                {truncateText(analysis.originalMessage, 120)}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted">
                  {analysis.redFlags.length} 个警告信号
                </span>
                <ChevronRight
                  size={16}
                  className="text-muted group-hover:text-primary transition-colors"
                />
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                removeAnalysis(analysis.id);
              }}
              className="absolute right-3 top-3 rounded-lg p-1.5 text-muted opacity-0 transition-all hover:bg-danger/10 hover:text-danger group-hover:opacity-100"
              title="删除"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
