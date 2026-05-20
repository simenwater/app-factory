"use client";

import Link from "next/link";
import {
  FileText,
  Users,
  DollarSign,
  TrendingUp,
  Plus,
  Sparkles,
  Send,
  Clock,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { formatCurrency, calculateConversionRate } from "@/lib/utils";
import { StatusBadge } from "@/components/StatusBadge";
import { SubscriptionBanner } from "@/components/SubscriptionBanner";

/**
 * @description 首页仪表盘 — 展示收入概览、报价统计和快捷操作
 */
export default function DashboardPage() {
  const quotes = useStore((s) => s.quotes);
  const clients = useStore((s) => s.clients);
  const settings = useStore((s) => s.settings);
  const followUps = useStore((s) => s.followUps);

  const totalRevenue = quotes
    .filter((q) => q.paymentStatus === "paid")
    .reduce((sum, q) => sum + q.paidAmount, 0);

  const pendingAmount = quotes
    .filter(
      (q) =>
        q.quoteStatus === "accepted" &&
        (q.paymentStatus === "unpaid" || q.paymentStatus === "partial")
    )
    .reduce((sum, q) => sum + (q.total - q.paidAmount), 0);

  const sentQuotes = quotes.filter((q) => q.quoteStatus === "sent").length;
  const acceptedQuotes = quotes.filter((q) => q.quoteStatus === "accepted").length;
  const conversionRate = calculateConversionRate(
    quotes.filter((q) => q.quoteStatus !== "draft").length,
    acceptedQuotes
  );

  const pendingFollowUps = followUps.filter((f) => f.status === "pending").length;

  const recentQuotes = [...quotes]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const stats = [
    {
      label: "Revenue",
      value: formatCurrency(totalRevenue, settings.currency),
      icon: DollarSign,
      color: "text-green-500",
      bg: "bg-green-50 dark:bg-green-900/20",
    },
    {
      label: "Pending",
      value: formatCurrency(pendingAmount, settings.currency),
      icon: Clock,
      color: "text-orange-500",
      bg: "bg-orange-50 dark:bg-orange-900/20",
    },
    {
      label: "Conversion",
      value: `${conversionRate}%`,
      icon: TrendingUp,
      color: "text-indigo-500",
      bg: "bg-indigo-50 dark:bg-indigo-900/20",
    },
    {
      label: "Clients",
      value: clients.length,
      icon: Users,
      color: "text-purple-500",
      bg: "bg-purple-50 dark:bg-purple-900/20",
    },
  ];

  return (
    <div className="px-4 pt-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {settings.businessName || "QuoteFlow AI"}
          </h1>
          <p className="text-sm text-text-muted dark:text-text-muted-dark">
            {sentQuotes > 0
              ? `${sentQuotes} quote${sentQuotes > 1 ? "s" : ""} awaiting response`
              : "Your AI-powered quoting assistant"}
          </p>
        </div>
        <Link
          href="/quotes/new"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-105"
        >
          <Plus size={20} />
        </Link>
      </div>

      <SubscriptionBanner />

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-2 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`rounded-2xl ${stat.bg} p-4 transition-shadow hover:shadow-md`}
          >
            <div className="mb-2 flex items-center gap-2">
              <stat.icon size={18} className={stat.color} />
              <span className="text-xs font-medium text-text-muted dark:text-text-muted-dark">
                {stat.label}
              </span>
            </div>
            <p className="text-xl font-bold text-text dark:text-text-dark">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/quotes/new"
            className="flex items-center gap-3 rounded-xl bg-surface p-4 shadow-sm transition-shadow hover:shadow-md dark:bg-surface-dark"
          >
            <div className="rounded-lg bg-primary/10 p-2">
              <Sparkles size={18} className="text-primary" />
            </div>
            <span className="text-sm font-medium">AI Quote</span>
          </Link>
          <Link
            href="/clients"
            className="flex items-center gap-3 rounded-xl bg-surface p-4 shadow-sm transition-shadow hover:shadow-md dark:bg-surface-dark"
          >
            <div className="rounded-lg bg-purple-500/10 p-2">
              <Users size={18} className="text-purple-500" />
            </div>
            <span className="text-sm font-medium">Clients</span>
          </Link>
        </div>
      </div>

      {/* Pending Follow-ups */}
      {pendingFollowUps > 0 && (
        <div className="mb-8">
          <Link
            href="/follow-ups"
            className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 p-4 shadow-sm transition-shadow hover:shadow-md dark:from-indigo-900/20 dark:to-purple-900/20"
          >
            <div className="rounded-lg bg-indigo-500/10 p-2">
              <Send size={18} className="text-indigo-500" />
            </div>
            <div className="flex-1">
              <span className="text-sm font-medium">
                {pendingFollowUps} Pending Follow-up{pendingFollowUps > 1 ? "s" : ""}
              </span>
              <p className="text-xs text-text-muted dark:text-text-muted-dark">
                Tap to review and send
              </p>
            </div>
          </Link>
        </div>
      )}

      {/* Recent Quotes */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
            Recent Quotes
          </h2>
          <Link
            href="/quotes"
            className="text-xs font-medium text-primary hover:underline"
          >
            View All
          </Link>
        </div>
        {recentQuotes.length === 0 ? (
          <div className="rounded-xl bg-surface p-6 text-center shadow-sm dark:bg-surface-dark">
            <FileText
              size={24}
              className="mx-auto mb-2 text-text-muted dark:text-text-muted-dark"
            />
            <p className="text-sm text-text-muted dark:text-text-muted-dark">
              No quotes yet. Create your first AI-powered quote!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentQuotes.map((quote) => (
              <Link
                key={quote.id}
                href={`/quotes/${quote.id}`}
                className="block rounded-xl bg-surface p-4 shadow-sm transition-shadow hover:shadow-md dark:bg-surface-dark"
              >
                <div className="mb-1 flex items-center justify-between">
                  <h3 className="font-medium">{quote.client.name}</h3>
                  <StatusBadge status={quote.quoteStatus} />
                </div>
                <p className="text-xs text-text-muted dark:text-text-muted-dark">
                  {quote.quoteNumber} &middot;{" "}
                  {formatCurrency(quote.total, settings.currency)}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
