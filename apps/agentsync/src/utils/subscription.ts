/**
 * @fileoverview 订阅与变现框架
 * @description 管理用户订阅计划和功能限制
 */

import { PlanLimits, SubscriptionPlan } from '../core/types';

/** 各计划的功能限制定义 */
const PLAN_LIMITS: Record<SubscriptionPlan, PlanLimits> = {
  [SubscriptionPlan.FREE]: {
    maxSources: 3,
    teamSync: false,
    customTemplates: false,
    autoResolveConflicts: false,
    watchMode: false,
  },
  [SubscriptionPlan.PRO_MONTHLY]: {
    maxSources: Infinity,
    teamSync: true,
    customTemplates: true,
    autoResolveConflicts: true,
    watchMode: true,
  },
  [SubscriptionPlan.PRO_YEARLY]: {
    maxSources: Infinity,
    teamSync: true,
    customTemplates: true,
    autoResolveConflicts: true,
    watchMode: true,
  },
};

/** 价格信息 */
export const PRICING = {
  [SubscriptionPlan.FREE]: { price: 0, period: 'forever' },
  [SubscriptionPlan.PRO_MONTHLY]: { price: 5, period: 'month' },
  [SubscriptionPlan.PRO_YEARLY]: { price: 50, period: 'year' },
} as const;

export class SubscriptionManager {
  private currentPlan: SubscriptionPlan;

  constructor(plan: SubscriptionPlan = SubscriptionPlan.FREE) {
    this.currentPlan = plan;
  }

  /**
   * 获取当前计划
   * @returns 当前订阅计划
   */
  getPlan(): SubscriptionPlan {
    return this.currentPlan;
  }

  /**
   * 获取当前计划的功能限制
   * @returns 功能限制对象
   */
  getLimits(): PlanLimits {
    return PLAN_LIMITS[this.currentPlan];
  }

  /**
   * 检查是否有权限使用某功能
   * @param feature - 功能名称
   * @returns 是否有权限
   */
  hasFeature(feature: keyof PlanLimits): boolean {
    const limits = this.getLimits();
    const value = limits[feature];
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value > 0;
    return false;
  }

  /**
   * 检查来源文件数是否在限制范围内
   * @param sourceCount - 来源文件数
   * @returns 是否在限制内
   */
  checkSourceLimit(sourceCount: number): { allowed: boolean; limit: number } {
    const limits = this.getLimits();
    return {
      allowed: sourceCount <= limits.maxSources,
      limit: limits.maxSources,
    };
  }

  /**
   * 升级计划
   * @param newPlan - 新的订阅计划
   */
  upgrade(newPlan: SubscriptionPlan): void {
    this.currentPlan = newPlan;
  }

  /**
   * 获取升级提示信息
   * @param feature - 受限功能名称
   * @returns 提示信息
   */
  getUpgradePrompt(feature: string): string {
    return [
      `⚡ "${feature}" is a Pro feature.`,
      `   Upgrade to Pro for $${PRICING[SubscriptionPlan.PRO_MONTHLY].price}/month`,
      `   or $${PRICING[SubscriptionPlan.PRO_YEARLY].price}/year (save 17%).`,
      `   Visit: https://agentsync.dev/pricing`,
    ].join('\n');
  }

  /**
   * 获取计划比较表
   * @returns 格式化的计划比较文本
   */
  getPlanComparison(): string {
    const lines = [
      '┌───────────────────────┬──────────┬──────────┐',
      '│ Feature               │   Free   │   Pro    │',
      '├───────────────────────┼──────────┼──────────┤',
      '│ Source files           │   ≤ 3    │ Unlimited│',
      '│ Team sync             │    ✗     │    ✓     │',
      '│ Custom templates      │    ✗     │    ✓     │',
      '│ Auto-resolve conflicts│    ✗     │    ✓     │',
      '│ Watch mode            │    ✗     │    ✓     │',
      '└───────────────────────┴──────────┴──────────┘',
    ];
    return lines.join('\n');
  }
}
