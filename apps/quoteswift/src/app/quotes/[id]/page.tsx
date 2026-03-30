"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Send,
  CheckCircle,
  XCircle,
  Trash2,
  Share2,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { formatCurrency, formatDate } from "@/lib/utils";
import { downloadQuotePDF } from "@/lib/pdf";
import { StatusBadge } from "@/components/StatusBadge";
import type { QuoteStatus } from "@/types";

/**
 * @description 报价单详情页面
 */
export default function QuoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const quote = useStore((s) => s.quotes.find((q) => q.id === id));
  const updateQuote = useStore((s) => s.updateQuote);
  const deleteQuote = useStore((s) => s.deleteQuote);
  const settings = useStore((s) => s.settings);

  if (!quote) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <p className="mb-4 text-text-muted dark:text-text-muted-dark">
            未找到该报价单
          </p>
          <Link href="/quotes" className="text-primary hover:text-primary-dark">
            返回列表
          </Link>
        </div>
      </div>
    );
  }

  /**
   * @description 更新报价单状态
   */
  function handleStatusChange(status: QuoteStatus) {
    updateQuote(id, { status });
  }

  /**
   * @description 下载 PDF
   */
  function handleDownload() {
    if (!quote) return;
    downloadQuotePDF(quote, settings);
  }

  /**
   * @description 分享报价单
   */
  async function handleShare() {
    if (!quote) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `报价单 #${quote.quoteNumber}`,
          text: `${settings.businessName || "QuoteSwift"} 为您提供了一份报价，总金额 ${formatCurrency(quote.total, settings.currency)}`,
        });
      } catch {
        // User cancelled
      }
    } else {
      const text = `报价单 #${quote.quoteNumber} - ${quote.customer.name} - 总金额 ${formatCurrency(quote.total, settings.currency)}`;
      await navigator.clipboard.writeText(text);
      alert("报价信息已复制到剪贴板");
    }
  }

  /**
   * @description 删除报价单
   */
  function handleDelete() {
    if (confirm("确定要删除这份报价单吗？")) {
      deleteQuote(id);
      router.push("/quotes");
    }
  }

  return (
    <div className="px-4 pt-6">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/quotes"
          className="rounded-lg p-2 text-text-muted transition-colors hover:bg-surface dark:hover:bg-surface-dark"
        >
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-text dark:text-text-dark">
            #{quote.quoteNumber}
          </h1>
          <StatusBadge status={quote.status} />
        </div>
      </div>

      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={handleDownload}
          className="flex shrink-0 items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-primary-dark"
        >
          <Download size={14} />
          下载 PDF
        </button>
        <button
          onClick={handleShare}
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-primary px-3 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/5"
        >
          <Share2 size={14} />
          分享
        </button>
        {quote.status === "draft" && (
          <button
            onClick={() => handleStatusChange("sent")}
            className="flex shrink-0 items-center gap-1.5 rounded-lg border border-blue-500 px-3 py-2 text-xs font-medium text-blue-500 transition-colors hover:bg-blue-50 dark:hover:bg-blue-950"
          >
            <Send size={14} />
            标记已发送
          </button>
        )}
        {quote.status === "sent" && (
          <>
            <button
              onClick={() => handleStatusChange("accepted")}
              className="flex shrink-0 items-center gap-1.5 rounded-lg border border-success px-3 py-2 text-xs font-medium text-success transition-colors hover:bg-green-50 dark:hover:bg-green-950"
            >
              <CheckCircle size={14} />
              已接受
            </button>
            <button
              onClick={() => handleStatusChange("declined")}
              className="flex shrink-0 items-center gap-1.5 rounded-lg border border-danger px-3 py-2 text-xs font-medium text-danger transition-colors hover:bg-red-50 dark:hover:bg-red-950"
            >
              <XCircle size={14} />
              已拒绝
            </button>
          </>
        )}
        <button
          onClick={handleDelete}
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-danger px-3 py-2 text-xs font-medium text-danger transition-colors hover:bg-red-50 dark:hover:bg-red-950"
        >
          <Trash2 size={14} />
          删除
        </button>
      </div>

      <section className="mb-4 rounded-xl border border-border bg-surface p-4 dark:border-border-dark dark:bg-surface-dark">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
          客户信息
        </h2>
        <p className="font-medium text-text dark:text-text-dark">
          {quote.customer.name}
        </p>
        {quote.customer.email && (
          <p className="text-sm text-text-muted dark:text-text-muted-dark">
            {quote.customer.email}
          </p>
        )}
        {quote.customer.phone && (
          <p className="text-sm text-text-muted dark:text-text-muted-dark">
            {quote.customer.phone}
          </p>
        )}
        {quote.customer.address && (
          <p className="text-sm text-text-muted dark:text-text-muted-dark">
            {quote.customer.address}
          </p>
        )}
      </section>

      <section className="mb-4 rounded-xl border border-border bg-surface p-4 dark:border-border-dark dark:bg-surface-dark">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
          服务项目
        </h2>
        <div className="space-y-3">
          {quote.items.map((item, index) => (
            <div
              key={item.id}
              className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0 dark:border-border-dark"
            >
              <div>
                <p className="text-sm font-medium text-text dark:text-text-dark">
                  {index + 1}. {item.description}
                </p>
                <p className="text-xs text-text-muted dark:text-text-muted-dark">
                  {item.quantity} {item.unit} × {formatCurrency(item.unitPrice, settings.currency)}
                </p>
              </div>
              <span className="text-sm font-semibold text-text dark:text-text-dark">
                {formatCurrency(item.quantity * item.unitPrice, settings.currency)}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-4 rounded-xl border border-primary/30 bg-primary/5 p-4">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-text-muted dark:text-text-muted-dark">
            <span>小计</span>
            <span>{formatCurrency(quote.subtotal, settings.currency)}</span>
          </div>
          {quote.tax > 0 && (
            <div className="flex justify-between text-text-muted dark:text-text-muted-dark">
              <span>税 ({settings.taxRate}%)</span>
              <span>{formatCurrency(quote.tax, settings.currency)}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-primary/20 pt-2 text-lg font-bold text-primary">
            <span>总计</span>
            <span>{formatCurrency(quote.total, settings.currency)}</span>
          </div>
        </div>
      </section>

      {quote.notes && (
        <section className="mb-4 rounded-xl border border-border bg-surface p-4 dark:border-border-dark dark:bg-surface-dark">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
            备注
          </h2>
          <p className="text-sm text-text dark:text-text-dark">{quote.notes}</p>
        </section>
      )}

      <div className="mb-4 text-xs text-text-muted dark:text-text-muted-dark">
        <p>创建于：{formatDate(quote.createdAt)}</p>
        <p>有效期至：{formatDate(quote.validUntil)}</p>
      </div>
    </div>
  );
}
