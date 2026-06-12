"use client";

import { useCallback } from "react";
import { AudioRecorder } from "@/components/AudioRecorder";
import { TemplateSelector } from "@/components/TemplateSelector";
import { ResultDisplay } from "@/components/ResultDisplay";
import { SubscriptionBanner } from "@/components/SubscriptionBanner";
import { useStore } from "@/store/useStore";
import { generateId } from "@/lib/utils";
import type { Recording } from "@/types";

/**
 * @description 主页 — 语音录制和结构化输出页面
 */
export default function HomePage() {
  const status = useStore((s) => s.currentStatus);
  const selectedTemplate = useStore((s) => s.selectedTemplate);
  const setStatus = useStore((s) => s.setStatus);
  const setCurrentTranscript = useStore((s) => s.setCurrentTranscript);
  const setCurrentFormatted = useStore((s) => s.setCurrentFormatted);
  const setErrorMessage = useStore((s) => s.setErrorMessage);
  const addRecording = useStore((s) => s.addRecording);
  const incrementUsage = useStore((s) => s.incrementUsage);
  const duration = useStore((s) => s.recordingDuration);

  /**
   * @description 处理录音完成事件：转写 → 格式化 → 保存
   * @param {Blob} audioBlob - 录制的音频 Blob
   */
  const handleRecordingComplete = useCallback(
    async (audioBlob: Blob) => {
      try {
        setStatus("transcribing");

        const formData = new FormData();
        formData.append("audio", audioBlob, "recording.webm");

        const transcribeRes = await fetch("/api/transcribe", {
          method: "POST",
          body: formData,
        });

        const transcribeData = await transcribeRes.json();

        if (!transcribeRes.ok) {
          throw new Error(transcribeData.error || "转写失败");
        }

        const transcript = transcribeData.transcript;
        setCurrentTranscript(transcript);

        setStatus("formatting");

        const formatRes = await fetch("/api/format", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            transcript,
            template: selectedTemplate,
          }),
        });

        const formatData = await formatRes.json();

        if (!formatRes.ok) {
          throw new Error(formatData.error || "格式化失败");
        }

        const formatted = formatData.formatted;
        setCurrentFormatted(formatted);

        const recording: Recording = {
          id: generateId(),
          transcript,
          formatted,
          template: selectedTemplate,
          language: "auto",
          duration,
          createdAt: new Date().toISOString(),
        };

        addRecording(recording);
        incrementUsage();
        setStatus("done");
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "处理录音时发生未知错误"
        );
        setStatus("error");
      }
    },
    [
      selectedTemplate,
      duration,
      setStatus,
      setCurrentTranscript,
      setCurrentFormatted,
      setErrorMessage,
      addRecording,
      incrementUsage,
    ]
  );

  return (
    <div className="space-y-6 px-4 pt-6">
      <header className="text-center">
        <h1 className="text-2xl font-bold text-text dark:text-text-dark">
          VoiceStruct
        </h1>
        <p className="mt-1 text-sm text-text-muted dark:text-text-muted-dark">
          语音笔记，智能结构化
        </p>
      </header>

      <SubscriptionBanner />

      {status === "idle" || status === "recording" ? (
        <>
          <TemplateSelector />
          <div className="flex justify-center pt-4">
            <AudioRecorder onRecordingComplete={handleRecordingComplete} />
          </div>
        </>
      ) : (
        <ResultDisplay />
      )}
    </div>
  );
}
