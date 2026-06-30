/**
 * @fileoverview 全局状态管理（Zustand）
 */

import { create } from 'zustand';
import type { AnalysisResult, GeneratedConfig, ToolStandard } from '@/types';

/** 应用全局状态接口 */
interface AppState {
  /** 当前分析结果 */
  analysis: AnalysisResult | null;
  /** 生成的配置文件列表 */
  configs: GeneratedConfig[];
  /** 当前选中的工具标准 */
  selectedStandards: ToolStandard[];
  /** 仓库 URL 输入 */
  repoUrl: string;
  /** 加载状态 */
  isAnalyzing: boolean;
  /** 生成状态 */
  isGenerating: boolean;
  /** 错误信息 */
  error: string | null;
  /** 自定义指令 */
  customInstructions: string;
  /** 深色模式 */
  darkMode: boolean;

  setRepoUrl: (url: string) => void;
  setAnalysis: (analysis: AnalysisResult | null) => void;
  setConfigs: (configs: GeneratedConfig[]) => void;
  setSelectedStandards: (standards: ToolStandard[]) => void;
  toggleStandard: (standard: ToolStandard) => void;
  setIsAnalyzing: (loading: boolean) => void;
  setIsGenerating: (generating: boolean) => void;
  setError: (error: string | null) => void;
  setCustomInstructions: (instructions: string) => void;
  toggleDarkMode: () => void;
  reset: () => void;
}

/**
 * 应用全局 Store
 */
export const useAppStore = create<AppState>((set) => ({
  analysis: null,
  configs: [],
  selectedStandards: ['cursor'],
  repoUrl: '',
  isAnalyzing: false,
  isGenerating: false,
  error: null,
  customInstructions: '',
  darkMode: false,

  setRepoUrl: (url) => set({ repoUrl: url, error: null }),
  setAnalysis: (analysis) => set({ analysis }),
  setConfigs: (configs) => set({ configs }),
  setSelectedStandards: (standards) => set({ selectedStandards: standards }),
  toggleStandard: (standard) =>
    set((state) => ({
      selectedStandards: state.selectedStandards.includes(standard)
        ? state.selectedStandards.filter((s) => s !== standard)
        : [...state.selectedStandards, standard],
    })),
  setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  setError: (error) => set({ error }),
  setCustomInstructions: (customInstructions) => set({ customInstructions }),
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
  reset: () =>
    set({
      analysis: null,
      configs: [],
      repoUrl: '',
      isAnalyzing: false,
      isGenerating: false,
      error: null,
      customInstructions: '',
    }),
}));
