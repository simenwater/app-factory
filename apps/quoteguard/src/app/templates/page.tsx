"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { filterTemplates, fillTemplate } from "@/lib/templates";
import { EmptyState } from "@/components/EmptyState";
import {
  getScenarioLabel,
  getToneLabel,
} from "@/lib/utils";
import type { DeclineScenario, DeclineTone } from "@/types";
import {
  MessageSquareOff,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

/**
 * @description 拒绝模板库页面
 */
export default function TemplatesPage() {
  const templates = useStore((s) => s.templates);
  const settings = useStore((s) => s.settings);
  const [scenarioFilter, setScenarioFilter] = useState<DeclineScenario | "">("");
  const [toneFilter, setToneFilter] = useState<DeclineTone | "">("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = filterTemplates(templates, scenarioFilter, toneFilter);

  /**
   * @description 复制模板内容到剪贴板
   */
  const handleCopy = async (id: string, body: string) => {
    const filled = fillTemplate(body, {
      clientName: "[客户姓名]",
      projectName: "[项目名称]",
      serviceType: "[服务类型]",
      businessName: settings.businessName || "[您的名字]",
    });
    await navigator.clipboard.writeText(filled);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const scenarios: { key: DeclineScenario | ""; label: string }[] = [
    { key: "", label: "全部场景" },
    { key: "free_work", label: "免费工作" },
    { key: "scope_creep", label: "范围蔓延" },
    { key: "low_budget", label: "预算过低" },
    { key: "unreasonable_deadline", label: "不合理截止日" },
    { key: "outside_expertise", label: "超出专业" },
    { key: "general", label: "通用" },
  ];

  const tones: { key: DeclineTone | ""; label: string }[] = [
    { key: "", label: "全部语气" },
    { key: "professional", label: "专业" },
    { key: "friendly", label: "友好" },
    { key: "firm", label: "坚定" },
    { key: "empathetic", label: "共情" },
  ];

  return (
    <div className="px-4 pt-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">话术模板库</h1>
        <p className="text-sm text-text-muted dark:text-text-muted-dark">
          专业的拒绝模板，维护关系同时保护利益
        </p>
      </div>

      {/* 筛选器 */}
      <div className="mb-4 space-y-2">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {scenarios.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setScenarioFilter(key)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                scenarioFilter === key
                  ? "bg-primary text-white"
                  : "bg-bg text-text-muted dark:bg-bg-dark dark:text-text-muted-dark"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {tones.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setToneFilter(key)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                toneFilter === key
                  ? "bg-accent text-white"
                  : "bg-bg text-text-muted dark:bg-bg-dark dark:text-text-muted-dark"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 模板列表 */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={MessageSquareOff}
          title="没有匹配的模板"
          description="尝试调整筛选条件查看更多模板"
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((tpl) => {
            const isExpanded = expandedId === tpl.id;
            const isCopied = copiedId === tpl.id;
            return (
              <div
                key={tpl.id}
                className="rounded-2xl border border-border bg-surface p-4 shadow-sm dark:border-border-dark dark:bg-surface-dark"
              >
                <div
                  className="flex cursor-pointer items-start justify-between"
                  onClick={() =>
                    setExpandedId(isExpanded ? null : tpl.id)
                  }
                >
                  <div className="flex-1">
                    <h3 className="font-semibold">{tpl.title}</h3>
                    <div className="mt-1 flex gap-2">
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                        {getScenarioLabel(tpl.scenario)}
                      </span>
                      <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent">
                        {getToneLabel(tpl.tone)}
                      </span>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp size={18} className="text-text-muted" />
                  ) : (
                    <ChevronDown size={18} className="text-text-muted" />
                  )}
                </div>

                {isExpanded && (
                  <div className="mt-3 border-t border-border pt-3 dark:border-border-dark">
                    <pre className="whitespace-pre-wrap text-sm leading-relaxed text-text-muted dark:text-text-muted-dark">
                      {fillTemplate(tpl.body, {
                        clientName: "[客户姓名]",
                        projectName: "[项目名称]",
                        serviceType: "[服务类型]",
                        businessName:
                          settings.businessName || "[您的名字]",
                      })}
                    </pre>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(tpl.id, tpl.body);
                      }}
                      className="mt-3 flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
                    >
                      {isCopied ? (
                        <>
                          <Check size={16} />
                          已复制
                        </>
                      ) : (
                        <>
                          <Copy size={16} />
                          复制到剪贴板
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="h-8" />
    </div>
  );
}
