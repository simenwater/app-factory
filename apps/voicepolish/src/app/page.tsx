"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { RecordButton } from "@/components/RecordButton";
import { TranscriptEditor } from "@/components/TranscriptEditor";
import { FormatSelector } from "@/components/FormatSelector";
import { PolishResult } from "@/components/PolishResult";
import { UsageBar } from "@/components/UsageBar";
import { SubscriptionBanner } from "@/components/SubscriptionBanner";
import { AudioRecorder } from "@/lib/recorder";
import { transcribeAudio, polishTranscript } from "@/lib/aiService";
import { generateId, formatDuration } from "@/lib/utils";
import { useStore } from "@/store/useStore";
import { Sparkles } from "lucide-react";

/**
 * @page HomePage
 * 首页：录音、转录、润色一站式操作
 */
export default function HomePage() {
  const recorderRef = useRef<AudioRecorder | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [polishedContent, setPolishedContent] = useState("");

  const {
    currentTranscript,
    setCurrentTranscript,
    recordingStatus,
    setRecordingStatus,
    recordingDuration,
    setRecordingDuration,
    selectedFormat,
    isPolishing,
    setIsPolishing,
    addNote,
    addMinutesUsed,
    error,
    setError,
  } = useStore();

  /**
   * @function startRecording
   * 开始录音并启动计时器
   */
  const startRecording = useCallback(async () => {
    try {
      setError(null);
      setPolishedContent("");
      setCurrentTranscript("");
      setRecordingDuration(0);

      const recorder = new AudioRecorder();
      recorderRef.current = recorder;
      await recorder.start();

      setRecordingStatus("recording");

      timerRef.current = setInterval(() => {
        setRecordingDuration(useStore.getState().recordingDuration + 1);
      }, 1000);
    } catch {
      setError("无法访问麦克风，请检查浏览器权限设置");
      setRecordingStatus("error");
    }
  }, [setError, setCurrentTranscript, setRecordingDuration, setRecordingStatus]);

  /**
   * @function stopRecording
   * 停止录音，转录音频
   */
  const stopRecording = useCallback(async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (!recorderRef.current) return;

    setRecordingStatus("processing");

    try {
      const audioBlob = await recorderRef.current.stop();
      const durationMinutes = Math.ceil(
        useStore.getState().recordingDuration / 60
      );
      addMinutesUsed(durationMinutes);

      const transcript = await transcribeAudio(audioBlob);
      setCurrentTranscript(transcript);
      setRecordingStatus("done");
    } catch {
      setError("转录失败，请重试。您也可以直接粘贴文本。");
      setRecordingStatus("error");
    }
  }, [setRecordingStatus, setCurrentTranscript, addMinutesUsed, setError]);

  /**
   * @function handlePolish
   * 调用 AI 润色接口
   */
  const handlePolish = useCallback(async () => {
    if (!currentTranscript.trim()) return;

    setIsPolishing(true);
    setError(null);

    try {
      const result = await polishTranscript(currentTranscript, selectedFormat);
      setPolishedContent(result);

      const note = {
        id: generateId(),
        title: currentTranscript.slice(0, 30),
        rawTranscript: currentTranscript,
        polishedOutputs: [
          {
            id: generateId(),
            format: selectedFormat,
            content: result,
            createdAt: new Date().toISOString(),
          },
        ],
        duration: recordingDuration,
        createdAt: new Date().toISOString(),
      };
      addNote(note);
    } catch {
      setError("润色失败，请重试");
    } finally {
      setIsPolishing(false);
    }
  }, [
    currentTranscript,
    selectedFormat,
    recordingDuration,
    setIsPolishing,
    setError,
    addNote,
  ]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="px-4 md:px-8 py-8 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
          语音笔记润色
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          录制或粘贴文本，AI 帮你自动整理成各种格式
        </p>
      </div>

      <UsageBar />

      <div className="flex flex-col items-center gap-2">
        <RecordButton onStart={startRecording} onStop={stopRecording} />
        {recordingStatus === "recording" && (
          <div className="flex items-center gap-3">
            <div className="flex items-end gap-0.5 h-8">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-red-500 rounded-full waveform-bar"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
            <span className="text-lg font-mono text-red-500 font-medium">
              {formatDuration(recordingDuration)}
            </span>
          </div>
        )}
      </div>

      <TranscriptEditor />

      {(currentTranscript || recordingStatus === "done") && (
        <>
          <FormatSelector />

          <div className="flex justify-center">
            <button
              onClick={handlePolish}
              disabled={!currentTranscript.trim() || isPolishing}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 text-white font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-5 h-5" />
              {isPolishing ? "润色中..." : "AI 润色"}
            </button>
          </div>
        </>
      )}

      {polishedContent && (
        <PolishResult
          content={polishedContent}
          format={selectedFormat}
          onRegenerate={handlePolish}
          isLoading={isPolishing}
        />
      )}

      {error && (
        <div className="w-full max-w-2xl mx-auto p-4 rounded-xl bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      )}

      <SubscriptionBanner />
    </div>
  );
}
