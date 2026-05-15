/**
 * @fileoverview 全局状态管理（Zustand）
 */

import { create } from "zustand";
import { Project, Template, Device, Subscription, TemplateCategory } from "@/types";
import { builtInTemplates } from "@/lib/templates";
import { v4 as uuidv4 } from "uuid";

/** 应用全局状态接口 */
interface AppState {
  /** 项目列表 */
  projects: Project[];
  /** 模板列表（含内置和自定义） */
  templates: Template[];
  /** 设备列表 */
  devices: Device[];
  /** 订阅信息 */
  subscription: Subscription;
  /** 当前正在编辑的项目 ID */
  activeProjectId: string | null;
  /** 当前选中的模板分类过滤 */
  selectedCategory: TemplateCategory | "all";
  /** 搜索关键词 */
  searchQuery: string;
  /** 深色模式 */
  darkMode: boolean;
  /** 同步中标记 */
  isSyncing: boolean;

  /** 创建新项目 */
  createProject: (name: string, description: string, templateId?: string) => Project;
  /** 更新项目内容 */
  updateProject: (id: string, updates: Partial<Project>) => void;
  /** 删除项目 */
  deleteProject: (id: string) => void;
  /** 设置活跃项目 */
  setActiveProject: (id: string | null) => void;

  /** 添加自定义模板 */
  addCustomTemplate: (template: Omit<Template, "id" | "createdAt" | "updatedAt" | "isBuiltIn">) => void;
  /** 删除自定义模板 */
  deleteTemplate: (id: string) => void;
  /** 设置分类过滤 */
  setSelectedCategory: (category: TemplateCategory | "all") => void;
  /** 设置搜索关键词 */
  setSearchQuery: (query: string) => void;

  /** 切换深色模式 */
  toggleDarkMode: () => void;
  /** 设置同步状态 */
  setSyncing: (syncing: boolean) => void;
  /** 设置设备列表 */
  setDevices: (devices: Device[]) => void;
  /** 批量导入项目 */
  importProjects: (projects: Project[]) => void;
  /** 批量导入模板 */
  importTemplates: (templates: Template[]) => void;
}

/**
 * 保存状态到 localStorage
 * @param key - 存储键
 * @param value - 要保存的值
 */
function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage 不可用时静默失败
  }
}

/** 默认订阅信息 */
const defaultSubscription: Subscription = {
  plan: "free",
  projectLimit: 3,
  projectCount: 0,
  teamSharing: false,
  cloudSync: false,
};

export const useStore = create<AppState>((set, get) => ({
  projects: [],
  templates: [...builtInTemplates],
  devices: [],
  subscription: defaultSubscription,
  activeProjectId: null,
  selectedCategory: "all",
  searchQuery: "",
  darkMode: false,
  isSyncing: false,

  createProject: (name, description, templateId) => {
    const template = templateId
      ? get().templates.find((t) => t.id === templateId)
      : null;

    const newProject: Project = {
      id: uuidv4(),
      name,
      description,
      agentsContent: template?.content || `# AGENTS.md — ${name}\n\n## Project Overview\n\nDescribe your project here.\n`,
      templateId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      syncStatus: "local-only",
    };

    set((state) => {
      const updated = [...state.projects, newProject];
      saveToStorage("contextkit_projects", updated);
      return {
        projects: updated,
        activeProjectId: newProject.id,
        subscription: {
          ...state.subscription,
          projectCount: updated.length,
        },
      };
    });

    return newProject;
  },

  updateProject: (id, updates) => {
    set((state) => {
      const updated = state.projects.map((p) =>
        p.id === id
          ? { ...p, ...updates, updatedAt: new Date().toISOString(), syncStatus: "pending" as const }
          : p
      );
      saveToStorage("contextkit_projects", updated);
      return { projects: updated };
    });
  },

  deleteProject: (id) => {
    set((state) => {
      const updated = state.projects.filter((p) => p.id !== id);
      saveToStorage("contextkit_projects", updated);
      return {
        projects: updated,
        activeProjectId: state.activeProjectId === id ? null : state.activeProjectId,
        subscription: {
          ...state.subscription,
          projectCount: updated.length,
        },
      };
    });
  },

  setActiveProject: (id) => set({ activeProjectId: id }),

  addCustomTemplate: (template) => {
    const newTemplate: Template = {
      ...template,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isBuiltIn: false,
    };
    set((state) => {
      const updated = [...state.templates, newTemplate];
      saveToStorage("contextkit_custom_templates", updated.filter((t) => !t.isBuiltIn));
      return { templates: updated };
    });
  },

  deleteTemplate: (id) => {
    set((state) => {
      const template = state.templates.find((t) => t.id === id);
      if (template?.isBuiltIn) return state;
      const updated = state.templates.filter((t) => t.id !== id);
      saveToStorage("contextkit_custom_templates", updated.filter((t) => !t.isBuiltIn));
      return { templates: updated };
    });
  },

  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  toggleDarkMode: () => {
    set((state) => {
      const newMode = !state.darkMode;
      saveToStorage("contextkit_dark_mode", newMode);
      return { darkMode: newMode };
    });
  },

  setSyncing: (syncing) => set({ isSyncing: syncing }),
  setDevices: (devices) => set({ devices }),

  importProjects: (projects) => {
    set((state) => {
      const existingIds = new Set(state.projects.map((p) => p.id));
      const newProjects = projects.filter((p) => !existingIds.has(p.id));
      const updated = [...state.projects, ...newProjects];
      saveToStorage("contextkit_projects", updated);
      return {
        projects: updated,
        subscription: { ...state.subscription, projectCount: updated.length },
      };
    });
  },

  importTemplates: (templates) => {
    set((state) => {
      const existingIds = new Set(state.templates.map((t) => t.id));
      const newTemplates = templates.filter((t) => !existingIds.has(t.id));
      const updated = [...state.templates, ...newTemplates];
      saveToStorage("contextkit_custom_templates", updated.filter((t) => !t.isBuiltIn));
      return { templates: updated };
    });
  },
}));
