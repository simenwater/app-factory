'use client';

/**
 * @fileoverview 转录详情视图组件
 * 显示录音的转录文本和时间轴同步
 */

import { useState, useRef } from 'react';
import {
  ArrowLeft,
  Copy,
  Download,
  Languages,
  Loader2,
  Play,
  Pause,
  Sparkles,
} from 'lucide-react';
import { useRecordingStore } from '@/store/recordingStore';
import { createTranscriptionService, TranscriptionService } from '@/lib/transcriptionService';
import { formatDuration, getLanguageName } from '@/lib/formatters';
import type { Recording, TranscriptionSegment } from '@/types';

/**
 * @description 转录详情视图，包含音频播放器和时间轴同步文本
 */
export function TranscriptionView({
  recording,
  onBack,
}: {
  recording: Recording;
  onBack: () => void;
}) {
  const { setTranscription, setTranscriptionStatus, subscription } = useRecordingStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [copied, setCopied] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  /** 启动 AI 转录 */
  const handleTranscribe = async () => {
    if (!recording.audioUrl) return;
    if (!TranscriptionService.hasQuota(subscription.usedMinutes, subscription.totalMinutes)) {
      alert('本月转录额度已用尽，请升级订阅计划');
      return;
    }

    setIsTranscribing(true);
    setTranscriptionStatus(recording.id, 'processing');

    try {
      const response = await fetch(recording.audioUrl);
      const audioBlob = await response.blob();
      const service = createTranscriptionService();
      const result = await service.transcribe(audioBlob, recording.language);
      setTranscription(recording.id, result.segments, result.fullText);
    } catch (error) {
      console.error('转录失败:', error);
      setTranscriptionStatus(recording.id, 'failed');
    } finally {
      setIsTranscribing(false);
    }
  };

  /** 复制全文到剪贴板 */
  const handleCopy = async () => {
    if (recording.fullText) {
      await navigator.clipboard.writeText(recording.fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  /** 导出转录文本 */
  const handleExport = () => {
    const content = recording.segments
      .map(
        (seg) =>
          `[${formatDuration(seg.startTime)} - ${formatDuration(seg.endTime)}] ${seg.text}`
      )
      .join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${recording.title}_转录.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /** 音频时间更新处理 */
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  /** 跳转到指定时间点 */
  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  /** 切换播放/暂停 */
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  /** 判断片段是否为当前播放位置 */
  const isActiveSegment = (segment: TranscriptionSegment) =>
    currentTime >= segment.startTime && currentTime <= segment.endTime;

  return (
    <div className="flex flex-col h-full">
      {/* 顶部导航栏 */}
      <div className="flex items-center gap-3 p-4 border-b border-border dark:border-border-dark">
        <button
          onClick={onBack}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="返回"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-text dark:text-text-dark truncate">
            {recording.title}
          </h2>
          <p className="text-xs text-muted dark:text-muted-dark">
            {formatDuration(recording.duration)} · {getLanguageName(recording.language)}
          </p>
        </div>
        {recording.transcriptionStatus === 'completed' && (
          <div className="flex items-center gap-1">
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="复制文本"
            >
              <Copy className="w-4 h-4 text-muted dark:text-muted-dark" />
            </button>
            <button
              onClick={handleExport}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="导出"
            >
              <Download className="w-4 h-4 text-muted dark:text-muted-dark" />
            </button>
          </div>
        )}
      </div>

      {/* 音频播放器 */}
      {recording.audioUrl && (
        <div className="p-4 border-b border-border dark:border-border-dark">
          <audio
            ref={audioRef}
            src={recording.audioUrl}
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
          />
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shadow-sm"
              aria-label={isPlaying ? '暂停' : '播放'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-white" />
              ) : (
                <Play className="w-5 h-5 text-white ml-0.5" />
              )}
            </button>
            <div className="flex-1">
              <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all"
                  style={{
                    width: `${recording.duration > 0 ? (currentTime / recording.duration) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
            <span className="text-xs font-mono text-muted dark:text-muted-dark">
              {formatDuration(currentTime)} / {formatDuration(recording.duration)}
            </span>
          </div>
        </div>
      )}

      {/* 转录内容区域 */}
      <div className="flex-1 overflow-y-auto p-4">
        {recording.transcriptionStatus === 'pending' && (
          <div className="flex flex-col items-center justify-center py-12">
            <Sparkles className="w-12 h-12 text-accent mb-4" />
            <h3 className="text-lg font-medium text-text dark:text-text-dark">
              AI 语音转文字
            </h3>
            <p className="text-sm text-muted dark:text-muted-dark mt-1 text-center max-w-xs">
              使用 AI 将录音内容转为文字，支持多语言自动识别
            </p>
            <p className="text-xs text-muted dark:text-muted-dark mt-2">
              剩余额度: {subscription.totalMinutes - subscription.usedMinutes} 分钟
            </p>
            <button
              onClick={handleTranscribe}
              disabled={isTranscribing || !recording.audioUrl}
              className="mt-4 px-6 py-2.5 bg-accent hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full font-medium transition-colors flex items-center gap-2"
            >
              {isTranscribing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  转录中...
                </>
              ) : (
                <>
                  <Languages className="w-4 h-4" />
                  开始转录
                </>
              )}
            </button>
          </div>
        )}

        {recording.transcriptionStatus === 'processing' && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 text-accent animate-spin mb-4" />
            <p className="text-muted dark:text-muted-dark">AI 正在转录中，请稍候...</p>
          </div>
        )}

        {recording.transcriptionStatus === 'completed' && (
          <div className="space-y-2">
            {copied && (
              <div className="text-center text-sm text-green-600 dark:text-green-400 py-1">
                已复制到剪贴板
              </div>
            )}
            {recording.segments.map((segment) => (
              <div
                key={segment.id}
                className={`p-3 rounded-lg cursor-pointer transition-all ${
                  isActiveSegment(segment)
                    ? 'bg-accent/10 border border-accent/30'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
                onClick={() => seekTo(segment.startTime)}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-accent">
                    {formatDuration(segment.startTime)}
                  </span>
                  <div className="h-px flex-1 bg-border dark:bg-border-dark" />
                </div>
                <p className="text-sm text-text dark:text-text-dark leading-relaxed">
                  {segment.text}
                </p>
              </div>
            ))}
          </div>
        )}

        {recording.transcriptionStatus === 'failed' && (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-red-500 mb-4">转录失败，请重试</p>
            <button
              onClick={handleTranscribe}
              className="px-4 py-2 bg-accent text-white rounded-full text-sm"
            >
              重新转录
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
