"use client";

/**
 * @fileoverview 冲突检测页面
 * 展示配置文件之间的冲突并提供合并建议
 */

import { useStore } from "@/store/useStore";
import ConflictViewer from "@/components/ConflictViewer";
import { GitCompare, AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";

/**
 * 冲突检测页面组件
 * @returns JSX 元素
 */
export default function ConflictsPage() {
  const { generatedConfigs, conflictResults, runConflictDetection } = useStore();

  const unresolvedCount = conflictResults.filter((c) => c.status === "unresolved").length;
  const hasConflicts = conflictResults.length > 0;

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">冲突检测</h1>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">
          智能检测不同 AI 助手配置文件之间的差异，提供合并建议
        </p>
      </div>

      {generatedConfigs.length < 2 ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
            <GitCompare size={28} className="text-zinc-400" />
          </div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">尚无配置文件</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-zinc-600 dark:text-zinc-400">
            请先扫描项目并生成至少两个不同 AI 助手的配置文件，然后即可进行冲突检测
          </p>
          <Link
            href="/scan"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-violet-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-600"
          >
            前往扫描
            <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* 操作栏 */}
          <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center gap-3">
              {hasConflicts && unresolvedCount > 0 && (
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                  <AlertTriangle size={16} />
                  <span className="text-sm font-medium">{unresolvedCount} 个未解决的冲突</span>
                </div>
              )}
              {hasConflicts && unresolvedCount === 0 && (
                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                  所有冲突已解决
                </span>
              )}
              {!hasConflicts && (
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  已生成 {generatedConfigs.length} 个配置文件，点击运行冲突检测
                </span>
              )}
            </div>
            <button
              onClick={runConflictDetection}
              className="flex items-center gap-2 rounded-lg bg-violet-500 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-600"
            >
              <GitCompare size={16} />
              {hasConflicts ? "重新检测" : "运行检测"}
            </button>
          </div>

          {/* 冲突列表 */}
          {hasConflicts && (
            <div className="space-y-4">
              {conflictResults.map((conflict) => (
                <ConflictViewer key={conflict.id} conflict={conflict} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
