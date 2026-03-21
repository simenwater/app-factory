"use client";

/**
 * @description 项目看板视图 — 拖拽管理项目状态
 */

import { useState } from "react";
import { Plus, Calendar, DollarSign } from "lucide-react";
import { useProjectStore } from "@/store/projectStore";
import { useClientStore } from "@/store/clientStore";
import type { Project, ProjectStatus } from "@/types";
import { PROJECT_COLUMNS } from "@/types";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { KanbanCard } from "@/components/kanban/KanbanCard";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProjectForm } from "./ProjectForm";
import { formatCurrency, formatDate } from "@/lib/utils";

/**
 * @description 项目看板
 */
export function ProjectBoard() {
  const { projects, addProject, updateProject, moveProject } = useProjectStore();
  const { getClientById } = useClientStore();
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>();

  const handleDragEnd = (itemId: string, newStatus: ProjectStatus) => {
    moveProject(itemId, newStatus);
  };

  const handleSubmit = (data: Omit<Project, "id" | "createdAt" | "updatedAt">) => {
    if (editingProject) {
      updateProject(editingProject.id, data);
    } else {
      addProject(data);
    }
    setShowForm(false);
    setEditingProject(undefined);
  };

  const items = PROJECT_COLUMNS.reduce(
    (acc, col) => {
      acc[col.id] = projects
        .filter((p) => p.status === col.id)
        .map((project) => {
          const client = getClientById(project.clientId);
          return (
            <KanbanCard
              key={project.id}
              id={project.id}
              onClick={() => {
                setEditingProject(project);
                setShowForm(true);
              }}
            >
              <div className="space-y-2">
                <p className="font-medium text-text dark:text-text-dark">{project.name}</p>
                {client && (
                  <p className="text-xs text-text-muted dark:text-text-muted-dark">
                    {client.name}
                  </p>
                )}
                <div className="flex flex-wrap gap-1">
                  {project.tags.map((tag) => (
                    <Badge key={tag} color="#6366f1" className="text-[10px]">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-3 text-xs text-text-muted dark:text-text-muted-dark">
                  {project.budget > 0 && (
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      {formatCurrency(project.budget)}
                    </span>
                  )}
                  {project.deadline && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(project.deadline)}
                    </span>
                  )}
                </div>
              </div>
            </KanbanCard>
          );
        });
      return acc;
    },
    {} as Record<ProjectStatus, React.ReactNode[]>
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text dark:text-text-dark">项目看板</h1>
          <p className="text-sm text-text-muted dark:text-text-muted-dark">
            拖拽卡片管理项目进度
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4" />
          新增项目
        </Button>
      </div>

      <KanbanBoard
        columns={PROJECT_COLUMNS}
        items={items}
        onDragEnd={handleDragEnd}
      />

      <Modal
        open={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingProject(undefined);
        }}
        title={editingProject ? "编辑项目" : "新增项目"}
      >
        <ProjectForm
          project={editingProject}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingProject(undefined);
          }}
        />
      </Modal>
    </div>
  );
}
