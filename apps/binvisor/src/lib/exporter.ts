/**
 * @fileoverview 导出功能模块
 * 支持导出 SVG、PNG、JSON 和 Markdown 格式
 */

import type { ProtocolStructure, ExportFormat } from "@/types";

/**
 * 生成协议结构的 SVG 字符串
 * @param {ProtocolStructure} structure - 协议结构
 * @returns {string} SVG 字符串
 */
export function generateSVG(structure: ProtocolStructure): string {
  const bitsPerRow = 32;
  const cellWidth = 30;
  const cellHeight = 40;
  const headerHeight = 60;
  const width = bitsPerRow * cellWidth + 80;

  const rows: Array<{ field: typeof structure.fields[number]; startBit: number; endBit: number }[]> = [];
  let currentRow: typeof rows[number] = [];
  let bitInRow = 0;

  for (const field of structure.fields) {
    let remainingBits = field.bits;
    while (remainingBits > 0) {
      const availableInRow = bitsPerRow - bitInRow;
      const bitsThisSegment = Math.min(remainingBits, availableInRow);

      currentRow.push({
        field,
        startBit: bitInRow,
        endBit: bitInRow + bitsThisSegment - 1,
      });

      bitInRow += bitsThisSegment;
      remainingBits -= bitsThisSegment;

      if (bitInRow >= bitsPerRow) {
        rows.push(currentRow);
        currentRow = [];
        bitInRow = 0;
      }
    }
  }
  if (currentRow.length > 0) rows.push(currentRow);

  const height = headerHeight + rows.length * cellHeight + 40;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;
  svg += `<style>
    .title { font: bold 16px sans-serif; fill: #1e293b; }
    .bit-label { font: 10px monospace; fill: #64748b; text-anchor: middle; }
    .field-label { font: bold 11px sans-serif; fill: white; text-anchor: middle; dominant-baseline: central; }
    .field-desc { font: 9px sans-serif; fill: rgba(255,255,255,0.8); text-anchor: middle; }
  </style>`;
  svg += `<rect width="${width}" height="${height}" fill="white" rx="8"/>`;
  svg += `<text x="40" y="30" class="title">${escapeXml(structure.name)}</text>`;

  // Bit number labels
  for (let i = 0; i < bitsPerRow; i++) {
    if (i % 4 === 0) {
      svg += `<text x="${40 + i * cellWidth + cellWidth / 2}" y="${headerHeight - 5}" class="bit-label">${i}</text>`;
    }
  }

  // Draw fields
  rows.forEach((row, rowIdx) => {
    const y = headerHeight + rowIdx * cellHeight;
    for (const seg of row) {
      const x = 40 + seg.startBit * cellWidth;
      const w = (seg.endBit - seg.startBit + 1) * cellWidth;
      const color = seg.field.color || "#6366f1";

      svg += `<rect x="${x}" y="${y}" width="${w}" height="${cellHeight - 2}" fill="${color}" rx="4" opacity="0.9"/>`;
      svg += `<rect x="${x}" y="${y}" width="${w}" height="${cellHeight - 2}" fill="none" stroke="white" stroke-width="1" rx="4"/>`;

      if (w > 30) {
        const label = seg.field.name.length > w / 8 ? seg.field.name.substring(0, Math.floor(w / 8)) + "…" : seg.field.name;
        svg += `<text x="${x + w / 2}" y="${y + cellHeight / 2 - 2}" class="field-label">${escapeXml(label)}</text>`;
        if (w > 60) {
          svg += `<text x="${x + w / 2}" y="${y + cellHeight / 2 + 12}" class="field-desc">${seg.field.bits}b</text>`;
        }
      }
    }
  });

  svg += `</svg>`;
  return svg;
}

/**
 * 导出为 PNG（通过 SVG 转换）
 * @param {ProtocolStructure} structure - 协议结构
 * @returns {Promise<Blob>} PNG Blob
 */
export async function exportToPNG(structure: ProtocolStructure): Promise<Blob> {
  const svgString = generateSVG(structure);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  const img = new Image();

  return new Promise((resolve, reject) => {
    img.onload = () => {
      canvas.width = img.width * 2;
      canvas.height = img.height * 2;
      ctx.scale(2, 2);
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to create PNG blob"));
      }, "image/png");
    };
    img.onerror = reject;
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgString);
  });
}

/**
 * 导出为 JSON
 * @param {ProtocolStructure} structure - 协议结构
 * @returns {string} JSON 字符串
 */
export function exportToJSON(structure: ProtocolStructure): string {
  return JSON.stringify(structure, null, 2);
}

/**
 * 导出为 Markdown 文档片段
 * @param {ProtocolStructure} structure - 协议结构
 * @returns {string} Markdown 字符串
 */
export function exportToMarkdown(structure: ProtocolStructure): string {
  let md = `# ${structure.name}\n\n`;
  if (structure.description) {
    md += `${structure.description}\n\n`;
  }
  md += `**Endianness**: ${structure.endianness === "big" ? "Big Endian" : "Little Endian"}  \n`;
  md += `**Total Size**: ${structure.totalBits} bits (${structure.totalBits / 8} bytes)\n\n`;

  md += `| Offset (bits) | Field | Type | Size (bits) | Description |\n`;
  md += `|--------------|-------|------|-------------|-------------|\n`;

  let offset = 0;
  for (const field of structure.fields) {
    md += `| ${offset} | ${field.name} | ${field.type} | ${field.bits} | ${field.description || "-"} |\n`;
    offset += field.bits;
  }

  return md;
}

/**
 * 通用导出函数
 * @param {ProtocolStructure} structure - 协议结构
 * @param {ExportFormat} format - 导出格式
 */
export async function exportStructure(
  structure: ProtocolStructure,
  format: ExportFormat
): Promise<void> {
  let content: string | Blob;
  let filename: string;
  let mimeType: string;

  switch (format) {
    case "svg":
      content = generateSVG(structure);
      filename = `${structure.name.replace(/\s+/g, "_")}.svg`;
      mimeType = "image/svg+xml";
      break;
    case "png":
      content = await exportToPNG(structure);
      filename = `${structure.name.replace(/\s+/g, "_")}.png`;
      mimeType = "image/png";
      break;
    case "json":
      content = exportToJSON(structure);
      filename = `${structure.name.replace(/\s+/g, "_")}.json`;
      mimeType = "application/json";
      break;
    case "markdown":
      content = exportToMarkdown(structure);
      filename = `${structure.name.replace(/\s+/g, "_")}.md`;
      mimeType = "text/markdown";
      break;
    default:
      throw new Error(`Unsupported format: ${format}`);
  }

  const blob = typeof content === "string" ? new Blob([content], { type: mimeType }) : content;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * XML 特殊字符转义
 * @param {string} str - 原始字符串
 * @returns {string} 转义后的字符串
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
