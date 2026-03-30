"use client";

import type { QuoteStatus } from "@/types";

const STATUS_CONFIG: Record<QuoteStatus, { label: string; className: string }> = {
  draft: { label: "草稿", className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" },
  sent: { label: "已发送", className: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" },
  accepted: { label: "已接受", className: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" },
  declined: { label: "已拒绝", className: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" },
  expired: { label: "已过期", className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300" },
};

/**
 * @description 报价单状态徽标
 * @param {{ status: QuoteStatus }} props
 */
export function StatusBadge({ status }: { status: QuoteStatus }) {
  const config = STATUS_CONFIG[status];

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}
