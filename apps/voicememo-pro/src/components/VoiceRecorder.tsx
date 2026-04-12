"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Mic, Square, Upload, Loader2 } from "lucide-react";
import { useStore } from "@/store/useStore";
import { generateId, formatDuration } from "@/lib/utils";

/**
 * @component VoiceRecorder
 * @description 语音录音器，支持实时录音和文件上传，集成 Whisper 转录
 */
export function VoiceRecorder() {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const isRecording = useStore((s) => s.isRecording);
  const isTranscribing = useStore((s) => s.isTranscribing);
  const recordingDuration = useStore((s) => s.recordingDuration);
  const setRecording = useStore((s) => s.setRecording);
  const setTranscribing = useStore((s) => s.setTranscribing);
  const setRecordingDuration = useStore((s) => s.setRecordingDuration);
  const addMemo = useStore((s) => s.addMemo);
  const setCurrentMemo = useStore((s) => s.setCurrentMemo);
  const incrementMinutesUsed = useStore((s) => s.incrementMinutesUsed);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  /**
   * @function transcribeAudio
   * @description 调用 Whisper API 将音频转为文字
   */
  const transcribeAudio = useCallback(
    async (audioBlob: Blob) => {
      setTranscribing(true);
      try {
        const formData = new FormData();
        formData.append("audio", audioBlob, "recording.webm");

        const res = await fetch("/api/transcribe", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!data.success) {
          setErrorMsg(data.error || "转录失败");
          return;
        }

        const now = new Date().toISOString();
        const duration = data.duration || useStore.getState().recordingDuration;
        const memo = {
          id: generateId(),
          title: `录音 ${new Date().toLocaleString("zh-CN")}`,
          originalText: data.text,
          duration,
          createdAt: now,
          updatedAt: now,
        };

        addMemo(memo);
        setCurrentMemo(memo);
        incrementMinutesUsed(Math.ceil(duration / 60));
      } catch {
        setErrorMsg("转录请求失败，请稍后重试");
      } finally {
        setTranscribing(false);
      }
    },
    [setTranscribing, addMemo, setCurrentMemo, incrementMinutesUsed]
  );

  /**
   * @function startRecording
   * @description 开始录音
   */
  const startRecording = useCallback(async () => {
    try {
      setErrorMsg("");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        await transcribeAudio(audioBlob);
      };

      mediaRecorder.start();
      setRecording(true);
      setRecordingDuration(0);

      timerRef.current = setInterval(() => {
        useStore.setState((s) => ({
          recordingDuration: s.recordingDuration + 1,
        }));
      }, 1000);
    } catch {
      setErrorMsg("无法访问麦克风，请检查权限设置");
    }
  }, [setRecording, setRecordingDuration, transcribeAudio]);

  /**
   * @function stopRecording
   * @description 停止录音
   */
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [isRecording, setRecording]);

  /**
   * @function handleFileUpload
   * @description 处理音频文件上传
   */
  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setErrorMsg("");
      await transcribeAudio(file);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [transcribeAudio]
  );

  return (
    <div className="flex flex-col items-center gap-6">
      {/* 录音按钮 */}
      <div className="relative">
        {isRecording && (
          <div className="absolute inset-0 rounded-full bg-red-400/30 animate-ping" />
        )}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isTranscribing}
          className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
            isRecording
              ? "bg-red-500 hover:bg-red-600 scale-110"
              : isTranscribing
              ? "bg-slate-400 cursor-not-allowed"
              : "bg-gradient-to-br from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 hover:scale-105"
          }`}
          aria-label={isRecording ? "停止录音" : "开始录音"}
        >
          {isTranscribing ? (
            <Loader2 className="w-10 h-10 text-white animate-spin" />
          ) : isRecording ? (
            <Square className="w-8 h-8 text-white" />
          ) : (
            <Mic className="w-10 h-10 text-white" />
          )}
        </button>
      </div>

      {/* 录音时长 */}
      {isRecording && (
        <div className="text-2xl font-mono text-red-500 dark:text-red-400 font-semibold">
          {formatDuration(recordingDuration)}
        </div>
      )}

      {/* 状态文字 */}
      <p className="text-sm text-slate-500 dark:text-slate-400">
        {isTranscribing
          ? "AI 正在转录中..."
          : isRecording
          ? "正在录音，点击停止"
          : "点击开始录音，或上传音频文件"}
      </p>

      {/* 上传按钮 */}
      {!isRecording && !isTranscribing && (
        <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors text-sm">
          <Upload className="w-4 h-4" />
          上传音频文件
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>
      )}

      {/* 错误提示 */}
      {errorMsg && (
        <p className="text-sm text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg">
          {errorMsg}
        </p>
      )}
    </div>
  );
}
