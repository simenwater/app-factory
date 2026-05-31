"use client";

import { useStore } from "@/lib/store";
import { formatCost, formatRelativeTime } from "@/lib/format";
import { Bot } from "lucide-react";

/**
 * @description 已检测到的 AI 代理列表
 */
export default function AgentList() {
  const darkMode = useStore((s) => s.darkMode);
  const agents = useStore((s) => s.getAgents());

  if (agents.length === 0) return null;

  return (
    <div
      className={`rounded-xl border p-5 ${
        darkMode
          ? "border-border bg-bg-card"
          : "border-light-border bg-light-bg-card shadow-sm"
      }`}
    >
      <h3 className="mb-4 text-sm font-semibold flex items-center gap-2">
        <Bot className="h-4 w-4 text-accent" />
        检测到的代理
      </h3>
      <div className="space-y-2">
        {agents.map((agent) => (
          <div
            key={agent.name}
            className={`flex items-center justify-between rounded-lg p-3 ${
              darkMode ? "bg-bg-tertiary" : "bg-light-bg-tertiary"
            }`}
          >
            <div>
              <div className="text-xs font-medium">{agent.name}</div>
              <div
                className={`text-[10px] ${
                  darkMode ? "text-text-muted" : "text-light-text-muted"
                }`}
              >
                {formatRelativeTime(agent.lastSeen)} · {agent.requestCount} 次请求
              </div>
            </div>
            <div className="text-xs font-medium text-warning">
              {formatCost(agent.totalCost)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
