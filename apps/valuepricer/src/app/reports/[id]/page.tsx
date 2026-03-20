"use client";

import { use } from "react";
import { useStore } from "@/store/useStore";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { INDUSTRY_CONFIG } from "@/lib/pricing";
import { generatePricingPDF } from "@/lib/pdf";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  TrendingUp,
  DollarSign,
  Target,
  Lightbulb,
  BarChart3,
  Lock,
} from "lucide-react";

/**
 * @description Pricing report detail page
 */
export default function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const recommendations = useStore((s) => s.recommendations);
  const inputs = useStore((s) => s.inputs);
  const tier = useStore((s) => s.settings.subscriptionTier);
  const rec = recommendations.find((r) => r.id === id);

  if (!rec) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <p className="mb-2 text-lg font-semibold text-text dark:text-text-dark">
            Report Not Found
          </p>
          <Link href="/reports" className="text-sm text-primary">
            Back to Reports
          </Link>
        </div>
      </div>
    );
  }

  const input = inputs.find((i) => i.id === rec.inputId);

  /**
   * @description Handle PDF export (Premium only)
   */
  function handleExportPDF() {
    if (tier === "free") {
      alert("PDF export is a Premium feature. Please upgrade to Premium to unlock unlimited report exports.");
      return;
    }
    if (input) {
      generatePricingPDF(rec!, input);
    }
  }

  return (
    <div className="p-4">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/reports"
            className="rounded-lg p-2 text-text-muted transition-colors hover:bg-border/30 dark:text-text-muted-dark dark:hover:bg-border-dark/30"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-text dark:text-text-dark">
              {rec.productName}
            </h1>
            <p className="text-xs text-text-muted dark:text-text-muted-dark">
              {INDUSTRY_CONFIG[rec.industry].label}
            </p>
          </div>
        </div>
        <button
          onClick={handleExportPDF}
          className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-primary-dark"
        >
          {tier === "free" ? <Lock size={14} /> : <Download size={14} />}
          Export PDF
        </button>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-surface p-3 text-center shadow-sm dark:bg-surface-dark">
          <DollarSign size={16} className="mx-auto mb-1 text-primary" />
          <p className="text-xs text-text-muted dark:text-text-muted-dark">
            Monthly Value
          </p>
          <p className="text-lg font-bold text-text dark:text-text-dark">
            {formatCurrency(rec.totalValueDelivered)}
          </p>
        </div>
        <div className="rounded-xl bg-surface p-3 text-center shadow-sm dark:bg-surface-dark">
          <TrendingUp size={16} className="mx-auto mb-1 text-success" />
          <p className="text-xs text-text-muted dark:text-text-muted-dark">
            Customer ROI
          </p>
          <p className="text-lg font-bold text-success">{rec.roi.toFixed(1)}x</p>
        </div>
        <div className="rounded-xl bg-surface p-3 text-center shadow-sm dark:bg-surface-dark">
          <Target size={16} className="mx-auto mb-1 text-accent" />
          <p className="text-xs text-text-muted dark:text-text-muted-dark">
            Pricing Model
          </p>
          <p className="text-xs font-bold text-text dark:text-text-dark">
            {rec.recommendedModel.replace(/_/g, " ").toUpperCase()}
          </p>
        </div>
      </div>

      <div className="mb-4 rounded-xl bg-surface p-4 shadow-sm dark:bg-surface-dark">
        <p className="mb-2 text-sm font-semibold text-text dark:text-text-dark">
          Model Recommendation Rationale
        </p>
        <p className="text-sm text-text-muted dark:text-text-muted-dark">
          {rec.modelReasoning}
        </p>
      </div>

      <div className="mb-4">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-text dark:text-text-dark">
          <BarChart3 size={18} />
          Recommended Pricing Tiers
        </h2>
        <div className="space-y-3">
          {rec.tiers.map((pricingTier, index) => (
            <div
              key={pricingTier.name}
              className={`rounded-xl border p-4 ${
                index === 1
                  ? "border-primary bg-primary/5 dark:bg-primary/10"
                  : "border-border bg-surface dark:border-border-dark dark:bg-surface-dark"
              }`}
            >
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-text dark:text-text-dark">
                      {pricingTier.name}
                    </p>
                    {index === 1 && (
                      <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-medium text-white">
                        Recommended
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-text-muted dark:text-text-muted-dark">
                    Value Capture: {formatPercent(pricingTier.valueCapture)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-primary">
                    {formatCurrency(pricingTier.monthlyPrice)}
                    <span className="text-xs font-normal text-text-muted dark:text-text-muted-dark">
                      /mo
                    </span>
                  </p>
                  <p className="text-xs text-text-muted dark:text-text-muted-dark">
                    {formatCurrency(pricingTier.annualPrice)}/yr
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {pricingTier.features.map((feature) => (
                  <span
                    key={feature}
                    className="rounded-md bg-bg px-2 py-1 text-[11px] text-text-muted dark:bg-bg-dark dark:text-text-muted-dark"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4 rounded-xl bg-surface p-4 shadow-sm dark:bg-surface-dark">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-text dark:text-text-dark">
          <Lightbulb size={16} className="text-warning" />
          Key Insights
        </h2>
        <ul className="space-y-2">
          {rec.keyInsights.map((insight, i) => (
            <li
              key={i}
              className="text-sm text-text-muted dark:text-text-muted-dark"
            >
              <span className="mr-2 text-primary">•</span>
              {insight}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-4 rounded-xl bg-surface p-4 shadow-sm dark:bg-surface-dark">
        <h2 className="mb-2 text-sm font-semibold text-text dark:text-text-dark">
          Competitor Analysis
        </h2>
        <p className="text-sm text-text-muted dark:text-text-muted-dark">
          {rec.competitorComparison}
        </p>
      </div>
    </div>
  );
}
