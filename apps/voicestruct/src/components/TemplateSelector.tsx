"use client";

import {
  Mail,
  ListChecks,
  FileText,
  Users,
  Sparkles,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { TEMPLATES } from "@/lib/templates";
import type { TemplateType } from "@/types";
import type { LucideIcon } from "lucide-react";

/**
 * @description 图标名称到组件的映射
 */
const ICON_MAP: Record<string, LucideIcon> = {
  mail: Mail,
  "list-checks": ListChecks,
  "file-text": FileText,
  users: Users,
  sparkles: Sparkles,
};

/**
 * @description 模板选择器组件，允许用户选择输出格式
 */
export function TemplateSelector() {
  const selectedTemplate = useStore((s) => s.selectedTemplate);
  const setSelectedTemplate = useStore((s) => s.setSelectedTemplate);
  const status = useStore((s) => s.currentStatus);

  const isDisabled = status === "recording" || status === "transcribing" || status === "formatting";

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-text-muted dark:text-text-muted-dark">
        选择输出格式
      </h3>
      <div className="grid grid-cols-5 gap-2">
        {TEMPLATES.map((template) => {
          const Icon = ICON_MAP[template.icon] || Sparkles;
          const isActive = selectedTemplate === template.id;

          return (
            <button
              key={template.id}
              onClick={() => setSelectedTemplate(template.id as TemplateType)}
              disabled={isDisabled}
              className={`flex flex-col items-center gap-1.5 rounded-xl p-3 text-xs transition-all ${
                isActive
                  ? "bg-primary text-white shadow-md"
                  : "bg-surface text-text-muted hover:bg-border dark:bg-surface-dark dark:text-text-muted-dark dark:hover:bg-border-dark"
              } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
              title={template.description}
            >
              <Icon size={20} />
              <span className="font-medium">{template.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
