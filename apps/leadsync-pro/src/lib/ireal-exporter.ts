/**
 * @fileoverview iReal Pro 格式导出器
 * 将内部 LeadSheet 数据结构转换为 irealb:// URL
 */

import type { LeadSheet, Section, Measure, Beat } from "@/types";
import { scramble } from "./ireal-parser";
import { formatChord } from "./chord-utils";

/**
 * 将 Beat 序列化为 iReal Pro 和弦字符串片段
 * @param {Beat} beat - 拍子数据
 * @returns {string} iReal Pro 格式字符串
 */
function beatToString(beat: Beat): string {
  if (beat.isRepeat) return "x";
  if (beat.isNoChord) return "n";
  if (beat.chord) return formatChord(beat.chord);
  return " ";
}

/**
 * 将 Measure 序列化为 iReal Pro 和弦字符串片段
 * @param {Measure} measure - 小节数据
 * @returns {string} iReal Pro 格式字符串
 */
function measureToString(measure: Measure): string {
  let result = "";

  if (measure.isRepeatStart) result += "[";
  if (measure.ending) result += `N${measure.ending}`;

  const beats = measure.beats.map(beatToString);
  result += beats.join(" ");

  if (measure.isRepeatEnd) result += "]";

  return result;
}

/**
 * 将 Section 序列化为 iReal Pro 和弦字符串片段
 * @param {Section} section - 段落数据
 * @returns {string} iReal Pro 格式字符串
 */
function sectionToString(section: Section): string {
  const header = `*${section.name}`;
  const measures = section.measures
    .map(measureToString)
    .join("|");
  return `${header}${measures}`;
}

/**
 * 将 LeadSheet 的和弦内容序列化为 iReal Pro 和弦字符串（未混淆）
 * @param {LeadSheet} sheet - 乐谱数据
 * @returns {string} 和弦字符串
 */
export function leadSheetToChordString(sheet: LeadSheet): string {
  const tsig = sheet.timeSignature.replace("/", "");
  const header = `T${tsig}`;

  const body = sheet.sections.map(sectionToString).join("|");
  return `${header}|${body}|Z`;
}

/**
 * 将 LeadSheet 数据导出为 irealb:// URL
 * @param {LeadSheet} sheet - 乐谱数据
 * @returns {string} irealb:// URL
 */
export function exportToIRealUrl(sheet: LeadSheet): string {
  const chordString = leadSheetToChordString(sheet);
  const scrambled = scramble(chordString);

  const parts = [
    sheet.title,
    sheet.composer,
    sheet.style,
    sheet.key,
    "n",
    "",
    scrambled,
  ];

  const encoded = parts
    .map((p) => encodeURIComponent(p))
    .join("=");

  return `irealb://${encoded}`;
}

/**
 * 将多首 LeadSheet 导出为单个 iReal Pro URL（播放列表格式）
 * @param {LeadSheet[]} sheets - 乐谱列表
 * @returns {string} irealb:// URL
 */
export function exportPlaylistToIRealUrl(sheets: LeadSheet[]): string {
  const songs = sheets.map((sheet) => {
    const chordString = leadSheetToChordString(sheet);
    const scrambled = scramble(chordString);

    return [
      encodeURIComponent(sheet.title),
      encodeURIComponent(sheet.composer),
      encodeURIComponent(sheet.style),
      encodeURIComponent(sheet.key),
      "n",
      "",
      encodeURIComponent(scrambled),
    ].join("=");
  });

  return `irealb://${songs.join("===")}`;
}

/**
 * 生成 iReal Pro HTML 导出文件内容
 * @param {LeadSheet} sheet - 乐谱数据
 * @returns {string} HTML 内容
 */
export function exportToIRealHtml(sheet: LeadSheet): string {
  const url = exportToIRealUrl(sheet);
  return `<!DOCTYPE html>
<html>
<head><title>${sheet.title} - LeadSync Pro Export</title></head>
<body>
<h1>${sheet.title}</h1>
<p>Composer: ${sheet.composer}</p>
<p>Key: ${sheet.key} | Style: ${sheet.style}</p>
<p><a href="${url}">Open in iReal Pro</a></p>
</body>
</html>`;
}
