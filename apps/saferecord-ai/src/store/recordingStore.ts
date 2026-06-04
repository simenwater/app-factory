/**
 * @fileoverview 录音状态管理 Store
 * 使用 Zustand 管理全局录音状态，包括录音列表、当前录音状态和设置
 */

import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type {
  Recording,
  RecordingStatus,
  Subscription,
  AppSettings,
  SupportedLanguage,
  TranscriptionSegment,
} from '@/types';

/** Store 状态接口 */
interface RecordingState {
  /** 所有录音记录 */
  recordings: Recording[];
  /** 当前录音状态 */
  status: RecordingStatus;
  /** 当前录音 ID */
  currentRecordingId: string | null;
  /** 当前录音时长（秒） */
  currentDuration: number;
  /** 用户订阅信息 */
  subscription: Subscription;
  /** 应用设置 */
  settings: AppSettings;
  /** 是否后台保护激活中 */
  isBackgroundProtected: boolean;

  /** 开始录音 */
  startRecording: () => string;
  /** 暂停录音 */
  pauseRecording: () => void;
  /** 恢复录音 */
  resumeRecording: () => void;
  /** 停止录音 */
  stopRecording: (audioUrl: string | null, fileSize: number) => void;
  /** 更新当前录音时长 */
  updateDuration: (duration: number) => void;
  /** 删除录音 */
  deleteRecording: (id: string) => void;
  /** 切换收藏 */
  toggleFavorite: (id: string) => void;
  /** 更新录音标题 */
  updateTitle: (id: string, title: string) => void;
  /** 设置转录结果 */
  setTranscription: (id: string, segments: TranscriptionSegment[], fullText: string) => void;
  /** 设置转录状态 */
  setTranscriptionStatus: (id: string, status: Recording['transcriptionStatus']) => void;
  /** 更新设置 */
  updateSettings: (settings: Partial<AppSettings>) => void;
  /** 设置后台保护状态 */
  setBackgroundProtected: (isProtected: boolean) => void;
}

/** 默认订阅配置 */
const defaultSubscription: Subscription = {
  plan: 'free',
  usedMinutes: 0,
  totalMinutes: 10,
  expiresAt: null,
};

/** 默认应用设置 */
const defaultSettings: AppSettings = {
  theme: 'system',
  defaultLanguage: 'auto',
  autoTranscribe: false,
  audioQuality: 44.1,
  backgroundProtection: true,
};

/**
 * 录音 Store
 * @description 管理录音生命周期、转录和用户设置
 */
export const useRecordingStore = create<RecordingState>((set, get) => ({
  recordings: [],
  status: 'idle',
  currentRecordingId: null,
  currentDuration: 0,
  subscription: defaultSubscription,
  settings: defaultSettings,
  isBackgroundProtected: false,

  startRecording: () => {
    const id = uuidv4();
    const newRecording: Recording = {
      id,
      title: `录音 ${new Date().toLocaleString('zh-CN')}`,
      createdAt: new Date().toISOString(),
      duration: 0,
      fileSize: 0,
      audioUrl: null,
      transcriptionStatus: 'pending',
      segments: [],
      fullText: '',
      language: get().settings.defaultLanguage,
      isFavorite: false,
    };

    set({
      recordings: [newRecording, ...get().recordings],
      status: 'recording',
      currentRecordingId: id,
      currentDuration: 0,
      isBackgroundProtected: get().settings.backgroundProtection,
    });

    return id;
  },

  pauseRecording: () => {
    set({ status: 'paused' });
  },

  resumeRecording: () => {
    set({ status: 'recording' });
  },

  stopRecording: (audioUrl, fileSize) => {
    const { currentRecordingId, currentDuration, recordings } = get();
    if (!currentRecordingId) return;

    set({
      recordings: recordings.map((r) =>
        r.id === currentRecordingId
          ? { ...r, duration: currentDuration, audioUrl, fileSize }
          : r
      ),
      status: 'stopped',
      currentRecordingId: null,
      currentDuration: 0,
      isBackgroundProtected: false,
    });
  },

  updateDuration: (duration) => {
    set({ currentDuration: duration });
  },

  deleteRecording: (id) => {
    set({
      recordings: get().recordings.filter((r) => r.id !== id),
    });
  },

  toggleFavorite: (id) => {
    set({
      recordings: get().recordings.map((r) =>
        r.id === id ? { ...r, isFavorite: !r.isFavorite } : r
      ),
    });
  },

  updateTitle: (id, title) => {
    set({
      recordings: get().recordings.map((r) =>
        r.id === id ? { ...r, title } : r
      ),
    });
  },

  setTranscription: (id, segments, fullText) => {
    set({
      recordings: get().recordings.map((r) =>
        r.id === id
          ? { ...r, segments, fullText, transcriptionStatus: 'completed' as const }
          : r
      ),
      subscription: {
        ...get().subscription,
        usedMinutes: get().subscription.usedMinutes +
          Math.ceil((get().recordings.find((r) => r.id === id)?.duration ?? 0) / 60),
      },
    });
  },

  setTranscriptionStatus: (id, status) => {
    set({
      recordings: get().recordings.map((r) =>
        r.id === id ? { ...r, transcriptionStatus: status } : r
      ),
    });
  },

  updateSettings: (newSettings) => {
    set({
      settings: { ...get().settings, ...newSettings },
    });
  },

  setBackgroundProtected: (isProtected) => {
    set({ isBackgroundProtected: isProtected });
  },
}));
