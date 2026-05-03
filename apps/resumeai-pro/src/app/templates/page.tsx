"use client";

import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import type { TemplateType } from "@/types";
import { Check, LayoutTemplate } from "lucide-react";

const templates: {
  id: TemplateType;
  name: string;
  description: string;
  colors: string[];
  preview: string;
}[] = [
  {
    id: "professional",
    name: "Professional",
    description:
      "Clean and traditional layout. Perfect for corporate environments and formal industries.",
    colors: ["#1e293b", "#3b82f6", "#f8fafc"],
    preview: "AaBbCc",
  },
  {
    id: "modern",
    name: "Modern",
    description:
      "Contemporary design with bold headings. Great for tech and creative roles.",
    colors: ["#0f172a", "#8b5cf6", "#f1f5f9"],
    preview: "AaBbCc",
  },
  {
    id: "minimal",
    name: "Minimal",
    description:
      "Ultra-clean with maximum whitespace. Lets your content speak for itself.",
    colors: ["#374151", "#6b7280", "#ffffff"],
    preview: "AaBbCc",
  },
  {
    id: "creative",
    name: "Creative",
    description:
      "Eye-catching layout with accent colors. Ideal for design and marketing.",
    colors: ["#1e1b4b", "#ec4899", "#fef3c7"],
    preview: "AaBbCc",
  },
];

/**
 * @description 模板选择页面
 */
export default function TemplatesPage() {
  const router = useRouter();
  const store = useStore();
  const resume = store.getCurrentResume();
  const currentTemplate = resume?.template ?? "professional";

  const handleSelect = (template: TemplateType) => {
    if (!resume) {
      const id = store.createResume();
      store.setCurrentResume(id);
    }
    store.setTemplate(template);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-text dark:text-text-dark">
          Resume Templates
        </h1>
        <p className="mt-1 text-text-muted dark:text-text-muted-dark">
          Choose a template that best fits your industry and personal style.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {templates.map((t) => {
          const isActive = currentTemplate === t.id;
          return (
            <div
              key={t.id}
              onClick={() => handleSelect(t.id)}
              className={`group cursor-pointer rounded-2xl border-2 p-6 transition-all ${
                isActive
                  ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                  : "border-border hover:border-primary/30 hover:shadow-md dark:border-border-dark"
              }`}
            >
              {/* Template Preview */}
              <div className="mb-4 aspect-[8.5/11] overflow-hidden rounded-lg border border-border bg-white dark:border-border-dark">
                <div className="flex h-full flex-col p-4">
                  <div
                    className="mb-2 h-3 w-24 rounded"
                    style={{ backgroundColor: t.colors[0] }}
                  />
                  <div
                    className="mb-4 h-1 w-full rounded"
                    style={{ backgroundColor: t.colors[1], opacity: 0.3 }}
                  />
                  <div className="space-y-2">
                    <div
                      className="h-2 w-16 rounded"
                      style={{ backgroundColor: t.colors[1] }}
                    />
                    <div className="h-1.5 w-full rounded bg-gray-200" />
                    <div className="h-1.5 w-4/5 rounded bg-gray-200" />
                    <div className="h-1.5 w-3/4 rounded bg-gray-200" />
                  </div>
                  <div className="mt-4 space-y-2">
                    <div
                      className="h-2 w-20 rounded"
                      style={{ backgroundColor: t.colors[1] }}
                    />
                    <div className="h-1.5 w-full rounded bg-gray-200" />
                    <div className="h-1.5 w-5/6 rounded bg-gray-200" />
                  </div>
                  <div className="mt-4 flex gap-1.5">
                    {t.colors.map((c, i) => (
                      <div
                        key={i}
                        className="h-4 w-4 rounded-full border border-gray-200"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-text dark:text-text-dark">
                    {t.name}
                  </h3>
                  <p className="mt-0.5 text-sm text-text-muted dark:text-text-muted-dark">
                    {t.description}
                  </p>
                </div>
                {isActive && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
                    <Check size={16} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {resume && (
        <div className="text-center">
          <button
            onClick={() => router.push("/editor")}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-primary-dark"
          >
            <LayoutTemplate size={18} />
            Continue Editing
          </button>
        </div>
      )}
    </div>
  );
}
