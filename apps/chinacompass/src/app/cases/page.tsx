"use client";

import { useState } from "react";
import {
  Briefcase,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Target,
  Trophy,
} from "lucide-react";
import { mockCases } from "@/lib/mockData";
import { getCountryInfo, formatDateCn } from "@/lib/utils";

/**
 * @description 案例库页面 - 同行经验与最佳实践
 */
export default function CasesPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-2">
        <Briefcase className="w-6 h-6 text-purple-600" />
        <h1 className="text-2xl font-bold">案例库</h1>
      </div>
      <p className="text-sm text-gray-500 mb-8">
        中国企业出海的真实案例与经验总结
      </p>

      <div className="space-y-4">
        {mockCases.map((cs) => {
          const countryInfo = getCountryInfo(cs.targetCountry);
          const isExpanded = expandedId === cs.id;

          return (
            <div
              key={cs.id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : cs.id)}
                className="w-full px-5 py-4 flex items-start gap-4 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="text-2xl shrink-0">{countryInfo?.flag}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                      {cs.industry}
                    </span>
                    <span className="text-xs text-gray-400">
                      {countryInfo?.name}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900">{cs.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {cs.challenge.slice(0, 80)}...
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className="text-xs text-gray-400">
                    {formatDateCn(cs.publishedAt)}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-5 animate-fade-in">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-4 h-4 text-red-500" />
                      <h4 className="font-medium text-gray-800">面临挑战</h4>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {cs.challenge}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="w-4 h-4 text-blue-500" />
                      <h4 className="font-medium text-gray-800">解决方案</h4>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {cs.solution}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="w-4 h-4 text-green-500" />
                      <h4 className="font-medium text-gray-800">最终成果</h4>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {cs.result}
                    </p>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-800 mb-2">
                      经验教训
                    </h4>
                    <ul className="space-y-1.5">
                      {cs.lessons.map((lesson, i) => (
                        <li
                          key={i}
                          className="text-sm text-yellow-700 flex items-start gap-2"
                        >
                          <span className="text-yellow-500 font-medium shrink-0">
                            {i + 1}.
                          </span>
                          {lesson}
                        </li>
                      ))}
                    </ul>
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
