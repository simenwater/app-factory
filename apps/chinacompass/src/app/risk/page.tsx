"use client";

import { useState } from "react";
import { AlertTriangle, ChevronDown, ChevronUp, Shield } from "lucide-react";
import RiskBadge from "@/components/RiskBadge";
import CountryFilter from "@/components/CountryFilter";
import { mockRiskAssessments } from "@/lib/mockData";
import { getCountryInfo, formatDateCn } from "@/lib/utils";
import type { Country } from "@/types";

/**
 * @description 风险评估页面 - 展示各国风险评估和应对建议
 */
export default function RiskPage() {
  const [selectedCountries, setSelectedCountries] = useState<Country[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = selectedCountries.length
    ? mockRiskAssessments.filter((r) => selectedCountries.includes(r.country))
    : mockRiskAssessments;

  const riskSummary = {
    critical: mockRiskAssessments.filter((r) => r.riskLevel === "critical").length,
    high: mockRiskAssessments.filter((r) => r.riskLevel === "high").length,
    medium: mockRiskAssessments.filter((r) => r.riskLevel === "medium").length,
    low: mockRiskAssessments.filter((r) => r.riskLevel === "low").length,
  };

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <AlertTriangle className="w-6 h-6 text-orange-500" />
        <h1 className="text-2xl font-bold">风险评估</h1>
      </div>

      {/* Risk Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-3xl font-bold text-red-700">{riskSummary.critical}</p>
          <p className="text-sm text-red-600">严重风险</p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <p className="text-3xl font-bold text-orange-700">{riskSummary.high}</p>
          <p className="text-sm text-orange-600">高风险</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <p className="text-3xl font-bold text-yellow-700">{riskSummary.medium}</p>
          <p className="text-sm text-yellow-600">中风险</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-3xl font-bold text-green-700">{riskSummary.low}</p>
          <p className="text-sm text-green-600">低风险</p>
        </div>
      </div>

      {/* Country Filter */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          按国家/地区筛选
        </h3>
        <CountryFilter selected={selectedCountries} onChange={setSelectedCountries} />
      </div>

      {/* Risk List */}
      <div className="space-y-4">
        {filtered.map((risk) => {
          const countryInfo = getCountryInfo(risk.country);
          const isExpanded = expandedId === risk.id;

          return (
            <div
              key={risk.id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden transition-shadow hover:shadow-md"
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : risk.id)}
                className="w-full px-5 py-4 flex items-start gap-4 text-left"
              >
                <RiskBadge level={risk.riskLevel} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span>{countryInfo?.flag}</span>
                    <span className="text-sm text-gray-500">
                      {countryInfo?.name}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                      {risk.category}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900">{risk.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {risk.description.slice(0, 100)}
                    {risk.description.length > 100 ? "..." : ""}
                  </p>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                )}
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 border-t border-gray-100 pt-4 animate-fade-in">
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-800 mb-2">详细说明</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {risk.description}
                    </p>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-green-600" />
                      <h4 className="font-medium text-green-800">应对建议</h4>
                    </div>
                    <p className="text-sm text-green-700 leading-relaxed whitespace-pre-wrap">
                      {risk.recommendation}
                    </p>
                  </div>

                  <p className="text-xs text-gray-400 mt-3">
                    更新于 {formatDateCn(risk.updatedAt)}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Shield className="w-12 h-12 text-green-300 mx-auto mb-4" />
          <p className="text-gray-500">所选国家暂无风险预警</p>
        </div>
      )}
    </div>
  );
}
