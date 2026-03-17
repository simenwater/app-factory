import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Timeline, User, TimelineEvent } from '@/types';

interface AppState {
  user: User;
  timelines: Timeline[];
  currentTimeline: Timeline | null;
  
  /**
   * 设置当前时间线
   */
  setCurrentTimeline: (timeline: Timeline | null) => void;
  
  /**
   * 添加新时间线
   */
  addTimeline: (timeline: Timeline) => void;
  
  /**
   * 删除时间线
   */
  deleteTimeline: (id: string) => void;
  
  /**
   * 增加生成次数
   */
  incrementGenerations: () => void;
  
  /**
   * 升级订阅
   */
  upgradeToPro: () => void;
  
  /**
   * 更新事件
   */
  updateEvent: (eventId: string, updates: Partial<Omit<TimelineEvent, 'id'>>) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: {
        id: 'demo-user',
        subscription: 'free',
        generationsUsed: 0,
        generationsLimit: 5,
      },
      timelines: [],
      currentTimeline: null,
      
      setCurrentTimeline: (timeline) => set({ currentTimeline: timeline }),
      
      addTimeline: (timeline) => set((state) => ({
        timelines: [timeline, ...state.timelines],
        currentTimeline: timeline,
      })),
      
      deleteTimeline: (id) => set((state) => ({
        timelines: state.timelines.filter(t => t.id !== id),
        currentTimeline: state.currentTimeline?.id === id ? null : state.currentTimeline,
      })),
      
      incrementGenerations: () => set((state) => ({
        user: {
          ...state.user,
          generationsUsed: state.user.generationsUsed + 1,
        },
      })),
      
      upgradeToPro: () => set((state) => ({
        user: {
          ...state.user,
          subscription: 'pro',
          generationsLimit: 999999,
        },
      })),
      
      updateEvent: (eventId, updates) => set((state) => {
        if (!state.currentTimeline) return state;
        
        const updatedEvents = state.currentTimeline.events.map(event =>
          event.id === eventId ? { ...event, ...updates } : event
        );
        
        const updatedTimeline = {
          ...state.currentTimeline,
          events: updatedEvents,
        };
        
        return {
          currentTimeline: updatedTimeline,
          timelines: state.timelines.map(t =>
            t.id === updatedTimeline.id ? updatedTimeline : t
          ),
        };
      }),
    }),
    {
      name: 'timeflow-storage',
    }
  )
);
