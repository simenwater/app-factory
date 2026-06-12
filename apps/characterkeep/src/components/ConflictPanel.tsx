"use client";

import { useAppStore } from "@/store";
import { AlertTriangle, RefreshCw, Shield } from "lucide-react";
import { conflictLevelColor, formatDate } from "@/lib/utils";

/** 冲突类型中文映射 */
const CONFLICT_TYPE_LABEL: Record<string, string> = {
  personality: "人设冲突",
  relationship: "关系矛盾",
  timeline: "时间线冲突",
  plot: "剧情矛盾",
};

/**
 * 冲突预警面板 — 智能检测角色间和剧情中的冲突
 */
export function ConflictPanel() {
  const { warnings, runConflictDetection, characters } = useAppStore();

  /** 获取角色名称列表 */
  const getCharNames = (ids: string[]) =>
    ids
      .map((id) => characters.find((c) => c.id === id)?.name ?? "未知")
      .join("、");

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2
            className="text-xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            冲突预警
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            智能检测角色性格冲突、关系矛盾和剧情不合理
          </p>
        </div>
        <button
          onClick={runConflictDetection}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors"
          style={{ backgroundColor: "var(--accent)" }}
        >
          <RefreshCw className="w-4 h-4" /> 检测冲突
        </button>
      </div>

      {warnings.length === 0 ? (
        <div
          className="text-center py-16"
          style={{ color: "var(--text-muted)" }}
        >
          <Shield className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">点击「检测冲突」开始扫描</p>
          <p className="text-xs mt-1">
            系统将分析角色关系网络和剧情事件中的潜在冲突
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {warnings.map((warning) => (
            <div
              key={warning.id}
              className="p-4 rounded-xl"
              style={{
                backgroundColor: "var(--bg-primary)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="flex items-start gap-3">
                <AlertTriangle
                  className={`w-5 h-5 shrink-0 mt-0.5 ${conflictLevelColor(warning.severity)}`}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: "var(--bg-tertiary)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {CONFLICT_TYPE_LABEL[warning.type] ?? warning.type}
                    </span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }, (_, i) => (
                        <div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            backgroundColor:
                              i < warning.severity
                                ? "var(--danger)"
                                : "var(--border)",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <p
                    className="text-sm"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {warning.message}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span
                      className="text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      涉及角色：{getCharNames(warning.characterIds)}
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {formatDate(warning.detectedAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
