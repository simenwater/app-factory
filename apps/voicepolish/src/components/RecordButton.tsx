"use client";

import { Mic, Square } from "lucide-react";
import { useStore } from "@/store/useStore";

/**
 * @component RecordButton
 * 大号录音按钮，支持录音/停止切换，带脉冲动画
 */
export function RecordButton({
  onStart,
  onStop,
}: {
  onStart: () => void;
  onStop: () => void;
}) {
  const recordingStatus = useStore((s) => s.recordingStatus);
  const isRecording = recordingStatus === "recording";

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={isRecording ? onStop : onStart}
        disabled={recordingStatus === "processing"}
        className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
          isRecording
            ? "bg-red-500 hover:bg-red-600 scale-110"
            : "bg-gradient-to-br from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700"
        } ${recordingStatus === "processing" ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} shadow-lg hover:shadow-xl`}
        aria-label={isRecording ? "停止录音" : "开始录音"}
      >
        {isRecording && (
          <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-30" />
        )}
        {isRecording ? (
          <Square className="w-8 h-8 text-white" fill="white" />
        ) : (
          <Mic className="w-10 h-10 text-white" />
        )}
      </button>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        {recordingStatus === "idle" && "点击开始录音"}
        {recordingStatus === "recording" && "录音中...点击停止"}
        {recordingStatus === "processing" && "处理中..."}
        {recordingStatus === "done" && "录音完成"}
        {recordingStatus === "error" && "录音出错"}
      </p>
    </div>
  );
}
