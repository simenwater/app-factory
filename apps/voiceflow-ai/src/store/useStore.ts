import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { VoiceNote, User, RecordingStatus, RewriteStyle } from '@/types';

/**
 * @description 应用全局状态
 */
interface AppState {
  user: User;
  notes: VoiceNote[];
  currentNote: VoiceNote | null;
  recordingStatus: RecordingStatus;
  rewriteStyle: RewriteStyle;
  theme: 'light' | 'dark';

  /** @description 设置当前笔记 */
  setCurrentNote: (note: VoiceNote | null) => void;
  /** @description 添加新笔记 */
  addNote: (note: VoiceNote) => void;
  /** @description 删除笔记 */
  deleteNote: (id: string) => void;
  /** @description 更新笔记 */
  updateNote: (id: string, updates: Partial<VoiceNote>) => void;
  /** @description 设置录音状态 */
  setRecordingStatus: (status: RecordingStatus) => void;
  /** @description 设置重写风格 */
  setRewriteStyle: (style: RewriteStyle) => void;
  /** @description 增加使用次数 */
  incrementUsage: () => void;
  /** @description 升级订阅 */
  upgradeSubscription: (plan: 'monthly' | 'lifetime') => void;
  /** @description 切换主题 */
  toggleTheme: () => void;
  /** @description 检查是否可以使用 */
  canUse: () => boolean;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: {
        id: 'demo-user',
        subscription: 'free',
        usageCount: 0,
        usageLimit: 3,
      },
      notes: [],
      currentNote: null,
      recordingStatus: 'idle',
      rewriteStyle: 'summary',
      theme: 'light',

      setCurrentNote: (note) => set({ currentNote: note }),

      addNote: (note) =>
        set((state) => ({
          notes: [note, ...state.notes],
          currentNote: note,
        })),

      deleteNote: (id) =>
        set((state) => ({
          notes: state.notes.filter((n) => n.id !== id),
          currentNote: state.currentNote?.id === id ? null : state.currentNote,
        })),

      updateNote: (id, updates) =>
        set((state) => ({
          notes: state.notes.map((n) => (n.id === id ? { ...n, ...updates } : n)),
          currentNote:
            state.currentNote?.id === id
              ? { ...state.currentNote, ...updates }
              : state.currentNote,
        })),

      setRecordingStatus: (status) => set({ recordingStatus: status }),

      setRewriteStyle: (style) => set({ rewriteStyle: style }),

      incrementUsage: () =>
        set((state) => ({
          user: { ...state.user, usageCount: state.user.usageCount + 1 },
        })),

      upgradeSubscription: (plan) =>
        set((state) => ({
          user: {
            ...state.user,
            subscription: plan,
            usageLimit: 999999,
          },
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

      canUse: () => {
        const { user } = get();
        if (user.subscription !== 'free') return true;
        return user.usageCount < user.usageLimit;
      },
    }),
    {
      name: 'voiceflow-storage',
      partialize: (state) => ({
        user: state.user,
        notes: state.notes,
        theme: state.theme,
      }),
    }
  )
);
