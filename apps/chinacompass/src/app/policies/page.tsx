"use client";

import { useState, useMemo } from "react";
import { FileText, Search, SlidersHorizontal } from "lucide-react";
import PolicyCard from "@/components/PolicyCard";
import CountryFilter from "@/components/CountryFilter";
import type { Country, PolicyCategory, RiskLevel } from "@/types";
import { mockPolicies } from "@/lib/mockData";

const CATEGORIES: PolicyCategory[] = [
  "贸易", "税务", "数据保护", "劳工", "知识产权", "外资准入", "环保", "消费者保护",
];

const RISK_LEVELS: { value: RiskLevel; label: string }[] = [
  { value: "critical", label: "严重" },
  { value: "high", label: "高风险" },
  { value: "medium", label: "中风险" },
  { value: "low", label: "低风险" },
];

/**
 * @description 政策监控页面 - 展示多国政策列表，支持筛选和搜索
 */
export default function PoliciesPage() {
  const [search, setSearch] = useState("");
  const [selectedCountries, setSelectedCountries] = useState<Country[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<PolicyCategory[]>([]);
  const [selectedRisks, setSelectedRisks] = useState<RiskLevel[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return mockPolicies.filter((p) => {
      if (search && !p.titleCn.includes(search) && !p.summaryCn.includes(search)) {
        return false;
      }
      if (selectedCountries.length > 0 && !selectedCountries.includes(p.country)) {
        return false;
      }
      if (selectedCategories.length > 0 && !selectedCategories.includes(p.category)) {
        return false;
      }
      if (selectedRisks.length > 0 && !selectedRisks.includes(p.riskLevel)) {
        return false;
      }
      return true;
    });
  }, [search, selectedCountries, selectedCategories, selectedRisks]);

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-6 h-6 text-navy-600" />
        <h1 className="text-2xl font-bold">政策监控</h1>
        <span className="text-sm text-gray-400">
          覆盖 10+ 国家和地区
        </span>
      </div>

      {/* Search & Filter Toggle */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索政策关键词..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
            showFilters
              ? "bg-navy-50 border-navy-300 text-navy-700"
              : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          筛选
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 space-y-4 animate-fade-in">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              按国家/地区
            </h3>
            <CountryFilter
              selected={selectedCountries}
              onChange={setSelectedCountries}
            />
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">按分类</h3>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() =>
                    setSelectedCategories((prev) =>
                      prev.includes(cat)
                        ? prev.filter((c) => c !== cat)
                        : [...prev, cat]
                    )
                  }
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    selectedCategories.includes(cat)
                      ? "bg-navy-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              按风险等级
            </h3>
            <div className="flex flex-wrap gap-2">
              {RISK_LEVELS.map((rl) => (
                <button
                  key={rl.value}
                  onClick={() =>
                    setSelectedRisks((prev) =>
                      prev.includes(rl.value)
                        ? prev.filter((r) => r !== rl.value)
                        : [...prev, rl.value]
                    )
                  }
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    selectedRisks.includes(rl.value)
                      ? "bg-navy-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {rl.label}
                </button>
              ))}
            </div>
          </div>

          {(selectedCountries.length > 0 ||
            selectedCategories.length > 0 ||
            selectedRisks.length > 0) && (
            <button
              onClick={() => {
                setSelectedCountries([]);
                setSelectedCategories([]);
                setSelectedRisks([]);
              }}
              className="text-sm text-brand-600 hover:text-brand-700"
            >
              清除所有筛选
            </button>
          )}
        </div>
      )}

      {/* Results */}
      <div className="mb-4 text-sm text-gray-500">
        共 {filtered.length} 条政策
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((policy) => (
          <PolicyCard key={policy.id} policy={policy} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">暂无匹配的政策</p>
          <p className="text-sm text-gray-400 mt-1">
            请尝试调整搜索条件或筛选器
          </p>
        </div>
      )}
    </div>
  );
}
