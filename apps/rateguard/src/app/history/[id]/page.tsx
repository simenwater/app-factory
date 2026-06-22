"use client";

/**
 * @fileoverview 分析详情页 — 展示完整分析结果和生成的回复
 */

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Copy,
  Check,
  RefreshCw,
  Flag,
  MessageSquare,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { RiskBadge } from "@/components/RiskBadge";
import { generateReply } from "@/lib/generator";
import { formatDate, responseTypeLabel } from "@/lib/utils";
import type { ResponseType } from "@/types";

export default function AnalysisDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"analysis" | "reply">("analysis");

  const { analyses, replies, settings, rateStandards, contractClauses, addReply } =
    useStore();

  const analysis = analyses.find((a) => a.id === id);
  const relatedReplies = replies.filter((r) => r.analysisId === id);
  const latestReply = relatedReplies[0];

  if (!analysis) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted">分析记录不存在</p>
        <button
          onClick={() => router.push("/history")}
          className="mt-4 text-sm text-primary hover:underline"
        >
          返回历史列表
        </button>
      </div>
    );
  }

  /** 复制回复到剪贴板 */
  const handleCopy = async () => {
    if (!latestReply) return;
    const text = `主题：${latestReply.subject}\n\n${latestReply.body}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /** 重新生成指定类型的回复 */
  const handleRegenerate = (type: ResponseType) => {
    const reply = generateReply(
      analysis,
      {
        tone: settings.defaultTone,
        displayName: settings.displayName || "RateGuard 用户",
        rates: rateStandards,
        clauses: contractClauses,
      },
      type
    );
    addReply(reply);
  };

  return (
    <div className="space-y-4">
      {/* 返回按钮 */}
      <button
        onClick={() => router.push("/history")}
        className="flex items-center gap-1 text-sm text-muted hover:text-foreground transition-colors"
      >
        <ArrowLeft size={16} />
        返回列表
      </button>

      {/* 分析概览 */}
      <div className="rounded-2xl bg-surface p-4 shadow-sm border border-border">
        <div className="mb-3 flex items-center justify-between">
          <RiskBadge level={analysis.riskLevel} score={analysis.riskScore} />
          <span className="text-xs text-muted">
            {formatDate(analysis.createdAt)}
          </span>
        </div>
        <p className="text-sm leading-relaxed text-foreground">{analysis.summary}</p>
      </div>

      {/* Tab 切换 */}
      <div className="flex gap-1 rounded-xl bg-background p-1 border border-border">
        {(["analysis", "reply"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
              activeTab === tab
                ? "bg-surface text-foreground shadow-sm"
                : "text-muted hover:text-foreground"
            }`}
          >
            {tab === "analysis" ? "分析详情" : "生成回复"}
          </button>
        ))}
      </div>

      {activeTab === "analysis" ? (
        <div className="space-y-4">
          {/* 原始消息 */}
          <div className="rounded-xl bg-surface p-4 border border-border">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
              <MessageSquare size={16} className="text-primary" />
              原始消息
            </h3>
            <div className="rounded-lg bg-background p-3 text-sm text-muted leading-relaxed">
              {analysis.originalMessage}
            </div>
          </div>

          {/* 红旗列表 */}
          <div className="rounded-xl bg-surface p-4 border border-border">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <Flag size={16} className="text-danger" />
              检测到的警告信号 ({analysis.redFlags.length})
            </h3>
            {analysis.redFlags.length === 0 ? (
              <p className="text-sm text-muted">未检测到明显的警告信号</p>
            ) : (
              <div className="space-y-2">
                {analysis.redFlags
                  .sort((a, b) => b.weight - a.weight)
                  .map((flag, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 rounded-lg bg-background p-3"
                    >
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-danger/10 text-xs text-danger font-semibold">
                        {Math.round(flag.weight * 100)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {flag.description}
                        </p>
                        <p className="mt-0.5 text-xs text-muted">
                          匹配关键词：&ldquo;{flag.keyword}&rdquo;
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* 回复预览 */}
          {latestReply ? (
            <div className="rounded-xl bg-surface p-4 border border-border">
              <div className="mb-3 flex items-center justify-between">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {responseTypeLabel(latestReply.type)}
                </span>
                <span className="text-xs text-muted">
                  {latestReply.tone === "formal" ? "正式" : "友好"} 语气
                </span>
              </div>

              <div className="mb-2 text-sm font-medium text-foreground">
                主题：{latestReply.subject}
              </div>

              <div className="whitespace-pre-wrap rounded-lg bg-background p-3 text-sm leading-relaxed text-muted">
                {latestReply.body}
              </div>

              <button
                onClick={handleCopy}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-primary bg-primary/5 px-4 py-2.5 text-sm font-medium text-primary transition-all hover:bg-primary/10 active:scale-[0.98]"
              >
                {copied ? (
                  <>
                    <Check size={16} />
                    已复制
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    复制回复内容
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="rounded-xl bg-surface p-4 border border-border text-center text-sm text-muted">
              暂无生成的回复
            </div>
          )}

          {/* 快速重新生成按钮 */}
          <div className="rounded-xl bg-surface p-4 border border-border">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <RefreshCw size={16} className="text-primary" />
              重新生成其他类型
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {(["reject", "negotiate", "accept"] as ResponseType[]).map(
                (type) => (
                  <button
                    key={type}
                    onClick={() => handleRegenerate(type)}
                    className="rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground transition-all hover:border-primary/30 hover:bg-primary/5 active:scale-[0.97]"
                  >
                    {responseTypeLabel(type)}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
