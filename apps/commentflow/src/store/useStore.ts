/**
 * @fileoverview Zustand 全局状态管理
 */

import { create } from 'zustand';
import type {
  Comment,
  Project,
  User,
  Integration,
  Notification,
  TeamSettings,
  CommentStatus,
} from '@/types';
import {
  mockComments,
  mockProjects,
  mockUsers,
  mockIntegrations,
  mockTeamSettings,
  mockNotifications,
} from '@/lib/mock-data';

/** @description 应用全局状态 */
interface AppState {
  /** 当前用户 */
  currentUser: User;
  /** 评论列表 */
  comments: Comment[];
  /** 项目列表 */
  projects: Project[];
  /** 团队成员 */
  members: User[];
  /** 集成列表 */
  integrations: Integration[];
  /** 团队设置 */
  teamSettings: TeamSettings;
  /** 通知列表 */
  notifications: Notification[];
  /** 当前主题 */
  theme: 'light' | 'dark';

  /** 添加评论 */
  addComment: (comment: Comment) => void;
  /** 更新评论状态 */
  updateCommentStatus: (commentId: string, status: CommentStatus) => void;
  /** 分配评论给用户 */
  assignComment: (commentId: string, userId: string) => void;
  /** 添加回复 */
  addReply: (commentId: string, reply: Comment['replies'][0]) => void;
  /** 删除评论 */
  deleteComment: (commentId: string) => void;
  /** 添加项目 */
  addProject: (project: Project) => void;
  /** 切换集成启用状态 */
  toggleIntegration: (integrationId: string) => void;
  /** 标记通知已读 */
  markNotificationRead: (notificationId: string) => void;
  /** 全部通知标记已读 */
  markAllNotificationsRead: () => void;
  /** 切换主题 */
  toggleTheme: () => void;
}

export const useStore = create<AppState>((set) => ({
  currentUser: mockUsers[0],
  comments: mockComments,
  projects: mockProjects,
  members: mockUsers,
  integrations: mockIntegrations,
  teamSettings: mockTeamSettings,
  notifications: mockNotifications,
  theme: 'light',

  addComment: (comment) =>
    set((state) => ({ comments: [comment, ...state.comments] })),

  updateCommentStatus: (commentId, status) =>
    set((state) => ({
      comments: state.comments.map((c) =>
        c.id === commentId ? { ...c, status, updatedAt: new Date().toISOString() } : c
      ),
    })),

  assignComment: (commentId, userId) =>
    set((state) => {
      const user = state.members.find((m) => m.id === userId);
      if (!user) return state;
      return {
        comments: state.comments.map((c) =>
          c.id === commentId ? { ...c, assignee: user, updatedAt: new Date().toISOString() } : c
        ),
      };
    }),

  addReply: (commentId, reply) =>
    set((state) => ({
      comments: state.comments.map((c) =>
        c.id === commentId
          ? { ...c, replies: [...c.replies, reply], updatedAt: new Date().toISOString() }
          : c
      ),
    })),

  deleteComment: (commentId) =>
    set((state) => ({
      comments: state.comments.filter((c) => c.id !== commentId),
    })),

  addProject: (project) =>
    set((state) => ({ projects: [project, ...state.projects] })),

  toggleIntegration: (integrationId) =>
    set((state) => ({
      integrations: state.integrations.map((i) =>
        i.id === integrationId ? { ...i, enabled: !i.enabled } : i
      ),
    })),

  markNotificationRead: (notificationId) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      ),
    })),

  markAllNotificationsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),

  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
        localStorage.setItem('theme', newTheme);
      }
      return { theme: newTheme };
    }),
}));
