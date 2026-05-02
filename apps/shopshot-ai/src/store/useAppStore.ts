import { create } from 'zustand';
import type {
  ProductImage,
  GenerationTask,
  GenerationMode,
  Subscription,
  TaskStatus,
  GeneratedImage,
} from '@/types';
import { v4 as uuidv4 } from 'uuid';

/**
 * @description 应用全局状态管理
 */
interface AppState {
  /** 当前上传的产品图 */
  currentImage: ProductImage | null;
  /** 生成任务列表 */
  tasks: GenerationTask[];
  /** 用户订阅信息 */
  subscription: Subscription;
  /** 深色模式 */
  darkMode: boolean;

  /** 设置当前图片 */
  setCurrentImage: (image: ProductImage | null) => void;
  /** 创建生成任务 */
  createTask: (mode: GenerationMode) => string | null;
  /** 更新任务状态 */
  updateTaskStatus: (taskId: string, status: TaskStatus, error?: string) => void;
  /** 添加生成结果 */
  addTaskResults: (taskId: string, results: GeneratedImage[]) => void;
  /** 切换深色模式 */
  toggleDarkMode: () => void;
  /** 使用额度 */
  useCredit: (count: number) => boolean;
}

export const useAppStore = create<AppState>((set, get) => ({
  currentImage: null,
  tasks: [],
  subscription: {
    plan: 'free',
    creditsUsed: 0,
    creditsTotal: 10,
    expiresAt: null,
  },
  darkMode: false,

  setCurrentImage: (image) => set({ currentImage: image }),

  createTask: (mode) => {
    const { currentImage, subscription } = get();
    if (!currentImage) return null;

    const creditsNeeded = mode === 'multi-angle' ? 3 : 1;
    const remaining = subscription.creditsTotal - subscription.creditsUsed;
    if (remaining < creditsNeeded) return null;

    const task: GenerationTask = {
      id: uuidv4(),
      sourceImage: currentImage,
      mode,
      status: 'processing',
      results: [],
      createdAt: new Date().toISOString(),
    };

    set((state) => ({ tasks: [task, ...state.tasks] }));
    return task.id;
  },

  updateTaskStatus: (taskId, status, error) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, status, error } : t
      ),
    })),

  addTaskResults: (taskId, results) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, results, status: 'completed' as TaskStatus } : t
      ),
    })),

  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

  useCredit: (count) => {
    const { subscription } = get();
    const remaining = subscription.creditsTotal - subscription.creditsUsed;
    if (remaining < count) return false;
    set((state) => ({
      subscription: {
        ...state.subscription,
        creditsUsed: state.subscription.creditsUsed + count,
      },
    }));
    return true;
  },
}));
