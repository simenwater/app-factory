"use client";

import { useStore } from "@/store/useStore";
import {
  GitBranch,
  Code2,
  Package,
  FlaskConical,
  GitPullRequest,
  FolderTree,
} from "lucide-react";

/**
 * @description 仓库分析结果摘要卡片
 */
export function RepoSummary() {
  const repoInfo = useStore((s) => s.repoInfo);
  if (!repoInfo) return null;

  const stats = [
    { icon: Code2, label: "语言", value: repoInfo.language },
    { icon: Package, label: "框架", value: repoInfo.framework || "N/A" },
    {
      icon: GitBranch,
      label: "包管理器",
      value: repoInfo.packageManager || "N/A",
    },
    {
      icon: FolderTree,
      label: "文件数",
      value: repoInfo.files.length.toLocaleString(),
    },
    {
      icon: FlaskConical,
      label: "测试",
      value: repoInfo.hasTests ? "有" : "无",
    },
    {
      icon: GitPullRequest,
      label: "CI/CD",
      value: repoInfo.hasCi ? "有" : "无",
    },
  ];

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 dark:border-border-dark dark:bg-surface-dark">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
          <Code2 className="h-5 w-5 text-success" />
        </div>
        <div>
          <h3 className="font-bold text-text dark:text-text-dark">
            {repoInfo.owner}/{repoInfo.name}
          </h3>
          {repoInfo.description && (
            <p className="text-xs text-text-muted dark:text-text-muted-dark">
              {repoInfo.description}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg bg-bg p-2.5 dark:bg-bg-dark"
          >
            <div className="flex items-center gap-1.5 text-text-muted dark:text-text-muted-dark">
              <stat.icon className="h-3.5 w-3.5" />
              <span className="text-[10px] font-medium uppercase tracking-wide">
                {stat.label}
              </span>
            </div>
            <div className="mt-1 text-sm font-semibold text-text dark:text-text-dark">
              {stat.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
