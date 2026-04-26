/**
 * @file 全局类型定义
 * @description FrontendPrep AI 应用中使用的所有 TypeScript 类型
 */

/** 面试消息角色 */
export type MessageRole = 'system' | 'user' | 'assistant';

/** 面试消息 */
export interface InterviewMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
}

/** 面试类型 */
export type InterviewType = 'behavioral' | 'technical' | 'css' | 'react' | 'javascript' | 'mixed';

/** 面试难度 */
export type Difficulty = 'junior' | 'mid' | 'senior';

/** 面试会话 */
export interface InterviewSession {
  id: string;
  type: InterviewType;
  difficulty: Difficulty;
  messages: InterviewMessage[];
  startedAt: number;
  endedAt?: number;
  score?: InterviewScore;
}

/** 面试评分 */
export interface InterviewScore {
  overall: number;
  communication: number;
  technicalDepth: number;
  problemSolving: number;
  codeQuality: number;
  feedback: string;
}

/** 代码评估请求 */
export interface CodeEvalRequest {
  code: string;
  language: 'javascript' | 'typescript' | 'css' | 'html' | 'jsx' | 'tsx';
  context?: string;
}

/** 代码评估结果 */
export interface CodeEvalResult {
  score: number;
  issues: CodeIssue[];
  suggestions: string[];
  optimizedCode?: string;
  explanation: string;
}

/** 代码问题 */
export interface CodeIssue {
  type: 'error' | 'warning' | 'info';
  line?: number;
  message: string;
  suggestion: string;
}

/** 技能维度 */
export type SkillCategory = 'javascript' | 'typescript' | 'react' | 'css' | 'html' | 'performance' | 'accessibility' | 'testing';

/** 弱点分析结果 */
export interface WeaknessAnalysis {
  skills: SkillAssessment[];
  overallLevel: Difficulty;
  weakestAreas: SkillCategory[];
  strongestAreas: SkillCategory[];
  generatedAt: number;
}

/** 技能评估 */
export interface SkillAssessment {
  category: SkillCategory;
  score: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  details: string;
}

/** 练习计划 */
export interface PracticePlan {
  id: string;
  title: string;
  description: string;
  tasks: PracticeTask[];
  estimatedDays: number;
  difficulty: Difficulty;
  generatedAt: number;
}

/** 练习任务 */
export interface PracticeTask {
  id: string;
  title: string;
  description: string;
  category: SkillCategory;
  difficulty: Difficulty;
  completed: boolean;
  resources?: string[];
}

/** 用户订阅状态 */
export type SubscriptionTier = 'free' | 'pro' | 'sprint';

/** 用户信息 */
export interface User {
  interviewCount: number;
  maxFreeInterviews: number;
  subscription: SubscriptionTier;
  weaknessAnalysis?: WeaknessAnalysis;
  practicePlans: PracticePlan[];
}
