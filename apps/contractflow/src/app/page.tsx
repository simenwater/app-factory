/**
 * @fileoverview 仪表盘页面
 * 展示业务概览：客户数、报价单、合同、付款统计
 */

"use client";

import { useStore } from "@/store/useStore";
import { calculateDashboardStats, formatCurrency, cn } from "@/lib/utils";
import {
  Users,
  FileText,
  FileCheck,
  CreditCard,
  DollarSign,
  AlertTriangle,
  Moon,
  Sun,
  TrendingUp,
  Plus,
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import Link from "next/link";

export default function DashboardPage() {
  const { clients, quotes, contracts, payments, settings, subscription } = useStore();
  const { theme, toggleTheme } = useTheme();
  const stats = calculateDashboardStats(clients, quotes, contracts, payments);

  const statCards = [
    { label: "Clients", value: stats.totalClients, icon: Users, color: "text-blue-500", href: "/clients" },
    { label: "Active Quotes", value: stats.activeQuotes, icon: FileText, color: "text-indigo-500", href: "/quotes" },
    { label: "Active Contracts", value: stats.activeContracts, icon: FileCheck, color: "text-emerald-500", href: "/contracts" },
    { label: "Pending Payments", value: stats.pendingPayments, icon: CreditCard, color: "text-amber-500", href: "/payments" },
  ];

  return (
    <div className="px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text dark:text-text-dark">
            ContractFlow
          </h1>
          <p className="text-sm text-text-muted dark:text-text-muted-dark">
            {settings.businessName || "Set up your business"}
          </p>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-surface dark:bg-surface-dark border border-border dark:border-border-dark"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      {/* Subscription Banner */}
      {subscription.plan === "free" && (
        <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Free Plan</p>
              <p className="text-xs opacity-80">
                {subscription.contractsUsedThisMonth}/{subscription.maxContractsPerMonth} contracts this month
              </p>
            </div>
            <Link
              href="/settings"
              className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg font-medium transition-colors"
            >
              Upgrade
            </Link>
          </div>
        </div>
      )}

      {/* Revenue Card */}
      <div className="mb-6 p-4 rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-text-muted dark:text-text-muted-dark">Total Revenue</p>
            <p className="text-2xl font-bold text-text dark:text-text-dark">
              {formatCurrency(stats.totalRevenue, settings.currency)}
            </p>
          </div>
          {stats.overduePayments > 0 && (
            <div className="ml-auto flex items-center gap-1 text-danger">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-xs font-medium">{stats.overduePayments} overdue</span>
            </div>
          )}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="p-4 rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark hover:border-primary/30 transition-colors"
          >
            <card.icon className={cn("w-5 h-5 mb-2", card.color)} />
            <p className="text-2xl font-bold text-text dark:text-text-dark">{card.value}</p>
            <p className="text-xs text-text-muted dark:text-text-muted-dark">{card.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <h2 className="text-sm font-semibold text-text-muted dark:text-text-muted-dark uppercase tracking-wider mb-3">
        Quick Actions
      </h2>
      <div className="space-y-2">
        <Link
          href="/quotes/new"
          className="flex items-center gap-3 p-3 rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark hover:border-primary/30 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
            <Plus className="w-4 h-4 text-indigo-600" />
          </div>
          <span className="text-sm font-medium text-text dark:text-text-dark">New Quote</span>
        </Link>
        <Link
          href="/contracts/new"
          className="flex items-center gap-3 p-3 rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark hover:border-primary/30 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <Plus className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-sm font-medium text-text dark:text-text-dark">New Contract</span>
        </Link>
        <Link
          href="/clients/new"
          className="flex items-center gap-3 p-3 rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark hover:border-primary/30 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <Plus className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-sm font-medium text-text dark:text-text-dark">Add Client</span>
        </Link>
      </div>

      {/* Recent Activity */}
      {(quotes.length > 0 || contracts.length > 0) && (
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-text-muted dark:text-text-muted-dark uppercase tracking-wider mb-3">
            Recent Activity
          </h2>
          <div className="space-y-2">
            {[...quotes, ...contracts]
              .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
              .slice(0, 5)
              .map((item) => {
                const isQuote = "quoteNumber" in item;
                return (
                  <Link
                    key={item.id}
                    href={isQuote ? `/quotes/${item.id}` : `/contracts/${item.id}`}
                    className="flex items-center justify-between p-3 rounded-xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-4 h-4 text-text-muted dark:text-text-muted-dark" />
                      <div>
                        <p className="text-sm font-medium text-text dark:text-text-dark">
                          {isQuote ? (item as typeof quotes[0]).quoteNumber : (item as typeof contracts[0]).contractNumber}
                        </p>
                        <p className="text-xs text-text-muted dark:text-text-muted-dark">
                          {item.title}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
