"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import {
  formatCost,
  formatDuration,
  formatTokens,
  formatTimestamp,
  getProviderLabel,
  getStatusLabel,
} from "@/lib/format";
import type { RequestLog } from "@/types";
import LogDetail from "./LogDetail";
import {
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

/**
 * @description 日志列表组件
 */
export default function LogTable() {
  const darkMode = useStore((s) => s.darkMode);
  const filteredLogs = useStore((s) => s.getFilteredLogs());
  const [selectedLog, setSelectedLog] = useState<RequestLog | null>(null);
  const [page, setPage] = useState(0);
  const pageSize = 50;

  const pagedLogs = filteredLogs.slice(
    page * pageSize,
    (page + 1) * pageSize
  );
  const totalPages = Math.ceil(filteredLogs.length / pageSize);

  const statusColors: Record<string, string> = {
    completed: "bg-success/10 text-success",
    pending: "bg-warning/10 text-warning",
    error: "bg-error/10 text-error",
  };

  const providerDot: Record<string, string> = {
    openai: "bg-provider-openai",
    anthropic: "bg-provider-anthropic",
    google: "bg-provider-google",
    custom: "bg-provider-custom",
  };

  if (filteredLogs.length === 0) {
    return (
      <div
        className={`flex flex-col items-center justify-center rounded-xl border py-16 ${
          darkMode
            ? "border-border bg-bg-card"
            : "border-light-border bg-light-bg-card"
        }`}
      >
        <div className="text-4xl mb-3 opacity-30">📡</div>
        <p
          className={`text-sm ${
            darkMode ? "text-text-secondary" : "text-light-text-secondary"
          }`}
        >
          暂无日志记录
        </p>
        <p
          className={`text-xs mt-1 ${
            darkMode ? "text-text-muted" : "text-light-text-muted"
          }`}
        >
          启动代理服务器或加载演示数据开始使用
        </p>
      </div>
    );
  }

  return (
    <>
      <div
        className={`overflow-hidden rounded-xl border ${
          darkMode
            ? "border-border bg-bg-card"
            : "border-light-border bg-light-bg-card shadow-sm"
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr
                className={`border-b ${
                  darkMode ? "border-border" : "border-light-border"
                }`}
              >
                {[
                  "时间",
                  "提供商",
                  "模型",
                  "代理",
                  "状态",
                  "耗时",
                  "Tokens",
                  "成本",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    className={`px-4 py-3 text-left font-medium ${
                      darkMode ? "text-text-muted" : "text-light-text-muted"
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pagedLogs.map((log) => (
                <tr
                  key={log.id}
                  onClick={() => setSelectedLog(log)}
                  className={`log-row cursor-pointer border-b last:border-b-0 ${
                    darkMode
                      ? "border-border/50 hover:bg-bg-tertiary/50"
                      : "border-light-border/50 hover:bg-light-bg-tertiary/50"
                  }`}
                >
                  <td className="whitespace-nowrap px-4 py-3">
                    {formatTimestamp(log.timestamp)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          providerDot[log.provider] || "bg-provider-custom"
                        }`}
                      />
                      {getProviderLabel(log.provider)}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono">{log.model}</td>
                  <td
                    className={`px-4 py-3 ${
                      darkMode ? "text-text-secondary" : "text-light-text-secondary"
                    }`}
                  >
                    {log.agentName}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        statusColors[log.status]
                      }`}
                    >
                      {getStatusLabel(log.status)}
                    </span>
                  </td>
                  <td
                    className={`px-4 py-3 ${
                      darkMode ? "text-text-secondary" : "text-light-text-secondary"
                    }`}
                  >
                    {log.duration ? formatDuration(log.duration) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {log.inputTokens != null ? (
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-0.5 text-provider-google">
                          <ArrowUpRight className="h-3 w-3" />
                          {formatTokens(log.inputTokens)}
                        </span>
                        <span className="flex items-center gap-0.5 text-success">
                          <ArrowDownRight className="h-3 w-3" />
                          {formatTokens(log.outputTokens || 0)}
                        </span>
                      </div>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-warning">
                    {log.estimatedCost != null
                      ? formatCost(log.estimatedCost)
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <ChevronRight
                      className={`h-3.5 w-3.5 ${
                        darkMode ? "text-text-muted" : "text-light-text-muted"
                      }`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 分页 */}
        {totalPages > 1 && (
          <div
            className={`flex items-center justify-between border-t px-4 py-3 ${
              darkMode ? "border-border" : "border-light-border"
            }`}
          >
            <span
              className={`text-xs ${
                darkMode ? "text-text-muted" : "text-light-text-muted"
              }`}
            >
              共 {filteredLogs.length} 条 · 第 {page + 1}/{totalPages} 页
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className={`rounded-md px-3 py-1 text-xs transition-colors disabled:opacity-30 ${
                  darkMode
                    ? "hover:bg-bg-tertiary"
                    : "hover:bg-light-bg-tertiary"
                }`}
              >
                上一页
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page >= totalPages - 1}
                className={`rounded-md px-3 py-1 text-xs transition-colors disabled:opacity-30 ${
                  darkMode
                    ? "hover:bg-bg-tertiary"
                    : "hover:bg-light-bg-tertiary"
                }`}
              >
                下一页
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 详情面板 */}
      {selectedLog && (
        <LogDetail log={selectedLog} onClose={() => setSelectedLog(null)} />
      )}
    </>
  );
}
