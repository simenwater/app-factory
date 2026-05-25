import { calculatePercentile, calculateRecommendedSalary, generateCompensationPlan } from '@/lib/salary-engine';
import type { CompanyInfo, Position } from '@/types';

describe('calculatePercentile', () => {
  const market = { p25: 60000, p50: 80000, p75: 100000, p90: 120000 };

  it('should return ~0 for very low salary', () => {
    expect(calculatePercentile(0, market)).toBe(0);
  });

  it('should return 25 at p25', () => {
    expect(calculatePercentile(60000, market)).toBe(25);
  });

  it('should return 50 at p50', () => {
    expect(calculatePercentile(80000, market)).toBe(50);
  });

  it('should return 75 at p75', () => {
    expect(calculatePercentile(100000, market)).toBe(75);
  });

  it('should return ~90 at p90', () => {
    expect(calculatePercentile(120000, market)).toBe(90);
  });

  it('should handle salary between p25 and p50', () => {
    const result = calculatePercentile(70000, market);
    expect(result).toBeGreaterThan(25);
    expect(result).toBeLessThan(50);
  });
});

describe('calculateRecommendedSalary', () => {
  const market = { p25: 60000, p50: 80000, p75: 100000, p90: 120000 };

  it('should not decrease salary', () => {
    const result = calculateRecommendedSalary(200000, market, 200000);
    expect(result).toBe(200000);
  });

  it('should recommend above market median', () => {
    const result = calculateRecommendedSalary(50000, market, 150000);
    expect(result).toBeGreaterThan(market.p50);
  });

  it('should respect budget constraint', () => {
    const result = calculateRecommendedSalary(50000, market, 60000);
    expect(result).toBeLessThanOrEqual(60000);
  });

  it('should keep current salary if already at target', () => {
    const result = calculateRecommendedSalary(110000, market, 150000);
    expect(result).toBe(110000);
  });
});

describe('generateCompensationPlan', () => {
  const company: CompanyInfo = {
    name: 'TestCo',
    industry: 'technology',
    region: 'us_west',
    annualRevenue: 2000000,
    employeeCount: 5,
    annualBudgetForSalaries: 600000,
  };

  const positions: Position[] = [
    { id: '1', title: 'Software Engineer', experienceLevel: 'mid', currentSalary: 80000, headcount: 2 },
    { id: '2', title: 'Designer', experienceLevel: 'senior', currentSalary: 90000, headcount: 1 },
  ];

  it('should return one recommendation per position', () => {
    const result = generateCompensationPlan(company, positions);
    expect(result).toHaveLength(2);
  });

  it('should include position details', () => {
    const result = generateCompensationPlan(company, positions);
    expect(result[0].positionId).toBe('1');
    expect(result[0].positionTitle).toBe('Software Engineer');
    expect(result[0].currentSalary).toBe(80000);
  });

  it('should recommend salaries >= current salary', () => {
    const result = generateCompensationPlan(company, positions);
    for (const rec of result) {
      expect(rec.recommendedSalary).toBeGreaterThanOrEqual(rec.currentSalary);
    }
  });

  it('should provide a rationale for each recommendation', () => {
    const result = generateCompensationPlan(company, positions);
    for (const rec of result) {
      expect(rec.rationale).toBeTruthy();
      expect(typeof rec.rationale).toBe('string');
    }
  });
});
