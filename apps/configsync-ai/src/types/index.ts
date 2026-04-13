/**
 * @fileoverview ConfigSync AI 核心类型定义
 */

/** AI 助手类型 */
export type AIAssistant = "cursor" | "codex" | "claude-code" | "copilot" | "windsurf";

/** 项目文件节点 */
export interface FileNode {
  name: string;
  path: string;
  type: "file" | "directory";
  children?: FileNode[];
  size?: number;
  extension?: string;
}

/** 扫描结果 */
export interface ScanResult {
  id: string;
  projectName: string;
  rootPath: string;
  fileTree: FileNode[];
  totalFiles: number;
  totalDirs: number;
  languages: LanguageStat[];
  frameworks: string[];
  scannedAt: string;
}

/** 语言统计 */
export interface LanguageStat {
  language: string;
  fileCount: number;
  percentage: number;
}

/** 配置模板 */
export interface ConfigTemplate {
  id: string;
  name: string;
  assistant: AIAssistant;
  description: string;
  icon: string;
  fileName: string;
  content: string;
  variables: TemplateVariable[];
}

/** 模板变量 */
export interface TemplateVariable {
  key: string;
  label: string;
  description: string;
  defaultValue: string;
}

/** 生成的配置文件 */
export interface GeneratedConfig {
  id: string;
  templateId: string;
  assistant: AIAssistant;
  fileName: string;
  content: string;
  generatedAt: string;
  scanResultId: string;
}

/** 冲突检测结果 */
export interface ConflictResult {
  id: string;
  fileA: GeneratedConfig;
  fileB: GeneratedConfig;
  conflicts: ConflictItem[];
  status: "unresolved" | "resolved" | "ignored";
}

/** 单条冲突 */
export interface ConflictItem {
  lineNumber: number;
  type: "addition" | "deletion" | "modification";
  contentA: string;
  contentB: string;
  suggestion: string;
}

/** 订阅计划 */
export type PlanType = "free" | "pro" | "team";

/** 订阅信息 */
export interface Subscription {
  plan: PlanType;
  billingCycle: "monthly" | "yearly";
  price: number;
  features: string[];
}

/** 用户配置 */
export interface UserSettings {
  theme: "light" | "dark" | "system";
  defaultAssistants: AIAssistant[];
  subscription: Subscription;
}
