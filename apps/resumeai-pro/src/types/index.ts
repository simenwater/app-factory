/**
 * @description 简历数据类型定义
 */

/** @description 个人信息 */
export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  website?: string;
  summary: string;
}

/** @description 工作经历 */
export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
}

/** @description 教育经历 */
export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

/** @description 技能 */
export interface Skill {
  id: string;
  name: string;
  level: "beginner" | "intermediate" | "advanced" | "expert";
}

/** @description 项目经历 */
export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
}

/** @description 简历数据 */
export interface ResumeData {
  id: string;
  title: string;
  personalInfo: PersonalInfo;
  workExperience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  template: TemplateType;
  createdAt: string;
  updatedAt: string;
}

/** @description 模板类型 */
export type TemplateType = "professional" | "modern" | "minimal" | "creative";

/** @description ATS 评分结果 */
export interface ATSScoreResult {
  overallScore: number;
  categories: ATSCategory[];
  suggestions: string[];
  keywords: KeywordMatch[];
}

/** @description ATS 评分分类 */
export interface ATSCategory {
  name: string;
  score: number;
  maxScore: number;
  feedback: string;
}

/** @description 关键词匹配 */
export interface KeywordMatch {
  keyword: string;
  found: boolean;
  importance: "high" | "medium" | "low";
}

/** @description 导出格式 */
export type ExportFormat = "pdf" | "docx";

/** @description 订阅计划 */
export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  interval: "once" | "month" | "year";
  features: string[];
  popular?: boolean;
}

/** @description 用户设置 */
export interface Settings {
  darkMode: boolean;
  language: "en" | "zh";
}
