/**
 * @fileoverview PrivPDF 类型定义
 */

/** PDF 文件信息 */
export interface PDFFileInfo {
  id: string;
  file: File;
  name: string;
  size: number;
  pageCount: number;
  thumbnail?: string;
}

/** 分割模式 */
export type SplitMode = "range" | "every" | "extract";

/** 分割配置 */
export interface SplitConfig {
  mode: SplitMode;
  /** range 模式: "1-3,5,7-9" */
  ranges?: string;
  /** every 模式: 每 N 页分割 */
  everyN?: number;
  /** extract 模式: 要提取的页码列表 */
  pages?: number[];
}

/** 签名数据 */
export interface SignatureData {
  id: string;
  dataUrl: string;
  createdAt: number;
}

/** 签名放置位置 */
export interface SignaturePlacement {
  signatureId: string;
  pageIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

/** OCR 识别结果 */
export interface OCRResult {
  text: string;
  confidence: number;
  blocks: OCRBlock[];
}

/** OCR 文本块 */
export interface OCRBlock {
  text: string;
  confidence: number;
  bbox: {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
  };
}

/** OCR 进度回调 */
export interface OCRProgress {
  status: string;
  progress: number;
}

/** 订阅计划 */
export type PlanType = "free" | "pro" | "lifetime";

/** 功能权限 */
export interface FeatureAccess {
  merge: boolean;
  split: boolean;
  sign: boolean;
  ocr: boolean;
  batchProcess: boolean;
  maxFiles: number;
}

/** 应用主题 */
export type Theme = "light" | "dark" | "system";

/** 工具标签页 */
export type ToolTab = "merge" | "split" | "sign" | "ocr";
