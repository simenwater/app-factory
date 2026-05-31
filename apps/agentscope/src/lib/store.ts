/**
 * @fileoverview 全局状态管理 - 使用 Zustand 管理请求日志和统计数据
 */

import { create } from "zustand";
import type {
  RequestLog,
  TokenStats,
  ModelStats,
  LogFilter,
  TimeSeriesPoint,
  AgentInfo,
} from "@/types";

interface AgentScopeState {
  /** 所有请求日志 */
  logs: RequestLog[];
  /** 筛选条件 */
  filter: LogFilter;
  /** 深色模式 */
  darkMode: boolean;
  /** 实时监听状态 */
  isListening: boolean;

  /** 添加日志 */
  addLog: (log: RequestLog) => void;
  /** 批量添加日志 */
  addLogs: (logs: RequestLog[]) => void;
  /** 清空日志 */
  clearLogs: () => void;
  /** 更新筛选条件 */
  setFilter: (filter: Partial<LogFilter>) => void;
  /** 重置筛选条件 */
  resetFilter: () => void;
  /** 切换深色模式 */
  toggleDarkMode: () => void;
  /** 设置监听状态 */
  setListening: (listening: boolean) => void;

  /** 获取筛选后的日志 */
  getFilteredLogs: () => RequestLog[];
  /** 获取总体统计 */
  getStats: () => TokenStats;
  /** 获取按模型分组统计 */
  getModelStats: () => ModelStats[];
  /** 获取时间序列数据 */
  getTimeSeries: (intervalMs?: number) => TimeSeriesPoint[];
  /** 获取代理列表 */
  getAgents: () => AgentInfo[];
}

/**
 * @description 应用全局状态 Store
 */
export const useStore = create<AgentScopeState>((set, get) => ({
  logs: [],
  filter: {},
  darkMode: true,
  isListening: false,

  addLog: (log) => set((state) => ({ logs: [log, ...state.logs] })),

  addLogs: (logs) =>
    set((state) => ({ logs: [...logs.reverse(), ...state.logs] })),

  clearLogs: () => set({ logs: [] }),

  setFilter: (filter) =>
    set((state) => ({ filter: { ...state.filter, ...filter } })),

  resetFilter: () => set({ filter: {} }),

  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

  setListening: (listening) => set({ isListening: listening }),

  getFilteredLogs: () => {
    const { logs, filter } = get();
    return logs.filter((log) => {
      if (filter.provider && log.provider !== filter.provider) return false;
      if (filter.model && !log.model.toLowerCase().includes(filter.model.toLowerCase())) return false;
      if (filter.status && log.status !== filter.status) return false;
      if (filter.agentName && log.agentName !== filter.agentName) return false;
      if (filter.startTime && log.timestamp < filter.startTime) return false;
      if (filter.endTime && log.timestamp > filter.endTime) return false;
      if (filter.searchQuery) {
        const q = filter.searchQuery.toLowerCase();
        const bodyStr = JSON.stringify(log.requestBody).toLowerCase();
        const respStr = JSON.stringify(log.responseBody).toLowerCase();
        if (!bodyStr.includes(q) && !respStr.includes(q) && !log.url.toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    });
  },

  getStats: () => {
    const logs = get().getFilteredLogs();
    const completed = logs.filter((l) => l.status === "completed");
    const errors = logs.filter((l) => l.status === "error");
    const totalInputTokens = completed.reduce(
      (sum, l) => sum + (l.inputTokens || 0),
      0
    );
    const totalOutputTokens = completed.reduce(
      (sum, l) => sum + (l.outputTokens || 0),
      0
    );
    const totalCost = completed.reduce(
      (sum, l) => sum + (l.estimatedCost || 0),
      0
    );
    const totalDuration = completed.reduce(
      (sum, l) => sum + (l.duration || 0),
      0
    );

    return {
      totalInputTokens,
      totalOutputTokens,
      totalTokens: totalInputTokens + totalOutputTokens,
      totalCost,
      requestCount: logs.length,
      errorCount: errors.length,
      avgResponseTime: completed.length > 0 ? totalDuration / completed.length : 0,
    };
  },

  getModelStats: () => {
    const logs = get().getFilteredLogs();
    const map = new Map<string, ModelStats>();

    for (const log of logs) {
      const key = `${log.provider}:${log.model}`;
      const existing = map.get(key) || {
        model: log.model,
        provider: log.provider,
        inputTokens: 0,
        outputTokens: 0,
        totalCost: 0,
        requestCount: 0,
      };
      existing.inputTokens += log.inputTokens || 0;
      existing.outputTokens += log.outputTokens || 0;
      existing.totalCost += log.estimatedCost || 0;
      existing.requestCount += 1;
      map.set(key, existing);
    }

    return Array.from(map.values()).sort(
      (a, b) => b.totalCost - a.totalCost
    );
  },

  getTimeSeries: (intervalMs = 3600000) => {
    const logs = get().getFilteredLogs();
    if (logs.length === 0) return [];

    const map = new Map<number, TimeSeriesPoint>();
    for (const log of logs) {
      const bucket =
        Math.floor(log.timestamp / intervalMs) * intervalMs;
      const existing = map.get(bucket) || {
        timestamp: bucket,
        inputTokens: 0,
        outputTokens: 0,
        cost: 0,
        requestCount: 0,
      };
      existing.inputTokens += log.inputTokens || 0;
      existing.outputTokens += log.outputTokens || 0;
      existing.cost += log.estimatedCost || 0;
      existing.requestCount += 1;
      map.set(bucket, existing);
    }

    return Array.from(map.values()).sort(
      (a, b) => a.timestamp - b.timestamp
    );
  },

  getAgents: () => {
    const logs = get().logs;
    const map = new Map<string, AgentInfo>();

    for (const log of logs) {
      const name = log.agentName || "unknown";
      const existing = map.get(name) || {
        name,
        lastSeen: 0,
        requestCount: 0,
        totalCost: 0,
      };
      existing.lastSeen = Math.max(existing.lastSeen, log.timestamp);
      existing.requestCount += 1;
      existing.totalCost += log.estimatedCost || 0;
      map.set(name, existing);
    }

    return Array.from(map.values()).sort(
      (a, b) => b.lastSeen - a.lastSeen
    );
  },
}));
