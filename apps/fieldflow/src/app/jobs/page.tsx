"use client";

import Link from "next/link";
import { Plus, Briefcase, MapPin, Download } from "lucide-react";
import { useStore } from "@/store/useStore";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/EmptyState";
import { formatCurrency, formatDate } from "@/lib/utils";
import { exportJobsCSV } from "@/lib/export";
import { useState } from "react";
import type { JobStatus } from "@/types";

const FILTER_TABS: { label: string; value: JobStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Scheduled", value: "scheduled" },
  { label: "In Progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
];

/**
 * @description 工作列表页（含免费CSV导出）
 */
export default function JobsPage() {
  const jobs = useStore((s) => s.jobs);
  const settings = useStore((s) => s.settings);
  const [filter, setFilter] = useState<JobStatus | "all">("all");

  const filteredJobs =
    filter === "all" ? jobs : jobs.filter((j) => j.status === filter);
  const sortedJobs = [...filteredJobs].sort(
    (a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime()
  );

  return (
    <div className="px-4 pt-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Jobs</h1>
        <div className="flex items-center gap-2">
          {jobs.length > 0 && (
            <button
              onClick={() => exportJobsCSV(jobs, settings)}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface shadow-sm transition-colors hover:bg-gray-50 dark:bg-surface-dark dark:hover:bg-gray-800"
              title="Export CSV"
            >
              <Download size={16} className="text-text-muted" />
            </button>
          )}
          <Link
            href="/jobs/new"
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-dark"
          >
            <Plus size={16} />
            New Job
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              filter === tab.value
                ? "bg-primary text-white"
                : "bg-surface text-text-muted shadow-sm hover:bg-gray-100 dark:bg-surface-dark dark:text-text-muted-dark dark:hover:bg-gray-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {sortedJobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No Jobs Yet"
          description="Create your first job to start managing your field service work."
          actionLabel="Create Job"
          actionHref="/jobs/new"
        />
      ) : (
        <div className="space-y-3">
          {sortedJobs.map((job) => (
            <Link
              key={job.id}
              href={`/jobs/${job.id}`}
              className="block rounded-xl bg-surface p-4 shadow-sm transition-shadow hover:shadow-md dark:bg-surface-dark"
            >
              <div className="mb-2 flex items-start justify-between">
                <div className="mr-3 flex-1">
                  <h3 className="font-semibold">{job.title}</h3>
                  <p className="text-sm text-text-muted dark:text-text-muted-dark">
                    {job.customer.name}
                  </p>
                </div>
                <StatusBadge status={job.status} />
              </div>
              <div className="flex items-center justify-between text-xs text-text-muted dark:text-text-muted-dark">
                <div className="flex items-center gap-1">
                  <MapPin size={12} />
                  <span className="max-w-[180px] truncate">
                    {job.location}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span>{formatDate(job.scheduledDate)}</span>
                  <span className="font-medium text-text dark:text-text-dark">
                    {formatCurrency(job.price, settings.currency)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
