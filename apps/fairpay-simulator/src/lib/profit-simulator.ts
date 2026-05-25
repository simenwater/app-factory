import type {
  CompanyInfo,
  Position,
  CompensationRecommendation,
  ProfitImpact,
} from '@/types';

/**
 * @description 计算当前总薪酬支出
 * @param {Position[]} positions - 岗位列表
 * @param {CompensationRecommendation[]} recommendations - 推荐方案
 * @returns {number} 当前总薪酬
 */
function calculateCurrentTotalCost(
  positions: Position[],
  recommendations: CompensationRecommendation[]
): number {
  return positions.reduce((total, pos) => {
    const rec = recommendations.find((r) => r.positionId === pos.id);
    const salary = rec ? rec.currentSalary : (pos.currentSalary || 0);
    return total + salary * pos.headcount;
  }, 0);
}

/**
 * @description 计算推荐方案下的总薪酬支出
 * @param {Position[]} positions - 岗位列表
 * @param {CompensationRecommendation[]} recommendations - 推荐方案
 * @returns {number} 推荐后总薪酬
 */
function calculateProposedTotalCost(
  positions: Position[],
  recommendations: CompensationRecommendation[]
): number {
  return positions.reduce((total, pos) => {
    const rec = recommendations.find((r) => r.positionId === pos.id);
    const salary = rec ? rec.recommendedSalary : (pos.currentSalary || 0);
    return total + salary * pos.headcount;
  }, 0);
}

/**
 * @description 估算因提高薪酬带来的留人收益（节省的招聘替换成本）
 * 行业平均替换一个员工的成本 = 0.5x ~ 2x 年薪
 * @param {number} avgSalary - 平均薪酬
 * @param {number} retentionImprovement - 留存率提升（百分点）
 * @param {number} totalEmployees - 总员工数
 * @returns {number} 预计 ROI
 */
function estimateRetentionROI(
  avgSalary: number,
  retentionImprovement: number,
  totalEmployees: number
): number {
  const replacementCostMultiplier = 1.0;
  const employeesRetained = Math.round(totalEmployees * (retentionImprovement / 100));
  return employeesRetained * avgSalary * replacementCostMultiplier;
}

/**
 * @description 模拟薪酬调整对利润的影响
 * @param {CompanyInfo} company - 公司信息
 * @param {Position[]} positions - 岗位列表
 * @param {CompensationRecommendation[]} recommendations - 薪酬推荐方案
 * @param {number} retentionImprovement - 留存率改善（百分点）
 * @returns {ProfitImpact} 利润影响分析结果
 */
export function simulateProfitImpact(
  company: CompanyInfo,
  positions: Position[],
  recommendations: CompensationRecommendation[],
  retentionImprovement: number
): ProfitImpact {
  const currentTotal = calculateCurrentTotalCost(positions, recommendations);
  const proposedTotal = calculateProposedTotalCost(positions, recommendations);
  const additionalCost = proposedTotal - currentTotal;
  const additionalCostPercent = currentTotal > 0 ? (additionalCost / currentTotal) * 100 : 0;

  const revenue = company.annualRevenue;
  const currentProfit = revenue - currentTotal;
  const projectedProfit = revenue - proposedTotal;

  const currentProfitMargin = revenue > 0 ? (currentProfit / revenue) * 100 : 0;
  const projectedProfitMargin = revenue > 0 ? (projectedProfit / revenue) * 100 : 0;

  const totalEmployees = positions.reduce((s, p) => s + p.headcount, 0);
  const avgSalary = totalEmployees > 0 ? proposedTotal / totalEmployees : 0;
  const roiFromRetention = estimateRetentionROI(avgSalary, retentionImprovement, totalEmployees);

  const monthlyRetentionSavings = roiFromRetention / 12;
  const breakEvenMonths = monthlyRetentionSavings > 0
    ? Math.ceil(additionalCost / monthlyRetentionSavings)
    : additionalCost > 0 ? 36 : 0;

  return {
    currentTotalSalaryCost: Math.round(currentTotal),
    proposedTotalSalaryCost: Math.round(proposedTotal),
    additionalCost: Math.round(additionalCost),
    additionalCostPercent: Math.round(additionalCostPercent * 10) / 10,
    currentProfitMargin: Math.round(currentProfitMargin * 10) / 10,
    projectedProfitMargin: Math.round(projectedProfitMargin * 10) / 10,
    breakEvenMonths: Math.min(breakEvenMonths, 60),
    roiFromRetention: Math.round(roiFromRetention),
  };
}
