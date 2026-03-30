"use client";

import Link from "next/link";
import {
  FileText,
  Wrench,
  Calculator,
  TrendingUp,
  Plus,
  Clock,
  CheckCircle,
  Send,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { formatCurrency, formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/StatusBadge";

/**
 * @description 首页仪表盘
 */
export default function HomePage() {
  const quotes = useStore((s) => s.quotes);
  const services = useStore((s) => s.services);
  const settings = useStore((s) => s.settings);

  const totalRevenue = quotes
    .filter((q) => q.status === "accepted")
    .reduce((sum, q) => sum + q.total, 0);
  const pendingQuotes = quotes.filter((q) => q.status === "sent").length;
  const acceptedQuotes = quotes.filter((q) => q.status === "accepted").length;
  const recentQuotes = [...quotes]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const stats = [
    { label: "总报价", value: quotes.length, icon: FileText, color: "text-primary" },
    { label: "待回复", value: pendingQuotes, icon: Send, color: "text-blue-500" },
    { label: "已成交", value: acceptedQuotes, icon: CheckCircle, color: "text-success" },
    {
      label: "收入",
      value: formatCurrency(totalRevenue, settings.currency),
      icon: TrendingUp,
      color: "text-primary",
    },
  ];

  return (
    <div className="px-4 pt-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text dark:text-text-dark">
            QuoteSwift
          </h1>
          <p className="text-sm text-text-muted dark:text-text-muted-dark">
            快速生成专业报价单
          </p>
        </div>
        <Link
          href="/quotes/new"
          className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-dark"
        >
          <Plus size={18} />
          新建报价
        </Link>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-xl border border-border bg-surface p-4 dark:border-border-dark dark:bg-surface-dark"
          >
            <div className="mb-2 flex items-center gap-2">
              <Icon size={18} className={color} />
              <span className="text-xs text-text-muted dark:text-text-muted-dark">
                {label}
              </span>
            </div>
            <p className="text-xl font-bold text-text dark:text-text-dark">
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="mb-4 grid grid-cols-3 gap-3">
        <Link
          href="/services"
          className="flex flex-col items-center gap-2 rounded-xl border border-border bg-surface p-4 transition-colors hover:bg-primary/5 dark:border-border-dark dark:bg-surface-dark"
        >
          <Wrench size={24} className="text-primary" />
          <span className="text-xs font-medium">服务库 ({services.length})</span>
        </Link>
        <Link
          href="/templates"
          className="flex flex-col items-center gap-2 rounded-xl border border-border bg-surface p-4 transition-colors hover:bg-primary/5 dark:border-border-dark dark:bg-surface-dark"
        >
          <FileText size={24} className="text-primary" />
          <span className="text-xs font-medium">模板</span>
        </Link>
        <Link
          href="/calculator"
          className="flex flex-col items-center gap-2 rounded-xl border border-border bg-surface p-4 transition-colors hover:bg-primary/5 dark:border-border-dark dark:bg-surface-dark"
        >
          <Calculator size={24} className="text-primary" />
          <span className="text-xs font-medium">计算器</span>
        </Link>
      </div>

      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text dark:text-text-dark">
          最近报价
        </h2>
        {quotes.length > 0 && (
          <Link href="/quotes" className="text-sm text-primary hover:text-primary-dark">
            查看全部
          </Link>
        )}
      </div>

      {recentQuotes.length === 0 ? (
        <div className="rounded-xl border border-border bg-surface p-8 text-center dark:border-border-dark dark:bg-surface-dark">
          <Clock size={32} className="mx-auto mb-3 text-text-muted dark:text-text-muted-dark" />
          <p className="text-sm text-text-muted dark:text-text-muted-dark">
            还没有报价单，点击上方按钮创建第一个报价吧
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {recentQuotes.map((quote) => (
            <Link
              key={quote.id}
              href={`/quotes/${quote.id}`}
              className="block rounded-xl border border-border bg-surface p-4 transition-colors hover:bg-primary/5 dark:border-border-dark dark:bg-surface-dark"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="font-medium text-text dark:text-text-dark">
                  {quote.customer.name}
                </span>
                <StatusBadge status={quote.status} />
              </div>
              <div className="flex items-center justify-between text-sm text-text-muted dark:text-text-muted-dark">
                <span>#{quote.quoteNumber}</span>
                <span className="font-semibold text-text dark:text-text-dark">
                  {formatCurrency(quote.total, settings.currency)}
                </span>
              </div>
              <p className="mt-1 text-xs text-text-muted dark:text-text-muted-dark">
                {formatDate(quote.createdAt)}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
