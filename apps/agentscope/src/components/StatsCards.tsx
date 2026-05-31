"use client";

import { useStore } from "@/lib/store";
import { formatTokens, formatCost, formatDuration } from "@/lib/format";
import {
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Clock,
  AlertCircle,
} from "lucide-react";

/**
 * @description 统计卡片组件 - 展示 Token 消耗与成本概览
 */
export default function StatsCards() {
  const darkMode = useStore((s) => s.darkMode);
  const stats = useStore((s) => s.getStats());

  const cards = [
    {
      label: "总请求数",
      value: String(stats.requestCount),
      icon: Zap,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      label: "输入 Tokens",
      value: formatTokens(stats.totalInputTokens),
      icon: ArrowUpRight,
      color: "text-provider-google",
      bgColor: "bg-provider-google/10",
    },
    {
      label: "输出 Tokens",
      value: formatTokens(stats.totalOutputTokens),
      icon: ArrowDownRight,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      label: "总成本",
      value: formatCost(stats.totalCost),
      icon: DollarSign,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      label: "平均响应时间",
      value: formatDuration(stats.avgResponseTime),
      icon: Clock,
      color: "text-provider-anthropic",
      bgColor: "bg-provider-anthropic/10",
    },
    {
      label: "错误数",
      value: String(stats.errorCount),
      icon: AlertCircle,
      color: stats.errorCount > 0 ? "text-error" : "text-success",
      bgColor: stats.errorCount > 0 ? "bg-error/10" : "bg-success/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`rounded-xl border p-4 transition-all hover:scale-[1.02] ${
            darkMode
              ? "border-border bg-bg-card hover:border-border-hover"
              : "border-light-border bg-light-bg-card hover:border-light-border-hover shadow-sm"
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className={`rounded-lg p-1.5 ${card.bgColor}`}>
              <card.icon className={`h-3.5 w-3.5 ${card.color}`} />
            </div>
            <span
              className={`text-xs ${
                darkMode ? "text-text-muted" : "text-light-text-muted"
              }`}
            >
              {card.label}
            </span>
          </div>
          <div className="text-xl font-bold tracking-tight">
            {card.value}
          </div>
        </div>
      ))}
    </div>
  );
}
