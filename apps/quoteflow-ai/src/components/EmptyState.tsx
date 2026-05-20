import type { LucideIcon } from "lucide-react";

/**
 * @description 空状态占位组件
 * @param {Object} props
 * @param {LucideIcon} props.icon - 展示的图标
 * @param {string} props.title - 标题
 * @param {string} props.description - 描述文字
 * @param {React.ReactNode} [props.action] - 操作按钮
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-surface p-10 text-center shadow-sm dark:bg-surface-dark">
      <div className="mb-4 rounded-full bg-primary/10 p-4">
        <Icon size={32} className="text-primary" />
      </div>
      <h3 className="mb-1 text-lg font-semibold">{title}</h3>
      <p className="mb-4 max-w-xs text-sm text-text-muted dark:text-text-muted-dark">
        {description}
      </p>
      {action}
    </div>
  );
}
