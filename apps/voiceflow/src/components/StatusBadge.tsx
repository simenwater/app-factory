import { getStatusInfo } from "@/lib/utils";
import type { NoteStatus } from "@/types";

/**
 * @description 状态标签组件
 */
export default function StatusBadge({ status }: { status: NoteStatus }) {
  const { label, color } = getStatusInfo(status);

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-surface-alt px-2 py-0.5 text-xs font-medium ${color}`}
    >
      {status !== "completed" && status !== "error" && (
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
      )}
      {label}
    </span>
  );
}
