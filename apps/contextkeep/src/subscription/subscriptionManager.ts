/**
 * @module subscriptionManager
 * @description 订阅与付费管理框架。
 * 提供 Free/Pro 计划管理、功能限制和升级提示。
 */

import * as vscode from 'vscode';

/** 订阅计划类型 */
export type PlanType = 'free' | 'pro';

/** 计划限制配置 */
export interface PlanLimits {
  /** 最大记忆条目数 */
  maxMemoryItems: number;
  /** 是否支持云同步 */
  cloudSync: boolean;
  /** 是否支持团队共享 */
  teamSharing: boolean;
  /** 最大项目数 */
  maxProjects: number;
  /** 是否支持高级检索 */
  advancedSearch: boolean;
}

/** 订阅状态 */
export interface SubscriptionState {
  plan: PlanType;
  expiresAt: number | null;
  userId: string | null;
}

/** 各计划的功能限制 */
const PLAN_CONFIGS: Record<PlanType, PlanLimits> = {
  free: {
    maxMemoryItems: 5000,
    cloudSync: false,
    teamSharing: false,
    maxProjects: 3,
    advancedSearch: false,
  },
  pro: {
    maxMemoryItems: 50000,
    cloudSync: true,
    teamSharing: true,
    maxProjects: -1,
    advancedSearch: true,
  },
};

/**
 * 订阅管理器。
 * 管理用户的订阅状态、功能限制和升级提示。
 */
export class SubscriptionManager {
  private state: SubscriptionState;
  private context: vscode.ExtensionContext | null = null;

  constructor() {
    this.state = {
      plan: 'free',
      expiresAt: null,
      userId: null,
    };
  }

  /**
   * 初始化订阅管理器
   * @param context - VS Code 扩展上下文
   */
  async initialize(context: vscode.ExtensionContext): Promise<void> {
    this.context = context;
    const saved = context.globalState.get<SubscriptionState>(
      'contextkeep.subscription'
    );
    if (saved) {
      this.state = saved;
      if (this.state.expiresAt && this.state.expiresAt < Date.now()) {
        this.state.plan = 'free';
        this.state.expiresAt = null;
        await this.saveState();
      }
    }
  }

  /** 获取当前计划类型 */
  get currentPlan(): PlanType {
    return this.state.plan;
  }

  /** 获取当前计划的功能限制 */
  get limits(): PlanLimits {
    return PLAN_CONFIGS[this.state.plan];
  }

  /** 当前是否为 Pro 用户 */
  get isPro(): boolean {
    return this.state.plan === 'pro';
  }

  /**
   * 检查某功能是否可用，不可用时显示升级提示
   * @param feature - 功能名称
   * @returns 功能是否可用
   */
  async checkFeature(
    feature: 'cloudSync' | 'teamSharing' | 'advancedSearch'
  ): Promise<boolean> {
    if (this.limits[feature]) {
      return true;
    }

    const featureNames: Record<string, string> = {
      cloudSync: '云同步',
      teamSharing: '团队共享',
      advancedSearch: '高级检索',
    };

    const action = await vscode.window.showInformationMessage(
      `"${featureNames[feature]}" 是 ContextKeep Pro 功能。升级到 Pro 仅需 $5/月。`,
      '升级到 Pro',
      '稍后'
    );

    if (action === '升级到 Pro') {
      vscode.env.openExternal(
        vscode.Uri.parse('https://contextkeep.dev/pricing')
      );
    }

    return false;
  }

  /**
   * 检查记忆条目是否已达上限
   * @param currentCount - 当前记忆数量
   * @returns 是否还可以添加
   */
  checkMemoryLimit(currentCount: number): boolean {
    if (currentCount >= this.limits.maxMemoryItems) {
      vscode.window.showWarningMessage(
        `ContextKeep: 已达到免费版记忆上限 (${this.limits.maxMemoryItems} 条)。升级到 Pro 获取更大容量。`,
        '升级到 Pro'
      ).then((action) => {
        if (action === '升级到 Pro') {
          vscode.env.openExternal(
            vscode.Uri.parse('https://contextkeep.dev/pricing')
          );
        }
      });
      return false;
    }
    return true;
  }

  /**
   * 激活 Pro 订阅（供将来 API 回调使用）
   * @param userId - 用户 ID
   * @param expiresAt - 过期时间戳
   */
  async activatePro(userId: string, expiresAt: number): Promise<void> {
    this.state = { plan: 'pro', userId, expiresAt };
    await this.saveState();
    vscode.window.showInformationMessage(
      '🎉 ContextKeep Pro 已激活！享受无限记忆和云同步。'
    );
  }

  /**
   * 取消订阅
   */
  async deactivatePro(): Promise<void> {
    this.state = { plan: 'free', userId: null, expiresAt: null };
    await this.saveState();
  }

  /**
   * 持久化订阅状态
   */
  private async saveState(): Promise<void> {
    if (this.context) {
      await this.context.globalState.update(
        'contextkeep.subscription',
        this.state
      );
    }
  }
}
