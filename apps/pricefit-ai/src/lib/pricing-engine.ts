/**
 * @fileoverview 基于价值的定价计算引擎
 * 核心算法：通过量化用户获得的经济价值，计算合理的 SaaS 定价
 */

import type { ValueMetrics, CostMetrics, PricingResult, PricingStrategy } from '@/types';

/**
 * 计算用户每月从产品获得的经济价值
 * @param {ValueMetrics} metrics - 价值指标
 * @returns {number} 月度价值（美元）
 */
export function calculateMonthlyValue(metrics: ValueMetrics): number {
  const timeSavingsValue =
    metrics.hoursSavedPerUse * metrics.engineerHourlyRate * metrics.usageFrequencyPerMonth;

  const reliabilityValue =
    (metrics.reliabilityImprovement / 100) * metrics.engineerHourlyRate * 10;

  return timeSavingsValue + reliabilityValue;
}

/**
 * 计算基于成本的底价
 * @param {CostMetrics} costs - 成本指标
 * @param {number} expectedCustomers - 预期客户数
 * @returns {number} 基于成本的最低价格
 */
export function calculateCostBasedPrice(costs: CostMetrics, expectedCustomers: number = 100): number {
  const totalMonthlyCost = costs.infrastructureCost + costs.apiCost;
  const perCustomerCost = totalMonthlyCost / Math.max(expectedCustomers, 1);
  const amortizedCAC = costs.customerAcquisitionCost / 12;

  return (perCustomerCost + amortizedCAC) / (1 - costs.targetMargin / 100);
}

/**
 * 推断定价策略
 * @param {number} valueBased - 基于价值的价格
 * @param {number} costBased - 基于成本的价格
 * @param {number} competitorPrice - 竞品价格
 * @returns {PricingStrategy} 推荐策略
 */
export function determinePricingStrategy(
  valueBased: number,
  costBased: number,
  competitorPrice: number
): PricingStrategy {
  const priceToValueRatio = competitorPrice > 0 ? valueBased / competitorPrice : 2;

  if (priceToValueRatio > 3) return 'premium';
  if (priceToValueRatio > 1.5) return 'value';
  if (costBased < competitorPrice * 0.5) return 'freemium';
  return 'penetration';
}

/**
 * 获取策略描述
 * @param {PricingStrategy} strategy - 定价策略
 * @returns {string} 策略描述文本
 */
export function getStrategyDescription(strategy: PricingStrategy): string {
  const descriptions: Record<PricingStrategy, string> = {
    penetration: '渗透定价：以低于竞品的价格快速获取市场份额，建立用户基础后逐步提价。',
    value: '价值定价：基于交付的实际价值定价，通常捕获用户价值的 10-20%，平衡增长与收入。',
    premium: '溢价定价：产品交付的价值远超市场均价，可大胆定价并通过高端定位强化品牌。',
    freemium: '免费增值：成本结构允许提供免费基础版，通过高级功能转化付费用户。',
  };
  return descriptions[strategy];
}

/**
 * 完整的定价计算
 * @param {ValueMetrics} valueMetrics - 价值指标
 * @param {CostMetrics} costMetrics - 成本指标
 * @param {number} competitorPrice - 竞品平均价格
 * @returns {PricingResult} 完整定价分析结果
 */
export function calculatePricing(
  valueMetrics: ValueMetrics,
  costMetrics: CostMetrics,
  competitorPrice: number = 0
): PricingResult {
  const monthlyValue = calculateMonthlyValue(valueMetrics);
  const valueBased = Math.round(monthlyValue * 0.15 * 100) / 100;
  const costBased = Math.round(calculateCostBasedPrice(costMetrics) * 100) / 100;
  const competitorBased = competitorPrice > 0 ? competitorPrice : valueBased;

  const strategy = determinePricingStrategy(valueBased, costBased, competitorBased);

  let recommended: number;
  switch (strategy) {
    case 'premium':
      recommended = Math.round(valueBased * 0.8);
      break;
    case 'value':
      recommended = Math.round((valueBased + competitorBased) / 2);
      break;
    case 'freemium':
      recommended = Math.round(competitorBased * 0.7);
      break;
    case 'penetration':
    default:
      recommended = Math.round(Math.max(costBased * 1.5, competitorBased * 0.8));
      break;
  }

  recommended = Math.max(recommended, costBased);

  const priceRange = {
    min: Math.round(Math.max(costBased, recommended * 0.7)),
    max: Math.round(recommended * 1.4),
  };

  const valueCaptureRate = monthlyValue > 0
    ? Math.round((recommended / monthlyValue) * 100 * 10) / 10
    : 0;

  return {
    valueBased,
    costBased,
    competitorBased,
    recommended,
    priceRange,
    monthlyValueDelivered: Math.round(monthlyValue),
    valueCaptureRate,
    strategy,
  };
}
