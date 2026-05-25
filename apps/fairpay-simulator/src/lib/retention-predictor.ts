import type {
  CompanyInfo,
  CompensationRecommendation,
  Position,
  RetentionPrediction,
} from '@/types';

/**
 * @description 行业平均留存率基线（年度）
 */
const INDUSTRY_BASELINE_RETENTION: Record<string, number> = {
  technology: 78,
  healthcare: 80,
  finance: 82,
  retail: 65,
  manufacturing: 75,
  education: 84,
  hospitality: 60,
  construction: 70,
  marketing: 72,
  logistics: 68,
};

/**
 * @description 根据薪酬百分位估算留存率提升
 * 研究表明薪酬每高于市场中位数 10%，留存率可提高 2-5 个百分点
 * @param {number} avgPercentile - 平均市场百分位
 * @returns {number} 预期留存率提升（百分点）
 */
function percentileToRetentionBoost(avgPercentile: number): number {
  if (avgPercentile <= 25) return -5;
  if (avgPercentile <= 40) return -2;
  if (avgPercentile <= 50) return 0;
  if (avgPercentile <= 60) return 3;
  if (avgPercentile <= 70) return 6;
  if (avgPercentile <= 80) return 9;
  return 12;
}

/**
 * @description 预测员工留存率变化
 * @param {CompanyInfo} company - 公司信息
 * @param {Position[]} positions - 岗位列表
 * @param {CompensationRecommendation[]} recommendations - 薪酬推荐
 * @returns {RetentionPrediction} 留存率预测结果
 */
export function predictRetention(
  company: CompanyInfo,
  positions: Position[],
  recommendations: CompensationRecommendation[]
): RetentionPrediction {
  const baselineRetention = INDUSTRY_BASELINE_RETENTION[company.industry] ?? 75;

  const totalHeadcount = positions.reduce((s, p) => s + p.headcount, 0);

  const weightedCurrentPercentile = recommendations.reduce((sum, rec) => {
    const pos = positions.find((p) => p.id === rec.positionId);
    const hc = pos ? pos.headcount : 1;
    const currentPercentile = rec.marketPercentile - (rec.salaryIncreasePercent > 0 ? 10 : 0);
    return sum + Math.max(0, currentPercentile) * hc;
  }, 0) / Math.max(totalHeadcount, 1);

  const weightedNewPercentile = recommendations.reduce((sum, rec) => {
    const pos = positions.find((p) => p.id === rec.positionId);
    const hc = pos ? pos.headcount : 1;
    return sum + rec.marketPercentile * hc;
  }, 0) / Math.max(totalHeadcount, 1);

  const currentBoost = percentileToRetentionBoost(weightedCurrentPercentile);
  const newBoost = percentileToRetentionBoost(weightedNewPercentile);

  const currentRetentionRate = Math.min(98, Math.max(40, baselineRetention + currentBoost));
  const projectedRetentionRate = Math.min(98, Math.max(40, baselineRetention + newBoost));
  const retentionImprovement = Math.max(0, projectedRetentionRate - currentRetentionRate);

  const avgSalary = recommendations.length > 0
    ? recommendations.reduce((s, r) => s + r.recommendedSalary, 0) / recommendations.length
    : 50000;
  const avgReplacementCost = Math.round(avgSalary * 1.0);

  const currentTurnover = totalHeadcount * ((100 - currentRetentionRate) / 100);
  const projectedTurnover = totalHeadcount * ((100 - projectedRetentionRate) / 100);
  const employeesRetained = Math.round(Math.max(0, currentTurnover - projectedTurnover));
  const estimatedTurnoverCostSaved = employeesRetained * avgReplacementCost;

  return {
    currentRetentionRate: Math.round(currentRetentionRate * 10) / 10,
    projectedRetentionRate: Math.round(projectedRetentionRate * 10) / 10,
    retentionImprovement: Math.round(retentionImprovement * 10) / 10,
    estimatedTurnoverCostSaved: Math.round(estimatedTurnoverCostSaved),
    avgReplacementCost: Math.round(avgReplacementCost),
    employeesRetained,
  };
}
