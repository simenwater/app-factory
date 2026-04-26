/**
 * @file Zustand 全局状态管理
 * @description 管理面试会话、用户信息、代码评估等状态
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  InterviewSession,
  InterviewMessage,
  User,
  WeaknessAnalysis,
  PracticePlan,
  CodeEvalResult,
  SubscriptionTier,
  InterviewType,
  Difficulty,
} from '@/types';

interface AppState {
  /** 用户信息 */
  user: User;
  /** 所有面试会话历史 */
  sessions: InterviewSession[];
  /** 当前活动会话 */
  currentSession: InterviewSession | null;
  /** 最近的代码评估结果 */
  lastCodeEval: CodeEvalResult | null;
  /** 深色模式 */
  darkMode: boolean;

  /** 创建新面试会话 */
  createSession: (type: InterviewType, difficulty: Difficulty) => InterviewSession;
  /** 添加消息到当前会话 */
  addMessage: (message: InterviewMessage) => void;
  /** 结束当前会话 */
  endSession: () => void;
  /** 设置代码评估结果 */
  setCodeEval: (result: CodeEvalResult) => void;
  /** 更新弱点分析 */
  setWeaknessAnalysis: (analysis: WeaknessAnalysis) => void;
  /** 添加练习计划 */
  addPracticePlan: (plan: PracticePlan) => void;
  /** 切换任务完成状态 */
  toggleTask: (planId: string, taskId: string) => void;
  /** 升级订阅 */
  setSubscription: (tier: SubscriptionTier) => void;
  /** 切换深色模式 */
  toggleDarkMode: () => void;
  /** 检查是否可以开始面试 */
  canStartInterview: () => boolean;
}

/**
 * @description 生成唯一 ID
 * @returns {string} 随机 ID 字符串
 */
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: {
        interviewCount: 0,
        maxFreeInterviews: 3,
        subscription: 'free' as SubscriptionTier,
        practicePlans: [],
      },
      sessions: [],
      currentSession: null,
      lastCodeEval: null,
      darkMode: false,

      createSession: (type, difficulty) => {
        const session: InterviewSession = {
          id: generateId(),
          type,
          difficulty,
          messages: [],
          startedAt: Date.now(),
        };
        set((state) => ({
          currentSession: session,
          user: { ...state.user, interviewCount: state.user.interviewCount + 1 },
        }));
        return session;
      },

      addMessage: (message) => {
        set((state) => {
          if (!state.currentSession) return state;
          return {
            currentSession: {
              ...state.currentSession,
              messages: [...state.currentSession.messages, message],
            },
          };
        });
      },

      endSession: () => {
        set((state) => {
          if (!state.currentSession) return state;
          const ended = { ...state.currentSession, endedAt: Date.now() };
          return {
            currentSession: null,
            sessions: [...state.sessions, ended],
          };
        });
      },

      setCodeEval: (result) => set({ lastCodeEval: result }),

      setWeaknessAnalysis: (analysis) =>
        set((state) => ({
          user: { ...state.user, weaknessAnalysis: analysis },
        })),

      addPracticePlan: (plan) =>
        set((state) => ({
          user: {
            ...state.user,
            practicePlans: [...state.user.practicePlans, plan],
          },
        })),

      toggleTask: (planId, taskId) =>
        set((state) => ({
          user: {
            ...state.user,
            practicePlans: state.user.practicePlans.map((p) =>
              p.id === planId
                ? {
                    ...p,
                    tasks: p.tasks.map((t) =>
                      t.id === taskId ? { ...t, completed: !t.completed } : t
                    ),
                  }
                : p
            ),
          },
        })),

      setSubscription: (tier) =>
        set((state) => ({
          user: { ...state.user, subscription: tier },
        })),

      toggleDarkMode: () =>
        set((state) => {
          const next = !state.darkMode;
          if (typeof document !== 'undefined') {
            document.documentElement.classList.toggle('dark', next);
          }
          return { darkMode: next };
        }),

      canStartInterview: () => {
        const { user } = get();
        return user.subscription !== 'free' || user.interviewCount < user.maxFreeInterviews;
      },
    }),
    { name: 'frontendprep-storage' }
  )
);
