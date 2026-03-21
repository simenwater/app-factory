"use client";

/**
 * @description 通用看板组件 — 支持拖拽状态切换
 */

import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { useState } from "react";
import type { KanbanColumn } from "@/types";
import { KanbanColumnComponent } from "./KanbanColumn";

interface KanbanBoardProps<T extends string> {
  columns: KanbanColumn<T>[];
  items: Record<T, React.ReactNode[]>;
  onDragEnd: (itemId: string, newStatus: T) => void;
  renderOverlay?: (activeId: string) => React.ReactNode;
}

/**
 * @description 看板主组件
 * @param {KanbanBoardProps<T>} props
 */
export function KanbanBoard<T extends string>({
  columns,
  items,
  onDragEnd,
  renderOverlay,
}: KanbanBoardProps<T>) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const overId = over.id as string;
      const columnId = columns.find((c) => c.id === overId)?.id;
      if (columnId) {
        onDragEnd(active.id as string, columnId);
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((column) => (
          <KanbanColumnComponent
            key={column.id}
            id={column.id}
            title={column.title}
            color={column.color}
            count={items[column.id]?.length || 0}
          >
            {items[column.id]}
          </KanbanColumnComponent>
        ))}
      </div>
      <DragOverlay>
        {activeId && renderOverlay ? renderOverlay(activeId) : null}
      </DragOverlay>
    </DndContext>
  );
}
