"use client";

import { VoiceRecorder } from "@/components/VoiceRecorder";
import { RewritePanel } from "@/components/RewritePanel";
import { UsageBanner } from "@/components/UsageBanner";
import { useStore } from "@/store/useStore";
import { Mic, Sparkles, ArrowRight } from "lucide-react";

/**
 * @component HomePage
 * @description 首页 — 语音录音 + AI 重写工作区
 */
export default function HomePage() {
  const currentMemo = useStore((s) => s.currentMemo);

  return (
    <div className="space-y-8 fade-in">
      {/* 欢迎区域 */}
      {!currentMemo && (
        <div className="text-center space-y-3 py-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            语音 → 专业内容
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            录制语音或上传音频，AI 帮你一键转化为 LinkedIn 帖子、博客文章、营销邮件
          </p>
        </div>
      )}

      {/* 使用额度 */}
      <UsageBanner />

      {/* 录音区域 */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <VoiceRecorder />
      </div>

      {/* AI 重写面板 */}
      {currentMemo && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 fade-in">
          <RewritePanel />
        </div>
      )}

      {/* 功能介绍（仅首次展示） */}
      {!currentMemo && (
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <FeatureCard
            icon={<Mic className="w-6 h-6 text-violet-500" />}
            title="智能转录"
            desc="Whisper AI 驱动，支持多种语言的高精度语音识别"
          />
          <FeatureCard
            icon={<Sparkles className="w-6 h-6 text-indigo-500" />}
            title="风格重写"
            desc="专业、休闲、营销三种风格，适配不同场景需求"
          />
          <FeatureCard
            icon={<ArrowRight className="w-6 h-6 text-blue-500" />}
            title="一键发布"
            desc="预设 LinkedIn、博客、邮件等格式，复制即可发布"
          />
        </div>
      )}
    </div>
  );
}

/**
 * @component FeatureCard
 * @description 功能介绍卡片
 */
function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 space-y-3">
      <div className="w-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-700 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="font-semibold text-slate-800 dark:text-slate-200">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400">{desc}</p>
    </div>
  );
}
