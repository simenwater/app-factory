/**
 * @fileoverview BinVisor 核心类型定义
 */

/** 字段数据类型 */
export type FieldType =
  | "uint8"
  | "uint16"
  | "uint32"
  | "uint64"
  | "int8"
  | "int16"
  | "int32"
  | "int64"
  | "float32"
  | "float64"
  | "bytes"
  | "string"
  | "bool"
  | "reserved"
  | "flags"
  | "enum";

/** 字节序 */
export type Endianness = "big" | "little";

/**
 * 协议中的单个字段
 * @typedef {Object} ProtocolField
 */
export interface ProtocolField {
  /** 字段名称 */
  name: string;
  /** 字段数据类型 */
  type: FieldType;
  /** 位宽（bits） */
  bits: number;
  /** 字段描述 */
  description?: string;
  /** 可选的颜色标记 */
  color?: string;
  /** 字段值（示例值或默认值） */
  value?: string;
  /** 是否为可选字段 */
  optional?: boolean;
  /** 枚举值映射 */
  enumValues?: Record<string, string>;
}

/**
 * 解析后的协议结构
 * @typedef {Object} ProtocolStructure
 */
export interface ProtocolStructure {
  /** 协议名称 */
  name: string;
  /** 协议描述 */
  description?: string;
  /** 字节序 */
  endianness: Endianness;
  /** 字段列表 */
  fields: ProtocolField[];
  /** 协议总位数 */
  totalBits: number;
}

/**
 * 解析结果
 * @typedef {Object} ParseResult
 */
export interface ParseResult {
  /** 是否解析成功 */
  success: boolean;
  /** 解析出的协议结构 */
  structure?: ProtocolStructure;
  /** 错误信息 */
  errors: string[];
}

/** 导出格式 */
export type ExportFormat = "svg" | "png" | "json" | "markdown";

/** 可视化主题 */
export type VisualizationTheme = "light" | "dark";

/** 缩放选项 */
export interface ZoomState {
  scale: number;
  offsetX: number;
  offsetY: number;
}

/**
 * 订阅计划
 * @typedef {Object} PricingPlan
 */
export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: "once" | "monthly";
  features: string[];
  recommended?: boolean;
}
