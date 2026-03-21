"use client";

/**
 * @description 首页仪表盘 — 概览所有关键指标
 */

import { useMemo } from "react";
import Link from "next/link";
import {
  Users,
  FolderKanban,
  FileText,
  Receipt,
  DollarSign,
  TrendingUp,
  ArrowRight,
  Zap,
} from "lucide-react";
import { useClientStore } from "@/store/clientStore";
import { useProjectStore } from "@/store/projectStore";
import { useQuoteStore } from "@/store/quoteStore";
import { useInvoiceStore } from "@/store/invoiceStore";
import { formatCurrency } from "@/lib/utils";
import { Card } from "@/components/ui/Card";

/**
 * @description 仪表盘页面
 */
export default function DashboardPage() {
  const { clients } = useClientStore();
  const { projects } = useProjectStore();
  const { quotes } = useQuoteStore();
  const { invoices, getTotalRevenue } = useInvoiceStore();

  const totalRevenue = useMemo(() => getTotalRevenue(), [invoices, getTotalRevenue]);
  const activeProjects = projects.filter((p) => p.status === "in_progress").length;
  const pendingQuotes = quotes.filter((q) => q.status === "sent").length;
  const pendingInvoices = invoices.filter((i) => i.status === "sent" || i.status === "overdue");
  const pendingAmount = pendingInvoices.reduce((sum, i) => sum + i.total, 0);

  const stats = [
    {
      label: "总客户",
      value: clients.length,
      icon: Users,
      color: "text-primary",
      bg: "bg-primary/10",
      href: "/clients",
    },
    {
      label: "进行中项目",
      value: activeProjects,
      icon: FolderKanban,
      color: "text-accent",
      bg: "bg-accent/10",
      href: "/projects",
    },
    {
      label: "待处理报价",
      value: pendingQuotes,
      icon: FileText,
      color: "text-warning",
      bg: "bg-warning/10",
      href: "/quotes",
    },
    {
      label: "总收入",
      value: formatCurrency(totalRevenue),
      icon: DollarSign,
      color: "text-success",
      bg: "bg-success/10",
      href: "/finance",
    },
  ];

  const quickActions = [
    { label: "新增客户", href: "/clients", icon: Users },
    { label: "创建项目", href: "/projects", icon: FolderKanban },
    { label: "生成报价", href: "/quotes", icon: FileText },
    { label: "创建发票", href: "/invoices", icon: Receipt },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <Zap className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-text dark:text-text-dark">
              欢迎回来
            </h1>
            <p className="text-sm text-text-muted dark:text-text-muted-dark">
              这是你的业务概览
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="flex items-center gap-4 transition-shadow hover:shadow-md">
              <div className={`rounded-xl p-3 ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-text-muted dark:text-text-muted-dark">
                  {stat.label}
                </p>
                <p className="text-xl font-bold text-text dark:text-text-dark">
                  {stat.value}
                </p>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <Card>
          <h2 className="mb-4 text-lg font-semibold text-text dark:text-text-dark">
            快速操作
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-border/30 dark:border-border-dark dark:hover:bg-border-dark/30"
              >
                <action.icon className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-text dark:text-text-dark">
                  {action.label}
                </span>
                <ArrowRight className="ml-auto h-4 w-4 text-text-muted dark:text-text-muted-dark" />
              </Link>
            ))}
          </div>
        </Card>

        {/* Pending Invoices */}
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text dark:text-text-dark">
              待收款发票
            </h2>
            <Link
              href="/invoices"
              className="text-sm text-primary hover:text-primary-dark"
            >
              查看全部
            </Link>
          </div>
          {pendingInvoices.length === 0 ? (
            <p className="py-4 text-center text-sm text-text-muted dark:text-text-muted-dark">
              暂无待收款发票
            </p>
          ) : (
            <div className="space-y-3">
              {pendingInvoices.slice(0, 5).map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-text dark:text-text-dark">
                      {invoice.invoiceNumber}
                    </p>
                    <p className="text-xs text-text-muted dark:text-text-muted-dark">
                      {invoice.status === "overdue" ? "已逾期" : "已发送"}
                    </p>
                  </div>
                  <span className="font-medium text-text dark:text-text-dark">
                    {formatCurrency(invoice.total)}
                  </span>
                </div>
              ))}
              {pendingAmount > 0 && (
                <div className="border-t border-border pt-3 dark:border-border-dark">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-text dark:text-text-dark">
                      待收总额
                    </span>
                    <span className="text-lg font-bold text-warning">
                      {formatCurrency(pendingAmount)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Recent Projects */}
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text dark:text-text-dark">
              最近项目
            </h2>
            <Link
              href="/projects"
              className="text-sm text-primary hover:text-primary-dark"
            >
              查看看板
            </Link>
          </div>
          {projects.length === 0 ? (
            <p className="py-4 text-center text-sm text-text-muted dark:text-text-muted-dark">
              暂无项目，去创建你的第一个项目吧
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {projects.slice(0, 6).map((project) => (
                <div
                  key={project.id}
                  className="rounded-lg border border-border p-3 dark:border-border-dark"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-text dark:text-text-dark">
                      {project.name}
                    </p>
                    <TrendingUp className="h-4 w-4 text-text-muted dark:text-text-muted-dark" />
                  </div>
                  <p className="mt-1 text-xs text-text-muted dark:text-text-muted-dark">
                    {project.status === "inquiry" && "咨询中"}
                    {project.status === "quoted" && "已报价"}
                    {project.status === "in_progress" && "进行中"}
                    {project.status === "review" && "审核中"}
                    {project.status === "completed" && "已完成"}
                    {project.status === "cancelled" && "已取消"}
                  </p>
                  {project.budget > 0 && (
                    <p className="mt-1 text-sm font-semibold text-primary">
                      {formatCurrency(project.budget)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
