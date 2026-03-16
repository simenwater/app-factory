import { getStatusColor } from "@/lib/utils";

/**
 * @description 状态标签组件
 */
export function StatusBadge({ status }: { status: string }) {
  const displayText = status.replace(/_/g, " ");
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${getStatusColor(status)}`}
    >
      {displayText}
    </span>
  );
}
