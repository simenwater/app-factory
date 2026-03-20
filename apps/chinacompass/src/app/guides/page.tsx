"use client";

import { useState } from "react";
import { BookOpen, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import { mockGuides } from "@/lib/mockData";
import { getCountryInfo, formatDateCn } from "@/lib/utils";

/**
 * @description 本地化运营指南页面
 */
export default function GuidesPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-2">
        <BookOpen className="w-6 h-6 text-navy-600" />
        <h1 className="text-2xl font-bold">本地化运营指南</h1>
      </div>
      <p className="text-sm text-gray-500 mb-8">
        各国税务、劳工、数据保护等领域的实操指南和合规清单
      </p>

      <div className="space-y-4">
        {mockGuides.map((guide) => {
          const countryInfo = getCountryInfo(guide.country);
          const isExpanded = expandedId === guide.id;

          return (
            <div
              key={guide.id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : guide.id)}
                className="w-full px-5 py-4 flex items-center gap-4 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="text-2xl">{countryInfo?.flag}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm text-gray-500">
                      {countryInfo?.name}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-navy-100 text-navy-700">
                      {guide.category}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900">{guide.title}</h3>
                </div>
                <div className="text-xs text-gray-400 shrink-0">
                  {formatDateCn(guide.lastUpdated)}
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                )}
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 border-t border-gray-100 pt-4 animate-fade-in">
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-800 mb-3">概述</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {guide.content}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">
                      合规清单
                    </h4>
                    <div className="space-y-2">
                      {guide.checklist.map((item, i) => (
                        <label
                          key={i}
                          className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer group"
                        >
                          <CheckCircle2 className="w-5 h-5 text-gray-300 group-hover:text-green-500 transition-colors shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700">{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
