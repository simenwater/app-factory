import { predictRetention } from '@/lib/retention-predictor';
import type { CompanyInfo, Position, CompensationRecommendation } from '@/types';

describe('predictRetention', () => {
  const company: CompanyInfo = {
    name: 'TestCo',
    industry: 'technology',
    region: 'us_west',
    annualRevenue: 2000000,
    employeeCount: 10,
    annualBudgetForSalaries: 800000,
  };

  const positions: Position[] = [
    { id: '1', title: 'Engineer', experienceLevel: 'mid', currentSalary: 80000, headcount: 5 },
  ];

  it('should return retention rates between 0 and 100', () => {
    const recs: CompensationRecommendation[] = [
      {
        positionId: '1',
        positionTitle: 'Engineer',
        currentSalary: 80000,
        marketMedian: 100000,
        recommendedSalary: 110000,
        marketPercentile: 65,
        salaryIncrease: 30000,
        salaryIncreasePercent: 37.5,
        rationale: 'Test',
      },
    ];

    const result = predictRetention(company, positions, recs);
    expect(result.currentRetentionRate).toBeGreaterThanOrEqual(0);
    expect(result.currentRetentionRate).toBeLessThanOrEqual(100);
    expect(result.projectedRetentionRate).toBeGreaterThanOrEqual(0);
    expect(result.projectedRetentionRate).toBeLessThanOrEqual(100);
  });

  it('should predict improvement when salary increases significantly', () => {
    const recs: CompensationRecommendation[] = [
      {
        positionId: '1',
        positionTitle: 'Engineer',
        currentSalary: 60000,
        marketMedian: 100000,
        recommendedSalary: 110000,
        marketPercentile: 70,
        salaryIncrease: 50000,
        salaryIncreasePercent: 83.3,
        rationale: 'Test',
      },
    ];

    const result = predictRetention(company, positions, recs);
    expect(result.retentionImprovement).toBeGreaterThanOrEqual(0);
  });

  it('should estimate turnover cost savings', () => {
    const recs: CompensationRecommendation[] = [
      {
        positionId: '1',
        positionTitle: 'Engineer',
        currentSalary: 60000,
        marketMedian: 100000,
        recommendedSalary: 110000,
        marketPercentile: 70,
        salaryIncrease: 50000,
        salaryIncreasePercent: 83.3,
        rationale: 'Test',
      },
    ];

    const result = predictRetention(company, positions, recs);
    expect(result.estimatedTurnoverCostSaved).toBeGreaterThanOrEqual(0);
    expect(result.avgReplacementCost).toBeGreaterThan(0);
  });

  it('should handle zero headcount gracefully', () => {
    const emptyPositions: Position[] = [];
    const emptyRecs: CompensationRecommendation[] = [];
    const result = predictRetention(company, emptyPositions, emptyRecs);
    expect(result.currentRetentionRate).toBeGreaterThanOrEqual(0);
  });
});
