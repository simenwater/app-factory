/**
 * @fileoverview Zustand 全局状态管理
 */

import { create } from "zustand";
import type {
  ProtocolStructure,
  VisualizationTheme,
  ZoomState,
} from "@/types";
import { parseProtocol, getExampleProtocol } from "@/lib/parser";

/** 应用状态接口 */
interface AppState {
  /** 原始输入文本 */
  inputText: string;
  /** 解析后的协议结构 */
  structure: ProtocolStructure | null;
  /** 解析错误列表 */
  errors: string[];
  /** 当前主题 */
  theme: VisualizationTheme;
  /** 缩放状态 */
  zoom: ZoomState;
  /** 选中的字段索引 */
  selectedFieldIndex: number | null;
  /** 是否显示定价弹窗 */
  showPricing: boolean;

  /** 设置输入文本并自动解析 */
  setInputText: (text: string) => void;
  /** 切换主题 */
  toggleTheme: () => void;
  /** 设置缩放 */
  setZoom: (zoom: Partial<ZoomState>) => void;
  /** 重置缩放 */
  resetZoom: () => void;
  /** 选中字段 */
  selectField: (index: number | null) => void;
  /** 加载示例 */
  loadExample: () => void;
  /** 设置定价弹窗显示状态 */
  setShowPricing: (show: boolean) => void;
}

/**
 * 全局应用 Store
 */
export const useStore = create<AppState>((set) => ({
  inputText: "",
  structure: null,
  errors: [],
  theme: "dark",
  zoom: { scale: 1, offsetX: 0, offsetY: 0 },
  selectedFieldIndex: null,
  showPricing: false,

  setInputText: (text: string) => {
    const result = parseProtocol(text);
    set({
      inputText: text,
      structure: result.structure || null,
      errors: result.errors,
    });
  },

  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === "dark" ? "light" : "dark",
    })),

  setZoom: (partial) =>
    set((state) => ({
      zoom: { ...state.zoom, ...partial },
    })),

  resetZoom: () =>
    set({ zoom: { scale: 1, offsetX: 0, offsetY: 0 } }),

  selectField: (index) =>
    set({ selectedFieldIndex: index }),

  loadExample: () => {
    const exampleText = getExampleProtocol();
    const result = parseProtocol(exampleText);
    set({
      inputText: exampleText,
      structure: result.structure || null,
      errors: result.errors,
    });
  },

  setShowPricing: (show) =>
    set({ showPricing: show }),
}));
