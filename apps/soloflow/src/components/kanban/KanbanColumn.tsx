"use client";

/**
 * @description 看板列组件
 */

import { useDroppable } from "@dnd-kit/core";

interface KanbanColumnProps {
  id: string;
  title: string;
  color: string;
  count: number;
  children: React.ReactNode;
}

/**
 * @description 看板列
 * @param {KanbanColumnProps} props
 */
export function KanbanColumnComponent({
  id,
  title,
  color,
  count,
  children,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`flex min-h-[200px] w-72 flex-shrink-0 flex-col rounded-xl border bg-surface/50 dark:bg-surface-dark/50 transition-colors ${
        isOver
          ? "border-primary bg-primary/5 dark:bg-primary/10"
          : "border-border dark:border-border-dark"
      }`}
    >
      <div className="flex items-center gap-2 border-b border-border px-4 py-3 dark:border-border-dark">
        <div
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: color }}
        />
        <h3 className="text-sm font-semibold text-text dark:text-text-dark">
          {title}
        </h3>
        <span className="ml-auto rounded-full bg-border/50 px-2 py-0.5 text-xs font-medium text-text-muted dark:bg-border-dark/50 dark:text-text-muted-dark">
          {count}
        </span>
      </div>
      <div className="flex flex-col gap-2 p-3">{children}</div>
    </div>
  );
}
