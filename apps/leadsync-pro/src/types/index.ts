/**
 * @fileoverview LeadSync Pro 核心类型定义
 */

/** 和弦品质枚举 */
export type ChordQuality =
  | "maj"
  | "min"
  | "dim"
  | "aug"
  | "dom7"
  | "maj7"
  | "min7"
  | "dim7"
  | "hdim7"
  | "aug7"
  | "min-maj7"
  | "sus2"
  | "sus4"
  | "6"
  | "min6"
  | "9"
  | "min9"
  | "maj9"
  | "11"
  | "13"
  | "add9"
  | "power"
  | "other";

/** 音名 */
export type NoteName =
  | "C"
  | "Db"
  | "D"
  | "Eb"
  | "E"
  | "F"
  | "Gb"
  | "G"
  | "Ab"
  | "A"
  | "Bb"
  | "B";

/** 和弦符号 */
export interface ChordSymbol {
  root: string;
  quality: string;
  bass?: string;
  display: string;
}

/** 一个小节内的拍子 */
export interface Beat {
  chord: ChordSymbol | null;
  isRepeat?: boolean;
  isNoChord?: boolean;
}

/** 小节 */
export interface Measure {
  beats: Beat[];
  timeSignature?: string;
  rehearsalMark?: string;
  isRepeatStart?: boolean;
  isRepeatEnd?: boolean;
  ending?: number;
}

/** 乐谱段落 */
export interface Section {
  name: string;
  measures: Measure[];
}

/** 音乐风格分类 */
export type MusicStyle =
  | "Jazz"
  | "Bossa Nova"
  | "Latin"
  | "Pop"
  | "Blues"
  | "Funk"
  | "Rock"
  | "Ballad"
  | "Swing"
  | "Waltz"
  | "Other";

/** Lead Sheet 完整数据 */
export interface LeadSheet {
  id: string;
  title: string;
  composer: string;
  style: MusicStyle;
  key: string;
  timeSignature: string;
  sections: Section[];
  rawChordString?: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  isFavorite: boolean;
  categoryId?: string;
}

/** 乐谱分类 */
export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

/** iReal Pro 歌曲原始数据 */
export interface IRealSong {
  title: string;
  composer: string;
  style: string;
  key: string;
  chordString: string;
}

/** 订阅计划 */
export type SubscriptionPlan = "free" | "monthly" | "yearly";

/** 用户订阅状态 */
export interface SubscriptionState {
  plan: SubscriptionPlan;
  syncCount: number;
  maxFreeSync: number;
  expiresAt?: string;
}

/** AI 和弦识别结果 */
export interface AIChordResult {
  measures: Measure[];
  confidence: number;
  key: string;
  timeSignature: string;
}

/** 编辑器操作历史记录 */
export interface EditorAction {
  type: "add" | "remove" | "modify" | "move";
  target: "chord" | "measure" | "section";
  sectionIndex: number;
  measureIndex: number;
  beatIndex?: number;
  previousValue?: unknown;
  newValue?: unknown;
  timestamp: number;
}
