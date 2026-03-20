"use client";

import { useStore } from "@/store/useStore";
import { formatCurrency, formatDate } from "@/lib/utils";
import { INDUSTRY_CONFIG } from "@/lib/pricing";
import Link from "next/link";
import {
  Calculator,
  TrendingUp,
  FileText,
  ArrowRight,
  Sparkles,
} from "lucide-react";

/**
 * @description 首页仪表盘，展示概览信息和快速操作
 */
export default function HomePage() {
  const inputs = useStore((s) => s.inputs);
  const recommendations = useStore((s) => s.recommendations);
  const tier = useStore((s) => s.settings.subscriptionTier);

  const totalValue = recommendations.reduce(
    (sum, r) => sum + r.totalValueDelivered,
    0
  );

  return (
    <div className="p-4">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text dark:text-text-dark">
            ValuePricer
          </h1>
          <p className="text-sm text-text-muted dark:text-text-muted-dark">
            基于价值的 B2B SaaS 定价策略
          </p>
        </div>
        {tier === "premium" && (
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            Premium
          </span>
        )}
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-surface p-4 shadow-sm dark:bg-surface-dark">
          <div className="mb-1 flex items-center gap-2 text-text-muted dark:text-text-muted-dark">
            <Calculator size={14} />
            <span className="text-xs">分析数量</span>
          </div>
          <p className="text-2xl font-bold text-text dark:text-text-dark">
            {inputs.length}
          </p>
        </div>
        <div className="rounded-xl bg-surface p-4 shadow-sm dark:bg-surface-dark">
          <div className="mb-1 flex items-center gap-2 text-text-muted dark:text-text-muted-dark">
            <TrendingUp size={14} />
            <span className="text-xs">总价值</span>
          </div>
          <p className="text-2xl font-bold text-primary">
            {formatCurrency(totalValue)}
          </p>
        </div>
      </div>

      <Link
        href="/calculator"
        className="mb-6 flex items-center justify-between rounded-xl bg-primary p-4 text-white shadow-md transition-transform active:scale-[0.98]"
      >
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-white/20 p-2">
            <Sparkles size={20} />
          </div>
          <div>
            <p className="font-semibold">开始新的定价分析</p>
            <p className="text-xs text-white/80">输入客户价值，获取定价建议</p>
          </div>
        </div>
        <ArrowRight size={20} />
      </Link>

      <div className="mb-4">
        <h2 className="mb-3 text-lg font-semibold text-text dark:text-text-dark">
          最近报告
        </h2>
        {recommendations.length === 0 ? (
          <div className="rounded-xl bg-surface p-6 text-center shadow-sm dark:bg-surface-dark">
            <FileText
              size={32}
              className="mx-auto mb-2 text-text-muted dark:text-text-muted-dark"
            />
            <p className="text-sm text-text-muted dark:text-text-muted-dark">
              还没有报告，开始第一次分析吧！
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {recommendations
              .slice(-3)
              .reverse()
              .map((rec) => (
                <Link
                  key={rec.id}
                  href={`/reports/${rec.id}`}
                  className="flex items-center justify-between rounded-xl bg-surface p-4 shadow-sm transition-colors hover:bg-border/30 dark:bg-surface-dark dark:hover:bg-border-dark/30"
                >
                  <div>
                    <p className="font-medium text-text dark:text-text-dark">
                      {rec.productName}
                    </p>
                    <p className="text-xs text-text-muted dark:text-text-muted-dark">
                      {INDUSTRY_CONFIG[rec.industry].label} ·{" "}
                      {formatDate(rec.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">
                      {formatCurrency(rec.tiers[1]?.monthlyPrice || 0)}/mo
                    </p>
                    <p className="text-xs text-success">
                      ROI {rec.roi.toFixed(1)}x
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
