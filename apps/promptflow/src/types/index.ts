/** @description 提示词模板分类 */
export type TemplateCategory =
  | 'coding-style'
  | 'context-rules'
  | 'project-setup'
  | 'debugging'
  | 'code-review'
  | 'documentation'
  | 'testing'
  | 'custom';

/** @description 目标 AI 平台 */
export type AIPlatform = 'cursor' | 'claude' | 'github-copilot' | 'generic';

/** @description 订阅套餐 */
export type PlanTier = 'free' | 'pro';

/** @description 版本历史条目 */
export interface VersionEntry {
  id: string;
  templateId: string;
  content: string;
  message: string;
  createdAt: string;
  author: string;
}

/** @description 提示词模板 */
export interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  content: string;
  category: TemplateCategory;
  platform: AIPlatform;
  tags: string[];
  isBuiltIn: boolean;
  isFavorite: boolean;
  isShared: boolean;
  createdAt: string;
  updatedAt: string;
  author: string;
  versions: VersionEntry[];
}

/** @description 团队成员 */
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'owner' | 'editor' | 'viewer';
}

/** @description 团队空间 */
export interface TeamSpace {
  id: string;
  name: string;
  members: TeamMember[];
  sharedTemplateIds: string[];
  createdAt: string;
}

/** @description 用户配置 */
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  plan: PlanTier;
  templateCount: number;
  maxTemplates: number;
}

/** @description 分类信息 */
export interface CategoryInfo {
  key: TemplateCategory;
  label: string;
  icon: string;
  description: string;
}

/** @description 所有分类的元数据 */
export const CATEGORIES: CategoryInfo[] = [
  { key: 'coding-style', label: '编码风格', icon: 'Paintbrush', description: '代码风格与命名规范' },
  { key: 'context-rules', label: '上下文规则', icon: 'FileText', description: 'AI 助手行为约束与上下文配置' },
  { key: 'project-setup', label: '项目初始化', icon: 'FolderOpen', description: '项目结构与技术栈配置' },
  { key: 'debugging', label: '调试排错', icon: 'Bug', description: '错误排查与调试提示' },
  { key: 'code-review', label: '代码审查', icon: 'Eye', description: 'Code Review 规范与检查清单' },
  { key: 'documentation', label: '文档生成', icon: 'BookOpen', description: '注释、README 与文档提示' },
  { key: 'testing', label: '测试用例', icon: 'TestTube', description: '单元测试与 E2E 测试提示' },
  { key: 'custom', label: '自定义', icon: 'Sparkles', description: '自定义提示词模板' },
];

/** @description 平台配置信息 */
export const PLATFORMS: { key: AIPlatform; label: string; description: string }[] = [
  { key: 'cursor', label: 'Cursor', description: '适用于 Cursor IDE' },
  { key: 'claude', label: 'Claude', description: '适用于 Claude AI 助手' },
  { key: 'github-copilot', label: 'GitHub Copilot', description: '适用于 GitHub Copilot' },
  { key: 'generic', label: '通用', description: '适用于任意 AI 助手' },
];
