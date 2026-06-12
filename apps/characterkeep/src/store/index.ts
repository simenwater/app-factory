/**
 * @fileoverview Zustand 全局状态管理
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import type {
  Character,
  PlotEvent,
  ConsistencyIssue,
  ConflictWarning,
  Project,
  Subscription,
} from "@/types";
import {
  checkCharacterConsistency,
  detectConflicts,
} from "@/lib/consistency-checker";
import { randomAvatarColor } from "@/lib/utils";

/** 应用全局状态 */
interface AppState {
  /** 当前项目 */
  currentProject: Project | null;
  /** 全部角色列表 */
  characters: Character[];
  /** 全部剧情事件列表 */
  events: PlotEvent[];
  /** 一致性检查结果 */
  issues: ConsistencyIssue[];
  /** 冲突预警 */
  warnings: ConflictWarning[];
  /** 订阅信息 */
  subscription: Subscription;
  /** 当前选中的角色 ID */
  selectedCharacterId: string | null;
  /** 当前活跃的标签页 */
  activeTab: "characters" | "events" | "consistency" | "conflicts" | "settings";
  /** 深色模式 */
  darkMode: boolean;

  /** 创建项目 */
  createProject: (name: string, description?: string) => void;
  /** 添加角色 */
  addCharacter: (data: Omit<Character, "id" | "createdAt" | "updatedAt" | "avatarColor">) => void;
  /** 更新角色 */
  updateCharacter: (id: string, data: Partial<Character>) => void;
  /** 删除角色 */
  deleteCharacter: (id: string) => void;
  /** 选中角色 */
  selectCharacter: (id: string | null) => void;
  /** 添加剧情事件 */
  addEvent: (data: Omit<PlotEvent, "id" | "createdAt">) => void;
  /** 更新剧情事件 */
  updateEvent: (id: string, data: Partial<PlotEvent>) => void;
  /** 删除剧情事件 */
  deleteEvent: (id: string) => void;
  /** 运行一致性检查 */
  runConsistencyCheck: () => void;
  /** 运行冲突检测 */
  runConflictDetection: () => void;
  /** 切换标签页 */
  setActiveTab: (tab: AppState["activeTab"]) => void;
  /** 切换深色模式 */
  toggleDarkMode: () => void;
  /** 更新订阅 */
  updateSubscription: (plan: Subscription["plan"]) => void;
}

/**
 * 全局状态 store
 */
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentProject: null,
      characters: [],
      events: [],
      issues: [],
      warnings: [],
      subscription: {
        plan: "free",
        maxCharacters: 5,
        maxProjects: 1,
      },
      selectedCharacterId: null,
      activeTab: "characters",
      darkMode: false,

      createProject: (name, description) => {
        const now = new Date().toISOString();
        set({
          currentProject: {
            id: uuidv4(),
            name,
            description,
            createdAt: now,
            updatedAt: now,
          },
        });
      },

      addCharacter: (data) => {
        const now = new Date().toISOString();
        const character: Character = {
          ...data,
          id: uuidv4(),
          avatarColor: randomAvatarColor(),
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          characters: [...state.characters, character],
        }));
      },

      updateCharacter: (id, data) => {
        set((state) => ({
          characters: state.characters.map((c) =>
            c.id === id
              ? { ...c, ...data, updatedAt: new Date().toISOString() }
              : c
          ),
        }));
      },

      deleteCharacter: (id) => {
        set((state) => ({
          characters: state.characters.filter((c) => c.id !== id),
          selectedCharacterId:
            state.selectedCharacterId === id
              ? null
              : state.selectedCharacterId,
        }));
      },

      selectCharacter: (id) => {
        set({ selectedCharacterId: id });
      },

      addEvent: (data) => {
        const event: PlotEvent = {
          ...data,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          events: [...state.events, event],
        }));
      },

      updateEvent: (id, data) => {
        set((state) => ({
          events: state.events.map((e) =>
            e.id === id ? { ...e, ...data } : e
          ),
        }));
      },

      deleteEvent: (id) => {
        set((state) => ({
          events: state.events.filter((e) => e.id !== id),
        }));
      },

      runConsistencyCheck: () => {
        const { characters, events } = get();
        const allIssues: ConsistencyIssue[] = [];
        for (const character of characters) {
          const issues = checkCharacterConsistency(character, events);
          allIssues.push(...issues);
        }
        set({ issues: allIssues });
      },

      runConflictDetection: () => {
        const { characters, events } = get();
        const warnings = detectConflicts(characters, events);
        set({ warnings });
      },

      setActiveTab: (tab) => {
        set({ activeTab: tab });
      },

      toggleDarkMode: () => {
        set((state) => ({ darkMode: !state.darkMode }));
      },

      updateSubscription: (plan) => {
        const limits: Record<string, { maxCharacters: number; maxProjects: number }> = {
          free: { maxCharacters: 5, maxProjects: 1 },
          pro: { maxCharacters: 50, maxProjects: 10 },
          premium: { maxCharacters: Infinity, maxProjects: Infinity },
        };
        set({
          subscription: {
            plan,
            ...limits[plan],
          },
        });
      },
    }),
    {
      name: "characterkeep-storage",
    }
  )
);
