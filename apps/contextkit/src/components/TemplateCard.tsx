"use client";

import { Template } from "@/types";
import { getCategoryLabel } from "@/lib/templates";
import { FileText, ArrowRight } from "lucide-react";

/**
 * 模板卡片组件
 * @param props - 模板属性
 * @param props.template - 模板数据
 * @param props.onUse - 使用模板回调
 * @param props.onPreview - 预览模板回调
 * @returns TemplateCard 组件
 */
export default function TemplateCard({
  template,
  onUse,
  onPreview,
}: {
  template: Template;
  onUse: (template: Template) => void;
  onPreview: (template: Template) => void;
}) {
  return (
    <div
      className="rounded-xl border p-5 transition-all hover:shadow-lg animate-fade-in cursor-pointer"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border-color)",
      }}
      onClick={() => onPreview(template)}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="p-2 rounded-lg"
          style={{ backgroundColor: "var(--accent-light)" }}
        >
          <FileText size={20} style={{ color: "var(--accent)" }} />
        </div>
        <span
          className="text-xs px-2 py-1 rounded-full font-medium"
          style={{
            backgroundColor: "var(--bg-tertiary)",
            color: "var(--text-secondary)",
          }}
        >
          {getCategoryLabel(template.category)}
        </span>
      </div>

      <h3
        className="font-semibold text-base mb-1"
        style={{ color: "var(--text-primary)" }}
      >
        {template.name}
      </h3>
      <p
        className="text-sm mb-4 line-clamp-2"
        style={{ color: "var(--text-secondary)" }}
      >
        {template.description}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {template.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-0.5 rounded-md"
            style={{
              backgroundColor: "var(--bg-tertiary)",
              color: "var(--text-muted)",
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onUse(template);
        }}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors text-white"
        style={{ backgroundColor: "var(--accent)" }}
      >
        使用此模板
        <ArrowRight size={14} />
      </button>
    </div>
  );
}
