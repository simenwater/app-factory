import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Quote,
  DeclineTemplate,
  ClientChecklist,
  AppSettings,
} from "@/types";
import { BUILT_IN_TEMPLATES } from "@/lib/templates";

/**
 * @description 应用全局状态接口
 */
interface AppState {
  quotes: Quote[];
  templates: DeclineTemplate[];
  checklists: ClientChecklist[];
  settings: AppSettings;

  addQuote: (quote: Quote) => void;
  updateQuote: (id: string, updates: Partial<Quote>) => void;
  deleteQuote: (id: string) => void;

  addTemplate: (template: DeclineTemplate) => void;
  deleteTemplate: (id: string) => void;

  addChecklist: (checklist: ClientChecklist) => void;
  updateChecklistItem: (
    checklistId: string,
    itemId: string,
    checked: boolean
  ) => void;
  deleteChecklist: (id: string) => void;

  updateSettings: (updates: Partial<AppSettings>) => void;
  resetStore: () => void;
}

/**
 * @description 默认设置
 */
const DEFAULT_SETTINGS: AppSettings = {
  darkMode: false,
  defaultCurrency: "USD",
  defaultHourlyRate: 80,
  defaultValidDays: 14,
  businessName: "",
  businessEmail: "",
  subscriptionTier: "free",
};

/**
 * @description 初始状态
 */
const initialState = {
  quotes: [] as Quote[],
  templates: [...BUILT_IN_TEMPLATES],
  checklists: [] as ClientChecklist[],
  settings: { ...DEFAULT_SETTINGS },
};

/**
 * @description Zustand 全局状态管理 store，含 localStorage 持久化
 */
export const useStore = create<AppState>()(
  persist(
    (set) => ({
      ...initialState,

      addQuote: (quote) =>
        set((state) => ({ quotes: [quote, ...state.quotes] })),

      updateQuote: (id, updates) =>
        set((state) => ({
          quotes: state.quotes.map((q) =>
            q.id === id ? { ...q, ...updates } : q
          ),
        })),

      deleteQuote: (id) =>
        set((state) => ({
          quotes: state.quotes.filter((q) => q.id !== id),
        })),

      addTemplate: (template) =>
        set((state) => ({
          templates: [...state.templates, template],
        })),

      deleteTemplate: (id) =>
        set((state) => ({
          templates: state.templates.filter((t) => t.id !== id || !t.isCustom),
        })),

      addChecklist: (checklist) =>
        set((state) => ({
          checklists: [checklist, ...state.checklists],
        })),

      updateChecklistItem: (checklistId, itemId, checked) =>
        set((state) => ({
          checklists: state.checklists.map((cl) =>
            cl.id === checklistId
              ? {
                  ...cl,
                  items: cl.items.map((item) =>
                    item.id === itemId ? { ...item, checked } : item
                  ),
                  completedAt:
                    cl.items
                      .map((item) =>
                        item.id === itemId ? { ...item, checked } : item
                      )
                      .every((i) => i.checked)
                      ? new Date().toISOString()
                      : null,
                }
              : cl
          ),
        })),

      deleteChecklist: (id) =>
        set((state) => ({
          checklists: state.checklists.filter((c) => c.id !== id),
        })),

      updateSettings: (updates) =>
        set((state) => ({
          settings: { ...state.settings, ...updates },
        })),

      resetStore: () => set({ ...initialState }),
    }),
    {
      name: "quoteguard-storage",
    }
  )
);
