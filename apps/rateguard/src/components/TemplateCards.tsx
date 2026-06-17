"use client";

/**
 * @fileoverview 谈判话术模板卡片组件
 */

import { useState } from "react";
import { Copy, Check, MessageSquare } from "lucide-react";
import { useAppStore } from "@/store";
import { NegotiationTemplate } from "@/types";

/** 模板类型标签 */
const TYPE_LABELS: Record<NegotiationTemplate["type"], { label: string; color: string }> = {
  reject: { label: "拒绝", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  negotiate: { label: "谈判", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  "accept-with-conditions": { label: "有条件接受", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
};

/**
 * TemplateCard - 单个话术模板卡片
 * @param props.template - 话术模板数据
 */
function TemplateCard({ template }: { template: NegotiationTemplate }) {
  const [copied, setCopied] = useState(false);
  const typeInfo = TYPE_LABELS[template.type];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(template.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${typeInfo.color}`}>
            {typeInfo.label}
          </span>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
            {template.title}
          </h4>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-green-500" />
              已复制
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              复制
            </>
          )}
        </button>
      </div>
      <pre className="whitespace-pre-wrap text-xs leading-relaxed text-gray-600 dark:text-gray-300">
        {template.content}
      </pre>
    </div>
  );
}

/**
 * TemplateCards - 话术模板列表组件
 */
export function TemplateCards() {
  const currentTemplates = useAppStore((s) => s.currentTemplates);

  if (currentTemplates.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
        <MessageSquare className="h-5 w-5 text-indigo-500" />
        谈判话术模板
      </h3>
      {currentTemplates.map((template, index) => (
        <TemplateCard key={index} template={template} />
      ))}
    </div>
  );
}
