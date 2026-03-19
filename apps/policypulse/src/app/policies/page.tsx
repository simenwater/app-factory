"use client";

import { useEffect } from "react";
import { useStore } from "@/store/useStore";
import { PolicyCard } from "@/components/PolicyCard";
import { sortByRisk } from "@/lib/utils";
import { FileText, RefreshCw, Loader2 } from "lucide-react";

/**
 * @component PoliciesPage
 * 全部政策追踪列表页 — 从真实数据源获取政策
 */
export default function PoliciesPage() {
  const alerts = useStore((s) => s.alerts);
  const isLoading = useStore((s) => s.isLoading);
  const fetchAlerts = useStore((s) => s.fetchAlerts);
  const dataSource = useStore((s) => s.dataSource);
  const sorted = sortByRisk(alerts);

  useEffect(() => {
    if (alerts.length === 0) {
      fetchAlerts();
    }
  }, [alerts.length, fetchAlerts]);

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-5 h-5 text-blue-500" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                政策追踪
              </h2>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              所有政策预警按风险等级排列，点击查看详细解读
              {dataSource === "live" && (
                <span className="ml-2 text-green-500">
                  · 数据来源：Federal Register
                </span>
              )}
            </p>
          </div>
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

      {isLoading && sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
          <p className="text-slate-500 dark:text-slate-400">
            正在获取最新政策数据...
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sorted.map((alert) => (
            <PolicyCard key={alert.id} alert={alert} />
          ))}
        </div>
      )}
    </div>
  );
}
