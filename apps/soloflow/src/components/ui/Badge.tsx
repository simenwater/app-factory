/**
 * @description 标签/徽章组件
 */

import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  className?: string;
}

/**
 * @description 徽章组件
 * @param {BadgeProps} props
 */
export function Badge({ children, color, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        className
      )}
      style={
        color
          ? {
              backgroundColor: `${color}20`,
              color: color,
            }
          : undefined
      }
    >
      {children}
    </span>
  );
}
