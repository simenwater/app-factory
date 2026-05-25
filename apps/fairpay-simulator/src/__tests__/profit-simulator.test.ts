import { simulateProfitImpact } from '@/lib/profit-simulator';
import type { CompanyInfo, Position, CompensationRecommendation } from '@/types';

describe('simulateProfitImpact', () => {
  const company: CompanyInfo = {
    name: 'TestCo',
    industry: 'technology',
    region: 'us_west',
    annualRevenue: 2000000,
    employeeCount: 10,
    annualBudgetForSalaries: 800000,
  };

  const positions: Position[] = [
    { id: '1', title: 'Engineer', experienceLevel: 'mid', currentSalary: 80000, headcount: 3 },
    { id: '2', title: 'Designer', experienceLevel: 'mid', currentSalary: 70000, headcount: 2 },
  ];

  const recommendations: CompensationRecommendation[] = [
    {
      positionId: '1',
      positionTitle: 'Engineer',
      currentSalary: 80000,
      marketMedian: 100000,
      recommendedSalary: 100000,
      marketPercentile: 55,
      salaryIncrease: 20000,
      salaryIncreasePercent: 25,
      rationale: 'Test',
    },
    {
      positionId: '2',
      positionTitle: 'Designer',
      currentSalary: 70000,
      marketMedian: 85000,
      recommendedSalary: 85000,
      marketPercentile: 50,
      salaryIncrease: 15000,
      salaryIncreasePercent: 21.4,
      rationale: 'Test',
    },
  ];

  it('should calculate current total salary cost', () => {
    const result = simulateProfitImpact(company, positions, recommendations, 5);
    // 80000*3 + 70000*2 = 380000
    expect(result.currentTotalSalaryCost).toBe(380000);
  });

  it('should calculate proposed total salary cost', () => {
    const result = simulateProfitImpact(company, positions, recommendations, 5);
    // 100000*3 + 85000*2 = 470000
    expect(result.proposedTotalSalaryCost).toBe(470000);
  });

  it('should compute additional cost correctly', () => {
    const result = simulateProfitImpact(company, positions, recommendations, 5);
    expect(result.additionalCost).toBe(90000);
  });

  it('should compute profit margins', () => {
    const result = simulateProfitImpact(company, positions, recommendations, 5);
    // Current: (2M - 380K) / 2M = 81%
    expect(result.currentProfitMargin).toBe(81);
    // Projected: (2M - 470K) / 2M = 76.5%
    expect(result.projectedProfitMargin).toBe(76.5);
  });

  it('should return a non-negative break-even period', () => {
    const result = simulateProfitImpact(company, positions, recommendations, 5);
    expect(result.breakEvenMonths).toBeGreaterThanOrEqual(0);
  });

  it('should estimate retention ROI', () => {
    const result = simulateProfitImpact(company, positions, recommendations, 5);
    expect(result.roiFromRetention).toBeGreaterThanOrEqual(0);
  });

  it('should produce positive ROI with larger workforce and higher improvement', () => {
    const largePositions: Position[] = [
      { id: '1', title: 'Engineer', experienceLevel: 'mid', currentSalary: 80000, headcount: 20 },
    ];
    const largeRecs: CompensationRecommendation[] = [
      {
        positionId: '1',
        positionTitle: 'Engineer',
        currentSalary: 80000,
        marketMedian: 100000,
        recommendedSalary: 100000,
        marketPercentile: 55,
        salaryIncrease: 20000,
        salaryIncreasePercent: 25,
        rationale: 'Test',
      },
    ];
    const result = simulateProfitImpact(company, largePositions, largeRecs, 10);
    expect(result.roiFromRetention).toBeGreaterThan(0);
  });
});
