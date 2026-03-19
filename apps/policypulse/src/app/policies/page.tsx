"use client";

import { useStore } from "@/store/useStore";
import { PolicyCard } from "@/components/PolicyCard";
import { sortByRisk } from "@/lib/utils";
import { FileText } from "lucide-react";

/**
 * @component PoliciesPage
 * 全部政策追踪列表页
 */
export default function PoliciesPage() {
  const alerts = useStore((s) => s.alerts);
  const sorted = sortByRisk(alerts);

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <FileText className="w-5 h-5 text-blue-500" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            政策追踪
          </h2>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          所有政策预警按风险等级排列，点击查看详细解读
        </p>
      </div>

      <div className="space-y-4">
        {sorted.map((alert) => (
          <PolicyCard key={alert.id} alert={alert} />
        ))}
      </div>
    </div>
  );
}
