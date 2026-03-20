"use client";

import Link from "next/link";
import type { Policy } from "@/types";
import { getRiskColor, getRiskLabel, getCountryInfo, formatDateCn, truncate } from "@/lib/utils";

/**
 * @description 政策卡片组件
 * @param policy - 政策数据
 */
export default function PolicyCard({ policy }: { policy: Policy }) {
  const countryInfo = getCountryInfo(policy.country);
  const riskClass = getRiskColor(policy.riskLevel);

  return (
    <Link href={`/policies/${policy.id}`}>
      <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-brand-300 transition-all duration-200 cursor-pointer group">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">{countryInfo?.flag}</span>
            <span className="text-sm font-medium text-gray-600">
              {countryInfo?.name}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-navy-100 text-navy-700">
              {policy.category}
            </span>
          </div>
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-medium ${riskClass}`}
          >
            {getRiskLabel(policy.riskLevel)}
          </span>
        </div>

        <h3 className="text-base font-semibold text-gray-900 mb-2 group-hover:text-brand-600 transition-colors">
          {policy.titleCn}
        </h3>

        <p className="text-sm text-gray-500 mb-3 leading-relaxed">
          {truncate(policy.summaryCn, 120)}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {policy.affectedIndustries.slice(0, 3).map((ind) => (
              <span
                key={ind}
                className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600"
              >
                {ind}
              </span>
            ))}
          </div>
          <span className="text-xs text-gray-400">
            {formatDateCn(policy.publishedAt)}
          </span>
        </div>
      </div>
    </Link>
  );
}
