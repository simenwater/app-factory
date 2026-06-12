"use client";

import { useState } from "react";
import { Copy, Check, RotateCcw, Mail, Loader2 } from "lucide-react";
import { useStore } from "@/store/useStore";
import { copyToClipboard } from "@/lib/utils";

/**
 * @description 结果展示组件，显示转写和格式化后的文本
 */
export function ResultDisplay() {
  const status = useStore((s) => s.currentStatus);
  const transcript = useStore((s) => s.currentTranscript);
  const formatted = useStore((s) => s.currentFormatted);
  const errorMessage = useStore((s) => s.errorMessage);
  const resetCurrent = useStore((s) => s.resetCurrent);
  const email = useStore((s) => s.settings.email);

  const [copied, setCopied] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  /**
   * @description 复制格式化文本到剪贴板
   */
  const handleCopy = async () => {
    const success = await copyToClipboard(formatted);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  /**
   * @description 通过mailto链接发送邮件
   */
  const handleEmail = () => {
    const subject = encodeURIComponent("VoiceStruct Note");
    const body = encodeURIComponent(formatted);
    const mailto = email
      ? `mailto:${email}?subject=${subject}&body=${body}`
      : `mailto:?subject=${subject}&body=${body}`;
    window.open(mailto, "_blank");
  };

  if (status === "transcribing") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-surface p-8 shadow-sm dark:bg-surface-dark">
        <Loader2 size={32} className="animate-spin text-primary" />
        <p className="text-sm text-text-muted dark:text-text-muted-dark">
          正在转写语音...
        </p>
      </div>
    );
  }

  if (status === "formatting") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-surface p-8 shadow-sm dark:bg-surface-dark">
        <Loader2 size={32} className="animate-spin text-accent" />
        <p className="text-sm text-text-muted dark:text-text-muted-dark">
          AI 正在整理格式...
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="rounded-2xl bg-red-50 p-6 dark:bg-red-950/30">
        <p className="mb-4 text-sm text-danger">{errorMessage}</p>
        <button
          onClick={resetCurrent}
          className="flex items-center gap-2 rounded-lg bg-danger px-4 py-2 text-sm text-white transition-colors hover:bg-red-600"
        >
          <RotateCcw size={16} />
          重新开始
        </button>
      </div>
    );
  }

  if (status === "done" && formatted) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl bg-surface p-6 shadow-sm dark:bg-surface-dark">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-text dark:text-text-dark">
              格式化结果
            </h3>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20 dark:bg-primary/20 dark:text-primary-light"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? "已复制" : "复制"}
              </button>
              <button
                onClick={handleEmail}
                className="flex items-center gap-1.5 rounded-lg bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent transition-colors hover:bg-accent/20 dark:bg-accent/20 dark:text-accent"
              >
                <Mail size={14} />
                邮件
              </button>
            </div>
          </div>
          <div className="prose prose-sm max-w-none whitespace-pre-wrap text-text dark:text-text-dark">
            {formatted}
          </div>
        </div>

        {transcript && (
          <div>
            <button
              onClick={() => setShowTranscript(!showTranscript)}
              className="mb-2 text-xs text-text-muted underline dark:text-text-muted-dark"
            >
              {showTranscript ? "隐藏原始转写" : "查看原始转写"}
            </button>
            {showTranscript && (
              <div className="rounded-xl bg-surface/50 p-4 text-sm text-text-muted dark:bg-surface-dark/50 dark:text-text-muted-dark">
                {transcript}
              </div>
            )}
          </div>
        )}

        <button
          onClick={resetCurrent}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-border py-3 text-sm font-medium text-text-muted transition-colors hover:bg-surface dark:border-border-dark dark:text-text-muted-dark dark:hover:bg-surface-dark"
        >
          <RotateCcw size={16} />
          新建录音
        </button>
      </div>
    );
  }

  return null;
}
