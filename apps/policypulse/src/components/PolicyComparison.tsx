"use client";

import { useState } from "react";
import { FileText, Sparkles, Lock } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/store/useStore";

/**
 * @component PolicyComparison
 * 政策原文与 AI 解读对照组件
 * @param {Object} props
 * @param {string} props.originalText - 政策原文
 * @param {string} props.aiInterpretation - AI 解读
 */
export function PolicyComparison({
  originalText,
  aiInterpretation,
}: {
  originalText: string;
  aiInterpretation: string;
}) {
  const [activeTab, setActiveTab] = useState<"comparison" | "original" | "ai">(
    "comparison"
  );
  const tier = useStore((s) => s.settings.subscriptionTier);
  const isPro = tier === "pro";

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab("comparison")}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === "comparison"
              ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50 dark:bg-blue-950/30"
              : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
          }`}
        >
          对照视图
        </button>
        <button
          onClick={() => setActiveTab("original")}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === "original"
              ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50 dark:bg-blue-950/30"
              : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
          }`}
        >
          原文
        </button>
        <button
          onClick={() => setActiveTab("ai")}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === "ai"
              ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50 dark:bg-blue-950/30"
              : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
          }`}
        >
          AI 解读
        </button>
      </div>

      {activeTab === "comparison" && (
        <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800">
          <div className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-slate-400" />
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                政策原文
              </h4>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
              {originalText}
            </p>
          </div>
          <div className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <h4 className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                AI 人话解读
              </h4>
            </div>
            {isPro ? (
              <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                {aiInterpretation}
              </div>
            ) : (
              <div className="relative">
                <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap line-clamp-4">
                  {aiInterpretation}
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/80 to-white dark:via-slate-900/80 dark:to-slate-900 flex flex-col items-center justify-end pb-4">
                  <Lock className="w-5 h-5 text-slate-400 mb-2" />
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                    升级专业版查看完整 AI 解读
                  </p>
                  <Link
                    href="/pricing"
                    className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    立即升级
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "original" && (
        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-slate-400" />
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              政策原文
            </h4>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
            {originalText}
          </p>
        </div>
      )}

      {activeTab === "ai" && (
        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <h4 className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              AI 人话解读
            </h4>
          </div>
          {isPro ? (
            <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
              {aiInterpretation}
            </div>
          ) : (
            <div className="text-center py-8">
              <Lock className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500 dark:text-slate-400 mb-3">
                完整 AI 解读为专业版功能
              </p>
              <Link
                href="/pricing"
                className="inline-block px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                升级专业版 — $14.99/月
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
