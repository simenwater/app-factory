"use client";

import Link from "next/link";
import { Clock, MapPin, ExternalLink } from "lucide-react";
import { RiskBadge } from "./RiskBadge";
import { IndustryTag } from "./IndustryTag";
import { formatDateTime, truncateText } from "@/lib/utils";
import type { PolicyAlert } from "@/types";

/**
 * @component PolicyCard
 * 政策预警卡片组件
 * @param {Object} props
 * @param {PolicyAlert} props.alert - 政策预警数据
 */
export function PolicyCard({ alert }: { alert: PolicyAlert }) {
  return (
    <Link href={`/policies/${alert.id}`} className="block group">
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
            {alert.title}
          </h3>
          <RiskBadge level={alert.riskLevel} />
        </div>

        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 leading-relaxed">
          {truncateText(alert.summary, 120)}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {alert.affectedIndustries.map((industry) => (
            <IndustryTag key={industry} industry={industry} />
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {alert.region}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {formatDateTime(alert.publishedAt)}
            </span>
          </div>
          <span className="flex items-center gap-1 text-blue-500">
            <ExternalLink className="w-3.5 h-3.5" />
            {alert.source}
          </span>
        </div>
      </div>
    </Link>
  );
}
