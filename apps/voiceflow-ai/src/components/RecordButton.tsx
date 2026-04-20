'use client';

import { useState, useRef } from 'react';
import { Mic, Square, Loader2, Upload } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { AudioRecorder } from '@/lib/recorder';
import { formatDuration } from '@/lib/export';

/**
 * @description 录音按钮组件 — 支持录音和文件上传两种方式
 */
export default function RecordButton() {
  const {
    recordingStatus,
    setRecordingStatus,
    rewriteStyle,
    addNote,
    incrementUsage,
    canUse,
  } = useStore();

  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const recorderRef = useRef<AudioRecorder | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * @description 将音频发送到 API 进行转录和重写
   */
  async function processAudio(audioBlob: Blob | File, clientDuration: number) {
    const formData = new FormData();
    const audioFile =
      audioBlob instanceof File
        ? audioBlob
        : new File([audioBlob], 'recording.webm', { type: audioBlob.type });
    formData.append('audio', audioFile);

    const transcribeRes = await fetch('/api/transcribe', { method: 'POST', body: formData });
    if (!transcribeRes.ok) throw new Error('Transcription failed');

    const { text, language, duration: serverDuration } = await transcribeRes.json();
    const duration = serverDuration || clientDuration;

    const rewriteRes = await fetch('/api/rewrite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, style: rewriteStyle, language }),
    });
    if (!rewriteRes.ok) throw new Error('Rewrite failed');

    const { title, rewrittenText } = await rewriteRes.json();

    addNote({
      id: crypto.randomUUID(),
      title,
      originalText: text,
      rewrittenText,
      style: rewriteStyle,
      duration,
      createdAt: new Date().toISOString(),
      language,
    });
    incrementUsage();
    setRecordingStatus('done');
    setTimeout(() => setRecordingStatus('idle'), 2000);
  }

  /**
   * @description 开始录音
   */
  async function startRecording() {
    if (!canUse()) {
      setError('免费额度已用完，请升级订阅继续使用');
      return;
    }

    setError(null);

    if (!AudioRecorder.isSupported()) {
      setError('您的浏览器不支持录音功能，请使用最新版 Chrome 或 Firefox');
      return;
    }

    try {
      const recorder = new AudioRecorder();
      recorderRef.current = recorder;
      await recorder.start();
      setRecordingStatus('recording');
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    } catch {
      setError('无法访问麦克风，请检查浏览器权限设置');
      setRecordingStatus('idle');
    }
  }

  /**
   * @description 停止录音并发送处理
   */
  async function stopRecording() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (!recorderRef.current) return;

    setRecordingStatus('processing');

    try {
      const { blob, duration } = await recorderRef.current.stop();
      await processAudio(blob, duration);
    } catch {
      setError('录音处理失败');
      setRecordingStatus('idle');
    }
  }

  /**
   * @description 处理上传的音频文件
   */
  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!canUse()) {
      setError('免费额度已用完，请升级订阅继续使用');
      return;
    }

    setError(null);
    setRecordingStatus('processing');

    try {
      await processAudio(file, 0);
    } catch {
      setError('文件处理失败');
      setRecordingStatus('idle');
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  const isRecording = recordingStatus === 'recording';
  const isProcessing = recordingStatus === 'processing';

  return (
    <div className="flex flex-col items-center gap-4">
      {/* 录音主按钮 */}
      <div className="relative">
        {isRecording && (
          <div className="absolute inset-0 rounded-full bg-red-400/30 animate-pulse-ring" />
        )}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
          className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
            isRecording
              ? 'bg-red-500 hover:bg-red-600 scale-110'
              : isProcessing
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-br from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 hover:scale-105'
          }`}
        >
          {isProcessing ? (
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          ) : isRecording ? (
            <Square className="w-7 h-7 text-white" />
          ) : (
            <Mic className="w-8 h-8 text-white" />
          )}
        </button>
      </div>

      {/* 状态文字 */}
      <div className="text-center">
        {isRecording && (
          <p className="text-red-500 font-medium">
            录音中 · {formatDuration(elapsed)}
          </p>
        )}
        {isProcessing && (
          <p className="text-violet-600 dark:text-violet-400 font-medium">
            AI 正在处理中...
          </p>
        )}
        {recordingStatus === 'done' && (
          <p className="text-green-600 dark:text-green-400 font-medium">处理完成!</p>
        )}
        {recordingStatus === 'idle' && (
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            点击开始录音，或上传音频文件
          </p>
        )}
      </div>

      {/* 上传按钮 */}
      {!isRecording && !isProcessing && (
        <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors text-sm text-gray-600 dark:text-gray-400">
          <Upload className="w-4 h-4" />
          上传音频
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>
      )}

      {error && (
        <p className="text-red-500 text-sm text-center max-w-xs">{error}</p>
      )}
    </div>
  );
}
