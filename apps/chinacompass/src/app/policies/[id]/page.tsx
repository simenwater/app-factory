"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  Sparkles,
  Loader2,
  Calendar,
  Building2,
} from "lucide-react";
import RiskBadge from "@/components/RiskBadge";
import { mockPolicies } from "@/lib/mockData";
import { getCountryInfo, formatDateCn } from "@/lib/utils";
import type { Policy } from "@/types";

/**
 * @description 政策详情页 - 展示政策全文和AI解读
 */
export default function PolicyDetailPage() {
  const params = useParams();
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [interpretation, setInterpretation] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const found = mockPolicies.find((p) => p.id === params.id);
    if (found) setPolicy(found);
  }, [params.id]);

  const handleInterpret = async () => {
    if (!policy) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `请详细解读以下政策对中国出海企业的影响：\n\n标题：${policy.titleCn}\n\n内容：${policy.content}`,
            },
          ],
        }),
      });
      const data = await res.json();
      setInterpretation(data.reply || "暂时无法生成解读");
    } catch {
      setInterpretation("解读服务暂时不可用，请稍后重试。");
    } finally {
      setLoading(false);
    }
  };

  if (!policy) {
    return (
      <div className="px-6 py-16 text-center">
        <p className="text-gray-500">政策未找到</p>
        <Link href="/policies" className="text-brand-600 text-sm mt-2 inline-block">
          返回政策列表
        </Link>
      </div>
    );
  }

  const countryInfo = getCountryInfo(policy.country);

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto animate-fade-in">
      <Link
        href="/policies"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        返回政策列表
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{countryInfo?.flag}</span>
            <span className="text-sm font-medium text-gray-600">
              {countryInfo?.name}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-navy-100 text-navy-700">
              {policy.category}
            </span>
          </div>
          <RiskBadge level={policy.riskLevel} size="md" />
        </div>

        <h1 className="text-xl font-bold text-gray-900 mb-2">
          {policy.titleCn}
        </h1>
        <p className="text-sm text-gray-400 mb-4">{policy.title}</p>

        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {formatDateCn(policy.publishedAt)}
          </span>
          <span className="flex items-center gap-1">
            <Building2 className="w-4 h-4" />
            {policy.sourceName}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {policy.affectedIndustries.map((ind) => (
            <span
              key={ind}
              className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600"
            >
              {ind}
            </span>
          ))}
        </div>

        <a
          href={policy.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          查看原文
        </a>
      </div>

      {/* Chinese Summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="font-semibold text-lg mb-3">中文摘要</h2>
        <p className="text-gray-700 leading-relaxed">{policy.summaryCn}</p>
      </div>

      {/* Original Content */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="font-semibold text-lg mb-3">政策原文</h2>
        <p className="text-gray-600 leading-relaxed text-sm">{policy.content}</p>
      </div>

      {/* AI Interpretation */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-500" />
            AI深度解读
          </h2>
          {!interpretation && !loading && (
            <button
              onClick={handleInterpret}
              className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              生成AI解读
            </button>
          )}
        </div>

        {loading && (
          <div className="flex items-center gap-3 text-gray-500 py-8">
            <Loader2 className="w-5 h-5 animate-spin" />
            AI正在分析政策内容...
          </div>
        )}

        {interpretation && (
          <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
            {interpretation}
          </div>
        )}

        {!interpretation && !loading && (
          <p className="text-sm text-gray-400 py-4">
            点击上方按钮，AI将为您深度解读该政策对中国出海企业的影响，并提供具体合规建议。
          </p>
        )}
      </div>
    </div>
  );
}
