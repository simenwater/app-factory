/** @typedef 行业类型枚举 */
export type Industry =
  | 'technology'
  | 'healthcare'
  | 'finance'
  | 'retail'
  | 'manufacturing'
  | 'education'
  | 'hospitality'
  | 'construction'
  | 'marketing'
  | 'logistics';

/** @typedef 经验级别枚举 */
export type ExperienceLevel = 'entry' | 'mid' | 'senior' | 'lead' | 'executive';

/** @typedef 地区类型枚举 */
export type Region =
  | 'us_west'
  | 'us_east'
  | 'us_midwest'
  | 'us_south'
  | 'europe_west'
  | 'europe_east'
  | 'asia_pacific'
  | 'latin_america';

/**
 * @interface CompanyInfo
 * @description 公司基本信息
 */
export interface CompanyInfo {
  name: string;
  industry: Industry;
  region: Region;
  annualRevenue: number;
  employeeCount: number;
  annualBudgetForSalaries: number;
}

/**
 * @interface Position
 * @description 岗位信息
 */
export interface Position {
  id: string;
  title: string;
  experienceLevel: ExperienceLevel;
  currentSalary?: number;
  headcount: number;
}

/**
 * @interface MarketSalaryData
 * @description 市场薪酬数据
 */
export interface MarketSalaryData {
  p25: number;
  p50: number;
  p75: number;
  p90: number;
}

/**
 * @interface CompensationRecommendation
 * @description 薪酬方案推荐
 */
export interface CompensationRecommendation {
  positionId: string;
  positionTitle: string;
  currentSalary: number;
  marketMedian: number;
  recommendedSalary: number;
  marketPercentile: number;
  salaryIncrease: number;
  salaryIncreasePercent: number;
  rationale: string;
}

/**
 * @interface ProfitImpact
 * @description 利润影响模拟结果
 */
export interface ProfitImpact {
  currentTotalSalaryCost: number;
  proposedTotalSalaryCost: number;
  additionalCost: number;
  additionalCostPercent: number;
  currentProfitMargin: number;
  projectedProfitMargin: number;
  breakEvenMonths: number;
  roiFromRetention: number;
}

/**
 * @interface RetentionPrediction
 * @description 员工留存率预测
 */
export interface RetentionPrediction {
  currentRetentionRate: number;
  projectedRetentionRate: number;
  retentionImprovement: number;
  estimatedTurnoverCostSaved: number;
  avgReplacementCost: number;
  employeesRetained: number;
}

/**
 * @interface SimulationResult
 * @description 完整模拟结果
 */
export interface SimulationResult {
  companyInfo: CompanyInfo;
  positions: Position[];
  recommendations: CompensationRecommendation[];
  profitImpact: ProfitImpact;
  retentionPrediction: RetentionPrediction;
  overallScore: number;
  summary: string;
  createdAt: string;
}

/**
 * @interface SubscriptionPlan
 * @description 订阅方案
 */
export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  period: 'monthly' | 'yearly';
  features: string[];
  simulationsPerMonth: number | 'unlimited';
  exportEnabled: boolean;
  highlighted?: boolean;
}
