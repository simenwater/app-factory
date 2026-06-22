"use client";

/**
 * @fileoverview 首页 — 消息分析入口
 *
 * 用户粘贴客户消息，点击分析，获得风险评估和回复建议。
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Sparkles, AlertTriangle, Zap } from "lucide-react";
import { useStore } from "@/store/useStore";
import { analyzeMessage } from "@/lib/analyzer";
import { generateReply } from "@/lib/generator";

export default function HomePage() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const {
    settings,
    analyses,
    addAnalysis,
    addReply,
    decrementFreeUses,
    rateStandards,
    contractClauses,
  } = useStore();

  const canUse =
    settings.subscriptionTier === "premium" || settings.freeUsesRemaining > 0;

  const handleAnalyze = async () => {
    if (!message.trim() || !canUse) return;

    setIsAnalyzing(true);

    // 模拟 AI 分析的短暂延迟
    await new Promise((r) => setTimeout(r, 800));

    const analysis = analyzeMessage(message);
    addAnalysis(analysis);

    const reply = generateReply(analysis, {
      tone: settings.defaultTone,
      displayName: settings.displayName || "RateGuard 用户",
      rates: rateStandards,
      clauses: contractClauses,
    });
    addReply(reply);

    if (settings.subscriptionTier === "free") {
      decrementFreeUses();
    }

    setIsAnalyzing(false);
    setMessage("");
    router.push(`/history/${analysis.id}`);
  };

  const recentCount = analyses.length;
  const highRiskCount = analyses.filter((a) => a.riskLevel === "high").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
          <Shield size={28} className="text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">RateGuard</h1>
        <p className="mt-1 text-sm text-muted">
          粘贴客户消息，AI 帮你识别&ldquo;白嫖&rdquo;信号
        </p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-surface p-3 text-center shadow-sm border border-border">
          <p className="text-2xl font-bold text-primary">{recentCount}</p>
          <p className="text-xs text-muted">已分析</p>
        </div>
        <div className="rounded-xl bg-surface p-3 text-center shadow-sm border border-border">
          <p className="text-2xl font-bold text-danger">{highRiskCount}</p>
          <p className="text-xs text-muted">高风险</p>
        </div>
        <div className="rounded-xl bg-surface p-3 text-center shadow-sm border border-border">
          <p className="text-2xl font-bold text-warning">
            {settings.subscriptionTier === "premium"
              ? "∞"
              : settings.freeUsesRemaining}
          </p>
          <p className="text-xs text-muted">
            {settings.subscriptionTier === "premium" ? "高级版" : "剩余次数"}
          </p>
        </div>
      </div>

      {/* 消息输入区 */}
      <div className="rounded-2xl bg-surface p-4 shadow-sm border border-border">
        <label className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
          <Sparkles size={16} className="text-primary" />
          粘贴客户消息
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={"在这里粘贴客户发来的消息内容...\n\n例如：「你能免费帮我做个 logo 吗？做好了可以帮你宣传」"}
          className="w-full resize-none rounded-xl border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          rows={5}
        />

        <button
          onClick={handleAnalyze}
          disabled={!message.trim() || isAnalyzing || !canUse}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-primary-dark active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isAnalyzing ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              正在分析...
            </>
          ) : (
            <>
              <Zap size={16} />
              分析消息
            </>
          )}
        </button>

        {!canUse && (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-warning/10 p-3 text-xs text-warning">
            <AlertTriangle size={14} />
            免费次数已用完，请升级到高级版继续使用
          </div>
        )}
      </div>

      {/* 使用提示 */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground">常见&ldquo;白嫖&rdquo;信号</h2>
        {[
          { icon: "🎭", text: "\"帮你曝光/宣传\" — 用虚假价值替代报酬" },
          { icon: "🎨", text: "\"充实你的作品集\" — 将付费工作包装成学习机会" },
          { icon: "🤝", text: "\"以后有很多活给你\" — 画饼式空头承诺" },
          { icon: "⏰", text: "\"就一点小活儿\" — 最小化你的专业价值" },
        ].map((tip) => (
          <div
            key={tip.icon}
            className="flex items-start gap-3 rounded-xl bg-surface p-3 text-sm border border-border"
          >
            <span className="text-lg">{tip.icon}</span>
            <span className="text-muted">{tip.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
