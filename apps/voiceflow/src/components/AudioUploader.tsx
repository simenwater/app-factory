"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, Mic, X } from "lucide-react";
import { isValidAudioFile, formatFileSize, getAudioDuration } from "@/lib/utils";

/**
 * @description 音频上传回调参数
 */
interface UploadResult {
  file: File;
  duration: number;
}

/**
 * @description 音频文件上传与录音组件
 */
export default function AudioUploader({
  onUpload,
  disabled,
}: {
  onUpload: (result: UploadResult) => void;
  disabled?: boolean;
}) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  /**
   * @description 处理文件选择
   */
  const handleFile = useCallback(
    async (file: File) => {
      setError(null);

      if (!isValidAudioFile(file)) {
        setError("不支持的文件格式。请上传 MP3、WAV、M4A、WebM、OGG、AAC 或 FLAC 格式的音频文件。");
        return;
      }

      if (file.size > 100 * 1024 * 1024) {
        setError("文件大小超过 100MB 限制。");
        return;
      }

      try {
        const duration = await getAudioDuration(file);
        setSelectedFile(file);
        onUpload({ file, duration });
      } catch {
        setError("无法读取音频文件，请确认文件未损坏。");
      }
    },
    [onUpload]
  );

  /**
   * @description 处理拖拽事件
   */
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files?.[0]) {
        handleFile(e.dataTransfer.files[0]);
      }
    },
    [handleFile]
  );

  /**
   * @description 开始录音
   */
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const file = new File([blob], `recording-${Date.now()}.webm`, {
          type: "audio/webm",
        });
        stream.getTracks().forEach((t) => t.stop());
        handleFile(file);
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch {
      setError("无法访问麦克风，请检查权限设置。");
    }
  }, [handleFile]);

  /**
   * @description 停止录音
   */
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, []);

  const clearFile = () => {
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-4">
      {/* 拖拽上传区域 */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        className={`relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 transition-all ${
          dragActive
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-surface-alt/50"
        } ${disabled ? "pointer-events-none opacity-50" : ""}`}
      >
        <Upload className="mb-3 h-8 w-8 text-text-muted" />
        <p className="text-sm font-medium text-text">
          拖拽音频文件到此处，或点击选择
        </p>
        <p className="mt-1 text-xs text-text-muted">
          支持 MP3, WAV, M4A, WebM, OGG, AAC, FLAC（最大 100MB）
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
      </div>

      {/* 录音按钮 */}
      <div className="flex justify-center">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={disabled}
          className={`flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all ${
            isRecording
              ? "animate-pulse bg-red-500 text-white hover:bg-red-600"
              : "bg-primary text-white hover:bg-primary-hover"
          } disabled:opacity-50`}
        >
          <Mic className="h-4 w-4" />
          {isRecording ? "停止录音" : "开始录音"}
        </button>
      </div>

      {/* 已选文件 */}
      {selectedFile && (
        <div className="flex items-center gap-3 rounded-xl bg-surface-alt p-3">
          <div className="flex-1 truncate">
            <p className="truncate text-sm font-medium text-text">
              {selectedFile.name}
            </p>
            <p className="text-xs text-text-muted">
              {formatFileSize(selectedFile.size)}
            </p>
          </div>
          <button
            onClick={clearFile}
            className="rounded-full p-1 hover:bg-border"
          >
            <X className="h-4 w-4 text-text-muted" />
          </button>
        </div>
      )}

      {/* 错误信息 */}
      {error && (
        <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
