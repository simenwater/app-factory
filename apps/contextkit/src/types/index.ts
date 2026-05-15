/**
 * @fileoverview ContextKit 核心类型定义
 */

/** AGENTS.md 模板分类 */
export type TemplateCategory =
  | "general"
  | "frontend"
  | "backend"
  | "fullstack"
  | "mobile"
  | "devops"
  | "data"
  | "custom";

/** AGENTS.md 模板定义 */
export interface Template {
  /** 唯一标识 */
  id: string;
  /** 模板名称 */
  name: string;
  /** 模板描述 */
  description: string;
  /** 模板分类 */
  category: TemplateCategory;
  /** Markdown 内容 */
  content: string;
  /** 标签列表 */
  tags: string[];
  /** 创建时间 */
  createdAt: string;
  /** 更新时间 */
  updatedAt: string;
  /** 是否为内置模板 */
  isBuiltIn: boolean;
}

/** 用户项目定义 */
export interface Project {
  /** 唯一标识 */
  id: string;
  /** 项目名称 */
  name: string;
  /** 项目描述 */
  description: string;
  /** AGENTS.md 内容 */
  agentsContent: string;
  /** 使用的模板 ID */
  templateId?: string;
  /** 创建时间 */
  createdAt: string;
  /** 更新时间 */
  updatedAt: string;
  /** 同步状态 */
  syncStatus: SyncStatus;
  /** 最后同步时间 */
  lastSyncedAt?: string;
}

/** 同步状态 */
export type SyncStatus = "synced" | "pending" | "conflict" | "local-only";

/** 设备信息 */
export interface Device {
  /** 唯一标识 */
  id: string;
  /** 设备名称 */
  name: string;
  /** 设备类型 */
  type: "desktop" | "laptop" | "tablet" | "mobile";
  /** 操作系统 */
  os: string;
  /** 最后活跃时间 */
  lastActiveAt: string;
  /** 是否当前设备 */
  isCurrent: boolean;
}

/** 订阅方案 */
export type PlanType = "free" | "pro" | "team";

/** 用户订阅信息 */
export interface Subscription {
  /** 当前方案 */
  plan: PlanType;
  /** 到期时间 */
  expiresAt?: string;
  /** 项目数量限制 */
  projectLimit: number;
  /** 已使用项目数 */
  projectCount: number;
  /** 是否支持团队共享 */
  teamSharing: boolean;
  /** 是否支持云端同步 */
  cloudSync: boolean;
}

/** 导出格式 */
export type ExportFormat = "md" | "json" | "yaml";

/** 导出数据包 */
export interface ExportBundle {
  /** 版本 */
  version: string;
  /** 导出时间 */
  exportedAt: string;
  /** 项目列表 */
  projects: Project[];
  /** 自定义模板列表 */
  customTemplates: Template[];
}
