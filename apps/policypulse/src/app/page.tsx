"use client";

import { useEffect } from "react";
import {
  AlertTriangle,
  TrendingUp,
  Globe,
  Search,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  RefreshCw,
  Wifi,
  WifiOff,
  Loader2,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { PolicyCard } from "@/components/PolicyCard";
import { SubscriptionBanner } from "@/components/SubscriptionBanner";
import { RiskBadge } from "@/components/RiskBadge";
import { IndustryTag } from "@/components/IndustryTag";
import {
  generateDailySummary,
  sortByRisk,
  filterByIndustry,
  filterByRiskLevel,
  searchAlerts,
} from "@/lib/utils";
import {
  INDUSTRY_LABELS,
  RISK_CONFIG,
  type IndustryType,
  type RiskLevel,
} from "@/types";

/**
 * @component DashboardPage
 * 首页 — 风险概览仪表盘，自动从真实数据源加载政策
 */
export default function DashboardPage() {
  const alerts = useStore((s) => s.alerts);
  const selectedIndustries = useStore((s) => s.selectedIndustries);
  const selectedRiskLevels = useStore((s) => s.selectedRiskLevels);
  const searchQuery = useStore((s) => s.searchQuery);
  const toggleIndustryFilter = useStore((s) => s.toggleIndustryFilter);
  const toggleRiskLevelFilter = useStore((s) => s.toggleRiskLevelFilter);
  const setSearchQuery = useStore((s) => s.setSearchQuery);
  const resetFilters = useStore((s) => s.resetFilters);
  const fetchAlerts = useStore((s) => s.fetchAlerts);
  const isLoading = useStore((s) => s.isLoading);
  const dataSource = useStore((s) => s.dataSource);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const today = new Date().toISOString().split("T")[0];
  const summary = generateDailySummary(alerts, today);

  let filteredAlerts = filterByIndustry(alerts, selectedIndustries);
  filteredAlerts = filterByRiskLevel(filteredAlerts, selectedRiskLevels);
  filteredAlerts = searchAlerts(filteredAlerts, searchQuery);
  filteredAlerts = sortByRisk(filteredAlerts);

  const hasFilters =
    selectedIndustries.length > 0 ||
    selectedRiskLevels.length > 0 ||
    searchQuery.length > 0;

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <SubscriptionBanner />

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
              风险概览
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              实时监测全球政策动态，洞察对您业务的潜在影响
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                dataSource === "live"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : dataSource === "cache"
                  ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                  : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
              }`}
            >
              {dataSource === "live" ? (
                <Wifi className="w-3 h-3" />
              ) : (
                <WifiOff className="w-3 h-3" />
              )}
              {dataSource === "live"
                ? "实时数据"
                : dataSource === "cache"
                ? "缓存数据"
                : "加载中"}
            </span>
            <button
              onClick={fetchAlerts}
              disabled={isLoading}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
              title="刷新数据"
            >
              <RefreshCw
                className={`w-4 h-4 text-slate-500 ${
                  isLoading ? "animate-spin" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && alerts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
          <p className="text-slate-500 dark:text-slate-400">
            正在获取最新政策数据...
          </p>
          <p className="text-xs text-slate-400 mt-1">
            数据来源：Federal Register、EUR-Lex
          </p>
        </div>
      )}

      {!isLoading || alerts.length > 0 ? (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
              <div className="flex items-center gap-2 mb-2">
                <ShieldAlert className="w-4 h-4 text-slate-400" />
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  今日预警
                </span>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {summary.alertCount}
              </p>
              <div className="mt-1">
                <RiskBadge level={summary.overallRisk} size="sm" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  严重/高风险
                </span>
              </div>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {summary.criticalCount + summary.highCount}
              </p>
              <p className="text-xs text-slate-500 mt-1">需要立即关注</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-amber-500" />
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  中等风险
                </span>
              </div>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {summary.mediumCount}
              </p>
              <p className="text-xs text-slate-500 mt-1">持续跟踪</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  低风险
                </span>
              </div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {summary.lowCount}
              </p>
              <p className="text-xs text-slate-500 mt-1">关注即可</p>
            </div>
          </div>

          {/* Key Highlights */}
          {summary.highlights.length > 0 && (
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-700 rounded-xl p-5 mb-8 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Globe className="w-5 h-5 text-blue-400" />
                <h3 className="font-semibold">今日要点速览</h3>
              </div>
              <ul className="space-y-2">
                {summary.highlights.map((h, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-slate-300"
                  >
                    <span className="text-blue-400 mt-0.5">•</span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Filters */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索政策关键词..."
                  className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              {hasFilters && (
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  重置
                </button>
              )}
            </div>

            <div className="mb-3">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                风险等级
              </p>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(RISK_CONFIG) as RiskLevel[]).map((level) => (
                  <button
                    key={level}
                    onClick={() => toggleRiskLevelFilter(level)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-full border transition-colors ${
                      selectedRiskLevels.includes(level)
                        ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                        : "border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-300"
                    }`}
                  >
                    {RISK_CONFIG[level].label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                行业筛选
              </p>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(INDUSTRY_LABELS) as IndustryType[]).map(
                  (industry) => (
                    <IndustryTag
                      key={industry}
                      industry={industry}
                      active={selectedIndustries.includes(industry)}
                      onClick={() => toggleIndustryFilter(industry)}
                    />
                  )
                )}
              </div>
            </div>
          </div>

          {/* Alert List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                政策预警
                <span className="text-sm font-normal text-slate-500 ml-2">
                  ({filteredAlerts.length})
                </span>
              </h3>
              {isLoading && (
                <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
              )}
            </div>

            {filteredAlerts.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>未找到匹配的政策预警</p>
                <button
                  onClick={resetFilters}
                  className="mt-2 text-sm text-blue-500 hover:underline"
                >
                  清除筛选条件
                </button>
              </div>
            ) : (
              filteredAlerts.map((alert) => (
                <PolicyCard key={alert.id} alert={alert} />
              ))
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}
