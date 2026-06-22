/**
 * @fileoverview 空状态占位组件
 */

import type { LucideIcon } from "lucide-react";

/**
 * @component EmptyState
 * @param {Object} props
 * @param {LucideIcon} props.icon - 图标组件
 * @param {string} props.title - 标题
 * @param {string} props.description - 描述
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 rounded-full bg-primary/10 p-4">
        <Icon size={32} className="text-primary" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
      <p className="max-w-xs text-sm text-muted">{description}</p>
    </div>
  );
}
