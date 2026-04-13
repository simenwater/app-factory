"use client";

/**
 * @fileoverview 模板管理页面
 * 展示所有可用的配置模板及其详细信息
 */

import { useState } from "react";
import { allTemplates } from "@/lib/templates";
import { ConfigTemplate } from "@/types";
import { ASSISTANT_META } from "@/components/AssistantCard";
import { FileText, Eye, EyeOff, Variable } from "lucide-react";

/**
 * 模板管理页面组件
 * @returns JSX 元素
 */
export default function TemplatesPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  /**
   * 切换模板展开状态
   * @param id - 模板 ID
   */
  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">配置模板</h1>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">
          浏览和管理所有 AI 助手配置模板，支持自定义变量
        </p>
      </div>

      <div className="space-y-4">
        {allTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            expanded={expandedId === template.id}
            onToggle={() => toggleExpand(template.id)}
          />
        ))}
      </div>
    </div>
  );
}

interface TemplateCardProps {
  template: ConfigTemplate;
  expanded: boolean;
  onToggle: () => void;
}

/**
 * 单个模板卡片
 * @param props - 组件属性
 * @returns JSX 元素
 */
function TemplateCard({ template, expanded, onToggle }: TemplateCardProps) {
  const meta = ASSISTANT_META[template.assistant];

  return (
    <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
      >
        <div className="flex items-center gap-4">
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${meta.color} text-white font-bold`}>
            {meta.name.charAt(0)}
          </div>
          <div>
            <div className="font-semibold text-zinc-900 dark:text-white">{template.name}</div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">{template.description}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <code className="rounded bg-zinc-100 px-2 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            {template.fileName}
          </code>
          {expanded ? <EyeOff size={16} className="text-zinc-400" /> : <Eye size={16} className="text-zinc-400" />}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-zinc-200 dark:border-zinc-800 animate-fade-in">
          {/* 变量列表 */}
          <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              <Variable size={14} />
              模板变量 ({template.variables.length})
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              {template.variables.map((v) => (
                <div
                  key={v.key}
                  className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-800/50"
                >
                  <div>
                    <code className="text-xs font-medium text-violet-600 dark:text-violet-400">
                      {"{{" + v.key + "}}"}
                    </code>
                    <div className="text-xs text-zinc-500">{v.label}</div>
                  </div>
                  <span className="text-xs text-zinc-400">{v.defaultValue || "自动生成"}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 模板预览 */}
          <div className="px-6 py-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              <FileText size={14} />
              模板内容预览
            </div>
            <pre className="max-h-64 overflow-auto rounded-lg bg-zinc-50 p-4 text-xs leading-relaxed text-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-300 font-mono">
              {template.content}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
