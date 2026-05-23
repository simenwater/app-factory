"use client";

/**
 * @fileoverview 播放控制面板
 * 提供播放/暂停、速度调节、风格切换等操作。
 */

import { useCallback } from "react";
import {
  Play,
  Pause,
  SkipBack,
  Repeat,
  Minus,
  Plus,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import type { MusicStyle } from "@/types";

const STYLE_OPTIONS: { value: MusicStyle; label: string }[] = [
  { value: "jazz-swing", label: "Swing" },
  { value: "jazz-bossa", label: "Bossa Nova" },
  { value: "jazz-ballad", label: "Ballad" },
  { value: "jazz-latin", label: "Latin" },
  { value: "jazz-bebop", label: "Bebop" },
  { value: "jazz-cool", label: "Cool Jazz" },
  { value: "blues", label: "Blues" },
  { value: "pop", label: "Pop" },
  { value: "folk", label: "Folk" },
];

interface PlayerControlsProps {
  onPlay: () => void;
  onStop: () => void;
  onTempoChange: (tempo: number) => void;
  onStyleChange: (style: MusicStyle) => void;
}

/**
 * @description 播放控制面板组件
 */
export function PlayerControls({
  onPlay,
  onStop,
  onTempoChange,
  onStyleChange,
}: PlayerControlsProps) {
  const playback = useStore((s) => s.playback);
  const setPlayback = useStore((s) => s.setPlayback);

  const handleTogglePlay = useCallback(() => {
    if (playback.isPlaying) {
      onStop();
      setPlayback({ isPlaying: false });
    } else {
      onPlay();
      setPlayback({ isPlaying: true });
    }
  }, [playback.isPlaying, onPlay, onStop, setPlayback]);

  const handleTempoDown = () => {
    const newTempo = Math.max(40, playback.tempo - 5);
    setPlayback({ tempo: newTempo });
    onTempoChange(newTempo);
  };

  const handleTempoUp = () => {
    const newTempo = Math.min(300, playback.tempo + 5);
    setPlayback({ tempo: newTempo });
    onTempoChange(newTempo);
  };

  const handleRestart = () => {
    onStop();
    setPlayback({ isPlaying: false, currentMeasure: 0, currentBeat: 0 });
  };

  const handleLoopToggle = () => {
    setPlayback({ loop: !playback.loop });
  };

  return (
    <div className="rounded-2xl bg-surface p-4 shadow-lg dark:bg-surface-dark">
      {/* Style selector */}
      <div className="mb-4">
        <label className="mb-1.5 block text-xs font-medium text-text-muted dark:text-text-muted-dark">
          伴奏风格
        </label>
        <select
          value={playback.style}
          onChange={(e) => {
            const style = e.target.value as MusicStyle;
            setPlayback({ style });
            onStyleChange(style);
          }}
          className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text dark:border-border-dark dark:bg-bg-dark dark:text-text-dark"
        >
          {STYLE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Tempo control */}
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-medium text-text-muted dark:text-text-muted-dark">
          速度
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={handleTempoDown}
            className="rounded-full p-1.5 hover:bg-bg dark:hover:bg-bg-dark"
          >
            <Minus size={16} />
          </button>
          <span className="w-20 text-center font-mono text-lg font-bold text-text dark:text-text-dark">
            {playback.tempo} <span className="text-xs font-normal text-text-muted dark:text-text-muted-dark">BPM</span>
          </span>
          <button
            onClick={handleTempoUp}
            className="rounded-full p-1.5 hover:bg-bg dark:hover:bg-bg-dark"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Transport controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={handleRestart}
          className="rounded-full p-3 text-text-muted transition-colors hover:bg-bg hover:text-text dark:text-text-muted-dark dark:hover:bg-bg-dark dark:hover:text-text-dark"
          title="重新开始"
        >
          <SkipBack size={20} />
        </button>

        <button
          onClick={handleTogglePlay}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
        >
          {playback.isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-0.5" />}
        </button>

        <button
          onClick={handleLoopToggle}
          className={`rounded-full p-3 transition-colors ${
            playback.loop
              ? "bg-primary/10 text-primary"
              : "text-text-muted hover:bg-bg hover:text-text dark:text-text-muted-dark dark:hover:bg-bg-dark dark:hover:text-text-dark"
          }`}
          title="循环播放"
        >
          <Repeat size={20} />
        </button>
      </div>

      {/* Position indicator */}
      <div className="mt-3 text-center text-xs text-text-muted dark:text-text-muted-dark">
        小节 {playback.currentMeasure + 1} · 第 {playback.currentBeat + 1} 拍
      </div>
    </div>
  );
}
