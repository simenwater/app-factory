/**
 * @fileoverview CharacterKeep 核心类型定义
 */

/** 角色性格特质 */
export interface Trait {
  /** 特质名称 */
  name: string;
  /** 特质描述 */
  description: string;
  /** 重要程度 1-5 */
  importance: number;
}

/** 角色关系 */
export interface Relationship {
  /** 关联角色ID */
  targetCharacterId: string;
  /** 关系类型 */
  type: RelationshipType;
  /** 关系描述 */
  description: string;
}

/** 关系类型枚举 */
export type RelationshipType =
  | "friend"
  | "enemy"
  | "lover"
  | "family"
  | "mentor"
  | "rival"
  | "colleague"
  | "other";

/** 关系类型显示名称映射 */
export const RELATIONSHIP_TYPE_LABELS: Record<RelationshipType, string> = {
  friend: "朋友",
  enemy: "敌人",
  lover: "恋人",
  family: "家人",
  mentor: "导师",
  rival: "对手",
  colleague: "同事",
  other: "其他",
};

/** 角色卡片 */
export interface Character {
  /** 唯一标识 */
  id: string;
  /** 角色名称 */
  name: string;
  /** 角色头像颜色 */
  avatarColor: string;
  /** 年龄 */
  age?: string;
  /** 性别 */
  gender?: string;
  /** 身份/职业 */
  role?: string;
  /** 背景故事 */
  backstory?: string;
  /** 性格特质列表 */
  traits: Trait[];
  /** 角色关系列表 */
  relationships: Relationship[];
  /** 标签 */
  tags: string[];
  /** 创建时间 */
  createdAt: string;
  /** 更新时间 */
  updatedAt: string;
}

/** 剧情事件 */
export interface PlotEvent {
  /** 唯一标识 */
  id: string;
  /** 事件标题 */
  title: string;
  /** 事件内容 */
  content: string;
  /** 关联角色ID列表 */
  characterIds: string[];
  /** 章节/段落编号 */
  chapter?: string;
  /** 创建时间 */
  createdAt: string;
}

/** 一致性检查结果 */
export interface ConsistencyIssue {
  /** 唯一标识 */
  id: string;
  /** 问题严重等级 */
  severity: "error" | "warning" | "info";
  /** 问题描述 */
  message: string;
  /** 相关角色ID */
  characterId?: string;
  /** 相关事件ID */
  eventId?: string;
  /** 建议修改 */
  suggestion?: string;
  /** 检查时间 */
  checkedAt: string;
}

/** 冲突预警 */
export interface ConflictWarning {
  /** 唯一标识 */
  id: string;
  /** 冲突类型 */
  type: "personality" | "relationship" | "timeline" | "plot";
  /** 冲突描述 */
  message: string;
  /** 涉及角色ID列表 */
  characterIds: string[];
  /** 涉及事件ID列表 */
  eventIds: string[];
  /** 严重程度 1-5 */
  severity: number;
  /** 检测时间 */
  detectedAt: string;
}

/** 小说项目 */
export interface Project {
  /** 唯一标识 */
  id: string;
  /** 项目名称 */
  name: string;
  /** 项目描述 */
  description?: string;
  /** 创建时间 */
  createdAt: string;
  /** 更新时间 */
  updatedAt: string;
}

/** 订阅计划 */
export type SubscriptionPlan = "free" | "pro" | "premium";

/** 订阅信息 */
export interface Subscription {
  /** 当前计划 */
  plan: SubscriptionPlan;
  /** 过期时间 */
  expiresAt?: string;
  /** 角色数量上限 */
  maxCharacters: number;
  /** 项目数量上限 */
  maxProjects: number;
}

/** 计划功能限制 */
export const PLAN_LIMITS: Record<
  SubscriptionPlan,
  { maxCharacters: number; maxProjects: number; price: string; name: string }
> = {
  free: { maxCharacters: 5, maxProjects: 1, price: "免费", name: "免费版" },
  pro: {
    maxCharacters: 50,
    maxProjects: 10,
    price: "$9.99/月",
    name: "专业版",
  },
  premium: {
    maxCharacters: Infinity,
    maxProjects: Infinity,
    price: "$19.99/月",
    name: "旗舰版",
  },
};
