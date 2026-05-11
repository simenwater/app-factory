/**
 * @fileoverview PDF 合并、分割、签名等核心工具函数
 * 基于 pdf-lib，完全在浏览器本地运行
 */

import { PDFDocument, rgb } from "pdf-lib";
import type { PDFFileInfo, SplitConfig, SignaturePlacement } from "@/types";

/**
 * 读取文件为 ArrayBuffer
 * @param {File} file - 要读取的文件
 * @returns {Promise<ArrayBuffer>} 文件内容
 */
export async function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

/**
 * 获取 PDF 页数
 * @param {File} file - PDF 文件
 * @returns {Promise<number>} 页数
 */
export async function getPDFPageCount(file: File): Promise<number> {
  const buffer = await readFileAsArrayBuffer(file);
  const doc = await PDFDocument.load(buffer);
  return doc.getPageCount();
}

/**
 * 合并多个 PDF 文件
 * @param {PDFFileInfo[]} files - 要合并的文件列表（按顺序）
 * @param {(progress: number) => void} [onProgress] - 进度回调
 * @returns {Promise<Uint8Array>} 合并后的 PDF 字节数据
 */
export async function mergePDFs(
  files: PDFFileInfo[],
  onProgress?: (progress: number) => void
): Promise<Uint8Array> {
  const mergedDoc = await PDFDocument.create();
  const total = files.length;

  for (let i = 0; i < total; i++) {
    const buffer = await readFileAsArrayBuffer(files[i].file);
    const sourceDoc = await PDFDocument.load(buffer);
    const pages = await mergedDoc.copyPages(
      sourceDoc,
      sourceDoc.getPageIndices()
    );
    pages.forEach((page) => mergedDoc.addPage(page));
    onProgress?.((i + 1) / total);
  }

  return mergedDoc.save();
}

/**
 * 解析页码范围字符串，如 "1-3,5,7-9"
 * @param {string} rangeStr - 页码范围
 * @param {number} maxPage - 最大页码
 * @returns {number[]} 页码数组（0-indexed）
 */
export function parsePageRanges(rangeStr: string, maxPage: number): number[] {
  const pages = new Set<number>();
  const parts = rangeStr.split(",").map((s) => s.trim());

  for (const part of parts) {
    if (part.includes("-")) {
      const [startStr, endStr] = part.split("-");
      const start = Math.max(1, parseInt(startStr, 10));
      const end = Math.min(maxPage, parseInt(endStr, 10));
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = start; i <= end; i++) pages.add(i - 1);
      }
    } else {
      const page = parseInt(part, 10);
      if (!isNaN(page) && page >= 1 && page <= maxPage) pages.add(page - 1);
    }
  }

  return Array.from(pages).sort((a, b) => a - b);
}

/**
 * 分割 PDF 文件
 * @param {File} file - 要分割的 PDF 文件
 * @param {SplitConfig} config - 分割配置
 * @returns {Promise<{name: string, data: Uint8Array}[]>} 分割后的 PDF 列表
 */
export async function splitPDF(
  file: File,
  config: SplitConfig
): Promise<{ name: string; data: Uint8Array }[]> {
  const buffer = await readFileAsArrayBuffer(file);
  const sourceDoc = await PDFDocument.load(buffer);
  const totalPages = sourceDoc.getPageCount();
  const baseName = file.name.replace(/\.pdf$/i, "");
  const results: { name: string; data: Uint8Array }[] = [];

  if (config.mode === "range" && config.ranges) {
    const pageIndices = parsePageRanges(config.ranges, totalPages);
    if (pageIndices.length > 0) {
      const newDoc = await PDFDocument.create();
      const pages = await newDoc.copyPages(sourceDoc, pageIndices);
      pages.forEach((p) => newDoc.addPage(p));
      results.push({
        name: `${baseName}_pages.pdf`,
        data: await newDoc.save(),
      });
    }
  } else if (config.mode === "every" && config.everyN) {
    const n = config.everyN;
    for (let start = 0; start < totalPages; start += n) {
      const end = Math.min(start + n, totalPages);
      const indices = Array.from({ length: end - start }, (_, i) => start + i);
      const newDoc = await PDFDocument.create();
      const pages = await newDoc.copyPages(sourceDoc, indices);
      pages.forEach((p) => newDoc.addPage(p));
      results.push({
        name: `${baseName}_${start + 1}-${end}.pdf`,
        data: await newDoc.save(),
      });
    }
  } else if (config.mode === "extract" && config.pages) {
    for (const pageNum of config.pages) {
      if (pageNum >= 1 && pageNum <= totalPages) {
        const newDoc = await PDFDocument.create();
        const [page] = await newDoc.copyPages(sourceDoc, [pageNum - 1]);
        newDoc.addPage(page);
        results.push({
          name: `${baseName}_page${pageNum}.pdf`,
          data: await newDoc.save(),
        });
      }
    }
  }

  return results;
}

/**
 * 在 PDF 上添加签名图片
 * @param {File} file - 原始 PDF 文件
 * @param {SignaturePlacement[]} placements - 签名放置信息
 * @param {Map<string, string>} signatureImages - 签名 ID 到 dataUrl 的映射
 * @returns {Promise<Uint8Array>} 添加签名后的 PDF
 */
export async function addSignaturesToPDF(
  file: File,
  placements: SignaturePlacement[],
  signatureImages: Map<string, string>
): Promise<Uint8Array> {
  const buffer = await readFileAsArrayBuffer(file);
  const doc = await PDFDocument.load(buffer);

  for (const placement of placements) {
    const dataUrl = signatureImages.get(placement.signatureId);
    if (!dataUrl) continue;

    const imgBytes = await fetch(dataUrl).then((r) => r.arrayBuffer());
    const pngImage = await doc.embedPng(imgBytes);

    const page = doc.getPages()[placement.pageIndex];
    if (!page) continue;

    page.drawImage(pngImage, {
      x: placement.x,
      y: placement.y,
      width: placement.width,
      height: placement.height,
    });
  }

  return doc.save();
}

/**
 * 在 PDF 上添加文本（表单填写用）
 * @param {File} file - 原始 PDF 文件
 * @param {{pageIndex: number, x: number, y: number, text: string, size: number}[]} textItems - 文本项列表
 * @returns {Promise<Uint8Array>} 填写后的 PDF
 */
export async function addTextToPDF(
  file: File,
  textItems: {
    pageIndex: number;
    x: number;
    y: number;
    text: string;
    size: number;
  }[]
): Promise<Uint8Array> {
  const buffer = await readFileAsArrayBuffer(file);
  const doc = await PDFDocument.load(buffer);

  for (const item of textItems) {
    const page = doc.getPages()[item.pageIndex];
    if (!page) continue;

    page.drawText(item.text, {
      x: item.x,
      y: item.y,
      size: item.size,
      color: rgb(0, 0, 0),
    });
  }

  return doc.save();
}

/**
 * 触发浏览器下载
 * @param {Uint8Array} data - 文件数据
 * @param {string} filename - 文件名
 */
export function downloadPDF(data: Uint8Array, filename: string): void {
  const blob = new Blob([new Uint8Array(data)], { type: "application/pdf" });
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
 * 下载多个 PDF 文件（逐个下载）
 * @param {{name: string, data: Uint8Array}[]} files - 文件列表
 */
export function downloadMultiplePDFs(
  files: { name: string; data: Uint8Array }[]
): void {
  files.forEach((f) => downloadPDF(f.data, f.name));
}

/**
 * 生成唯一 ID
 * @returns {string} 唯一标识符
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
