"use client";

import { use } from "react";
import { useStore } from "@/store/useStore";
import { calculateQuoteTotal } from "@/lib/quote";
import { generateQuotePDF } from "@/lib/pdf";
import {
  formatCurrency,
  formatDate,
  getQuoteStatus,
  getServiceLabel,
} from "@/lib/utils";
import {
  ArrowLeft,
  Download,
  Send,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import type { Quote } from "@/types";

/**
 * @description 报价单详情页
 */
export default function QuoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const quotes = useStore((s) => s.quotes);
  const updateQuote = useStore((s) => s.updateQuote);
  const settings = useStore((s) => s.settings);
  const quote = quotes.find((q) => q.id === id);

  if (!quote) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold">报价单不存在</p>
          <Link href="/" className="mt-2 text-sm text-primary">
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  const total = calculateQuoteTotal(quote.lineItems);
  const status = getQuoteStatus(quote.status);

  /**
   * @description 导出为 PDF
   */
  const handleExportPDF = () => {
    generateQuotePDF(quote, settings.businessName);
  };

  /**
   * @description 更新报价状态
   */
  const handleStatusChange = (newStatus: Quote["status"]) => {
    updateQuote(quote.id, { status: newStatus });
  };

  return (
    <div className="px-4 pt-6">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/"
          className="rounded-lg p-2 transition-colors hover:bg-border/50 dark:hover:bg-border-dark/50"
        >
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold">{quote.projectName}</h1>
          <p className="text-sm text-text-muted dark:text-text-muted-dark">
            {quote.clientName}
          </p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${status.color} bg-current/10`}>
          {status.label}
        </span>
      </div>

      {/* 概要 */}
      <div className="mb-4 rounded-2xl border border-border bg-surface p-4 dark:border-border-dark dark:bg-surface-dark">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-text-muted dark:text-text-muted-dark">服务类型</p>
            <p className="font-medium">
              {getServiceLabel(quote.serviceCategory)}
            </p>
          </div>
          <div>
            <p className="text-text-muted dark:text-text-muted-dark">创建日期</p>
            <p className="font-medium">{formatDate(quote.createdAt)}</p>
          </div>
          <div>
            <p className="text-text-muted dark:text-text-muted-dark">有效期</p>
            <p className="font-medium">{quote.validDays} 天</p>
          </div>
          <div>
            <p className="text-text-muted dark:text-text-muted-dark">总金额</p>
            <p className="text-lg font-bold text-primary">
              {formatCurrency(total, quote.currency)}
            </p>
          </div>
        </div>
      </div>

      {/* 行项目 */}
      <div className="mb-4 rounded-2xl border border-border bg-surface p-4 dark:border-border-dark dark:bg-surface-dark">
        <h2 className="mb-3 text-sm font-semibold text-text-muted dark:text-text-muted-dark">
          项目明细
        </h2>
        <div className="space-y-3">
          {quote.lineItems.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between rounded-xl bg-bg p-3 dark:bg-bg-dark"
            >
              <div className="flex-1">
                <p className="text-sm font-medium">{item.description}</p>
                <p className="text-xs text-text-muted dark:text-text-muted-dark">
                  {item.quantity} {item.unit} ×{" "}
                  {formatCurrency(item.unitPrice, quote.currency)}
                </p>
              </div>
              <p className="text-sm font-semibold">
                {formatCurrency(
                  item.quantity * item.unitPrice,
                  quote.currency
                )}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-3 flex justify-between border-t border-border pt-3 dark:border-border-dark">
          <span className="font-semibold">合计</span>
          <span className="text-lg font-bold text-primary">
            {formatCurrency(total, quote.currency)}
          </span>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="space-y-3">
        <button
          onClick={handleExportPDF}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-primary-dark"
        >
          <Download size={18} />
          导出 PDF
        </button>

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleStatusChange("sent")}
            className="flex items-center justify-center gap-1 rounded-xl bg-primary/10 py-2.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
          >
            <Send size={14} />
            已发送
          </button>
          <button
            onClick={() => handleStatusChange("accepted")}
            className="flex items-center justify-center gap-1 rounded-xl bg-success/10 py-2.5 text-xs font-medium text-success transition-colors hover:bg-success/20"
          >
            <CheckCircle size={14} />
            已接受
          </button>
          <button
            onClick={() => handleStatusChange("declined")}
            className="flex items-center justify-center gap-1 rounded-xl bg-danger/10 py-2.5 text-xs font-medium text-danger transition-colors hover:bg-danger/20"
          >
            <XCircle size={14} />
            已拒绝
          </button>
        </div>
      </div>

      <div className="h-8" />
    </div>
  );
}
