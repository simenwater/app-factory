"use client";

/**
 * @fileoverview 乐谱播放器页面
 * 显示五线谱/和弦图表，并提供伴奏播放功能。
 */

import { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Music,
  BarChart3,
  Star,
  Download,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { ChordChart } from "@/components/ChordChart";
import { SheetRenderer } from "@/components/SheetRenderer";
import { PlayerControls } from "@/components/PlayerControls";
import { exportSheet } from "@/lib/exportUtils";
import type { MusicStyle } from "@/types";

type ViewMode = "chord" | "notation";

/**
 * @description 乐谱播放器页面
 */
export default function PlayerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const sheets = useStore((s) => s.sheets);
  const playback = useStore((s) => s.playback);
  const setPlayback = useStore((s) => s.setPlayback);
  const setCurrentPosition = useStore((s) => s.setCurrentPosition);
  const toggleFavorite = useStore((s) => s.toggleFavorite);

  const [viewMode, setViewMode] = useState<ViewMode>("chord");
  const [audioReady, setAudioReady] = useState(false);

  const sheet = sheets.find((s) => s.id === id);

  useEffect(() => {
    if (sheet) {
      setPlayback({
        tempo: sheet.tempo,
        style: sheet.style,
        currentMeasure: 0,
        currentBeat: 0,
        isPlaying: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sheet?.id]);

  const handlePlay = useCallback(async () => {
    if (!sheet) return;

    try {
      const { initAudioEngine, startPlayback } = await import("@/lib/audioEngine");

      if (!audioReady) {
        await initAudioEngine();
        setAudioReady(true);
      }

      await startPlayback(
        sheet.measures,
        playback.tempo,
        playback.style,
        playback.loop,
        false,
        (measure, beat) => {
          setCurrentPosition(measure, beat);
        }
      );
    } catch (err) {
      console.error("Playback failed:", err);
    }
  }, [sheet, playback.tempo, playback.style, playback.loop, audioReady, setCurrentPosition]);

  const handleStop = useCallback(async () => {
    try {
      const { stopPlayback } = await import("@/lib/audioEngine");
      await stopPlayback();
    } catch (err) {
      console.error("Stop failed:", err);
    }
  }, []);

  const handleTempoChange = useCallback(async (tempo: number) => {
    try {
      const { setTempo } = await import("@/lib/audioEngine");
      await setTempo(tempo);
    } catch {
      // Audio engine not initialized
    }
  }, []);

  const handleStyleChange = useCallback(
    async (style: MusicStyle) => {
      if (playback.isPlaying && sheet) {
        await handleStop();
        setPlayback({ style, isPlaying: false });
      }
    },
    [playback.isPlaying, sheet, handleStop, setPlayback]
  );

  if (!sheet) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <Music size={48} className="mx-auto mb-4 text-text-muted dark:text-text-muted-dark" />
          <h2 className="mb-2 text-lg font-semibold">乐谱不存在</h2>
          <button
            onClick={() => router.push("/library")}
            className="rounded-xl bg-primary px-6 py-2.5 text-sm text-white"
          >
            返回乐谱库
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-4">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={() => {
            handleStop();
            router.back();
          }}
          className="rounded-lg p-2 hover:bg-surface dark:hover:bg-surface-dark"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold">{sheet.title}</h1>
          <p className="text-xs text-text-muted dark:text-text-muted-dark">
            {sheet.key} · {sheet.tempo} BPM · {sheet.measures.length} 小节
          </p>
        </div>
        <button
          onClick={() => toggleFavorite(sheet.id)}
          className="rounded-lg p-2 hover:bg-surface dark:hover:bg-surface-dark"
        >
          <Star
            size={20}
            className={sheet.isFavorite ? "fill-amber-500 text-amber-500" : "text-text-muted"}
          />
        </button>
        <button
          onClick={() => exportSheet(sheet, "pdf")}
          className="rounded-lg p-2 hover:bg-surface dark:hover:bg-surface-dark"
        >
          <Download size={20} className="text-text-muted" />
        </button>
      </div>

      {/* View Toggle */}
      <div className="mb-4 flex rounded-xl bg-surface p-1 dark:bg-surface-dark">
        <button
          onClick={() => setViewMode("chord")}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition-all ${
            viewMode === "chord"
              ? "bg-primary text-white shadow"
              : "text-text-muted dark:text-text-muted-dark"
          }`}
        >
          <BarChart3 size={16} />
          和弦图
        </button>
        <button
          onClick={() => setViewMode("notation")}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition-all ${
            viewMode === "notation"
              ? "bg-primary text-white shadow"
              : "text-text-muted dark:text-text-muted-dark"
          }`}
        >
          <Music size={16} />
          五线谱
        </button>
      </div>

      {/* Sheet Display */}
      <div className="mb-4">
        {viewMode === "chord" ? (
          <ChordChart
            measures={sheet.measures}
            currentMeasure={playback.currentMeasure}
          />
        ) : (
          <SheetRenderer
            sheet={sheet}
            currentMeasure={playback.currentMeasure}
          />
        )}
      </div>

      {/* Player Controls */}
      <PlayerControls
        onPlay={handlePlay}
        onStop={handleStop}
        onTempoChange={handleTempoChange}
        onStyleChange={handleStyleChange}
      />
    </div>
  );
}
