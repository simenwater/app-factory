"use client";

import { useStore } from "@/lib/store";
import { formatTokens, formatCost, getProviderLabel } from "@/lib/format";

/**
 * @description 按模型分组的使用统计
 */
export default function ModelBreakdown() {
  const darkMode = useStore((s) => s.darkMode);
  const modelStats = useStore((s) => s.getModelStats());

  if (modelStats.length === 0) return null;

  const maxCost = Math.max(...modelStats.map((m) => m.totalCost), 0.001);

  const providerColors: Record<string, string> = {
    openai: "bg-provider-openai",
    anthropic: "bg-provider-anthropic",
    google: "bg-provider-google",
    custom: "bg-provider-custom",
  };

  return (
    <div
      className={`rounded-xl border p-5 ${
        darkMode
          ? "border-border bg-bg-card"
          : "border-light-border bg-light-bg-card shadow-sm"
      }`}
    >
      <h3 className="mb-4 text-sm font-semibold">模型使用统计</h3>
      <div className="space-y-3">
        {modelStats.map((m) => (
          <div key={`${m.provider}:${m.model}`} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div
                  className={`h-2 w-2 rounded-full ${
                    providerColors[m.provider] || "bg-provider-custom"
                  }`}
                />
                <span className="font-medium">{m.model}</span>
                <span
                  className={
                    darkMode ? "text-text-muted" : "text-light-text-muted"
                  }
                >
                  {getProviderLabel(m.provider)}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={
                    darkMode ? "text-text-secondary" : "text-light-text-secondary"
                  }
                >
                  {m.requestCount} 次
                </span>
                <span
                  className={
                    darkMode ? "text-text-secondary" : "text-light-text-secondary"
                  }
                >
                  {formatTokens(m.inputTokens + m.outputTokens)} tokens
                </span>
                <span className="font-medium text-warning">
                  {formatCost(m.totalCost)}
                </span>
              </div>
            </div>
            <div
              className={`h-1.5 rounded-full ${
                darkMode ? "bg-bg-tertiary" : "bg-light-bg-tertiary"
              }`}
            >
              <div
                className={`h-full rounded-full transition-all ${
                  providerColors[m.provider] || "bg-provider-custom"
                }`}
                style={{
                  width: `${Math.max((m.totalCost / maxCost) * 100, 2)}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
