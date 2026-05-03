"use client";

import type { ATSScoreResult } from "@/types";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";

/**
 * @description ATS 评分展示卡片组件
 * @param {Object} props
 * @param {ATSScoreResult} props.result - ATS 评分结果
 */
export function ATSScoreCard({ result }: { result: ATSScoreResult }) {
  const scoreColor =
    result.overallScore >= 80
      ? "text-success"
      : result.overallScore >= 60
        ? "text-warning"
        : "text-danger";

  const scoreBg =
    result.overallScore >= 80
      ? "from-success/20 to-success/5"
      : result.overallScore >= 60
        ? "from-warning/20 to-warning/5"
        : "from-danger/20 to-danger/5";

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <div
        className={`rounded-2xl bg-gradient-to-br ${scoreBg} p-6 text-center`}
      >
        <div className="mb-2 text-sm font-medium text-text-muted dark:text-text-muted-dark">
          ATS Compatibility Score
        </div>
        <div className={`text-6xl font-bold ${scoreColor}`}>
          {result.overallScore}
        </div>
        <div className="text-text-muted dark:text-text-muted-dark">/ 100</div>
      </div>

      {/* Category Breakdown */}
      <div className="space-y-3">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-text dark:text-text-dark">
          <TrendingUp size={16} />
          Category Breakdown
        </h3>
        {result.categories.map((cat, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card p-4 dark:border-border-dark dark:bg-card-dark"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-text dark:text-text-dark">
                {cat.name}
              </span>
              <span className="text-sm font-bold text-text dark:text-text-dark">
                {cat.score}/{cat.maxScore}
              </span>
            </div>
            <div className="mb-2 h-2 overflow-hidden rounded-full bg-border dark:bg-border-dark">
              <div
                className={`h-full rounded-full transition-all ${
                  cat.score / cat.maxScore >= 0.8
                    ? "bg-success"
                    : cat.score / cat.maxScore >= 0.5
                      ? "bg-warning"
                      : "bg-danger"
                }`}
                style={{
                  width: `${(cat.score / cat.maxScore) * 100}%`,
                }}
              />
            </div>
            <p className="text-xs text-text-muted dark:text-text-muted-dark">
              {cat.feedback}
            </p>
          </div>
        ))}
      </div>

      {/* Suggestions */}
      {result.suggestions.length > 0 && (
        <div className="space-y-2">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-text dark:text-text-dark">
            <AlertTriangle size={16} className="text-warning" />
            Suggestions
          </h3>
          <ul className="space-y-2">
            {result.suggestions.map((s, i) => (
              <li
                key={i}
                className="flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/5 p-3 text-sm text-text dark:text-text-dark"
              >
                <AlertTriangle
                  size={14}
                  className="mt-0.5 shrink-0 text-warning"
                />
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Keywords */}
      {result.keywords.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-text dark:text-text-dark">
            Keyword Matching
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.keywords.map((kw, i) => (
              <span
                key={i}
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                  kw.found
                    ? "bg-success/10 text-success"
                    : "bg-danger/10 text-danger"
                }`}
              >
                {kw.found ? (
                  <CheckCircle2 size={12} />
                ) : (
                  <XCircle size={12} />
                )}
                {kw.keyword}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
