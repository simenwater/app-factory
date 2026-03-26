import type { LucideIcon } from "lucide-react";

/**
 * @description 空状态占位组件
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
      <h3 className="mb-2 text-lg font-semibold text-text dark:text-text-dark">
        {title}
      </h3>
      <p className="max-w-xs text-sm text-text-muted dark:text-text-muted-dark">
        {description}
      </p>
    </div>
  );
}
