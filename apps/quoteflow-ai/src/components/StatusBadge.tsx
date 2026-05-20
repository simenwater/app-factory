import { getStatusColor } from "@/lib/utils";

/**
 * @description 状态徽章组件
 * @param {Object} props
 * @param {string} props.status - 状态文本
 */
export function StatusBadge({ status }: { status: string }) {
  const displayText = status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(status)}`}
    >
      {displayText}
    </span>
  );
}
