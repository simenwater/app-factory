/**
 * @fileoverview 订阅计划配置（客户端安全，不含 Stripe SDK）
 */

import type { PlanDetails, PlanType } from '@/types';

/** 订阅计划配置 */
export const PLANS: Record<PlanType, PlanDetails> = {
  free: {
    type: 'free',
    name: 'Free',
    price: 0,
    priceYearly: 0,
    features: [
      '每月 3 个仓库分析',
      '基础 AGENTS.md 生成',
      '单工具标准导出',
      '社区支持',
    ],
    limits: {
      reposPerMonth: 3,
      syncEnabled: false,
      teamSharing: false,
      prioritySupport: false,
    },
  },
  pro: {
    type: 'pro',
    name: 'Pro',
    price: 5,
    priceYearly: 50,
    features: [
      '无限仓库分析',
      'LLM 增强生成',
      '多工具标准同步',
      '自动更新同步',
      '优先支持',
      '自定义指令模板',
    ],
    limits: {
      reposPerMonth: -1,
      syncEnabled: true,
      teamSharing: false,
      prioritySupport: true,
    },
  },
  team: {
    type: 'team',
    name: 'Team',
    price: 15,
    priceYearly: 150,
    features: [
      'Pro 所有功能',
      '团队共享配置',
      '集中管理面板',
      '自定义品牌',
      '专属客服',
      'API 访问',
    ],
    limits: {
      reposPerMonth: -1,
      syncEnabled: true,
      teamSharing: true,
      prioritySupport: true,
    },
  },
};
