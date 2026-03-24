"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { createChecklist, groupByCategory } from "@/lib/checklist";
import { EmptyState } from "@/components/EmptyState";
import {
  getChecklistCategoryLabel,
  getChecklistProgress,
  formatDate,
} from "@/lib/utils";
import {
  ClipboardCheck,
  Plus,
  Trash2,
  CheckSquare,
  Square,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

/**
 * @description 客户期望管理清单页面
 */
export default function ChecklistPage() {
  const checklists = useStore((s) => s.checklists);
  const addChecklist = useStore((s) => s.addChecklist);
  const updateChecklistItem = useStore((s) => s.updateChecklistItem);
  const deleteChecklist = useStore((s) => s.deleteChecklist);

  const [showNew, setShowNew] = useState(false);
  const [clientName, setClientName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  /**
   * @description 创建新的客户清单
   */
  const handleCreate = () => {
    if (!clientName || !projectName) return;
    const checklist = createChecklist(clientName, projectName);
    addChecklist(checklist);
    setClientName("");
    setProjectName("");
    setShowNew(false);
    setExpandedId(checklist.id);
  };

  return (
    <div className="px-4 pt-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">期望管理清单</h1>
          <p className="text-sm text-text-muted dark:text-text-muted-dark">
            确保每个项目的客户期望对齐
          </p>
        </div>
        <button
          onClick={() => setShowNew(!showNew)}
          className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-md transition-colors hover:bg-primary-dark"
        >
          <Plus size={18} />
          新建清单
        </button>
      </div>

      {/* 新建表单 */}
      {showNew && (
        <div className="mb-4 rounded-2xl border border-primary/30 bg-primary/5 p-4">
          <h3 className="mb-3 text-sm font-semibold">新建客户清单</h3>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="客户姓名"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-border-dark dark:bg-surface-dark"
            />
            <input
              type="text"
              placeholder="项目名称"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary dark:border-border-dark dark:bg-surface-dark"
            />
            <div className="flex gap-2">
              <button
                onClick={handleCreate}
                disabled={!clientName || !projectName}
                className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
              >
                创建
              </button>
              <button
                onClick={() => setShowNew(false)}
                className="rounded-xl bg-border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-border/80 dark:bg-border-dark"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 清单列表 */}
      {checklists.length === 0 ? (
        <EmptyState
          icon={ClipboardCheck}
          title="还没有清单"
          description="为每位客户创建期望管理清单，确保项目顺利推进"
        />
      ) : (
        <div className="space-y-3">
          {checklists.map((cl) => {
            const progress = getChecklistProgress(cl.items);
            const isExpanded = expandedId === cl.id;
            const grouped = groupByCategory(cl.items);
            return (
              <div
                key={cl.id}
                className="rounded-2xl border border-border bg-surface shadow-sm dark:border-border-dark dark:bg-surface-dark"
              >
                {/* 头部 */}
                <div
                  className="flex cursor-pointer items-center justify-between p-4"
                  onClick={() =>
                    setExpandedId(isExpanded ? null : cl.id)
                  }
                >
                  <div className="flex-1">
                    <h3 className="font-semibold">{cl.projectName}</h3>
                    <p className="text-sm text-text-muted dark:text-text-muted-dark">
                      {cl.clientName} · {formatDate(cl.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-16 overflow-hidden rounded-full bg-border dark:bg-border-dark">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-text-muted dark:text-text-muted-dark">
                        {progress}%
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp size={18} className="text-text-muted" />
                    ) : (
                      <ChevronDown size={18} className="text-text-muted" />
                    )}
                  </div>
                </div>

                {/* 展开内容 */}
                {isExpanded && (
                  <div className="border-t border-border px-4 pb-4 pt-3 dark:border-border-dark">
                    {Object.entries(grouped).map(
                      ([category, items]) => (
                        <div key={category} className="mb-4 last:mb-0">
                          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
                            {getChecklistCategoryLabel(category)}
                          </h4>
                          <div className="space-y-1.5">
                            {items.map((item) => (
                              <button
                                key={item.id}
                                onClick={() =>
                                  updateChecklistItem(
                                    cl.id,
                                    item.id,
                                    !item.checked
                                  )
                                }
                                className="flex w-full items-start gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-bg dark:hover:bg-bg-dark"
                              >
                                {item.checked ? (
                                  <CheckSquare
                                    size={18}
                                    className="mt-0.5 shrink-0 text-success"
                                  />
                                ) : (
                                  <Square
                                    size={18}
                                    className="mt-0.5 shrink-0 text-text-muted dark:text-text-muted-dark"
                                  />
                                )}
                                <span
                                  className={`text-sm ${
                                    item.checked
                                      ? "text-text-muted line-through dark:text-text-muted-dark"
                                      : ""
                                  }`}
                                >
                                  {item.text}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )
                    )}
                    <button
                      onClick={() => deleteChecklist(cl.id)}
                      className="mt-3 flex items-center gap-1.5 text-xs text-danger transition-colors hover:text-danger/80"
                    >
                      <Trash2 size={14} />
                      删除清单
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
