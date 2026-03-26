import type { TrackingStatus } from "@/types";
import { trackingStatusColor, trackingStatusLabel } from "@/lib/utils";

/**
 * @description 追踪状态徽章组件
 */
export function StatusBadge({ status }: { status: TrackingStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${trackingStatusColor(status)}`}
    >
      {trackingStatusLabel(status)}
    </span>
  );
}
