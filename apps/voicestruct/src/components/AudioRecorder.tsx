"use client";

import { useRef, useCallback, useEffect } from "react";
import { Mic, Square } from "lucide-react";
import { useStore } from "@/store/useStore";
import { formatDuration } from "@/lib/utils";

/**
 * @description 音频录制组件，使用 MediaRecorder API 捕获麦克风输入
 */
export function AudioRecorder({
  onRecordingComplete,
}: {
  onRecordingComplete: (blob: Blob) => void;
}) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const status = useStore((s) => s.currentStatus);
  const duration = useStore((s) => s.recordingDuration);
  const setStatus = useStore((s) => s.setStatus);
  const setDuration = useStore((s) => s.setRecordingDuration);
  const setError = useStore((s) => s.setErrorMessage);
  const isFreeLimitReached = useStore((s) => s.isFreeLimitReached);

  const isRecording = status === "recording";

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  /**
   * @description 开始录音
   */
  const startRecording = useCallback(async () => {
    if (isFreeLimitReached()) {
      setError("免费试用次数已用完，请升级到 Pro 版本继续使用。");
      setStatus("error");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
          ? "audio/webm;codecs=opus"
          : "audio/webm",
      });

      chunksRef.current = [];
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        stream.getTracks().forEach((track) => track.stop());
        if (timerRef.current) clearInterval(timerRef.current);
        onRecordingComplete(blob);
      };

      mediaRecorder.start(1000);
      setStatus("recording");
      setDuration(0);

      timerRef.current = setInterval(() => {
        setDuration(useStore.getState().recordingDuration + 1);
      }, 1000);
    } catch {
      setError("无法访问麦克风，请检查浏览器权限设置。");
      setStatus("error");
    }
  }, [isFreeLimitReached, onRecordingComplete, setStatus, setDuration, setError]);

  /**
   * @description 停止录音
   */
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  }, []);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        {isRecording && (
          <>
            <div className="animate-pulse-ring absolute inset-0 rounded-full bg-recording/30" />
            <div
              className="animate-pulse-ring absolute inset-0 rounded-full bg-recording/20"
              style={{ animationDelay: "0.5s" }}
            />
          </>
        )}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`relative z-10 flex h-24 w-24 items-center justify-center rounded-full shadow-lg transition-all active:scale-95 ${
            isRecording
              ? "bg-recording text-white"
              : "bg-primary text-white hover:bg-primary-dark"
          }`}
          aria-label={isRecording ? "停止录音" : "开始录音"}
        >
          {isRecording ? <Square size={32} /> : <Mic size={32} />}
        </button>
      </div>

      {isRecording && (
        <div className="flex items-center gap-3">
          <div className="flex items-end gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="animate-wave w-1 rounded-full bg-recording"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
          <span className="font-mono text-lg font-semibold text-recording">
            {formatDuration(duration)}
          </span>
        </div>
      )}

      {!isRecording && status === "idle" && (
        <p className="text-sm text-text-muted dark:text-text-muted-dark">
          点击按钮开始录音
        </p>
      )}
    </div>
  );
}
