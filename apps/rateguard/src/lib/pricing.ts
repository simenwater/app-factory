/**
 * @fileoverview 动态定价建议引擎
 * 基于行业、经验、项目复杂度生成个性化定价建议
 */

import { UserProfile, PricingSuggestion, ClientIntentAnalysis } from "@/types";
import { getRate } from "./industry-rates";

/**
 * 根据工作年限调整的经验系数
 * @param years - 工作年限
 * @returns 调整系数 (0.8 - 1.5)
 */
function experienceMultiplier(years: number): number {
  if (years <= 1) return 0.85;
  if (years <= 3) return 1.0;
  if (years <= 5) return 1.15;
  if (years <= 8) return 1.3;
  return 1.5;
}

/**
 * 根据项目复杂度调整的系数
 * @param complexity - 复杂度评分 (1-10)
 * @returns 调整系数 (0.8 - 1.6)
 */
function complexityMultiplier(complexity: number): number {
  if (complexity <= 3) return 0.85;
  if (complexity <= 5) return 1.0;
  if (complexity <= 7) return 1.2;
  if (complexity <= 9) return 1.4;
  return 1.6;
}

/**
 * 根据风险等级调整的系数（高风险应提高报价作为风险溢价）
 * @param riskLevel - 风险等级
 * @returns 调整系数
 */
function riskPremium(riskLevel: string): number {
  switch (riskLevel) {
    case "critical":
      return 1.5;
    case "high":
      return 1.3;
    case "medium":
      return 1.15;
    default:
      return 1.0;
  }
}

/**
 * 生成动态定价建议
 * @param profile - 用户配置（行业、经验等）
 * @param analysis - 客户意图分析结果
 * @returns 定价建议
 */
export function generatePricingSuggestion(
  profile: UserProfile,
  analysis: ClientIntentAnalysis
): PricingSuggestion {
  const baseRate = getRate(profile.industry, profile.experienceLevel);

  const expMult = experienceMultiplier(profile.yearsOfExperience);
  const cplxMult = complexityMultiplier(analysis.complexityScore);
  const riskMult = riskPremium(analysis.riskLevel);

  const adjustedMin = Math.round(baseRate.min * expMult * cplxMult * riskMult);
  const adjustedMid = Math.round(baseRate.mid * expMult * cplxMult * riskMult);
  const adjustedMax = Math.round(baseRate.max * expMult * cplxMult * riskMult);

  const finalMin = Math.max(adjustedMin, profile.minimumHourlyRate);

  let reasoning = `基于 ${profile.industry} 行业 ${profile.experienceLevel} 级别的市场基准（$${baseRate.min}-$${baseRate.max}/小时），`;
  reasoning += `结合您 ${profile.yearsOfExperience} 年工作经验（×${expMult.toFixed(2)}）`;
  reasoning += `和项目复杂度 ${analysis.complexityScore}/10（×${cplxMult.toFixed(2)}）`;

  if (riskMult > 1) {
    reasoning += `，加上风险溢价（×${riskMult.toFixed(2)}）`;
  }

  reasoning += `，为您生成以上定价建议。`;

  if (analysis.detectedBudget.min !== null) {
    const clientBudget = analysis.detectedBudget.min;
    if (clientBudget < finalMin) {
      reasoning += ` 注意：客户预算（$${clientBudget}）低于建议最低价，存在被压价风险。`;
    }
  }

  return {
    minRate: finalMin,
    recommendedRate: Math.max(adjustedMid, finalMin),
    maxRate: adjustedMax,
    currency: profile.currency,
    unit: "hour",
    industryBenchmark: baseRate.mid,
    reasoning,
  };
}
