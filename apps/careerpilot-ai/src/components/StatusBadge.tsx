/**
 * @fileoverview 申请状态徽章组件
 */
import type { ApplicationStatus } from "@/types";

/** 状态到样式映射 */
const STATUS_CONFIG: Record<ApplicationStatus, { label: string; className: string }> = {
  wishlist: {
    label: "Wishlist",
    className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  },
  applied: {
    label: "Applied",
    className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  },
  screening: {
    label: "Screening",
    className: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  },
  interviewing: {
    label: "Interviewing",
    className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  },
  offer: {
    label: "Offer",
    className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  },
  withdrawn: {
    label: "Withdrawn",
    className: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
  },
};

/**
 * @param props - 申请状态
 * @returns 带颜色的状态徽章
 */
export default function StatusBadge({ status }: { status: ApplicationStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}
