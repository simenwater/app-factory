'use client';

/**
 * @fileoverview 录音按钮组件
 * 核心交互组件，支持开始/暂停/停止录音
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { Mic, Pause, Square, Play } from 'lucide-react';
import { useRecordingStore } from '@/store/recordingStore';
import { RecordingEngine } from '@/lib/recordingEngine';
import { formatDuration } from '@/lib/formatters';

/**
 * @description 录音控制按钮，显示录音状态和时长
 */
export function RecordButton() {
  const {
    status,
    currentDuration,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    updateDuration,
    settings,
  } = useRecordingStore();

  const engineRef = useRef<RecordingEngine | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [volume, setVolume] = useState(0);

  /** 开始录音 */
  const handleStart = useCallback(async () => {
    const rates: Record<number, number> = { 16: 16000, 44.1: 44100, 48: 48000 };
    try {
      const engine = new RecordingEngine(
        { sampleRate: rates[settings.audioQuality] ?? 44100 },
        {
          onVolumeChange: setVolume,
          onStop: (blob, duration) => {
            const url = URL.createObjectURL(blob);
            stopRecording(url, blob.size);
          },
          onError: (error) => {
            console.error('录音错误:', error);
            stopRecording(null, 0);
          },
        }
      );

      await engine.start();
      engineRef.current = engine;
      startRecording();

      timerRef.current = setInterval(() => {
        if (engine.getState().isRecording) {
          updateDuration(engine.getElapsedTime());
        }
      }, 100);
    } catch (error) {
      console.error('启动录音失败:', error);
    }
  }, [settings.audioQuality, startRecording, stopRecording, updateDuration]);

  /** 暂停录音 */
  const handlePause = useCallback(() => {
    engineRef.current?.pause();
    pauseRecording();
  }, [pauseRecording]);

  /** 恢复录音 */
  const handleResume = useCallback(() => {
    engineRef.current?.resume();
    resumeRecording();
  }, [resumeRecording]);

  /** 停止录音 */
  const handleStop = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    engineRef.current?.stop();
    engineRef.current = null;
    setVolume(0);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      engineRef.current?.stop();
    };
  }, []);

  const isActive = status === 'recording' || status === 'paused';

  return (
    <div className="flex flex-col items-center gap-6">
      {/* 录音时长显示 */}
      {isActive && (
        <div className="text-center">
          <p className="text-4xl font-mono font-bold tracking-wider text-text dark:text-text-dark">
            {formatDuration(currentDuration)}
          </p>
          <p className="text-sm text-muted dark:text-muted-dark mt-1">
            {status === 'recording' ? '正在录音...' : '已暂停'}
          </p>
        </div>
      )}

      {/* 波形可视化 */}
      {status === 'recording' && (
        <div className="flex items-center gap-1 h-12">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="w-1 bg-primary rounded-full transition-all duration-75"
              style={{
                height: `${Math.max(4, volume * 48 * (0.5 + Math.random() * 0.5))}px`,
              }}
            />
          ))}
        </div>
      )}

      {/* 控制按钮 */}
      <div className="flex items-center gap-4">
        {!isActive ? (
          <button
            onClick={handleStart}
            className="relative w-20 h-20 rounded-full bg-primary hover:bg-primary-dark transition-all flex items-center justify-center shadow-lg hover:shadow-xl active:scale-95"
            aria-label="开始录音"
          >
            <div className="absolute inset-0 rounded-full bg-primary animate-pulse-ring opacity-0" />
            <Mic className="w-8 h-8 text-white" />
          </button>
        ) : (
          <>
            {status === 'recording' ? (
              <button
                onClick={handlePause}
                className="w-14 h-14 rounded-full bg-amber-500 hover:bg-amber-600 transition-all flex items-center justify-center shadow-md active:scale-95"
                aria-label="暂停录音"
              >
                <Pause className="w-6 h-6 text-white" />
              </button>
            ) : (
              <button
                onClick={handleResume}
                className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 transition-all flex items-center justify-center shadow-md active:scale-95"
                aria-label="恢复录音"
              >
                <Play className="w-6 h-6 text-white" />
              </button>
            )}
            <button
              onClick={handleStop}
              className="w-20 h-20 rounded-full bg-primary hover:bg-primary-dark transition-all flex items-center justify-center shadow-lg active:scale-95"
              aria-label="停止录音"
            >
              <Square className="w-7 h-7 text-white fill-white" />
            </button>
          </>
        )}
      </div>

      {/* 后台保护状态 */}
      {isActive && settings.backgroundProtection && (
        <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span>后台防中断保护已启用</span>
        </div>
      )}
    </div>
  );
}
