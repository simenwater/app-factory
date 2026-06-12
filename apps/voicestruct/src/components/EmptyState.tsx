"use client";

import type { LucideIcon } from "lucide-react";

/**
 * @description 空状态占位组件
 * @param {Object} props
 * @param {LucideIcon} props.icon - 图标组件
 * @param {string} props.title - 标题文本
 * @param {string} props.description - 描述文本
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
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <div className="rounded-2xl bg-primary/10 p-4 dark:bg-primary/20">
        <Icon size={32} className="text-primary dark:text-primary-light" />
      </div>
      <div>
        <h3 className="font-semibold text-text dark:text-text-dark">{title}</h3>
        <p className="mt-1 text-sm text-text-muted dark:text-text-muted-dark">
          {description}
        </p>
      </div>
    </div>
  );
}
