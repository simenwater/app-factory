"use client";

/**
 * @fileoverview 冲突查看器组件
 */

import { ConflictResult } from "@/types";
import { useStore } from "@/store/useStore";
import { getConflictSeverity } from "@/lib/conflicts";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { ASSISTANT_META } from "./AssistantCard";

interface ConflictViewerProps {
  conflict: ConflictResult;
}

/** 严重程度样式映射 */
const severityStyles = {
  low: { color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-950/20", icon: CheckCircle },
  medium: { color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/20", icon: AlertTriangle },
  high: { color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/20", icon: XCircle },
};

/**
 * 冲突查看器组件
 * @param props - 组件属性
 * @returns JSX 元素
 */
export default function ConflictViewer({ conflict }: ConflictViewerProps) {
  const resolveConflict = useStore((s) => s.resolveConflict);
  const severity = getConflictSeverity(conflict.conflicts);
  const style = severityStyles[severity];
  const Icon = style.icon;

  const metaA = ASSISTANT_META[conflict.fileA.assistant];
  const metaB = ASSISTANT_META[conflict.fileB.assistant];

  return (
    <div className={`rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden ${conflict.status === "resolved" ? "opacity-60" : ""}`}>
      <div className={`flex items-center justify-between px-4 py-3 ${style.bg}`}>
        <div className="flex items-center gap-2">
          <Icon size={18} className={style.color} />
          <span className="font-medium text-zinc-900 dark:text-white text-sm">
            {metaA.name} vs {metaB.name}
          </span>
          <span className={`text-xs font-medium ${style.color}`}>
            {conflict.conflicts.length} 处差异 · {severity === "low" ? "低" : severity === "medium" ? "中" : "高"}风险
          </span>
        </div>
        {conflict.status === "unresolved" ? (
          <button
            onClick={() => resolveConflict(conflict.id)}
            className="rounded-lg bg-violet-500 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-violet-600"
          >
            标记为已解决
          </button>
        ) : (
          <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
            已解决
          </span>
        )}
      </div>

      {conflict.conflicts.length > 0 && (
        <div className="max-h-64 divide-y divide-zinc-100 overflow-auto dark:divide-zinc-800">
          {conflict.conflicts.slice(0, 10).map((item, idx) => (
            <div key={idx} className="px-4 py-2 text-xs">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-zinc-400">行 {item.lineNumber}</span>
                <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                  item.type === "addition" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                  item.type === "deletion" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                  "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                }`}>
                  {item.type === "addition" ? "新增" : item.type === "deletion" ? "删除" : "修改"}
                </span>
              </div>
              {item.contentA && (
                <div className="rounded bg-red-50 px-2 py-1 font-mono text-red-700 dark:bg-red-950/20 dark:text-red-400 mb-1">
                  - {item.contentA}
                </div>
              )}
              {item.contentB && (
                <div className="rounded bg-green-50 px-2 py-1 font-mono text-green-700 dark:bg-green-950/20 dark:text-green-400 mb-1">
                  + {item.contentB}
                </div>
              )}
              <div className="text-zinc-500 dark:text-zinc-400 italic mt-1">{item.suggestion}</div>
            </div>
          ))}
          {conflict.conflicts.length > 10 && (
            <div className="px-4 py-2 text-xs text-zinc-500 text-center">
              还有 {conflict.conflicts.length - 10} 处差异未显示
            </div>
          )}
        </div>
      )}
    </div>
  );
}
