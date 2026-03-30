"use client";

import { useRouter } from "next/navigation";
import { FileText, Lock, Crown } from "lucide-react";
import { useStore } from "@/store/useStore";
import { QUOTE_TEMPLATES, getTemplateCategories } from "@/lib/templates";
import { useState } from "react";

/**
 * @description 报价单模板页面
 */
export default function TemplatesPage() {
  const router = useRouter();
  const subscription = useStore((s) => s.settings.subscription);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = getTemplateCategories();
  const filteredTemplates = selectedCategory
    ? QUOTE_TEMPLATES.filter((t) => t.category === selectedCategory)
    : QUOTE_TEMPLATES;

  /**
   * @description 使用模板创建报价单
   */
  function handleUseTemplate(templateId: string) {
    const template = QUOTE_TEMPLATES.find((t) => t.id === templateId);
    if (!template) return;

    if (template.isPremium && subscription !== "pro") {
      alert("此模板需要 Pro 订阅。请升级以使用所有模板。");
      return;
    }

    const params = new URLSearchParams({ templateId });
    router.push(`/quotes/new?${params.toString()}`);
  }

  return (
    <div className="px-4 pt-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text dark:text-text-dark">
          报价单模板
        </h1>
        <p className="text-sm text-text-muted dark:text-text-muted-dark">
          选择行业模板快速创建报价单
        </p>
      </div>

      {subscription === "free" && (
        <div className="mb-4 flex items-center gap-3 rounded-xl border border-warning/30 bg-warning/5 p-4">
          <Crown size={20} className="shrink-0 text-warning" />
          <div className="flex-1">
            <p className="text-sm font-medium text-text dark:text-text-dark">
              升级到 Pro 解锁所有模板
            </p>
            <p className="text-xs text-text-muted dark:text-text-muted-dark">
              免费版包含 3 个模板，Pro 版享有全部 {QUOTE_TEMPLATES.length} 个模板
            </p>
          </div>
        </div>
      )}

      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            !selectedCategory
              ? "bg-primary text-white"
              : "bg-surface text-text-muted border border-border dark:bg-surface-dark dark:border-border-dark"
          }`}
        >
          全部
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              selectedCategory === cat
                ? "bg-primary text-white"
                : "bg-surface text-text-muted border border-border dark:bg-surface-dark dark:border-border-dark"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredTemplates.map((template) => {
          const isLocked = template.isPremium && subscription !== "pro";
          return (
            <div
              key={template.id}
              className={`rounded-xl border bg-surface p-4 transition-colors dark:bg-surface-dark ${
                isLocked
                  ? "border-border/50 opacity-75 dark:border-border-dark/50"
                  : "border-border dark:border-border-dark"
              }`}
            >
              <div className="mb-2 flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <FileText size={18} className="text-primary" />
                  <h3 className="font-medium text-text dark:text-text-dark">
                    {template.name}
                  </h3>
                  {template.isPremium && (
                    <span className="flex items-center gap-0.5 rounded-full bg-warning/10 px-2 py-0.5 text-xs font-medium text-warning">
                      <Crown size={10} />
                      Pro
                    </span>
                  )}
                </div>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                  {template.category}
                </span>
              </div>
              <p className="mb-3 text-sm text-text-muted dark:text-text-muted-dark">
                {template.description}
              </p>
              <div className="mb-3 space-y-1">
                {template.defaultItems.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between text-xs text-text-muted dark:text-text-muted-dark"
                  >
                    <span>{item.description}</span>
                    <span>
                      ${item.unitPrice}/{item.unit}
                    </span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => handleUseTemplate(template.id)}
                disabled={isLocked}
                className={`w-full rounded-lg py-2 text-sm font-medium transition-colors ${
                  isLocked
                    ? "flex items-center justify-center gap-1.5 border border-border bg-bg text-text-muted cursor-not-allowed dark:border-border-dark dark:bg-bg-dark"
                    : "bg-primary text-white hover:bg-primary-dark"
                }`}
              >
                {isLocked ? (
                  <>
                    <Lock size={14} />
                    需要 Pro 订阅
                  </>
                ) : (
                  "使用此模板"
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
