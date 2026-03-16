"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Phone,
  Mail,
  FileText,
  Trash2,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { StatusBadge } from "@/components/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { JobStatus } from "@/types";

const STATUS_OPTIONS: { label: string; value: JobStatus }[] = [
  { label: "Scheduled", value: "scheduled" },
  { label: "In Progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

/**
 * @description 工作详情页
 */
export default function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { jobs, updateJob, deleteJob, settings } = useStore();
  const job = jobs.find((j) => j.id === id);

  if (!job) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-bold">Job Not Found</h2>
          <Link href="/jobs" className="text-primary hover:underline">
            Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  const handleStatusChange = (status: JobStatus) => {
    updateJob(id, { status });
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this job?")) {
      deleteJob(id);
      router.push("/jobs");
    }
  };

  return (
    <div className="px-4 pt-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/jobs"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-surface shadow-sm dark:bg-surface-dark"
          >
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-xl font-bold">{job.title}</h1>
        </div>
        <StatusBadge status={job.status} />
      </div>

      {/* Status Actions */}
      <div className="mb-6 flex flex-wrap gap-2">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleStatusChange(opt.value)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              job.status === opt.value
                ? "bg-primary text-white"
                : "bg-surface shadow-sm hover:bg-gray-100 dark:bg-surface-dark dark:hover:bg-gray-800"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Details Cards */}
      <div className="space-y-4">
        {/* Schedule & Location */}
        <div className="rounded-xl bg-surface p-4 shadow-sm dark:bg-surface-dark">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
            Details
          </h3>
          <div className="space-y-3">
            {job.description && (
              <p className="text-sm text-text-muted dark:text-text-muted-dark">
                {job.description}
              </p>
            )}
            <div className="flex items-center gap-3 text-sm">
              <MapPin size={16} className="text-text-muted" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Calendar size={16} className="text-text-muted" />
              <span>
                {formatDate(job.scheduledDate)} at {job.scheduledTime}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Clock size={16} className="text-text-muted" />
              <span>{job.estimatedDuration} minutes</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <DollarSign size={16} className="text-text-muted" />
              <span className="font-semibold">
                {formatCurrency(job.price, settings.currency)}
              </span>
            </div>
          </div>
        </div>

        {/* Customer */}
        <div className="rounded-xl bg-surface p-4 shadow-sm dark:bg-surface-dark">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
            Customer
          </h3>
          <p className="mb-2 font-semibold">{job.customer.name}</p>
          <div className="space-y-2 text-sm text-text-muted dark:text-text-muted-dark">
            {job.customer.email && (
              <a
                href={`mailto:${job.customer.email}`}
                className="flex items-center gap-2 hover:text-primary"
              >
                <Mail size={14} />
                {job.customer.email}
              </a>
            )}
            {job.customer.phone && (
              <a
                href={`tel:${job.customer.phone}`}
                className="flex items-center gap-2 hover:text-primary"
              >
                <Phone size={14} />
                {job.customer.phone}
              </a>
            )}
          </div>
        </div>

        {/* Notes */}
        {job.notes && (
          <div className="rounded-xl bg-surface p-4 shadow-sm dark:bg-surface-dark">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
              Notes
            </h3>
            <p className="text-sm">{job.notes}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Link
            href={`/invoices/new?jobId=${job.id}`}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark"
          >
            <FileText size={16} />
            Create Invoice
          </Link>
          <button
            onClick={handleDelete}
            className="flex items-center justify-center rounded-xl bg-red-50 px-4 py-3 text-red-600 shadow-sm transition-colors hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
