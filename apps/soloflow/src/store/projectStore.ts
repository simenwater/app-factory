/**
 * @description 项目状态管理 Store
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Project, ProjectStatus } from "@/types";

/** @description 项目 Store 接口 */
interface ProjectStore {
  projects: Project[];
  addProject: (project: Omit<Project, "id" | "createdAt" | "updatedAt">) => Project;
  updateProject: (id: string, data: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  moveProject: (id: string, status: ProjectStatus) => void;
  getProjectById: (id: string) => Project | undefined;
  getProjectsByStatus: (status: ProjectStatus) => Project[];
  getProjectsByClient: (clientId: string) => Project[];
}

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      projects: [],

      addProject: (data) => {
        const now = new Date().toISOString();
        const project: Project = {
          ...data,
          id: crypto.randomUUID(),
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ projects: [...state.projects, project] }));
        return project;
      },

      updateProject: (id, data) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p
          ),
        }));
      },

      deleteProject: (id) => {
        set((state) => ({ projects: state.projects.filter((p) => p.id !== id) }));
      },

      moveProject: (id, status) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, status, updatedAt: new Date().toISOString() } : p
          ),
        }));
      },

      getProjectById: (id) => {
        return get().projects.find((p) => p.id === id);
      },

      getProjectsByStatus: (status) => {
        return get().projects.filter((p) => p.status === status);
      },

      getProjectsByClient: (clientId) => {
        return get().projects.filter((p) => p.clientId === clientId);
      },
    }),
    { name: "soloflow-projects" }
  )
);
