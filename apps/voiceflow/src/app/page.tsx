"use client";

import { useState, useCallback } from "react";
import { Sparkles, AlertCircle } from "lucide-react";
import AudioUploader from "@/components/AudioUploader";
import PricingModal from "@/components/PricingModal";
import { useStore } from "@/store/useStore";
import { useRouter } from "next/navigation";

/**
 * @description 首页 - 语音上传与处理
 */
export default function HomePage() {
  const router = useRouter();
  const { addNote, updateNote, updateNoteStatus, incrementUsage, canUseService, settings } = useStore();
  const [processing, setProcessing] = useState(false);
  const [showPricing, setShowPricing] = useState(false);

  const remainingUses = settings.subscription === "free"
    ? settings.freeLimit - settings.usageCount
    : Infinity;

  /**
   * @description 处理音频上传并启动转录 + 总结流程
   */
  const handleUpload = useCallback(
    async ({ file, duration }: { file: File; duration: number }) => {
      if (!canUseService()) {
        setShowPricing(true);
        return;
      }

      setProcessing(true);

      const noteId = addNote({
        title: file.name.replace(/\.[^/.]+$/, ""),
        fileName: file.name,
        fileSize: file.size,
        duration,
        transcript: "",
        summary: "",
        keyPoints: [],
        actionItems: [],
        status: "uploading",
      });

      try {
        updateNoteStatus(noteId, "transcribing");

        const formData = new FormData();
        formData.append("audio", file);

        const transcribeRes = await fetch("/api/transcribe", {
          method: "POST",
          body: formData,
        });

        if (!transcribeRes.ok) throw new Error("转录失败");

        const { transcript } = await transcribeRes.json();
        updateNote(noteId, { transcript });
        updateNoteStatus(noteId, "summarizing");

        const summarizeRes = await fetch("/api/summarize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transcript }),
        });

        if (!summarizeRes.ok) throw new Error("总结失败");

        const { summary, keyPoints, actionItems, title } =
          await summarizeRes.json();

        updateNote(noteId, {
          title: title || file.name.replace(/\.[^/.]+$/, ""),
          summary,
          keyPoints,
          actionItems,
          status: "completed",
        });

        incrementUsage();
        router.push(`/notes/${noteId}`);
      } catch {
        updateNoteStatus(noteId, "error");
      } finally {
        setProcessing(false);
      }
    },
    [addNote, updateNote, updateNoteStatus, incrementUsage, canUseService, router]
  );

  return (
    <div className="px-4 pt-12">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">AI 语音整理</span>
        </div>
        <h1 className="mb-2 text-3xl font-bold text-text">VoiceFlow</h1>
        <p className="text-text-muted">
          将语音笔记瞬间转化为结构化文本
        </p>
      </div>

      {/* 使用次数提示 */}
      {settings.subscription === "free" && (
        <div className="mb-6 flex items-center gap-2 rounded-xl bg-surface p-3">
          <AlertCircle className="h-4 w-4 flex-shrink-0 text-amber-500" />
          <p className="text-sm text-text-muted">
            免费试用剩余 <span className="font-semibold text-text">{remainingUses}</span> 次
            <button
              onClick={() => setShowPricing(true)}
              className="ml-2 text-primary hover:underline"
            >
              升级解锁
            </button>
          </p>
        </div>
      )}

      {/* 上传区域 */}
      <AudioUploader onUpload={handleUpload} disabled={processing} />

      {/* 处理中状态 */}
      {processing && (
        <div className="mt-6 flex flex-col items-center">
          <div className="mb-3 flex items-end gap-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="wave-bar h-8 w-1.5 rounded-full bg-primary"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
          <p className="text-sm font-medium text-text">处理中...</p>
          <p className="text-xs text-text-muted">
            AI 正在转录并分析您的语音笔记
          </p>
        </div>
      )}

      {/* 功能介绍 */}
      {!processing && (
        <div className="mt-10 grid grid-cols-3 gap-3">
          {[
            { icon: "🎙️", title: "高精度转录", desc: "支持多语言" },
            { icon: "🧠", title: "AI 智能分析", desc: "提取关键信息" },
            { icon: "📤", title: "一键导出", desc: "多格式支持" },
          ].map((f) => (
            <div
              key={f.title}
              className="flex flex-col items-center rounded-xl bg-surface p-4 text-center"
            >
              <span className="mb-2 text-2xl">{f.icon}</span>
              <p className="text-xs font-medium text-text">{f.title}</p>
              <p className="text-xs text-text-muted">{f.desc}</p>
            </div>
          ))}
        </div>
      )}

      {showPricing && <PricingModal onClose={() => setShowPricing(false)} />}
    </div>
  );
}
