/**
 * @fileoverview Zustand 全局状态管理
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Resume,
  JobDescription,
  MatchResult,
  Application,
  ApplicationStatus,
  UsageQuota,
  SubscriptionPlan,
} from "@/types";
import { v4 as uuidv4 } from "uuid";

/** 免费计划配额限制 */
const FREE_LIMITS = { optimizations: 3, matches: 3 };
const PAID_LIMITS = { optimizations: Infinity, matches: Infinity };

interface AppState {
  /** 简历列表 */
  resumes: Resume[];
  /** 职位描述列表 */
  jobs: JobDescription[];
  /** 匹配结果列表 */
  matchResults: MatchResult[];
  /** 申请列表 */
  applications: Application[];
  /** 使用配额 */
  quota: UsageQuota;
  /** 深色模式 */
  darkMode: boolean;

  /** 添加简历 */
  addResume: (fileName: string, rawText: string) => Resume;
  /** 更新简历优化文本 */
  updateResumeOptimized: (id: string, optimizedText: string) => void;
  /** 删除简历 */
  deleteResume: (id: string) => void;

  /** 添加职位描述 */
  addJob: (title: string, company: string, description: string, keywords: string[]) => JobDescription;
  /** 删除职位 */
  deleteJob: (id: string) => void;

  /** 添加匹配结果 */
  addMatchResult: (result: Omit<MatchResult, "id" | "analyzedAt">) => MatchResult;

  /** 添加申请 */
  addApplication: (app: Omit<Application, "id" | "updatedAt">) => Application;
  /** 更新申请状态 */
  updateApplicationStatus: (id: string, status: ApplicationStatus) => void;
  /** 更新申请信息 */
  updateApplication: (id: string, updates: Partial<Application>) => void;
  /** 删除申请 */
  deleteApplication: (id: string) => void;

  /** 消耗一次优化配额 */
  consumeOptimization: () => boolean;
  /** 消耗一次匹配配额 */
  consumeMatch: () => boolean;
  /** 升级订阅 */
  upgradePlan: (plan: SubscriptionPlan) => void;

  /** 切换深色模式 */
  toggleDarkMode: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      resumes: [],
      jobs: [],
      matchResults: [],
      applications: [],
      quota: {
        plan: "free",
        optimizationsUsed: 0,
        optimizationsLimit: FREE_LIMITS.optimizations,
        matchesUsed: 0,
        matchesLimit: FREE_LIMITS.matches,
      },
      darkMode: false,

      addResume: (fileName, rawText) => {
        const resume: Resume = {
          id: uuidv4(),
          fileName,
          rawText,
          uploadedAt: new Date().toISOString(),
        };
        set((s) => ({ resumes: [resume, ...s.resumes] }));
        return resume;
      },

      updateResumeOptimized: (id, optimizedText) =>
        set((s) => ({
          resumes: s.resumes.map((r) =>
            r.id === id ? { ...r, optimizedText, lastOptimizedAt: new Date().toISOString() } : r
          ),
        })),

      deleteResume: (id) =>
        set((s) => ({ resumes: s.resumes.filter((r) => r.id !== id) })),

      addJob: (title, company, description, keywords) => {
        const job: JobDescription = {
          id: uuidv4(),
          title,
          company,
          description,
          keywords,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ jobs: [job, ...s.jobs] }));
        return job;
      },

      deleteJob: (id) =>
        set((s) => ({ jobs: s.jobs.filter((j) => j.id !== id) })),

      addMatchResult: (partial) => {
        const result: MatchResult = {
          ...partial,
          id: uuidv4(),
          analyzedAt: new Date().toISOString(),
        };
        set((s) => ({ matchResults: [result, ...s.matchResults] }));
        return result;
      },

      addApplication: (app) => {
        const application: Application = {
          ...app,
          id: uuidv4(),
          updatedAt: new Date().toISOString(),
        };
        set((s) => ({ applications: [application, ...s.applications] }));
        return application;
      },

      updateApplicationStatus: (id, status) =>
        set((s) => ({
          applications: s.applications.map((a) =>
            a.id === id ? { ...a, status, updatedAt: new Date().toISOString() } : a
          ),
        })),

      updateApplication: (id, updates) =>
        set((s) => ({
          applications: s.applications.map((a) =>
            a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a
          ),
        })),

      deleteApplication: (id) =>
        set((s) => ({ applications: s.applications.filter((a) => a.id !== id) })),

      consumeOptimization: () => {
        const { quota } = get();
        if (quota.optimizationsUsed >= quota.optimizationsLimit) return false;
        set((s) => ({
          quota: { ...s.quota, optimizationsUsed: s.quota.optimizationsUsed + 1 },
        }));
        return true;
      },

      consumeMatch: () => {
        const { quota } = get();
        if (quota.matchesUsed >= quota.matchesLimit) return false;
        set((s) => ({
          quota: { ...s.quota, matchesUsed: s.quota.matchesUsed + 1 },
        }));
        return true;
      },

      upgradePlan: (plan) =>
        set(() => ({
          quota: {
            plan,
            optimizationsUsed: 0,
            optimizationsLimit: plan === "free" ? FREE_LIMITS.optimizations : PAID_LIMITS.optimizations,
            matchesUsed: 0,
            matchesLimit: plan === "free" ? FREE_LIMITS.matches : PAID_LIMITS.matches,
          },
        })),

      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
    }),
    {
      name: "careerpilot-storage",
    }
  )
);
