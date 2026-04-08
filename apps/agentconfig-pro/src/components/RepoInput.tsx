"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { parseGitHubUrl } from "@/lib/analyzer";
import { Github, Loader2, ArrowRight } from "lucide-react";

/**
 * @description GitHub 仓库 URL 输入组件
 */
export function RepoInput() {
  const repoUrl = useStore((s) => s.repoUrl);
  const setRepoUrl = useStore((s) => s.setRepoUrl);
  const setRepoInfo = useStore((s) => s.setRepoInfo);
  const setLoading = useStore((s) => s.setLoading);
  const setError = useStore((s) => s.setError);
  const loading = useStore((s) => s.loading);
  const [inputFocused, setInputFocused] = useState(false);

  const isValid = repoUrl.trim() !== "" && parseGitHubUrl(repoUrl) !== null;

  /**
   * @description 分析仓库
   */
  async function handleAnalyze() {
    if (!isValid) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to analyze repository");
      }

      setRepoInfo(data.repoInfo);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-text dark:text-text-dark">
        GitHub 仓库 URL
      </label>
      <div
        className={`flex items-center gap-2 rounded-xl border-2 bg-surface px-4 py-3 transition-all dark:bg-surface-dark ${
          inputFocused
            ? "border-primary shadow-lg shadow-primary/10"
            : "border-border dark:border-border-dark"
        }`}
      >
        <Github className="h-5 w-5 shrink-0 text-text-muted dark:text-text-muted-dark" />
        <input
          type="text"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          onFocus={() => setInputFocused(true)}
          onBlur={() => setInputFocused(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && isValid && !loading) handleAnalyze();
          }}
          placeholder="https://github.com/owner/repo"
          className="flex-1 bg-transparent text-sm text-text outline-none placeholder:text-text-muted/50 dark:text-text-dark"
        />
        <button
          onClick={handleAnalyze}
          disabled={!isValid || loading}
          className="flex shrink-0 items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-all hover:bg-primary-dark disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              分析
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
      <p className="text-xs text-text-muted dark:text-text-muted-dark">
        支持格式：https://github.com/owner/repo 或 owner/repo
      </p>
    </div>
  );
}
