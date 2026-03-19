"use client";

import { use, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  MapPin,
  ExternalLink,
  Tag,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { RiskBadge } from "@/components/RiskBadge";
import { IndustryTag } from "@/components/IndustryTag";
import { PolicyComparison } from "@/components/PolicyComparison";
import { formatDateTime } from "@/lib/utils";

/**
 * @component PolicyDetailPage
 * 政策详情页 — 包含原文与实时AI解读对照
 */
export default function PolicyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const alerts = useStore((s) => s.alerts);
  const fetchAlerts = useStore((s) => s.fetchAlerts);
  const settings = useStore((s) => s.settings);
  const alert = alerts.find((a) => a.id === id);

  const [aiInterpretation, setAiInterpretation] = useState<string>("");
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  useEffect(() => {
    if (alerts.length === 0) {
      fetchAlerts();
    }
  }, [alerts.length, fetchAlerts]);

  /**
   * 请求实时AI解读
   */
  const requestAIInterpretation = useCallback(async () => {
    if (!alert) return;
    setIsLoadingAI(true);
    setAiError(null);

    try {
      const industryNames = settings.subscribedIndustries.join(", ");
      const response = await fetch("/api/ai/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: alert.title,
          originalText: alert.originalText,
          userIndustry: industryNames || undefined,
        }),
      });

      if (!response.ok) throw new Error("AI service request failed");

      const result = await response.json();
      if (result.success && result.data?.interpretation) {
        setAiInterpretation(result.data.interpretation);
      }
    } catch (error) {
      console.error("AI interpretation error:", error);
      setAiError("AI解读服务暂时不可用，请稍后重试");
    } finally {
      setIsLoadingAI(false);
    }
  }, [alert, settings.subscribedIndustries]);

  useEffect(() => {
    if (alert && !alert.aiInterpretation && !aiInterpretation) {
      requestAIInterpretation();
    }
  }, [alert, aiInterpretation, requestAIInterpretation]);

  if (!alert) {
    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto text-center py-20">
        <p className="text-slate-500 mb-4">未找到该政策预警</p>
        <Link
          href="/"
          className="text-blue-500 hover:underline inline-flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          返回首页
        </Link>
      </div>
    );
  }

  const displayInterpretation =
    aiInterpretation || alert.aiInterpretation || "";

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        返回概览
      </Link>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 leading-snug">
              {alert.title}
            </h1>
            <RiskBadge level={alert.riskLevel} size="lg" />
          </div>
        </div>

        <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
          {alert.summary}
        </p>

        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-4">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            {alert.region}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {formatDateTime(alert.publishedAt)}
          </span>
          <a
            href={alert.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-blue-500 hover:underline"
          >
            <ExternalLink className="w-4 h-4" />
            {alert.source}
          </a>
        </div>

        {/* Industries */}
        <div className="mb-4">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
            受影响行业
          </p>
          <div className="flex flex-wrap gap-2">
            {alert.affectedIndustries.map((industry) => (
              <IndustryTag key={industry} industry={industry} />
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {alert.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded"
            >
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* AI Interpretation Controls */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          政策原文 vs AI 解读
        </h2>
        <button
          onClick={requestAIInterpretation}
          disabled={isLoadingAI}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isLoadingAI ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5" />
          )}
          {isLoadingAI ? "AI 分析中..." : "重新AI解读"}
        </button>
      </div>

      {/* AI Error Notice */}
      {aiError && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3 mb-4 text-sm text-amber-700 dark:text-amber-400">
          {aiError}
        </div>
      )}

      {/* Comparison */}
      <div className="mb-8">
        <PolicyComparison
          originalText={alert.originalText}
          aiInterpretation={displayInterpretation}
          isLoadingAI={isLoadingAI}
        />
      </div>
    </div>
  );
}
