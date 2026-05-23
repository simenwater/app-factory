/**
 * @fileoverview LeadSheet AI 核心类型定义
 */

/** 音符名称 */
export type NoteName = "C" | "D" | "E" | "F" | "G" | "A" | "B";

/** 升降号 */
export type Accidental = "#" | "b" | "";

/** 音符（含八度） */
export interface Note {
  name: NoteName;
  accidental: Accidental;
  octave: number;
  duration: NoteDuration;
}

/** 音符时值 */
export type NoteDuration = "whole" | "half" | "quarter" | "eighth" | "sixteenth";

/** 和弦质量 */
export type ChordQuality =
  | "major"
  | "minor"
  | "dominant7"
  | "major7"
  | "minor7"
  | "diminished"
  | "augmented"
  | "half-diminished"
  | "minor7b5"
  | "sus4"
  | "sus2"
  | "add9"
  | "dominant9"
  | "minor9"
  | "major9"
  | "dominant13";

/** 和弦 */
export interface Chord {
  root: NoteName;
  accidental: Accidental;
  quality: ChordQuality;
  beats: number;
}

/** 小节 */
export interface Measure {
  chords: Chord[];
  melody?: Note[];
  timeSignature?: [number, number];
}

/** Lead Sheet 乐谱 */
export interface LeadSheet {
  id: string;
  title: string;
  composer: string;
  style: MusicStyle;
  key: string;
  timeSignature: [number, number];
  tempo: number;
  measures: Measure[];
  createdAt: string;
  updatedAt: string;
  isFavorite: boolean;
  tags: string[];
}

/** 音乐风格 */
export type MusicStyle =
  | "jazz-swing"
  | "jazz-bossa"
  | "jazz-ballad"
  | "jazz-latin"
  | "jazz-bebop"
  | "jazz-cool"
  | "blues"
  | "pop"
  | "folk";

/** 伴奏风格配置 */
export interface AccompanimentStyle {
  name: MusicStyle;
  label: string;
  pattern: number[][];
  swingRatio: number;
  velocityRange: [number, number];
}

/** 播放状态 */
export interface PlaybackState {
  isPlaying: boolean;
  currentMeasure: number;
  currentBeat: number;
  tempo: number;
  loop: boolean;
  style: MusicStyle;
  volume: number;
}

/** 用户设置 */
export interface UserSettings {
  theme: "light" | "dark" | "system";
  defaultTempo: number;
  defaultStyle: MusicStyle;
  defaultKey: string;
  defaultTimeSignature: [number, number];
  metronomeEnabled: boolean;
  countInBars: number;
  subscription: SubscriptionTier;
}

/** 订阅等级 */
export type SubscriptionTier = "free" | "pro" | "premium";

/** 订阅计划 */
export interface SubscriptionPlan {
  tier: SubscriptionTier;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
  generationsPerMonth: number;
}

/** AI 生成请求 */
export interface GenerateRequest {
  title: string;
  style: MusicStyle;
  key: string;
  timeSignature: [number, number];
  tempo: number;
  measures: number;
  complexity: "simple" | "moderate" | "complex";
  description?: string;
}

/** 导出格式 */
export type ExportFormat = "pdf" | "musicxml" | "abc" | "json";
