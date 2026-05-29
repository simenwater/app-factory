"use client";

import { useState, useRef, useCallback } from "react";
import { Mic, Square, Loader2 } from "lucide-react";
import { useAppStore } from "@/store";
import { transcribeAudio } from "@/lib/transcription";
import { generateSummary } from "@/lib/summary";
import type { VoiceNote } from "@/types";

/**
 * @description 录音按钮组件 - 支持录制、停止和处理
 */
export function RecordButton() {
  const {
    recordingStatus,
    setRecordingStatus,
    addNote,
    subscription,
    updateSubscription,
  } = useAppStore();

  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef<number>(0);

  const canRecord =
    subscription.plan !== "free" ||
    subscription.usedTranscriptions < subscription.maxFreeTranscriptions;

  /**
   * @description 开始录音
   */
  const startRecording = useCallback(async () => {
    if (!canRecord) {
      setError("免费额度已用完，请升级订阅");
      return;
    }

    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });

      chunksRef.current = [];
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.start(1000);
      startTimeRef.current = Date.now();
      setRecordingStatus("recording");
    } catch (err) {
      setError("无法访问麦克风，请检查权限设置");
      console.error("Recording error:", err);
    }
  }, [canRecord, setRecordingStatus]);

  /**
   * @description 停止录音并处理
   */
  const stopRecording = useCallback(async () => {
    if (!mediaRecorderRef.current) return;

    setRecordingStatus("processing");

    const recorder = mediaRecorderRef.current;
    recorder.stop();
    recorder.stream.getTracks().forEach((track) => track.stop());

    await new Promise<void>((resolve) => {
      recorder.onstop = () => resolve();
    });

    const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
    const duration = (Date.now() - startTimeRef.current) / 1000;

    try {
      const transcription = await transcribeAudio(audioBlob);
      const summary = await generateSummary(transcription.text);

      const note: VoiceNote = {
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
        transcription: { ...transcription, duration },
        summary,
      };

      addNote(note);
      updateSubscription({
        usedTranscriptions: subscription.usedTranscriptions + 1,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "处理失败");
    } finally {
      setRecordingStatus("idle");
    }
  }, [addNote, setRecordingStatus, subscription, updateSubscription]);

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={recordingStatus === "recording" ? stopRecording : startRecording}
        disabled={recordingStatus === "processing" || !canRecord}
        className={`relative flex h-20 w-20 items-center justify-center rounded-full transition-all ${
          recordingStatus === "recording"
            ? "animate-pulse-recording bg-[var(--danger)] text-white shadow-lg shadow-red-500/30"
            : recordingStatus === "processing"
              ? "bg-[var(--secondary)] text-[var(--muted)]"
              : "bg-[var(--primary)] text-white shadow-lg shadow-indigo-500/30 hover:bg-[var(--primary-hover)] hover:scale-105"
        } disabled:opacity-50 disabled:cursor-not-allowed`}
        aria-label={recordingStatus === "recording" ? "停止录音" : "开始录音"}
      >
        {recordingStatus === "processing" ? (
          <Loader2 className="h-8 w-8 animate-spin" />
        ) : recordingStatus === "recording" ? (
          <Square className="h-7 w-7" />
        ) : (
          <Mic className="h-8 w-8" />
        )}
      </button>

      <p className="text-sm text-[var(--muted)]">
        {recordingStatus === "recording"
          ? "正在录音，点击停止..."
          : recordingStatus === "processing"
            ? "AI 正在处理..."
            : "点击开始录音"}
      </p>

      {recordingStatus === "recording" && (
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="wave-bar w-1 rounded-full bg-[var(--danger)]"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      )}

      {error && (
        <p className="text-sm text-[var(--danger)]">{error}</p>
      )}

      {!canRecord && (
        <button className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm text-white transition-colors hover:bg-[var(--primary-hover)]">
          升级订阅 - $9.9/月
        </button>
      )}
    </div>
  );
}
