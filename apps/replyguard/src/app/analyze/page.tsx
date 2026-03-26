"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { analyzeSentiment } from "@/lib/sentiment";
import { generateAllReplies } from "@/lib/replyGenerator";
import { generateId } from "@/lib/utils";
import { RiskBadge } from "@/components/RiskBadge";
import { ReplyCard } from "@/components/ReplyCard";
import type { Review, SentimentAnalysis } from "@/types";
import {
  ArrowLeft,
  Search,
  Sparkles,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";

/**
 * @description 评价分析与回复生成页面
 */
export default function AnalyzePage() {
  const router = useRouter();
  const { addReview, settings, incrementRepliesGenerated, selectReply } = useStore();
  const [reviewText, setReviewText] = useState("");
  const [platform, setPlatform] = useState("");
  const [step, setStep] = useState<"input" | "analyzing" | "results">("input");
  const [sentiment, setSentiment] = useState<SentimentAnalysis | null>(null);
  const [currentReview, setCurrentReview] = useState<Review | null>(null);

  const canGenerate =
    settings.plan !== "free" || settings.freeRepliesRemaining > 0;

  const handleAnalyze = () => {
    if (!reviewText.trim()) return;
    if (!canGenerate) return;

    setStep("analyzing");

    setTimeout(() => {
      const sentimentResult = analyzeSentiment(reviewText);
      setSentiment(sentimentResult);

      const replies = generateAllReplies(
        reviewText,
        sentimentResult,
        settings.businessName
      );

      const review: Review = {
        id: generateId(),
        platform: platform || "未知平台",
        originalText: reviewText,
        sentiment: sentimentResult,
        replies,
        selectedReplyId: null,
        trackingStatus: "draft",
        trackingNotes: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      addReview(review);
      incrementRepliesGenerated();
      setCurrentReview(review);
      setStep("results");
    }, 1500);
  };

  const handleSelectReply = (replyId: string) => {
    if (!currentReview) return;
    selectReply(currentReview.id, replyId);
    setCurrentReview({
      ...currentReview,
      selectedReplyId: replyId,
    });
  };

  const handleReset = () => {
    setReviewText("");
    setPlatform("");
    setSentiment(null);
    setCurrentReview(null);
    setStep("input");
  };

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/"
          className="rounded-lg p-1.5 hover:bg-surface dark:hover:bg-surface-dark"
        >
          <ArrowLeft size={20} className="text-text dark:text-text-dark" />
        </Link>
        <h1 className="text-lg font-bold text-text dark:text-text-dark">
          分析评价
        </h1>
      </div>

      {step === "input" && (
        <div className="space-y-4">
          {/* Platform selector */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text dark:text-text-dark">
              评价来源平台
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text outline-none focus:border-primary dark:border-border-dark dark:bg-surface-dark dark:text-text-dark"
            >
              <option value="">选择平台（可选）</option>
              <option value="Google">Google Reviews</option>
              <option value="Yelp">Yelp</option>
              <option value="大众点评">大众点评</option>
              <option value="美团">美团</option>
              <option value="Upwork">Upwork</option>
              <option value="Fiverr">Fiverr</option>
              <option value="淘宝">淘宝</option>
              <option value="其他">其他</option>
            </select>
          </div>

          {/* Review text input */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text dark:text-text-dark">
              粘贴负面评价内容
            </label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="将收到的负面评价粘贴到这里..."
              rows={6}
              className="w-full resize-none rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text outline-none focus:border-primary dark:border-border-dark dark:bg-surface-dark dark:text-text-dark"
            />
            <p className="mt-1 text-xs text-text-muted dark:text-text-muted-dark">
              {reviewText.length} 字
            </p>
          </div>

          {!canGenerate && (
            <div className="flex items-start gap-2 rounded-xl bg-warning/10 p-3">
              <AlertCircle size={16} className="mt-0.5 text-warning" />
              <div>
                <p className="text-sm font-medium text-text dark:text-text-dark">
                  免费额度已用完
                </p>
                <p className="text-xs text-text-muted dark:text-text-muted-dark">
                  升级 Pro 解锁无限次回复生成
                </p>
                <Link
                  href="/pricing"
                  className="mt-1 inline-block text-xs font-medium text-primary hover:underline"
                >
                  查看订阅计划 →
                </Link>
              </div>
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={!reviewText.trim() || !canGenerate}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Sparkles size={18} />
            AI 分析并生成回复
          </button>
        </div>
      )}

      {step === "analyzing" && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 size={40} className="mb-4 animate-spin text-primary" />
          <p className="text-sm font-medium text-text dark:text-text-dark">
            AI 正在分析评价内容...
          </p>
          <p className="mt-1 text-xs text-text-muted dark:text-text-muted-dark">
            正在进行情感分析与回复生成
          </p>
        </div>
      )}

      {step === "results" && sentiment && currentReview && (
        <div className="space-y-6">
          {/* Sentiment Analysis Result */}
          <div className="rounded-xl border border-border bg-surface p-4 dark:border-border-dark dark:bg-surface-dark">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-text dark:text-text-dark">
                情感分析结果
              </h2>
              <RiskBadge level={sentiment.riskLevel} />
            </div>

            {/* Score bar */}
            <div className="mb-3">
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-text-muted dark:text-text-muted-dark">
                  负面程度
                </span>
                <span className="font-medium text-text dark:text-text-dark">
                  {sentiment.score}/100
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-border dark:bg-border-dark">
                <div
                  className={`h-full rounded-full transition-all ${
                    sentiment.score >= 75
                      ? "bg-danger"
                      : sentiment.score >= 50
                        ? "bg-orange-500"
                        : sentiment.score >= 25
                          ? "bg-warning"
                          : "bg-success"
                  }`}
                  style={{ width: `${sentiment.score}%` }}
                />
              </div>
            </div>

            {/* Keywords */}
            {sentiment.keywords.length > 0 && (
              <div className="mb-3">
                <p className="mb-1.5 text-xs font-medium text-text-muted dark:text-text-muted-dark">
                  检测到的关键词
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {sentiment.keywords.map((kw) => (
                    <span
                      key={kw}
                      className="rounded-full bg-danger/10 px-2 py-0.5 text-xs text-danger"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Emotion Tags */}
            {sentiment.emotionTags.length > 0 && (
              <div className="mb-3">
                <p className="mb-1.5 text-xs font-medium text-text-muted dark:text-text-muted-dark">
                  情绪标签
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {sentiment.emotionTags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Summary */}
            <div className="rounded-lg bg-bg p-3 dark:bg-bg-dark">
              <p className="text-xs leading-relaxed text-text-muted dark:text-text-muted-dark">
                <Search size={12} className="mb-0.5 mr-1 inline" />
                {sentiment.summary}
              </p>
            </div>
          </div>

          {/* Reply Drafts */}
          <div>
            <h2 className="mb-3 text-sm font-semibold text-text dark:text-text-dark">
              回复草稿（三种风格）
            </h2>
            <div className="space-y-3">
              {currentReview.replies.map((reply) => (
                <ReplyCard
                  key={reply.id}
                  reply={reply}
                  isSelected={currentReview.selectedReplyId === reply.id}
                  onSelect={() => handleSelectReply(reply.id)}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="flex-1 rounded-xl border border-border px-4 py-3 text-sm font-medium text-text transition-colors hover:bg-surface dark:border-border-dark dark:text-text-dark dark:hover:bg-surface-dark"
            >
              分析新评价
            </button>
            <button
              onClick={() => router.push(`/replies/${currentReview.id}`)}
              className="flex-1 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              查看详情
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
