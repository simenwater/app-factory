/**
 * @fileoverview 本地 OCR 工具函数
 * 基于 Tesseract.js，完全在浏览器端运行，无需上传至服务器
 */

import type { OCRResult, OCRBlock, OCRProgress } from "@/types";

/**
 * 将 PDF 页面渲染为图片，用于 OCR 识别
 * 使用 canvas 渲染 PDF（需要动态导入 pdfjs-dist 或使用其他方式）
 * 这里接收已经渲染好的图片 blob/dataUrl
 */

/**
 * 对图片执行 OCR 识别
 * @param {string | File | Blob} image - 要识别的图片
 * @param {string} [language='eng'] - 识别语言
 * @param {(progress: OCRProgress) => void} [onProgress] - 进度回调
 * @returns {Promise<OCRResult>} OCR 识别结果
 */
export async function performOCR(
  image: string | File | Blob,
  language: string = "eng",
  onProgress?: (progress: OCRProgress) => void
): Promise<OCRResult> {
  const Tesseract = await import("tesseract.js");

  const worker = await Tesseract.createWorker(language, undefined, {
    logger: (m: { status: string; progress: number }) => {
      onProgress?.({ status: m.status, progress: m.progress });
    },
  });

  const {
    data: { text, confidence, blocks },
  } = await worker.recognize(image);

  const ocrBlocks: OCRBlock[] = (blocks || []).map(
    (block: {
      text: string;
      confidence: number;
      bbox: { x0: number; y0: number; x1: number; y1: number };
    }) => ({
      text: block.text,
      confidence: block.confidence,
      bbox: block.bbox,
    })
  );

  await worker.terminate();

  return {
    text,
    confidence,
    blocks: ocrBlocks,
  };
}

/**
 * 支持的 OCR 语言列表
 * @returns {{code: string, name: string}[]} 语言选项
 */
export function getSupportedLanguages(): { code: string; name: string }[] {
  return [
    { code: "eng", name: "English" },
    { code: "chi_sim", name: "简体中文" },
    { code: "chi_tra", name: "繁體中文" },
    { code: "jpn", name: "日本語" },
    { code: "kor", name: "한국어" },
    { code: "fra", name: "Français" },
    { code: "deu", name: "Deutsch" },
    { code: "spa", name: "Español" },
    { code: "por", name: "Português" },
    { code: "rus", name: "Русский" },
    { code: "ara", name: "العربية" },
  ];
}

/**
 * 将 File 转为 data URL
 * @param {File | Blob} file - 文件
 * @returns {Promise<string>} data URL
 */
export function fileToDataUrl(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
