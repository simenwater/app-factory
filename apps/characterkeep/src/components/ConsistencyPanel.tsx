"use client";

import { useAppStore } from "@/store";
import { Search, RefreshCw, CheckCircle, AlertCircle, Info } from "lucide-react";
import { severityColor, formatDate } from "@/lib/utils";

/**
 * 一致性检查面板 — 自动检测角色行为、设定中的不一致
 */
export function ConsistencyPanel() {
  const { issues, runConsistencyCheck, characters } = useAppStore();

  /** 获取角色名称 */
  const getCharName = (id?: string) => {
    if (!id) return "";
    return characters.find((c) => c.id === id)?.name ?? "未知角色";
  };

  /** 严重程度图标 */
  const SeverityIcon = ({
    severity,
  }: {
    severity: "error" | "warning" | "info";
  }) => {
    if (severity === "error")
      return <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />;
    if (severity === "warning")
      return <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />;
    return <Info className="w-4 h-4 text-blue-500 shrink-0" />;
  };

  const errorCount = issues.filter((i) => i.severity === "error").length;
  const warnCount = issues.filter((i) => i.severity === "warning").length;
  const infoCount = issues.filter((i) => i.severity === "info").length;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2
            className="text-xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            一致性检查
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            自动检测角色设定、行为和剧情中的不一致性
          </p>
        </div>
        <button
          onClick={runConsistencyCheck}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors"
          style={{ backgroundColor: "var(--accent)" }}
        >
          <RefreshCw className="w-4 h-4" /> 运行检查
        </button>
      </div>

      {/* 统计摘要 */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "错误", count: errorCount, color: "var(--danger)" },
          { label: "警告", count: warnCount, color: "var(--warning)" },
          { label: "建议", count: infoCount, color: "var(--accent)" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-4 rounded-xl text-center"
            style={{
              backgroundColor: "var(--bg-primary)",
              border: "1px solid var(--border)",
            }}
          >
            <div
              className="text-2xl font-bold"
              style={{ color: stat.color }}
            >
              {stat.count}
            </div>
            <div
              className="text-xs mt-1"
              style={{ color: "var(--text-muted)" }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* 问题列表 */}
      {issues.length === 0 ? (
        <div
          className="text-center py-16"
          style={{ color: "var(--text-muted)" }}
        >
          <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">点击「运行检查」开始分析</p>
          <p className="text-xs mt-1">
            系统将自动扫描所有角色和事件的一致性
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {issues.map((issue) => (
            <div
              key={issue.id}
              className="flex gap-3 p-4 rounded-xl"
              style={{
                backgroundColor: "var(--bg-primary)",
                border: "1px solid var(--border)",
              }}
            >
              <SeverityIcon severity={issue.severity} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-xs font-semibold uppercase ${severityColor(issue.severity)}`}
                  >
                    {issue.severity === "error"
                      ? "错误"
                      : issue.severity === "warning"
                        ? "警告"
                        : "建议"}
                  </span>
                  {issue.characterId && (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: "var(--bg-tertiary)",
                        color: "var(--text-muted)",
                      }}
                    >
                      {getCharName(issue.characterId)}
                    </span>
                  )}
                </div>
                <p
                  className="text-sm"
                  style={{ color: "var(--text-primary)" }}
                >
                  {issue.message}
                </p>
                {issue.suggestion && (
                  <p
                    className="text-xs mt-1.5 p-2 rounded-lg"
                    style={{
                      backgroundColor: "var(--bg-tertiary)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    💡 {issue.suggestion}
                  </p>
                )}
                <p
                  className="text-xs mt-1"
                  style={{ color: "var(--text-muted)" }}
                >
                  {formatDate(issue.checkedAt)}
                </p>
              </div>
            </div>
          ))}

          {errorCount === 0 && warnCount === 0 && (
            <div
              className="flex items-center gap-2 p-4 rounded-xl"
              style={{
                backgroundColor: "var(--bg-primary)",
                border: "1px solid var(--border)",
              }}
            >
              <CheckCircle className="w-5 h-5 text-green-500" />
              <p className="text-sm" style={{ color: "var(--text-primary)" }}>
                太好了！未发现严重的一致性问题。
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
