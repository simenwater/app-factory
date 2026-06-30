/**
 * @fileoverview AgentContext 核心类型定义
 */

/** GitHub 仓库信息 */
export interface RepoInfo {
  owner: string;
  name: string;
  fullName: string;
  description: string;
  language: string;
  languages: Record<string, number>;
  defaultBranch: string;
  stars: number;
  forks: number;
  topics: string[];
}

/** 代码库文件结构节点 */
export interface FileNode {
  path: string;
  type: 'file' | 'dir';
  size?: number;
  children?: FileNode[];
}

/** 代码库分析结果 */
export interface AnalysisResult {
  id: string;
  repo: RepoInfo;
  structure: FileNode[];
  frameworks: string[];
  buildTools: string[];
  testingTools: string[];
  packageManager: string;
  entryPoints: string[];
  configFiles: string[];
  createdAt: string;
}

/** 支持的 AI 工具标准 */
export type ToolStandard = 'cursor' | 'claude' | 'copilot';

/** 生成的配置文件 */
export interface GeneratedConfig {
  id: string;
  analysisId: string;
  standard: ToolStandard;
  filename: string;
  content: string;
  createdAt: string;
}

/** 用户订阅计划 */
export type PlanType = 'free' | 'pro' | 'team';

/** 用户信息 */
export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  plan: PlanType;
  githubToken?: string;
}

/** 订阅计划详情 */
export interface PlanDetails {
  type: PlanType;
  name: string;
  price: number;
  priceYearly: number;
  features: string[];
  limits: {
    reposPerMonth: number;
    syncEnabled: boolean;
    teamSharing: boolean;
    prioritySupport: boolean;
  };
}

/** API 响应包装 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/** 生成请求参数 */
export interface GenerateRequest {
  repoUrl: string;
  standards: ToolStandard[];
  customInstructions?: string;
}

/** 同步请求参数 */
export interface SyncRequest {
  analysisId: string;
  targetStandards: ToolStandard[];
}
