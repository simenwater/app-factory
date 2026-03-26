"use client";

import { useParams, useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { RiskBadge } from "@/components/RiskBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { ReplyCard } from "@/components/ReplyCard";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, Trash2, Send } from "lucide-react";
import Link from "next/link";
import type { TrackingStatus } from "@/types";

/**
 * @description 评价详情与回复管理页面
 */
export default function ReplyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { reviews, selectReply, updateTrackingStatus, deleteReview } =
    useStore();

  const review = reviews.find((r) => r.id === params.id);

  if (!review) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-20">
        <p className="text-sm text-text-muted dark:text-text-muted-dark">
          未找到该评价记录
        </p>
        <Link href="/" className="mt-2 text-sm text-primary hover:underline">
          返回首页
        </Link>
      </div>
    );
  }

  const handleDelete = () => {
    if (confirm("确定要删除这条评价记录吗？")) {
      deleteReview(review.id);
      router.push("/");
    }
  };

  const handleStatusChange = (status: TrackingStatus) => {
    updateTrackingStatus(review.id, status);
  };

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="rounded-lg p-1.5 hover:bg-surface dark:hover:bg-surface-dark"
          >
            <ArrowLeft size={20} className="text-text dark:text-text-dark" />
          </Link>
          <h1 className="text-lg font-bold text-text dark:text-text-dark">
            评价详情
          </h1>
        </div>
        <button
          onClick={handleDelete}
          className="rounded-lg p-1.5 text-danger hover:bg-danger/10"
        >
          <Trash2 size={20} />
        </button>
      </div>

      {/* Original Review */}
      <div className="mb-6 rounded-xl border border-border bg-surface p-4 dark:border-border-dark dark:bg-surface-dark">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {review.sentiment && (
              <RiskBadge level={review.sentiment.riskLevel} />
            )}
            <StatusBadge status={review.trackingStatus} />
          </div>
          <span className="text-xs text-text-muted dark:text-text-muted-dark">
            {review.platform}
          </span>
        </div>
        <p className="mb-2 whitespace-pre-line text-sm leading-relaxed text-text dark:text-text-dark">
          {review.originalText}
        </p>
        <p className="text-xs text-text-muted dark:text-text-muted-dark">
          {formatDate(review.createdAt)}
        </p>
      </div>

      {/* Sentiment Details */}
      {review.sentiment && (
        <div className="mb-6 rounded-xl border border-border bg-surface p-4 dark:border-border-dark dark:bg-surface-dark">
          <h2 className="mb-3 text-sm font-semibold text-text dark:text-text-dark">
            情感分析
          </h2>
          <div className="mb-2 flex justify-between text-xs">
            <span className="text-text-muted dark:text-text-muted-dark">
              负面程度
            </span>
            <span className="font-medium text-text dark:text-text-dark">
              {review.sentiment.score}/100
            </span>
          </div>
          <div className="mb-3 h-2 overflow-hidden rounded-full bg-border dark:bg-border-dark">
            <div
              className={`h-full rounded-full ${
                review.sentiment.score >= 75
                  ? "bg-danger"
                  : review.sentiment.score >= 50
                    ? "bg-orange-500"
                    : review.sentiment.score >= 25
                      ? "bg-warning"
                      : "bg-success"
              }`}
              style={{ width: `${review.sentiment.score}%` }}
            />
          </div>
          <p className="text-xs leading-relaxed text-text-muted dark:text-text-muted-dark">
            {review.sentiment.summary}
          </p>
        </div>
      )}

      {/* Status Management */}
      <div className="mb-6">
        <h2 className="mb-3 text-sm font-semibold text-text dark:text-text-dark">
          回复状态管理
        </h2>
        <div className="flex flex-wrap gap-2">
          {(["draft", "sent", "effective", "needs_revision"] as TrackingStatus[]).map(
            (status) => (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  review.trackingStatus === status
                    ? "bg-primary text-white"
                    : "border border-border text-text-muted hover:border-primary hover:text-primary dark:border-border-dark dark:text-text-muted-dark"
                }`}
              >
                {status === "sent" && <Send size={12} />}
                {status === "draft" && "草稿"}
                {status === "sent" && "已发送"}
                {status === "effective" && "有效"}
                {status === "needs_revision" && "需修改"}
              </button>
            )
          )}
        </div>
      </div>

      {/* Reply Drafts */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-text dark:text-text-dark">
          回复草稿
        </h2>
        <div className="space-y-3">
          {review.replies.map((reply) => (
            <ReplyCard
              key={reply.id}
              reply={reply}
              isSelected={review.selectedReplyId === reply.id}
              onSelect={() => selectReply(review.id, reply.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
