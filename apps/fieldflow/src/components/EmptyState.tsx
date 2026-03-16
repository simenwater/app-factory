import type { LucideIcon } from "lucide-react";
import Link from "next/link";

/**
 * @description 空状态占位组件
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-4 rounded-full bg-primary/10 p-4">
        <Icon size={32} className="text-primary" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-text dark:text-text-dark">
        {title}
      </h3>
      <p className="mb-6 max-w-xs text-sm text-text-muted dark:text-text-muted-dark">
        {description}
      </p>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-dark"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
