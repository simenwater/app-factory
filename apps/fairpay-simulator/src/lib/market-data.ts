import type { Industry, ExperienceLevel, Region, MarketSalaryData } from '@/types';

/**
 * @description 基准市场薪酬数据（年薪，美元）
 * 以 technology / us_west / mid 为基准，其他通过系数调整
 */
const BASE_SALARY_BY_ROLE: Record<string, Record<ExperienceLevel, MarketSalaryData>> = {
  'Software Engineer': {
    entry: { p25: 75000, p50: 85000, p75: 100000, p90: 120000 },
    mid: { p25: 100000, p50: 120000, p75: 145000, p90: 170000 },
    senior: { p25: 140000, p50: 165000, p75: 195000, p90: 230000 },
    lead: { p25: 170000, p50: 200000, p75: 240000, p90: 280000 },
    executive: { p25: 220000, p50: 270000, p75: 330000, p90: 400000 },
  },
  'Product Manager': {
    entry: { p25: 70000, p50: 80000, p75: 95000, p90: 110000 },
    mid: { p25: 95000, p50: 115000, p75: 135000, p90: 160000 },
    senior: { p25: 130000, p50: 155000, p75: 185000, p90: 220000 },
    lead: { p25: 160000, p50: 190000, p75: 225000, p90: 265000 },
    executive: { p25: 200000, p50: 250000, p75: 310000, p90: 380000 },
  },
  'Designer': {
    entry: { p25: 55000, p50: 65000, p75: 78000, p90: 90000 },
    mid: { p25: 78000, p50: 92000, p75: 110000, p90: 130000 },
    senior: { p25: 110000, p50: 130000, p75: 155000, p90: 180000 },
    lead: { p25: 140000, p50: 165000, p75: 195000, p90: 230000 },
    executive: { p25: 180000, p50: 220000, p75: 270000, p90: 330000 },
  },
  'Sales Representative': {
    entry: { p25: 40000, p50: 50000, p75: 60000, p90: 75000 },
    mid: { p25: 60000, p50: 75000, p75: 92000, p90: 115000 },
    senior: { p25: 85000, p50: 105000, p75: 130000, p90: 160000 },
    lead: { p25: 110000, p50: 135000, p75: 165000, p90: 200000 },
    executive: { p25: 150000, p50: 190000, p75: 240000, p90: 300000 },
  },
  'Marketing Specialist': {
    entry: { p25: 42000, p50: 50000, p75: 60000, p90: 72000 },
    mid: { p25: 60000, p50: 72000, p75: 88000, p90: 105000 },
    senior: { p25: 85000, p50: 100000, p75: 120000, p90: 145000 },
    lead: { p25: 110000, p50: 130000, p75: 155000, p90: 185000 },
    executive: { p25: 150000, p50: 185000, p75: 225000, p90: 280000 },
  },
  'Operations Manager': {
    entry: { p25: 45000, p50: 55000, p75: 65000, p90: 78000 },
    mid: { p25: 65000, p50: 78000, p75: 95000, p90: 115000 },
    senior: { p25: 90000, p50: 110000, p75: 130000, p90: 155000 },
    lead: { p25: 120000, p50: 145000, p75: 170000, p90: 200000 },
    executive: { p25: 160000, p50: 200000, p75: 245000, p90: 300000 },
  },
  'Customer Support': {
    entry: { p25: 32000, p50: 38000, p75: 45000, p90: 52000 },
    mid: { p25: 42000, p50: 50000, p75: 60000, p90: 72000 },
    senior: { p25: 55000, p50: 68000, p75: 82000, p90: 98000 },
    lead: { p25: 72000, p50: 88000, p75: 105000, p90: 125000 },
    executive: { p25: 100000, p50: 125000, p75: 155000, p90: 190000 },
  },
  'Accountant': {
    entry: { p25: 48000, p50: 55000, p75: 65000, p90: 75000 },
    mid: { p25: 62000, p50: 75000, p75: 90000, p90: 108000 },
    senior: { p25: 85000, p50: 102000, p75: 125000, p90: 150000 },
    lead: { p25: 110000, p50: 135000, p75: 160000, p90: 195000 },
    executive: { p25: 150000, p50: 185000, p75: 230000, p90: 285000 },
  },
  'HR Specialist': {
    entry: { p25: 42000, p50: 50000, p75: 60000, p90: 70000 },
    mid: { p25: 58000, p50: 70000, p75: 85000, p90: 100000 },
    senior: { p25: 80000, p50: 95000, p75: 115000, p90: 138000 },
    lead: { p25: 105000, p50: 125000, p75: 150000, p90: 180000 },
    executive: { p25: 140000, p50: 175000, p75: 215000, p90: 265000 },
  },
  'General': {
    entry: { p25: 35000, p50: 42000, p75: 50000, p90: 60000 },
    mid: { p25: 50000, p50: 62000, p75: 75000, p90: 90000 },
    senior: { p25: 72000, p50: 88000, p75: 108000, p90: 130000 },
    lead: { p25: 95000, p50: 118000, p75: 142000, p90: 170000 },
    executive: { p25: 130000, p50: 165000, p75: 205000, p90: 255000 },
  },
};

/** @description 行业薪酬调整系数 */
const INDUSTRY_MULTIPLIER: Record<Industry, number> = {
  technology: 1.15,
  finance: 1.12,
  healthcare: 1.05,
  manufacturing: 0.95,
  retail: 0.85,
  education: 0.82,
  hospitality: 0.80,
  construction: 0.92,
  marketing: 1.0,
  logistics: 0.90,
};

/** @description 地区薪酬调整系数 */
const REGION_MULTIPLIER: Record<Region, number> = {
  us_west: 1.15,
  us_east: 1.10,
  us_midwest: 0.90,
  us_south: 0.88,
  europe_west: 0.95,
  europe_east: 0.60,
  asia_pacific: 0.70,
  latin_america: 0.50,
};

/** @description 所有可选的岗位名称 */
export const AVAILABLE_ROLES = Object.keys(BASE_SALARY_BY_ROLE);

/** @description 行业显示名 */
export const INDUSTRY_LABELS: Record<Industry, string> = {
  technology: 'Technology',
  healthcare: 'Healthcare',
  finance: 'Finance & Banking',
  retail: 'Retail & E-commerce',
  manufacturing: 'Manufacturing',
  education: 'Education',
  hospitality: 'Hospitality & Food',
  construction: 'Construction',
  marketing: 'Marketing & Advertising',
  logistics: 'Logistics & Supply Chain',
};

/** @description 地区显示名 */
export const REGION_LABELS: Record<Region, string> = {
  us_west: 'US West Coast',
  us_east: 'US East Coast',
  us_midwest: 'US Midwest',
  us_south: 'US South',
  europe_west: 'Western Europe',
  europe_east: 'Eastern Europe',
  asia_pacific: 'Asia Pacific',
  latin_america: 'Latin America',
};

/** @description 经验级别显示名 */
export const EXPERIENCE_LABELS: Record<ExperienceLevel, string> = {
  entry: 'Entry Level (0-2 yrs)',
  mid: 'Mid Level (3-5 yrs)',
  senior: 'Senior (6-10 yrs)',
  lead: 'Lead / Manager (10+ yrs)',
  executive: 'Executive / Director',
};

/**
 * @description 根据岗位名匹配最接近的基准角色
 * @param {string} title - 岗位名称
 * @returns {string} 匹配的基准角色名
 */
export function matchRole(title: string): string {
  const lower = title.toLowerCase();
  if (lower.includes('engineer') || lower.includes('developer') || lower.includes('programmer')) {
    return 'Software Engineer';
  }
  if (lower.includes('product') && lower.includes('manager')) return 'Product Manager';
  if (lower.includes('design')) return 'Designer';
  if (lower.includes('sales')) return 'Sales Representative';
  if (lower.includes('market')) return 'Marketing Specialist';
  if (lower.includes('operation') || lower.includes('ops')) return 'Operations Manager';
  if (lower.includes('support') || lower.includes('service')) return 'Customer Support';
  if (lower.includes('account') || lower.includes('finance') || lower.includes('book')) return 'Accountant';
  if (lower.includes('hr') || lower.includes('human') || lower.includes('recruit')) return 'HR Specialist';
  return 'General';
}

/**
 * @description 获取经过行业和地区调整后的市场薪酬数据
 * @param {string} positionTitle - 岗位名称
 * @param {ExperienceLevel} level - 经验级别
 * @param {Industry} industry - 行业
 * @param {Region} region - 地区
 * @returns {MarketSalaryData} 调整后的市场薪酬数据
 */
export function getMarketSalary(
  positionTitle: string,
  level: ExperienceLevel,
  industry: Industry,
  region: Region
): MarketSalaryData {
  const role = matchRole(positionTitle);
  const base = BASE_SALARY_BY_ROLE[role][level];
  const multiplier = INDUSTRY_MULTIPLIER[industry] * REGION_MULTIPLIER[region];

  return {
    p25: Math.round(base.p25 * multiplier),
    p50: Math.round(base.p50 * multiplier),
    p75: Math.round(base.p75 * multiplier),
    p90: Math.round(base.p90 * multiplier),
  };
}
