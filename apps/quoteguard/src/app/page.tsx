"use client";

import { useStore } from "@/store/useStore";
import { EmptyState } from "@/components/EmptyState";
import { FileText, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { formatCurrency, formatDate, getQuoteStatus } from "@/lib/utils";
import { calculateQuoteTotal } from "@/lib/quote";

/**
 * @description 首页 — 报价单列表
 */
export default function HomePage() {
  const quotes = useStore((s) => s.quotes);
  const deleteQuote = useStore((s) => s.deleteQuote);

  return (
    <div className="px-4 pt-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">QuoteGuard</h1>
          <p className="text-sm text-text-muted dark:text-text-muted-dark">
            您的报价单管理中心
          </p>
        </div>
        <Link
          href="/quote"
          className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-md transition-colors hover:bg-primary-dark"
        >
          <Plus size={18} />
          新建报价
        </Link>
      </div>

      {quotes.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="还没有报价单"
          description="点击右上角「新建报价」创建您的第一份专业报价单"
        />
      ) : (
        <div className="space-y-3">
          {quotes.map((quote) => {
            const total = calculateQuoteTotal(quote.lineItems);
            const status = getQuoteStatus(quote.status);
            return (
              <div
                key={quote.id}
                className="rounded-2xl border border-border bg-surface p-4 shadow-sm transition-shadow hover:shadow-md dark:border-border-dark dark:bg-surface-dark"
              >
                <div className="mb-2 flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold">{quote.projectName}</h3>
                    <p className="text-sm text-text-muted dark:text-text-muted-dark">
                      {quote.clientName}
                    </p>
                  </div>
                  <span className={`text-xs font-medium ${status.color}`}>
                    {status.label}
                  </span>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-lg font-bold text-primary">
                      {formatCurrency(total, quote.currency)}
                    </p>
                    <p className="text-xs text-text-muted dark:text-text-muted-dark">
                      {formatDate(quote.createdAt)} · 有效期 {quote.validDays} 天
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/quote/${quote.id}`}
                      className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
                    >
                      查看详情
                    </Link>
                    <button
                      onClick={() => deleteQuote(quote.id)}
                      className="rounded-lg bg-danger/10 p-1.5 text-danger transition-colors hover:bg-danger/20"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
