"use client";

import Link from "next/link";
import {
  Briefcase,
  CalendarDays,
  FileText,
  DollarSign,
  Plus,
  TrendingUp,
  Clock,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { formatCurrency, isToday } from "@/lib/utils";
import { StatusBadge } from "@/components/StatusBadge";

/**
 * @description 首页仪表盘
 */
export default function HomePage() {
  const jobs = useStore((s) => s.jobs);
  const invoices = useStore((s) => s.invoices);
  const settings = useStore((s) => s.settings);

  const todayJobs = jobs.filter((j) => isToday(j.scheduledDate));
  const activeJobs = jobs.filter(
    (j) => j.status === "scheduled" || j.status === "in_progress"
  );
  const unpaidInvoices = invoices.filter(
    (inv) => inv.paymentStatus === "unpaid" || inv.paymentStatus === "overdue"
  );
  const totalRevenue = invoices
    .filter((inv) => inv.paymentStatus === "paid")
    .reduce((sum, inv) => sum + inv.paidAmount, 0);

  const stats = [
    {
      label: "Active Jobs",
      value: activeJobs.length,
      icon: Briefcase,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      label: "Today",
      value: todayJobs.length,
      icon: CalendarDays,
      color: "text-purple-500",
      bg: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      label: "Unpaid",
      value: unpaidInvoices.length,
      icon: FileText,
      color: "text-orange-500",
      bg: "bg-orange-50 dark:bg-orange-900/20",
    },
    {
      label: "Revenue",
      value: formatCurrency(totalRevenue, settings.currency),
      icon: TrendingUp,
      color: "text-green-500",
      bg: "bg-green-50 dark:bg-green-900/20",
    },
  ];

  return (
    <div className="px-4 pt-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {settings.businessName || "FieldFlow"}
          </h1>
          <p className="text-sm text-text-muted dark:text-text-muted-dark">
            {todayJobs.length > 0
              ? `${todayJobs.length} job${todayJobs.length > 1 ? "s" : ""} today`
              : "No jobs scheduled for today"}
          </p>
        </div>
        <Link
          href="/jobs/new"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-105"
        >
          <Plus size={20} />
        </Link>
      </div>

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
            href="/jobs/new"
            className="flex items-center gap-3 rounded-xl bg-surface p-4 shadow-sm transition-shadow hover:shadow-md dark:bg-surface-dark"
          >
            <div className="rounded-lg bg-primary/10 p-2">
              <Briefcase size={18} className="text-primary" />
            </div>
            <span className="text-sm font-medium">New Job</span>
          </Link>
          <Link
            href="/invoices/new"
            className="flex items-center gap-3 rounded-xl bg-surface p-4 shadow-sm transition-shadow hover:shadow-md dark:bg-surface-dark"
          >
            <div className="rounded-lg bg-green-500/10 p-2">
              <DollarSign size={18} className="text-green-500" />
            </div>
            <span className="text-sm font-medium">New Invoice</span>
          </Link>
        </div>
      </div>

      {/* Upcoming Jobs */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
            Upcoming Jobs
          </h2>
          <Link
            href="/jobs"
            className="text-xs font-medium text-primary hover:underline"
          >
            View All
          </Link>
        </div>
        {activeJobs.length === 0 ? (
          <div className="rounded-xl bg-surface p-6 text-center shadow-sm dark:bg-surface-dark">
            <Clock
              size={24}
              className="mx-auto mb-2 text-text-muted dark:text-text-muted-dark"
            />
            <p className="text-sm text-text-muted dark:text-text-muted-dark">
              No upcoming jobs
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeJobs.slice(0, 5).map((job) => (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="block rounded-xl bg-surface p-4 shadow-sm transition-shadow hover:shadow-md dark:bg-surface-dark"
              >
                <div className="mb-1 flex items-center justify-between">
                  <h3 className="font-medium">{job.title}</h3>
                  <StatusBadge status={job.status} />
                </div>
                <p className="text-sm text-text-muted dark:text-text-muted-dark">
                  {job.customer.name} &middot; {job.scheduledDate} at{" "}
                  {job.scheduledTime}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
