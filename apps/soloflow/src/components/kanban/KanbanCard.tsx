"use client";

/**
 * @description 看板卡片组件（可拖拽）
 */

import { useDraggable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

interface KanbanCardProps {
  id: string;
  children: React.ReactNode;
  onClick?: () => void;
}

/**
 * @description 可拖拽的看板卡片
 * @param {KanbanCardProps} props
 */
export function KanbanCard({ id, children, onClick }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className={cn(
        "cursor-grab rounded-lg border border-border bg-card p-3 shadow-sm transition-shadow hover:shadow-md dark:border-border-dark dark:bg-card-dark",
        isDragging && "opacity-50 shadow-lg"
      )}
    >
      {children}
    </div>
  );
}
