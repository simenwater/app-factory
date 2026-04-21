/**
 * @fileoverview 竞品定位对比矩阵生成引擎
 * 根据竞品信息生成功能对比矩阵和定位建议
 */

import type { Competitor, CompetitorMatrix } from '@/types';

/**
 * 从所有竞品中提取完整的功能列表（去重）
 * @param {Competitor[]} competitors - 竞品列表
 * @returns {string[]} 去重后的功能列表
 */
export function extractFeatureColumns(competitors: Competitor[]): string[] {
  const allFeatures = new Set<string>();
  competitors.forEach((c) => c.features.forEach((f) => allFeatures.add(f)));
  return Array.from(allFeatures).sort();
}

/**
 * 计算竞品的平均价格
 * @param {Competitor[]} competitors - 竞品列表
 * @returns {number} 平均价格
 */
export function calculateAveragePrice(competitors: Competitor[]): number {
  if (competitors.length === 0) return 0;
  const total = competitors.reduce((sum, c) => sum + c.price, 0);
  return Math.round((total / competitors.length) * 100) / 100;
}

/**
 * 判断价格-价值象限定位
 * @param {number} yourPrice - 你的产品价格
 * @param {number} avgCompetitorPrice - 竞品平均价格
 * @param {number} yourFeatureCount - 你的功能数量
 * @param {number} avgFeatureCount - 竞品平均功能数量
 * @returns {CompetitorMatrix['pricePositionQuadrant']} 象限定位
 */
export function determineQuadrant(
  yourPrice: number,
  avgCompetitorPrice: number,
  yourFeatureCount: number,
  avgFeatureCount: number
): CompetitorMatrix['pricePositionQuadrant'] {
  const isHighPrice = yourPrice > avgCompetitorPrice;
  const isHighValue = yourFeatureCount > avgFeatureCount;

  if (isHighPrice && isHighValue) return 'high-price-high-value';
  if (isHighPrice && !isHighValue) return 'high-price-low-value';
  if (!isHighPrice && isHighValue) return 'low-price-high-value';
  return 'low-price-low-value';
}

/**
 * 根据象限生成定位建议
 * @param {CompetitorMatrix['pricePositionQuadrant']} quadrant - 象限
 * @returns {string} 定位建议
 */
export function getPositioningSuggestion(
  quadrant: CompetitorMatrix['pricePositionQuadrant']
): string {
  const suggestions: Record<CompetitorMatrix['pricePositionQuadrant'], string> = {
    'high-price-high-value':
      '你的产品处于高端定位。建议强调品质和全面性，吸引注重效率且预算充足的客户。可以考虑推出白手套服务来巩固高端形象。',
    'high-price-low-value':
      '⚠️ 警告：价格高于竞品但功能较少，这是危险的定位。建议迅速补齐核心功能差距，或降低价格至更合理区间。',
    'low-price-high-value':
      '🌟 最佳性价比定位！你提供了更多价值但价格更低。这是快速获取市场份额的理想位置。建议适度提价以提升利润率。',
    'low-price-low-value':
      '你的产品处于经济型定位。建议聚焦核心功能做到极致，通过简洁和易用性形成差异化。可考虑免费增值模式。',
  };
  return suggestions[quadrant];
}

/**
 * 生成完整的竞品对比矩阵
 * @param {Competitor[]} competitors - 竞品列表
 * @param {number} yourPrice - 你的产品价格
 * @param {string[]} yourFeatures - 你的产品功能
 * @returns {CompetitorMatrix} 竞品对比矩阵
 */
export function generateCompetitorMatrix(
  competitors: Competitor[],
  yourPrice: number,
  yourFeatures: string[]
): CompetitorMatrix {
  const featureColumns = extractFeatureColumns([
    ...competitors,
    { name: '', price: 0, features: yourFeatures, targetAudience: '', strengths: [], weaknesses: [] },
  ]);

  const avgPrice = calculateAveragePrice(competitors);
  const avgFeatureCount =
    competitors.length > 0
      ? competitors.reduce((sum, c) => sum + c.features.length, 0) / competitors.length
      : 0;

  const quadrant = determineQuadrant(yourPrice, avgPrice, yourFeatures.length, avgFeatureCount);
  const positioningSuggestion = getPositioningSuggestion(quadrant);

  return {
    competitors,
    featureColumns,
    positioningSuggestion,
    pricePositionQuadrant: quadrant,
  };
}
