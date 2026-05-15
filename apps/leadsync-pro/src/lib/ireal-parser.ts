/**
 * @fileoverview iReal Pro 格式解析器
 * 解析 irealb:// URL 和原始和弦字符串为内部 LeadSheet 数据结构
 */

import type { IRealSong, LeadSheet, Section, Measure } from "@/types";
import { parseChord } from "./chord-utils";
import { v4 as uuidv4 } from "uuid";

/**
 * 反混淆 iReal Pro 和弦字符串
 * iReal Pro 使用 50 字符块交换算法进行混淆
 * @param {string} raw - 混淆后的原始字符串
 * @returns {string} 还原后的和弦字符串
 */
export function unscramble(raw: string): string {
  const s = raw.replace(/1r34LbKcu7/g, "");
  const blocks: string[] = [];

  for (let i = 0; i < s.length; i += 50) {
    const block = s.substring(i, i + 50).split("");
    if (block.length === 50) {
      for (let j = 0; j < 13; j++) {
        const temp = block[j];
        block[j] = block[49 - j];
        block[49 - j] = temp;
      }
    }
    blocks.push(block.join(""));
  }

  return blocks.join("");
}

/**
 * 混淆和弦字符串为 iReal Pro 格式
 * @param {string} clean - 原始和弦字符串
 * @returns {string} 混淆后的字符串
 */
export function scramble(clean: string): string {
  let s = clean;
  while (s.length % 50 !== 0) s += " ";

  const blocks: string[] = [];
  for (let i = 0; i < s.length; i += 50) {
    const block = s.substring(i, i + 50).split("");
    if (block.length === 50) {
      for (let j = 0; j < 13; j++) {
        const temp = block[j];
        block[j] = block[49 - j];
        block[49 - j] = temp;
      }
    }
    blocks.push(block.join(""));
  }

  return blocks.join("");
}

/**
 * 从 iReal Pro URL 解析出歌曲列表
 * URL 格式: irealb://[songs separated by ===]
 * 每首歌格式: Title=Composer=Style=Key=n==ChordString
 * @param {string} url - irealb:// URL 字符串
 * @returns {IRealSong[]} 解析出的歌曲列表
 */
export function parseIRealUrl(url: string): IRealSong[] {
  const prefix = "irealb://";
  if (!url.startsWith(prefix)) {
    throw new Error("Invalid iReal Pro URL: must start with irealb://");
  }

  const body = decodeURIComponent(url.slice(prefix.length));
  const songStrings = body.split("===");
  const songs: IRealSong[] = [];

  for (const songStr of songStrings) {
    if (!songStr.trim()) continue;
    const parts = songStr.split("=");
    if (parts.length < 6) continue;

    const title = parts[0].trim();
    const composer = parts[1].trim();
    const style = parts[2].trim();
    const key = parts[3].trim();

    const chordRaw = parts.slice(5).join("=").trim();
    const chordString = unscramble(chordRaw);

    songs.push({ title, composer, style, key, chordString });
  }

  return songs;
}

/**
 * 解析和弦字符串中的小节
 * @param {string} chordStr - iReal Pro 和弦字符串
 * @param {string} defaultTimeSignature - 默认拍号
 * @returns {Section[]} 段落列表
 */
export function parseChordString(
  chordStr: string,
  defaultTimeSignature: string = "4/4"
): Section[] {
  const sections: Section[] = [];
  let currentSection: Section = { name: "A", measures: [] };
  let currentMeasure: Measure = {
    beats: [],
    timeSignature: defaultTimeSignature,
  };
  let currentTimeSig = defaultTimeSignature;

  const cleaned = chordStr
    .replace(/\s+/g, " ")
    .replace(/LZ/g, "|")
    .replace(/XyQ/g, "")
    .trim();

  let i = 0;
  while (i < cleaned.length) {
    const ch = cleaned[i];

    if (ch === "*" && i + 1 < cleaned.length) {
      const mark = cleaned[i + 1];
      if (
        currentSection.measures.length > 0 ||
        currentMeasure.beats.length > 0
      ) {
        if (currentMeasure.beats.length > 0) {
          currentSection.measures.push(currentMeasure);
          currentMeasure = { beats: [], timeSignature: currentTimeSig };
        }
        sections.push(currentSection);
      }
      currentSection = {
        name: mark.toUpperCase(),
        measures: [],
      };
      i += 2;
      continue;
    }

    if (ch === "T" && i + 2 < cleaned.length) {
      const tsig = cleaned.substring(i + 1, i + 3);
      if (/^\d\d$/.test(tsig)) {
        currentTimeSig = tsig[0] + "/" + tsig[1];
        currentMeasure.timeSignature = currentTimeSig;
        i += 3;
        continue;
      }
    }

    if (ch === "N" && i + 1 < cleaned.length && /\d/.test(cleaned[i + 1])) {
      currentMeasure.ending = parseInt(cleaned[i + 1]);
      i += 2;
      continue;
    }

    if (ch === "[") {
      currentMeasure.isRepeatStart = true;
      i++;
      continue;
    }

    if (ch === "]") {
      currentMeasure.isRepeatEnd = true;
      i++;
      continue;
    }

    if (ch === "|" || ch === "Z") {
      if (currentMeasure.beats.length > 0) {
        currentSection.measures.push(currentMeasure);
        currentMeasure = { beats: [], timeSignature: currentTimeSig };
      }
      i++;
      continue;
    }

    if (ch === "Y" || ch === " " || ch === ",") {
      i++;
      continue;
    }

    if (ch === "{" || ch === "}") {
      i++;
      continue;
    }

    if (ch === "Q" || ch === "S" || ch === "f" || ch === "U") {
      i++;
      continue;
    }

    if (ch === "<") {
      const end = cleaned.indexOf(">", i);
      i = end >= 0 ? end + 1 : i + 1;
      continue;
    }

    if (ch === "x") {
      currentMeasure.beats.push({ chord: null, isRepeat: true });
      i++;
      continue;
    }

    if (ch === "n") {
      currentMeasure.beats.push({ chord: null, isNoChord: true });
      i++;
      continue;
    }

    if (ch === "r" || ch === "p") {
      currentMeasure.beats.push({ chord: null, isRepeat: true });
      i++;
      continue;
    }

    if (ch === "W" || ch === "l") {
      i++;
      continue;
    }

    if (/[A-G]/.test(ch)) {
      let chordStr2 = ch;
      i++;
      while (i < cleaned.length) {
        const next = cleaned[i];
        if (
          /[b#]/.test(next) &&
          chordStr2.length === 1
        ) {
          chordStr2 += next;
          i++;
        } else if (
          /[a-zA-Z0-9#()]/.test(next) &&
          !/[A-G]/.test(next)
        ) {
          chordStr2 += next;
          i++;
        } else if (next === "/" && i + 1 < cleaned.length && /[A-G]/.test(cleaned[i + 1])) {
          chordStr2 += next;
          i++;
          chordStr2 += cleaned[i];
          i++;
          if (i < cleaned.length && /[b#]/.test(cleaned[i])) {
            chordStr2 += cleaned[i];
            i++;
          }
        } else {
          break;
        }
      }

      const chord = parseChord(chordStr2);
      if (chord) {
        currentMeasure.beats.push({ chord });
      }
      continue;
    }

    i++;
  }

  if (currentMeasure.beats.length > 0) {
    currentSection.measures.push(currentMeasure);
  }
  if (currentSection.measures.length > 0) {
    sections.push(currentSection);
  }

  if (sections.length === 0) {
    sections.push({ name: "A", measures: [] });
  }

  return sections;
}

/**
 * 将 IRealSong 转换为完整的 LeadSheet 对象
 * @param {IRealSong} song - iReal Pro 歌曲数据
 * @returns {LeadSheet} 内部 LeadSheet 数据
 */
export function irealSongToLeadSheet(song: IRealSong): LeadSheet {
  const now = new Date().toISOString();
  const sections = parseChordString(song.chordString);

  return {
    id: uuidv4(),
    title: song.title,
    composer: song.composer,
    style: mapStyle(song.style),
    key: song.key,
    timeSignature: "4/4",
    sections,
    rawChordString: song.chordString,
    createdAt: now,
    updatedAt: now,
    tags: [song.style],
    isFavorite: false,
  };
}

/**
 * 将 iReal Pro 风格名映射到内部 MusicStyle
 * @param {string} irealStyle - iReal Pro 风格名
 * @returns {import("@/types").MusicStyle} 内部风格枚举
 */
function mapStyle(
  irealStyle: string
): import("@/types").MusicStyle {
  const lower = irealStyle.toLowerCase();
  if (lower.includes("bossa")) return "Bossa Nova";
  if (lower.includes("latin")) return "Latin";
  if (lower.includes("blues")) return "Blues";
  if (lower.includes("funk")) return "Funk";
  if (lower.includes("rock")) return "Rock";
  if (lower.includes("pop")) return "Pop";
  if (lower.includes("ballad")) return "Ballad";
  if (lower.includes("swing")) return "Swing";
  if (lower.includes("waltz")) return "Waltz";
  if (lower.includes("jazz") || lower.includes("bebop") || lower.includes("medium"))
    return "Jazz";
  return "Other";
}
