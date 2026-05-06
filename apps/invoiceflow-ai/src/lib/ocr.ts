/**
 * @fileoverview OCR 识别模块 - 使用 Tesseract.js 进行收据/合同文字识别，
 * 然后通过 AI (OpenAI) 结构化提取关键信息
 */

import type { OCRResult, OCRLineItem } from "@/types";

/**
 * 从图片中提取文字（使用 Tesseract.js）
 * @param {File} imageFile - 上传的图片文件
 * @returns {Promise<string>} 识别出的原始文本
 */
export async function extractTextFromImage(imageFile: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await fetch("/api/ocr", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("OCR 识别失败");
  }

  const data = await response.json();
  return data.text;
}

/**
 * 使用 AI 从 OCR 原始文本中提取结构化发票信息
 * @param {string} rawText - OCR 识别的原始文本
 * @returns {Promise<OCRResult>} 结构化的识别结果
 */
export async function parseReceiptWithAI(rawText: string): Promise<OCRResult> {
  const response = await fetch("/api/ocr", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: rawText }),
  });

  if (!response.ok) {
    throw new Error("AI 解析失败");
  }

  return response.json();
}

/**
 * 完整的 OCR 流程：图片 → 文字识别 → AI 结构化解析
 * @param {File} imageFile - 上传的图片文件
 * @returns {Promise<OCRResult>} 结构化的识别结果
 */
export async function processReceipt(imageFile: File): Promise<OCRResult> {
  const rawText = await extractTextFromImage(imageFile);
  const result = await parseReceiptWithAI(rawText);
  return result;
}

/**
 * 从 AI 响应中解析行项目
 * @param {unknown} data - AI 返回的 JSON 数据
 * @returns {OCRLineItem[]} 解析后的行项目列表
 */
export function parseLineItems(data: unknown): OCRLineItem[] {
  if (!Array.isArray(data)) return [];

  return data
    .filter(
      (item) =>
        item &&
        typeof item.description === "string" &&
        typeof item.total === "number"
    )
    .map((item) => ({
      description: item.description || "未知项目",
      quantity: Number(item.quantity) || 1,
      unitPrice: Number(item.unitPrice) || Number(item.total) || 0,
      total: Number(item.total) || 0,
    }));
}

/**
 * 验证 OCR 结果的完整性
 * @param {OCRResult} result - OCR 结果
 * @returns {{ valid: boolean; missing: string[] }} 验证结果
 */
export function validateOCRResult(result: OCRResult): {
  valid: boolean;
  missing: string[];
} {
  const missing: string[] = [];

  if (!result.vendorName) missing.push("商家名称");
  if (!result.amount || result.amount <= 0) missing.push("金额");
  if (!result.date) missing.push("日期");
  if (!result.items || result.items.length === 0) missing.push("项目明细");

  return { valid: missing.length === 0, missing };
}
