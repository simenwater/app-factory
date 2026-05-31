"use client";

import { useStore } from "@/lib/store";
import { exportAndDownload } from "@/lib/export";
import { Search, X, Download, FileJson, FileSpreadsheet } from "lucide-react";
import { useState } from "react";
import type { Provider, RequestStatus, ExportFormat } from "@/types";

/**
 * @description 日志筛选与导出工具栏
 */
export default function LogFilter() {
  const darkMode = useStore((s) => s.darkMode);
  const filter = useStore((s) => s.filter);
  const setFilter = useStore((s) => s.setFilter);
  const resetFilter = useStore((s) => s.resetFilter);
  const getFilteredLogs = useStore((s) => s.getFilteredLogs);
  const agents = useStore((s) => s.getAgents());
  const [showExport, setShowExport] = useState(false);

  const inputClass = `rounded-lg border px-3 py-1.5 text-xs outline-none transition-colors ${
    darkMode
      ? "border-border bg-bg-tertiary text-text-primary focus:border-accent"
      : "border-light-border bg-light-bg-tertiary text-light-text-primary focus:border-accent"
  }`;

  const handleExport = (format: ExportFormat) => {
    const logs = getFilteredLogs();
    exportAndDownload(logs, format);
    setShowExport(false);
  };

  const hasFilters = Object.values(filter).some((v) => v !== undefined && v !== "");

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* 搜索 */}
      <div className="relative flex-1 min-w-[200px]">
        <Search
          className={`absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 ${
            darkMode ? "text-text-muted" : "text-light-text-muted"
          }`}
        />
        <input
          type="text"
          placeholder="搜索请求内容..."
          value={filter.searchQuery || ""}
          onChange={(e) => setFilter({ searchQuery: e.target.value || undefined })}
          className={`${inputClass} w-full pl-9`}
        />
      </div>

      {/* Provider 筛选 */}
      <select
        value={filter.provider || ""}
        onChange={(e) =>
          setFilter({ provider: (e.target.value as Provider) || undefined })
        }
        className={inputClass}
      >
        <option value="">所有提供商</option>
        <option value="openai">OpenAI</option>
        <option value="anthropic">Anthropic</option>
        <option value="google">Google</option>
        <option value="custom">Custom</option>
      </select>

      {/* 状态筛选 */}
      <select
        value={filter.status || ""}
        onChange={(e) =>
          setFilter({
            status: (e.target.value as RequestStatus) || undefined,
          })
        }
        className={inputClass}
      >
        <option value="">所有状态</option>
        <option value="completed">完成</option>
        <option value="pending">进行中</option>
        <option value="error">错误</option>
      </select>

      {/* Agent 筛选 */}
      {agents.length > 0 && (
        <select
          value={filter.agentName || ""}
          onChange={(e) =>
            setFilter({ agentName: e.target.value || undefined })
          }
          className={inputClass}
        >
          <option value="">所有代理</option>
          {agents.map((a) => (
            <option key={a.name} value={a.name}>
              {a.name}
            </option>
          ))}
        </select>
      )}

      {/* 重置筛选 */}
      {hasFilters && (
        <button
          onClick={resetFilter}
          className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs text-error hover:bg-error/10 transition-colors"
        >
          <X className="h-3 w-3" />
          清除
        </button>
      )}

      {/* 导出 */}
      <div className="relative">
        <button
          onClick={() => setShowExport(!showExport)}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
            darkMode
              ? "bg-accent/10 text-accent hover:bg-accent/20"
              : "bg-accent/10 text-accent hover:bg-accent/20"
          }`}
        >
          <Download className="h-3.5 w-3.5" />
          导出
        </button>

        {showExport && (
          <div
            className={`absolute right-0 top-full mt-1 rounded-lg border p-1 z-10 ${
              darkMode
                ? "border-border bg-bg-secondary shadow-xl"
                : "border-light-border bg-light-bg-secondary shadow-lg"
            }`}
          >
            <button
              onClick={() => handleExport("json")}
              className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs transition-colors ${
                darkMode ? "hover:bg-bg-tertiary" : "hover:bg-light-bg-tertiary"
              }`}
            >
              <FileJson className="h-3.5 w-3.5 text-accent" />
              导出 JSON
            </button>
            <button
              onClick={() => handleExport("csv")}
              className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs transition-colors ${
                darkMode ? "hover:bg-bg-tertiary" : "hover:bg-light-bg-tertiary"
              }`}
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-success" />
              导出 CSV
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
