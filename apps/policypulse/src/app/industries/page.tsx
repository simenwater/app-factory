"use client";

import { Building2, AlertTriangle, TrendingDown, TrendingUp } from "lucide-react";
import { useStore } from "@/store/useStore";
import { PolicyCard } from "@/components/PolicyCard";
import { INDUSTRY_LABELS, RISK_CONFIG, type IndustryType } from "@/types";
import { riskLevelScore } from "@/lib/utils";
import { useState } from "react";

/**
 * @component IndustriesPage
 * 行业视图 — 按行业分组展示受影响的政策预警
 */
export default function IndustriesPage() {
  const alerts = useStore((s) => s.alerts);
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryType | null>(
    null
  );

  const industryStats = (Object.keys(INDUSTRY_LABELS) as IndustryType[]).map(
    (industry) => {
      const related = alerts.filter((a) =>
        a.affectedIndustries.includes(industry)
      );
      const maxRisk = related.reduce(
        (max, a) =>
          riskLevelScore(a.riskLevel) > riskLevelScore(max)
            ? a.riskLevel
            : max,
        related[0]?.riskLevel || "low"
      );
      return {
        industry,
        label: INDUSTRY_LABELS[industry],
        count: related.length,
        maxRisk,
        alerts: related,
      };
    }
  );

  const activeStats = industryStats.filter((s) => s.count > 0);
  activeStats.sort(
    (a, b) => riskLevelScore(b.maxRisk) - riskLevelScore(a.maxRisk)
  );

  const selectedData = selectedIndustry
    ? industryStats.find((s) => s.industry === selectedIndustry)
    : null;

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Building2 className="w-5 h-5 text-blue-500" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            行业视图
          </h2>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          查看各行业受政策影响情况，点击行业查看相关预警
        </p>
      </div>

      {/* Industry Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
        {activeStats.map((stat) => {
          const config = RISK_CONFIG[stat.maxRisk];
          const isSelected = selectedIndustry === stat.industry;

          return (
            <button
              key={stat.industry}
              onClick={() =>
                setSelectedIndustry(
                  isSelected ? null : stat.industry
                )
              }
              className={`p-4 rounded-xl border text-left transition-all ${
                isSelected
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950 ring-2 ring-blue-500/20"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-blue-700"
              }`}
            >
              <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                {stat.label}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold" style={{ color: config.color }}>
                  {stat.count}
                </span>
                <span
                  className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                  style={{
                    color: config.color,
                    backgroundColor: config.bgColor,
                  }}
                >
                  {config.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Industry Impact Overview */}
      {!selectedIndustry && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 mb-8">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            行业影响概览
          </h3>
          <div className="space-y-3">
            {activeStats.map((stat) => {
              const config = RISK_CONFIG[stat.maxRisk];
              const barWidth = (stat.count / alerts.length) * 100;

              return (
                <div key={stat.industry} className="flex items-center gap-3">
                  <span className="text-sm text-slate-600 dark:text-slate-400 w-20 text-right">
                    {stat.label}
                  </span>
                  <div className="flex-1 h-6 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full flex items-center px-2 transition-all duration-500"
                      style={{
                        width: `${Math.max(barWidth, 10)}%`,
                        backgroundColor: config.color + "30",
                        borderLeft: `3px solid ${config.color}`,
                      }}
                    >
                      <span
                        className="text-xs font-bold"
                        style={{ color: config.color }}
                      >
                        {stat.count}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 w-16">
                    {riskLevelScore(stat.maxRisk) >= 3 ? (
                      <TrendingDown className="w-3.5 h-3.5 text-red-500" />
                    ) : (
                      <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                    )}
                    <span
                      className="text-xs font-medium"
                      style={{ color: config.color }}
                    >
                      {config.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Industry Alerts */}
      {selectedData && (
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
            {selectedData.label}相关预警
            <span className="text-sm font-normal text-slate-500 ml-2">
              ({selectedData.count})
            </span>
          </h3>
          <div className="space-y-4">
            {selectedData.alerts.map((alert) => (
              <PolicyCard key={alert.id} alert={alert} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
