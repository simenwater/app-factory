"use client";

import { useStore } from "@/store/useStore";
import { formatCurrency, formatDate } from "@/lib/utils";
import { INDUSTRY_CONFIG } from "@/lib/pricing";
import { EmptyState } from "@/components/EmptyState";
import { FileText, Trash2 } from "lucide-react";
import Link from "next/link";

/**
 * @description Reports list page showing all generated pricing strategy reports
 */
export default function ReportsPage() {
  const recommendations = useStore((s) => s.recommendations);
  const removeRecommendation = useStore((s) => s.removeRecommendation);

  if (recommendations.length === 0) {
    return (
      <div className="p-4">
        <h1 className="mb-6 text-2xl font-bold text-text dark:text-text-dark">
          Pricing Reports
        </h1>
        <EmptyState
          icon={FileText}
          title="No reports yet"
          description="After analyzing customer value with the calculator, your pricing strategy reports will appear here."
        />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text dark:text-text-dark">
          Pricing Reports
        </h1>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          {recommendations.length} {recommendations.length === 1 ? "report" : "reports"}
        </span>
      </div>

      <div className="space-y-3">
        {[...recommendations].reverse().map((rec) => (
          <div
            key={rec.id}
            className="rounded-xl bg-surface shadow-sm dark:bg-surface-dark"
          >
            <Link href={`/reports/${rec.id}`} className="block p-4">
              <div className="mb-2 flex items-start justify-between">
                <div>
                  <p className="font-semibold text-text dark:text-text-dark">
                    {rec.productName}
                  </p>
                  <p className="text-xs text-text-muted dark:text-text-muted-dark">
                    {INDUSTRY_CONFIG[rec.industry].label} ·{" "}
                    {formatDate(rec.createdAt)}
                  </p>
                </div>
                <span className="rounded-lg bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                  {rec.recommendedModel.replace(/_/g, " ")}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {rec.tiers.map((tier) => (
                  <div
                    key={tier.name}
                    className="rounded-lg bg-bg p-2 text-center dark:bg-bg-dark"
                  >
                    <p className="text-[10px] text-text-muted dark:text-text-muted-dark">
                      {tier.name.split(" ")[0]}
                    </p>
                    <p className="text-sm font-bold text-text dark:text-text-dark">
                      {formatCurrency(tier.monthlyPrice)}
                    </p>
                  </div>
                ))}
              </div>
            </Link>
            <div className="flex items-center justify-between border-t border-border px-4 py-2 dark:border-border-dark">
              <p className="text-xs text-success">
                Monthly Value: {formatCurrency(rec.totalValueDelivered)} · ROI{" "}
                {rec.roi.toFixed(1)}x
              </p>
              <button
                onClick={() => removeRecommendation(rec.id)}
                className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-danger/10 hover:text-danger dark:text-text-muted-dark"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
