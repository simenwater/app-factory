import type { PlanTier } from '@/types';

/** @description 订阅计划定义 */
export interface PlanDefinition {
  tier: PlanTier;
  name: string;
  price: number;
  priceLabel: string;
  features: string[];
  limits: {
    maxTemplates: number;
    maxTeamMembers: number;
    versionHistory: boolean;
    cloudSync: boolean;
    export: boolean;
  };
}

/** @description 可用的订阅计划 */
export const PLANS: PlanDefinition[] = [
  {
    tier: 'free',
    name: '基础版',
    price: 0,
    priceLabel: '免费',
    features: [
      '最多 10 个自定义模板',
      '所有内置模板',
      '一键复制功能',
      '本地存储',
      '深色模式',
    ],
    limits: {
      maxTemplates: 10,
      maxTeamMembers: 0,
      versionHistory: false,
      cloudSync: false,
      export: false,
    },
  },
  {
    tier: 'pro',
    name: '高级版',
    price: 9,
    priceLabel: '$9/月',
    features: [
      '无限自定义模板',
      '所有内置模板',
      '一键复制功能',
      '团队共享（最多 10 人）',
      '版本历史记录',
      '云端同步',
      '导出为 JSON/Markdown',
      '优先技术支持',
    ],
    limits: {
      maxTemplates: Infinity,
      maxTeamMembers: 10,
      versionHistory: true,
      cloudSync: true,
      export: true,
    },
  },
];

/**
 * @description 根据套餐获取计划定义
 * @param {PlanTier} tier - 套餐等级
 * @returns {PlanDefinition} 计划定义
 */
export function getPlan(tier: PlanTier): PlanDefinition {
  return PLANS.find((p) => p.tier === tier) ?? PLANS[0];
}

/**
 * @description 检查功能是否可用
 * @param {PlanTier} tier - 用户当前套餐
 * @param {keyof PlanDefinition['limits']} feature - 功能名
 * @returns {boolean} 是否可用
 */
export function hasFeature(tier: PlanTier, feature: keyof PlanDefinition['limits']): boolean {
  const plan = getPlan(tier);
  return !!plan.limits[feature];
}
