"use client";

import { useStore } from "@/store/useStore";
import { generateAgentsFile } from "@/lib/generator";
import { Sparkles, Loader2 } from "lucide-react";

/**
 * @description 一键生成按钮组件
 */
export function GenerateButton() {
  const repoUrl = useStore((s) => s.repoUrl);
  const repoInfo = useStore((s) => s.repoInfo);
  const format = useStore((s) => s.format);
  const options = useStore((s) => s.options);
  const loading = useStore((s) => s.loading);
  const setResult = useStore((s) => s.setResult);
  const setLoading = useStore((s) => s.setLoading);
  const setError = useStore((s) => s.setError);
  const incrementGeneration = useStore((s) => s.incrementGeneration);

  const canGenerate = repoInfo !== null && !loading;

  /**
   * @description 执行生成
   */
  function handleGenerate() {
    if (!canGenerate || !repoInfo) return;

    setLoading(true);
    setError(null);

    try {
      const result = generateAgentsFile(repoInfo, {
        repoUrl,
        format,
        ...options,
      });
      setResult(result);
      incrementGeneration();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleGenerate}
      disabled={!canGenerate}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent py-3.5 text-base font-bold text-white shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <>
          <Sparkles className="h-5 w-5" />
          生成配置文件
        </>
      )}
    </button>
  );
}
