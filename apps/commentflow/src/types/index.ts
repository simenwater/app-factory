/**
 * @fileoverview CommentFlow 核心类型定义
 */

/** 评论状态 */
export type CommentStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

/** 评论优先级 */
export type CommentPriority = 'low' | 'medium' | 'high' | 'critical';

/** 评论分类 */
export type CommentCategory = 'bug' | 'design' | 'content' | 'functionality' | 'performance' | 'other';

/** 集成类型 */
export type IntegrationType = 'slack' | 'jira' | 'linear';

/** 订阅计划 */
export type SubscriptionPlan = 'free' | 'team' | 'enterprise';

/** 用户角色 */
export type UserRole = 'owner' | 'admin' | 'member' | 'viewer';

/**
 * @description 选中的 HTML 元素信息
 */
export interface ElementSelector {
  /** CSS 选择器路径 */
  selector: string;
  /** XPath 路径 */
  xpath: string;
  /** 元素标签名 */
  tagName: string;
  /** 元素文本内容（截取前100字符） */
  textContent: string;
  /** 元素截图的 base64 数据 */
  screenshot?: string;
}

/**
 * @description 评论数据
 */
export interface Comment {
  id: string;
  /** 所属项目 ID */
  projectId: string;
  /** 评论作者 */
  author: User;
  /** 评论内容 */
  content: string;
  /** 选中的 HTML 元素 */
  element: ElementSelector;
  /** 页面 URL */
  pageUrl: string;
  /** 评论状态 */
  status: CommentStatus;
  /** 优先级 */
  priority: CommentPriority;
  /** 分类 */
  category: CommentCategory;
  /** 指派给 */
  assignee?: User;
  /** 回复列表 */
  replies: Reply[];
  /** 关联的 Jira ticket */
  jiraTicketId?: string;
  /** 创建时间 */
  createdAt: string;
  /** 更新时间 */
  updatedAt: string;
}

/**
 * @description 评论回复
 */
export interface Reply {
  id: string;
  author: User;
  content: string;
  createdAt: string;
}

/**
 * @description 用户信息
 */
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
}

/**
 * @description 项目（网站）
 */
export interface Project {
  id: string;
  name: string;
  url: string;
  description?: string;
  /** 项目成员 */
  members: User[];
  /** 评论总数 */
  commentCount: number;
  /** 未解决评论数 */
  openCommentCount: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * @description 集成配置
 */
export interface Integration {
  id: string;
  type: IntegrationType;
  /** 是否已启用 */
  enabled: boolean;
  /** 配置数据 */
  config: Record<string, string>;
  /** 连接状态 */
  connected: boolean;
  /** 最后同步时间 */
  lastSyncAt?: string;
}

/**
 * @description 订阅信息
 */
export interface Subscription {
  plan: SubscriptionPlan;
  /** 当前用户数 */
  currentUsers: number;
  /** 最大用户数 */
  maxUsers: number;
  /** 单价（美元/用户/月） */
  pricePerUser: number;
  /** 试用到期日 */
  trialEndsAt?: string;
  /** 下次计费日 */
  nextBillingAt?: string;
}

/**
 * @description 团队设置
 */
export interface TeamSettings {
  id: string;
  name: string;
  subscription: Subscription;
  members: User[];
  integrations: Integration[];
}

/**
 * @description 通知
 */
export interface Notification {
  id: string;
  type: 'comment' | 'reply' | 'assign' | 'status_change' | 'mention';
  title: string;
  message: string;
  read: boolean;
  commentId?: string;
  createdAt: string;
}
