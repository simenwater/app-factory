/**
 * @fileoverview 乐谱导出工具
 * 支持导出为 PDF、ABC 记谱法、MusicXML 和 JSON。
 */

import type { LeadSheet, ExportFormat } from "@/types";
import { formatChord } from "./chordParser";

/**
 * @description 将乐谱导出为 ABC 记谱法字符串
 * @param {LeadSheet} sheet - 乐谱对象
 * @returns {string} ABC 格式文本
 */
export function toABC(sheet: LeadSheet): string {
  const lines: string[] = [];

  lines.push(`X:1`);
  lines.push(`T:${sheet.title}`);
  lines.push(`C:${sheet.composer}`);
  lines.push(`M:${sheet.timeSignature[0]}/${sheet.timeSignature[1]}`);
  lines.push(`L:1/4`);
  lines.push(`Q:1/4=${sheet.tempo}`);
  lines.push(`K:${sheet.key}`);

  let currentLine = "";
  sheet.measures.forEach((measure, idx) => {
    const chordStr = measure.chords
      .map((c) => `"${formatChord(c)}"`)
      .join(" ");

    const melodyStr = measure.melody?.length
      ? measure.melody
          .map((n) => {
            const acc = n.accidental === "#" ? "^" : n.accidental === "b" ? "_" : "";
            const octaveMarker = n.octave >= 5 ? n.name.toLowerCase() : n.name;
            const durMap: Record<string, string> = {
              whole: "4",
              half: "2",
              quarter: "",
              eighth: "/2",
              sixteenth: "/4",
            };
            return `${acc}${octaveMarker}${durMap[n.duration] || ""}`;
          })
          .join(" ")
      : "z4";

    currentLine += `${chordStr} ${melodyStr} |`;

    if ((idx + 1) % 4 === 0) {
      lines.push(currentLine);
      currentLine = "";
    }
  });

  if (currentLine) {
    lines.push(currentLine + "|");
  }

  return lines.join("\n");
}

/**
 * @description 将乐谱导出为简化 MusicXML
 * @param {LeadSheet} sheet - 乐谱对象
 * @returns {string} MusicXML 格式文本
 */
export function toMusicXML(sheet: LeadSheet): string {
  const parts: string[] = [];

  parts.push(`<?xml version="1.0" encoding="UTF-8"?>`);
  parts.push(`<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 4.0 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">`);
  parts.push(`<score-partwise version="4.0">`);
  parts.push(`  <work><work-title>${escapeXml(sheet.title)}</work-title></work>`);
  parts.push(`  <identification>`);
  parts.push(`    <creator type="composer">${escapeXml(sheet.composer)}</creator>`);
  parts.push(`  </identification>`);
  parts.push(`  <part-list><score-part id="P1"><part-name>Lead Sheet</part-name></score-part></part-list>`);
  parts.push(`  <part id="P1">`);

  sheet.measures.forEach((measure, idx) => {
    parts.push(`    <measure number="${idx + 1}">`);

    if (idx === 0) {
      parts.push(`      <attributes>`);
      parts.push(`        <divisions>1</divisions>`);
      parts.push(`        <time><beats>${sheet.timeSignature[0]}</beats><beat-type>${sheet.timeSignature[1]}</beat-type></time>`);
      parts.push(`      </attributes>`);
      parts.push(`      <direction placement="above"><direction-type><metronome><beat-unit>quarter</beat-unit><per-minute>${sheet.tempo}</per-minute></metronome></direction-type></direction>`);
    }

    measure.chords.forEach((chord) => {
      parts.push(`      <harmony><root><root-step>${chord.root}</root-step>${chord.accidental ? `<root-alter>${chord.accidental === "#" ? 1 : -1}</root-alter>` : ""}</root><kind>${chord.quality}</kind></harmony>`);
    });

    if (measure.melody?.length) {
      measure.melody.forEach((note) => {
        const durMap: Record<string, number> = { whole: 4, half: 2, quarter: 1, eighth: 1, sixteenth: 1 };
        parts.push(`      <note>`);
        parts.push(`        <pitch><step>${note.name}</step>${note.accidental ? `<alter>${note.accidental === "#" ? 1 : -1}</alter>` : ""}<octave>${note.octave}</octave></pitch>`);
        parts.push(`        <duration>${durMap[note.duration] || 1}</duration>`);
        parts.push(`        <type>${note.duration}</type>`);
        parts.push(`      </note>`);
      });
    } else {
      parts.push(`      <note><rest/><duration>${sheet.timeSignature[0]}</duration><type>whole</type></note>`);
    }

    parts.push(`    </measure>`);
  });

  parts.push(`  </part>`);
  parts.push(`</score-partwise>`);

  return parts.join("\n");
}

/**
 * @description 将乐谱导出为 JSON 字符串
 * @param {LeadSheet} sheet - 乐谱对象
 * @returns {string} JSON 字符串
 */
export function toJSON(sheet: LeadSheet): string {
  return JSON.stringify(sheet, null, 2);
}

/**
 * @description 触发浏览器文件下载
 * @param {string} content - 文件内容
 * @param {string} filename - 文件名
 * @param {string} mimeType - MIME 类型
 */
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * @description 导出乐谱（统一入口）
 * @param {LeadSheet} sheet - 乐谱对象
 * @param {ExportFormat} format - 导出格式
 */
export function exportSheet(sheet: LeadSheet, format: ExportFormat): void {
  const safeTitle = sheet.title.replace(/[^a-zA-Z0-9]/g, "_");

  switch (format) {
    case "abc": {
      const abc = toABC(sheet);
      downloadFile(abc, `${safeTitle}.abc`, "text/plain");
      break;
    }
    case "musicxml": {
      const xml = toMusicXML(sheet);
      downloadFile(xml, `${safeTitle}.musicxml`, "application/xml");
      break;
    }
    case "json": {
      const json = toJSON(sheet);
      downloadFile(json, `${safeTitle}.json`, "application/json");
      break;
    }
    case "pdf": {
      exportAsPdf(sheet);
      break;
    }
  }
}

/**
 * @description 导出乐谱为 PDF
 * @param {LeadSheet} sheet - 乐谱对象
 */
async function exportAsPdf(sheet: LeadSheet): Promise<void> {
  const { default: jsPDF } = await import("jspdf");
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text(sheet.title, 105, 20, { align: "center" });

  doc.setFontSize(12);
  doc.text(`Composer: ${sheet.composer}`, 105, 30, { align: "center" });
  doc.text(`Key: ${sheet.key} | Tempo: ${sheet.tempo} BPM | Style: ${sheet.style}`, 105, 38, { align: "center" });

  let y = 55;
  const measuresPerLine = 4;
  const measureWidth = 45;
  const startX = 15;

  for (let i = 0; i < sheet.measures.length; i += measuresPerLine) {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    const lineEnd = Math.min(i + measuresPerLine, sheet.measures.length);

    doc.setLineWidth(0.5);
    for (let j = i; j < lineEnd; j++) {
      const x = startX + (j - i) * measureWidth;
      doc.rect(x, y, measureWidth, 20);

      const measure = sheet.measures[j];
      const chordText = measure.chords.map(formatChord).join("  ");
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(chordText, x + 3, y + 8);

      if (measure.melody?.length) {
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        const melodyText = measure.melody.map((n) => `${n.accidental}${n.name}${n.octave}`).join(" ");
        doc.text(melodyText, x + 3, y + 16);
      }
    }

    y += 30;
  }

  doc.save(`${sheet.title.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`);
}

/**
 * @description 转义 XML 特殊字符
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
