"use client";

import { useState } from "react";
import { Sparkles, Loader2, Copy, Check, RotateCcw } from "lucide-react";
import { useStore } from "@/store/useStore";
import { ToneSelector } from "./ToneSelector";
import { PlatformSelector } from "./PlatformSelector";
import { wordCount } from "@/lib/utils";
import type { ToneStyle, PlatformFormat } from "@/types";

/**
 * @component RewritePanel
 * @description AI 重写控制面板，包含语气选择、平台选择和重写操作
 */
export function RewritePanel() {
  const currentMemo = useStore((s) => s.currentMemo);
  const settings = useStore((s) => s.settings);
  const isRewriting = useStore((s) => s.isRewriting);
  const setRewriting = useStore((s) => s.setRewriting);
  const updateMemo = useStore((s) => s.updateMemo);

  const [tone, setTone] = useState<ToneStyle>(settings.defaultTone);
  const [platform, setPlatform] = useState<PlatformFormat>(settings.defaultPlatform);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  if (!currentMemo) return null;

  /**
   * @function handleRewrite
   * @description 调用 AI 重写 API
   */
  const handleRewrite = async () => {
    setRewriting(true);
    setError("");
    try {
      const res = await fetch("/api/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: currentMemo.originalText,
          tone,
          platform,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.error || "重写失败");
        return;
      }

      updateMemo(currentMemo.id, {
        rewrittenText: data.rewrittenText,
        toneStyle: tone,
        platformFormat: platform,
      });
    } catch {
      setError("重写请求失败，请稍后重试");
    } finally {
      setRewriting(false);
    }
  };

  /**
   * @function handleCopy
   * @description 复制重写结果到剪贴板
   */
  const handleCopy = async () => {
    if (!currentMemo.rewrittenText) return;
    await navigator.clipboard.writeText(currentMemo.rewrittenText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* 原始文本预览 */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            转录原文
          </h3>
          <span className="text-xs text-slate-400">
            {wordCount(currentMemo.originalText)} 字
          </span>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto">
          {currentMemo.originalText}
        </p>
      </div>

      {/* 风格与格式选择 */}
      <ToneSelector selected={tone} onChange={setTone} />
      <PlatformSelector selected={platform} onChange={setPlatform} />

      {/* 重写按钮 */}
      <button
        onClick={handleRewrite}
        disabled={isRewriting}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-500/25"
      >
        {isRewriting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            AI 正在重写...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            AI 智能重写
          </>
        )}
      </button>

      {/* 错误提示 */}
      {error && (
        <p className="text-sm text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg">
          {error}
        </p>
      )}

      {/* 重写结果 */}
      {currentMemo.rewrittenText && (
        <div className="bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20 rounded-xl p-4 space-y-3 border border-violet-200 dark:border-violet-800">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-violet-700 dark:text-violet-300">
              重写结果
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-violet-400">
                {wordCount(currentMemo.rewrittenText)} 字
              </span>
              <button
                onClick={handleRewrite}
                disabled={isRewriting}
                className="p-1.5 rounded-lg hover:bg-violet-100 dark:hover:bg-violet-800/50 transition-colors"
                title="重新生成"
              >
                <RotateCcw className="w-4 h-4 text-violet-500" />
              </button>
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-lg hover:bg-violet-100 dark:hover:bg-violet-800/50 transition-colors"
                title="复制"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4 text-violet-500" />
                )}
              </button>
            </div>
          </div>
          <div className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
            {currentMemo.rewrittenText}
          </div>
        </div>
      )}
    </div>
  );
}
