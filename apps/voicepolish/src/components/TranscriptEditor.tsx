"use client";

import { useStore } from "@/store/useStore";

/**
 * @component TranscriptEditor
 * 转录文本编辑器，允许用户查看和编辑 AI 转录结果
 */
export function TranscriptEditor() {
  const currentTranscript = useStore((s) => s.currentTranscript);
  const setCurrentTranscript = useStore((s) => s.setCurrentTranscript);
  const recordingStatus = useStore((s) => s.recordingStatus);

  if (!currentTranscript && recordingStatus !== "processing") {
    return null;
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
        转录文本
      </label>
      {recordingStatus === "processing" ? (
        <div className="w-full h-40 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce [animation-delay:150ms]" />
            <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce [animation-delay:300ms]" />
            <span className="text-sm text-slate-500 dark:text-slate-400 ml-2">
              正在转录音频...
            </span>
          </div>
        </div>
      ) : (
        <textarea
          value={currentTranscript}
          onChange={(e) => setCurrentTranscript(e.target.value)}
          placeholder="转录文本将在此处显示，您也可以直接粘贴文本..."
          className="w-full h-40 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 resize-none focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
        />
      )}
    </div>
  );
}
