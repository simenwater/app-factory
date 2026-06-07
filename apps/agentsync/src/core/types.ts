/**
 * @fileoverview AgentSync 核心类型定义
 * @description 定义所有配置文件解析、转换、合并相关的类型接口
 */

/** 支持的 AI 工具配置文件来源 */
export enum ConfigSource {
  CLAUDE_MD = 'CLAUDE.md',
  CURSORRULES = '.cursorrules',
  COPILOT_INSTRUCTIONS = '.github/copilot-instructions.md',
  WINDSURF_RULES = '.windsurfrules',
  AGENTS_MD = 'AGENTS.md',
  CUSTOM = 'custom',
}

/** 配置指令的类别 */
export enum DirectiveCategory {
  CODE_STYLE = 'code_style',
  ARCHITECTURE = 'architecture',
  TESTING = 'testing',
  DOCUMENTATION = 'documentation',
  WORKFLOW = 'workflow',
  DEPENDENCIES = 'dependencies',
  SECURITY = 'security',
  PERFORMANCE = 'performance',
  GENERAL = 'general',
}

/** 单条配置指令 */
export interface Directive {
  /** 指令内容 */
  content: string;
  /** 指令类别 */
  category: DirectiveCategory;
  /** 来源文件 */
  source: ConfigSource;
  /** 优先级 (1-10, 10 最高) */
  priority: number;
  /** 原始文本行号 */
  lineNumber?: number;
}

/** 解析后的配置文件结构 */
export interface ParsedConfig {
  /** 来源 */
  source: ConfigSource;
  /** 文件路径 */
  filePath: string;
  /** 项目名称 */
  projectName?: string;
  /** 项目描述 */
  description?: string;
  /** 技术栈信息 */
  techStack?: string[];
  /** 配置指令列表 */
  directives: Directive[];
  /** 原始内容 */
  rawContent: string;
  /** 自定义元数据 */
  metadata?: Record<string, string>;
}

/** AGENTS.md 标准格式结构 */
export interface AgentsConfig {
  /** 版本号 */
  version: string;
  /** 项目名称 */
  projectName: string;
  /** 项目描述 */
  description: string;
  /** 技术栈 */
  techStack: string[];
  /** 分类指令 */
  sections: AgentsSection[];
  /** 合并来源 */
  sources: ConfigSource[];
  /** 生成时间 */
  generatedAt: string;
  /** 自定义元数据 */
  metadata?: Record<string, string>;
}

/** AGENTS.md 中的一个配置段落 */
export interface AgentsSection {
  /** 段落标题 */
  title: string;
  /** 对应的类别 */
  category: DirectiveCategory;
  /** 指令列表 */
  directives: Directive[];
}

/** 合并冲突 */
export interface MergeConflict {
  /** 冲突 ID */
  id: string;
  /** 冲突的指令A */
  directiveA: Directive;
  /** 冲突的指令B */
  directiveB: Directive;
  /** 冲突类型 */
  type: ConflictType;
  /** 冲突描述 */
  description: string;
  /** 建议的解决方案 */
  resolution?: ConflictResolution;
}

/** 冲突类型 */
export enum ConflictType {
  CONTRADICTING = 'contradicting',
  DUPLICATE = 'duplicate',
  OVERLAPPING = 'overlapping',
}

/** 冲突解决方案 */
export interface ConflictResolution {
  /** 解决策略 */
  strategy: 'keep_a' | 'keep_b' | 'merge' | 'manual';
  /** 合并后的内容 (strategy 为 merge 时使用) */
  mergedContent?: string;
}

/** 合并结果 */
export interface MergeResult {
  /** 合并后的配置 */
  config: AgentsConfig;
  /** 检测到的冲突 */
  conflicts: MergeConflict[];
  /** 合并统计 */
  stats: MergeStats;
}

/** 合并统计信息 */
export interface MergeStats {
  /** 总指令数 */
  totalDirectives: number;
  /** 合并的指令数 */
  mergedDirectives: number;
  /** 冲突数 */
  conflictCount: number;
  /** 去重数 */
  deduplicatedCount: number;
  /** 来源文件数 */
  sourceCount: number;
}

/** 订阅计划 */
export enum SubscriptionPlan {
  FREE = 'free',
  PRO_MONTHLY = 'pro_monthly',
  PRO_YEARLY = 'pro_yearly',
}

/** 功能限制 */
export interface PlanLimits {
  /** 最大来源文件数 */
  maxSources: number;
  /** 是否支持团队同步 */
  teamSync: boolean;
  /** 是否支持自定义模板 */
  customTemplates: boolean;
  /** 是否支持冲突自动解决 */
  autoResolveConflicts: boolean;
  /** 是否支持 watch 模式 */
  watchMode: boolean;
}
