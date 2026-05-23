/**
 * @fileoverview 音频引擎 — 基于 Tone.js 的和弦伴奏播放系统
 * 支持多种爵士伴奏风格、Swing 节奏和走贝斯。
 */

import type { Chord, MusicStyle, Measure } from "@/types";
import { getChordMidiNotes } from "./chordParser";

/** Tone.js 模块（动态加载，仅客户端） */
let Tone: typeof import("tone") | null = null;

/**
 * @description 动态加载 Tone.js（SSR 安全）
 */
async function loadTone() {
  if (!Tone) {
    Tone = await import("tone");
  }
  return Tone;
}

/** 音频引擎单例 */
let pianoSynth: InstanceType<typeof import("tone").PolySynth> | null = null;
let bassSynth: InstanceType<typeof import("tone").Synth> | null = null;
let metronome: InstanceType<typeof import("tone").Synth> | null = null;

/**
 * @description 伴奏模式配置
 */
interface CompingPattern {
  pianoRhythm: number[];
  bassPattern: "walking" | "root-fifth" | "bossa" | "latin";
  swingAmount: number;
}

const STYLE_PATTERNS: Record<MusicStyle, CompingPattern> = {
  "jazz-swing": { pianoRhythm: [0, 1.5, 2.5, 3.5], bassPattern: "walking", swingAmount: 0.6 },
  "jazz-bossa": { pianoRhythm: [0, 1.5, 3, 3.5], bassPattern: "bossa", swingAmount: 0 },
  "jazz-ballad": { pianoRhythm: [0, 2], bassPattern: "root-fifth", swingAmount: 0.3 },
  "jazz-latin": { pianoRhythm: [0, 0.5, 1.5, 2, 3, 3.5], bassPattern: "latin", swingAmount: 0 },
  "jazz-bebop": { pianoRhythm: [0, 1.5, 2.5, 3.5], bassPattern: "walking", swingAmount: 0.65 },
  "jazz-cool": { pianoRhythm: [0, 2], bassPattern: "root-fifth", swingAmount: 0.4 },
  blues: { pianoRhythm: [0, 1, 2, 3], bassPattern: "walking", swingAmount: 0.55 },
  pop: { pianoRhythm: [0, 1, 2, 3], bassPattern: "root-fifth", swingAmount: 0 },
  folk: { pianoRhythm: [0, 2], bassPattern: "root-fifth", swingAmount: 0 },
};

/**
 * @description 初始化音频引擎
 */
export async function initAudioEngine(): Promise<void> {
  const T = await loadTone();

  await T.start();

  pianoSynth = new T.PolySynth(T.Synth, {
    oscillator: { type: "triangle" },
    envelope: {
      attack: 0.02,
      decay: 0.3,
      sustain: 0.2,
      release: 0.8,
    },
    volume: -12,
  }).toDestination();

  bassSynth = new T.Synth({
    oscillator: { type: "triangle" },
    envelope: {
      attack: 0.05,
      decay: 0.2,
      sustain: 0.4,
      release: 0.5,
    },
    volume: -8,
  }).toDestination();

  metronome = new T.Synth({
    oscillator: { type: "sine" },
    envelope: {
      attack: 0.001,
      decay: 0.05,
      sustain: 0,
      release: 0.05,
    },
    volume: -20,
  }).toDestination();
}

/**
 * @description MIDI 编号转 Tone.js 音符名
 * @param {number} midi - MIDI 编号
 * @returns {string} Tone.js 格式的音符名（如 "C4", "Bb3"）
 */
function midiToNoteName(midi: number): string {
  const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const octave = Math.floor(midi / 12) - 1;
  const noteIdx = midi % 12;
  return `${noteNames[noteIdx]}${octave}`;
}

/**
 * @description 生成走贝斯音符序列
 * @param {Chord} chord - 当前和弦
 * @param {string} pattern - 低音模式
 * @param {number} beats - 每小节拍数
 * @returns {string[]} 低音音符名序列
 */
function generateBassNotes(chord: Chord, pattern: string, beats: number): string[] {
  const midiNotes = getChordMidiNotes(chord, 2);
  if (midiNotes.length === 0) return [];

  const root = midiToNoteName(midiNotes[0]);
  const fifth = midiNotes.length >= 3 ? midiToNoteName(midiNotes[2]) : root;
  const third = midiNotes.length >= 2 ? midiToNoteName(midiNotes[1]) : root;

  switch (pattern) {
    case "walking":
      return beats === 4
        ? [root, third, fifth, midiToNoteName(midiNotes[0] + 10)]
        : [root, fifth, root];
    case "bossa":
      return [root, fifth];
    case "latin":
      return [root, root, fifth, fifth];
    case "root-fifth":
    default:
      return beats === 4 ? [root, root, fifth, root] : [root, fifth, root];
  }
}

/** 播放回调 */
type PlaybackCallback = (measureIndex: number, beatIndex: number) => void;

/**
 * @description 开始伴奏播放
 * @param {Measure[]} measures - 小节数组
 * @param {number} tempo - BPM
 * @param {MusicStyle} style - 伴奏风格
 * @param {boolean} [loop=true] - 是否循环
 * @param {boolean} [useMetronome=false] - 是否开启节拍器
 * @param {PlaybackCallback} [onBeat] - 节拍回调
 */
export async function startPlayback(
  measures: Measure[],
  tempo: number,
  style: MusicStyle,
  loop: boolean = true,
  useMetronome: boolean = false,
  onBeat?: PlaybackCallback
): Promise<void> {
  const T = await loadTone();

  if (!pianoSynth || !bassSynth) {
    await initAudioEngine();
  }

  T.getTransport().bpm.value = tempo;
  T.getTransport().cancel();

  const pattern = STYLE_PATTERNS[style] || STYLE_PATTERNS["jazz-swing"];
  const beatsPerMeasure = measures[0]?.timeSignature?.[0] ?? 4;

  let currentBeat = 0;

  T.getTransport().scheduleRepeat(
    (time) => {
      const measureIdx = Math.floor(currentBeat / beatsPerMeasure);
      const beatIdx = currentBeat % beatsPerMeasure;

      if (measureIdx >= measures.length) {
        if (loop) {
          currentBeat = 0;
          return;
        }
        stopPlayback();
        return;
      }

      const measure = measures[measureIdx];
      const chord = measure.chords[0];

      if (chord && pianoSynth) {
        if (pattern.pianoRhythm.includes(beatIdx)) {
          const midiNotes = getChordMidiNotes(chord, 3);
          const noteNames = midiNotes.map(midiToNoteName);
          pianoSynth.triggerAttackRelease(noteNames, "8n", time);
        }
      }

      if (chord && bassSynth && beatIdx < 4) {
        const bassNotes = generateBassNotes(chord, pattern.bassPattern, beatsPerMeasure);
        if (bassNotes[beatIdx]) {
          bassSynth.triggerAttackRelease(bassNotes[beatIdx], "8n", time);
        }
      }

      if (useMetronome && metronome) {
        const freq = beatIdx === 0 ? 1000 : 800;
        metronome.triggerAttackRelease(freq, "32n", time);
      }

      if (onBeat) {
        T.getDraw().schedule(() => {
          onBeat(measureIdx, beatIdx);
        }, time);
      }

      currentBeat++;
    },
    "4n",
    0
  );

  T.getTransport().start();
}

/**
 * @description 停止播放
 */
export async function stopPlayback(): Promise<void> {
  const T = await loadTone();
  T.getTransport().stop();
  T.getTransport().cancel();
}

/**
 * @description 设置播放速度
 * @param {number} bpm - 新的 BPM 值
 */
export async function setTempo(bpm: number): Promise<void> {
  const T = await loadTone();
  T.getTransport().bpm.value = bpm;
}

/**
 * @description 设置主音量
 * @param {number} volume - 音量（dB），范围 -60 到 0
 */
export async function setVolume(volume: number): Promise<void> {
  const T = await loadTone();
  T.getDestination().volume.value = volume;
}

/**
 * @description 检查是否正在播放
 * @returns {boolean}
 */
export async function isPlaying(): Promise<boolean> {
  const T = await loadTone();
  return T.getTransport().state === "started";
}
