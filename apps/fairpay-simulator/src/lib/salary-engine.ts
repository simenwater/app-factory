import type {
  CompanyInfo,
  Position,
  CompensationRecommendation,
} from '@/types';
import { getMarketSalary } from './market-data';

/**
 * @description 计算薪酬在市场中的百分位
 * @param {number} salary - 当前薪酬
 * @param {{ p25: number; p50: number; p75: number; p90: number }} market - 市场数据
 * @returns {number} 百分位 (0-100)
 */
export function calculatePercentile(
  salary: number,
  market: { p25: number; p50: number; p75: number; p90: number }
): number {
  if (salary <= market.p25) return Math.round((salary / market.p25) * 25);
  if (salary <= market.p50) return Math.round(25 + ((salary - market.p25) / (market.p50 - market.p25)) * 25);
  if (salary <= market.p75) return Math.round(50 + ((salary - market.p50) / (market.p75 - market.p50)) * 25);
  if (salary <= market.p90) return Math.round(75 + ((salary - market.p75) / (market.p90 - market.p75)) * 15);
  return Math.min(99, Math.round(90 + ((salary - market.p90) / market.p90) * 10));
}

/**
 * @description 生成推荐薪酬 — 目标是让薪酬高于市场中位数(P60-P75)
 * @param {number} currentSalary - 当前薪酬
 * @param {{ p25: number; p50: number; p75: number; p90: number }} market - 市场数据
 * @param {number} budget - 单人可用预算
 * @returns {number} 推荐薪酬
 */
export function calculateRecommendedSalary(
  currentSalary: number,
  market: { p25: number; p50: number; p75: number; p90: number },
  budget: number
): number {
  const targetSalary = Math.round(market.p50 * 1.1 + market.p75 * 0.15);

  if (currentSalary >= targetSalary) {
    return currentSalary;
  }

  const recommended = Math.min(targetSalary, budget);
  return Math.max(recommended, currentSalary);
}

/**
 * @description 生成薪酬调整理由
 * @param {number} currentPercentile - 当前百分位
 * @param {number} newPercentile - 调整后百分位
 * @param {number} increasePercent - 增长百分比
 * @returns {string} 调整理由文本
 */
function generateRationale(
  currentPercentile: number,
  newPercentile: number,
  increasePercent: number
): string {
  if (increasePercent === 0) {
    return `Current compensation is already competitive at the ${currentPercentile}th percentile. No adjustment needed.`;
  }
  if (currentPercentile < 25) {
    return `Salary is significantly below market (${currentPercentile}th percentile). A ${increasePercent.toFixed(1)}% increase to the ${newPercentile}th percentile will help attract and retain talent.`;
  }
  if (currentPercentile < 50) {
    return `Salary is below market median (${currentPercentile}th percentile). Raising to the ${newPercentile}th percentile (${increasePercent.toFixed(1)}% increase) positions you as a competitive employer.`;
  }
  return `Moving from ${currentPercentile}th to ${newPercentile}th percentile (${increasePercent.toFixed(1)}% increase) establishes above-market compensation for stronger retention.`;
}

/**
 * @description 为所有岗位生成薪酬推荐方案
 * @param {CompanyInfo} company - 公司信息
 * @param {Position[]} positions - 岗位列表
 * @returns {CompensationRecommendation[]} 薪酬推荐方案列表
 */
export function generateCompensationPlan(
  company: CompanyInfo,
  positions: Position[]
): CompensationRecommendation[] {
  const totalHeadcount = positions.reduce((sum, p) => sum + p.headcount, 0);
  const budgetPerPerson = totalHeadcount > 0
    ? company.annualBudgetForSalaries / totalHeadcount
    : 0;

  return positions.map((position) => {
    const market = getMarketSalary(
      position.title,
      position.experienceLevel,
      company.industry,
      company.region
    );

    const currentSalary = position.currentSalary || market.p25;
    const recommended = calculateRecommendedSalary(currentSalary, market, budgetPerPerson);
    const currentPercentile = calculatePercentile(currentSalary, market);
    const newPercentile = calculatePercentile(recommended, market);
    const increase = recommended - currentSalary;
    const increasePercent = currentSalary > 0 ? (increase / currentSalary) * 100 : 0;

    return {
      positionId: position.id,
      positionTitle: position.title,
      currentSalary,
      marketMedian: market.p50,
      recommendedSalary: recommended,
      marketPercentile: newPercentile,
      salaryIncrease: increase,
      salaryIncreasePercent: increasePercent,
      rationale: generateRationale(currentPercentile, newPercentile, increasePercent),
    };
  });
}
