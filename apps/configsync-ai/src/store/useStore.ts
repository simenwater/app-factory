/**
 * @fileoverview Zustand 全局状态管理
 */

import { create } from "zustand";
import {
  AIAssistant,
  ConflictResult,
  GeneratedConfig,
  PlanType,
  ScanResult,
  UserSettings,
} from "@/types";
import { allTemplates } from "@/lib/templates";
import { generateMultipleConfigs } from "@/lib/generator";
import { detectConflicts } from "@/lib/conflicts";
import { createDemoScanResult } from "@/lib/scanner";

interface AppState {
  /** 当前扫描结果 */
  scanResult: ScanResult | null;
  /** 生成的配置文件列表 */
  generatedConfigs: GeneratedConfig[];
  /** 冲突检测结果 */
  conflictResults: ConflictResult[];
  /** 选中的 AI 助手 */
  selectedAssistants: AIAssistant[];
  /** 用户设置 */
  settings: UserSettings;
  /** 是否正在扫描 */
  isScanning: boolean;
  /** 自定义变量 */
  customVariables: Record<string, string>;

  /** 执行项目扫描 */
  scanProject: (projectName: string) => void;
  /** 生成配置文件 */
  generateConfigs: () => void;
  /** 切换选中的 AI 助手 */
  toggleAssistant: (assistant: AIAssistant) => void;
  /** 设置全部选中的助手 */
  setSelectedAssistants: (assistants: AIAssistant[]) => void;
  /** 检测冲突 */
  runConflictDetection: () => void;
  /** 更新自定义变量 */
  setCustomVariable: (key: string, value: string) => void;
  /** 更新订阅计划 */
  setPlan: (plan: PlanType) => void;
  /** 切换主题 */
  toggleTheme: () => void;
  /** 标记冲突为已解决 */
  resolveConflict: (conflictId: string) => void;
}

export const useStore = create<AppState>((set, get) => ({
  scanResult: null,
  generatedConfigs: [],
  conflictResults: [],
  selectedAssistants: ["cursor", "codex", "claude-code"],
  isScanning: false,
  customVariables: {},

  settings: {
    theme: "dark",
    defaultAssistants: ["cursor", "codex", "claude-code"],
    subscription: {
      plan: "free",
      billingCycle: "monthly",
      price: 0,
      features: ["本地单机使用", "最多 3 个模板", "基础冲突检测"],
    },
  },

  scanProject: (projectName: string) => {
    set({ isScanning: true });
    setTimeout(() => {
      const result = createDemoScanResult(projectName);
      set({ scanResult: result, isScanning: false });
    }, 1500);
  },

  generateConfigs: () => {
    const { scanResult, selectedAssistants, customVariables } = get();
    if (!scanResult) return;

    const templates = allTemplates.filter((t) =>
      selectedAssistants.includes(t.assistant)
    );
    const configs = generateMultipleConfigs(templates, scanResult, customVariables);
    set({ generatedConfigs: configs });
  },

  toggleAssistant: (assistant: AIAssistant) => {
    const { selectedAssistants } = get();
    if (selectedAssistants.includes(assistant)) {
      set({ selectedAssistants: selectedAssistants.filter((a) => a !== assistant) });
    } else {
      set({ selectedAssistants: [...selectedAssistants, assistant] });
    }
  },

  setSelectedAssistants: (assistants: AIAssistant[]) => {
    set({ selectedAssistants: assistants });
  },

  runConflictDetection: () => {
    const { generatedConfigs } = get();
    if (generatedConfigs.length < 2) return;

    const results: ConflictResult[] = [];
    for (let i = 0; i < generatedConfigs.length; i++) {
      for (let j = i + 1; j < generatedConfigs.length; j++) {
        results.push(detectConflicts(generatedConfigs[i], generatedConfigs[j]));
      }
    }
    set({ conflictResults: results });
  },

  setCustomVariable: (key: string, value: string) => {
    const { customVariables } = get();
    set({ customVariables: { ...customVariables, [key]: value } });
  },

  setPlan: (plan: PlanType) => {
    const plans: Record<PlanType, { price: number; features: string[] }> = {
      free: {
        price: 0,
        features: ["本地单机使用", "最多 3 个模板", "基础冲突检测"],
      },
      pro: {
        price: 5,
        features: [
          "无限模板",
          "云同步",
          "高级冲突检测",
          "优先支持",
          "自定义模板",
        ],
      },
      team: {
        price: 12,
        features: [
          "所有 Pro 功能",
          "团队共享",
          "权限管理",
          "审计日志",
          "API 访问",
          "专属支持",
        ],
      },
    };

    set((state) => ({
      settings: {
        ...state.settings,
        subscription: {
          ...state.settings.subscription,
          plan,
          price: plans[plan].price,
          features: plans[plan].features,
        },
      },
    }));
  },

  toggleTheme: () => {
    set((state) => ({
      settings: {
        ...state.settings,
        theme: state.settings.theme === "dark" ? "light" : "dark",
      },
    }));
  },

  resolveConflict: (conflictId: string) => {
    set((state) => ({
      conflictResults: state.conflictResults.map((c) =>
        c.id === conflictId ? { ...c, status: "resolved" as const } : c
      ),
    }));
  },
}));
