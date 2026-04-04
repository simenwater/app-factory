/**
 * @fileoverview CareerPilot AI 核心类型定义
 */

/** 简历数据结构 */
export interface Resume {
  id: string;
  fileName: string;
  rawText: string;
  optimizedText?: string;
  uploadedAt: string;
  lastOptimizedAt?: string;
}

/** 简历中提取的结构化信息 */
export interface ParsedResume {
  name?: string;
  email?: string;
  phone?: string;
  summary?: string;
  skills: string[];
  experience: WorkExperience[];
  education: Education[];
}

/** 工作经历 */
export interface WorkExperience {
  title: string;
  company: string;
  startDate: string;
  endDate?: string;
  description: string;
}

/** 教育背景 */
export interface Education {
  degree: string;
  school: string;
  year: string;
}

/** 职位描述（JD） */
export interface JobDescription {
  id: string;
  title: string;
  company: string;
  description: string;
  keywords: string[];
  createdAt: string;
}

/** JD 匹配结果 */
export interface MatchResult {
  id: string;
  resumeId: string;
  jobId: string;
  overallScore: number;
  skillMatch: number;
  experienceMatch: number;
  keywordMatch: number;
  suggestions: string[];
  matchedKeywords: string[];
  missingKeywords: string[];
  generatedCoverLetter?: string;
  analyzedAt: string;
}

/** 求职申请状态 */
export type ApplicationStatus =
  | "wishlist"
  | "applied"
  | "screening"
  | "interviewing"
  | "offer"
  | "rejected"
  | "withdrawn";

/** 求职申请 */
export interface Application {
  id: string;
  jobTitle: string;
  company: string;
  status: ApplicationStatus;
  appliedAt?: string;
  updatedAt: string;
  notes: string;
  jobUrl?: string;
  salary?: string;
  matchScore?: number;
}

/** 订阅计划 */
export type SubscriptionPlan = "free" | "monthly" | "quarterly";

/** 用户使用配额 */
export interface UsageQuota {
  plan: SubscriptionPlan;
  optimizationsUsed: number;
  optimizationsLimit: number;
  matchesUsed: number;
  matchesLimit: number;
}

/** 看板列配置 */
export interface KanbanColumn {
  id: ApplicationStatus;
  title: string;
  color: string;
}
