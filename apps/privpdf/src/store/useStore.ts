"use client";

import { create } from "zustand";
import type {
  PDFFileInfo,
  SignatureData,
  ToolTab,
  Theme,
  PlanType,
  FeatureAccess,
} from "@/types";

/**
 * @typedef {Object} AppState
 * @property {ToolTab} activeTab - 当前活动标签页
 * @property {Theme} theme - 当前主题
 * @property {PlanType} plan - 订阅计划
 * @property {PDFFileInfo[]} files - 已加载的 PDF 文件列表
 * @property {SignatureData[]} signatures - 已保存的签名列表
 */
interface AppState {
  activeTab: ToolTab;
  theme: Theme;
  plan: PlanType;
  files: PDFFileInfo[];
  signatures: SignatureData[];
  isProcessing: boolean;
  processingProgress: number;

  setActiveTab: (tab: ToolTab) => void;
  setTheme: (theme: Theme) => void;
  setPlan: (plan: PlanType) => void;
  addFiles: (files: PDFFileInfo[]) => void;
  removeFile: (id: string) => void;
  clearFiles: () => void;
  reorderFiles: (fromIndex: number, toIndex: number) => void;
  addSignature: (sig: SignatureData) => void;
  removeSignature: (id: string) => void;
  setProcessing: (processing: boolean, progress?: number) => void;
  getFeatureAccess: () => FeatureAccess;
}

/** 根据订阅计划返回功能权限 */
function getAccessForPlan(plan: PlanType): FeatureAccess {
  switch (plan) {
    case "free":
      return {
        merge: true,
        split: true,
        sign: true,
        ocr: false,
        batchProcess: false,
        maxFiles: 5,
      };
    case "pro":
      return {
        merge: true,
        split: true,
        sign: true,
        ocr: true,
        batchProcess: true,
        maxFiles: 50,
      };
    case "lifetime":
      return {
        merge: true,
        split: true,
        sign: true,
        ocr: true,
        batchProcess: true,
        maxFiles: 100,
      };
  }
}

export const useStore = create<AppState>((set, get) => ({
  activeTab: "merge",
  theme: "system",
  plan: "free",
  files: [],
  signatures: [],
  isProcessing: false,
  processingProgress: 0,

  setActiveTab: (tab) => set({ activeTab: tab }),
  setTheme: (theme) => set({ theme }),
  setPlan: (plan) => set({ plan }),

  addFiles: (newFiles) =>
    set((state) => ({ files: [...state.files, ...newFiles] })),

  removeFile: (id) =>
    set((state) => ({ files: state.files.filter((f) => f.id !== id) })),

  clearFiles: () => set({ files: [] }),

  reorderFiles: (fromIndex, toIndex) =>
    set((state) => {
      const files = [...state.files];
      const [moved] = files.splice(fromIndex, 1);
      files.splice(toIndex, 0, moved);
      return { files };
    }),

  addSignature: (sig) =>
    set((state) => ({ signatures: [...state.signatures, sig] })),

  removeSignature: (id) =>
    set((state) => ({
      signatures: state.signatures.filter((s) => s.id !== id),
    })),

  setProcessing: (processing, progress = 0) =>
    set({ isProcessing: processing, processingProgress: progress }),

  getFeatureAccess: () => getAccessForPlan(get().plan),
}));
