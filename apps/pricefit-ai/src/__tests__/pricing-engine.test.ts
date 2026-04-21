/**
 * @fileoverview 定价计算引擎单元测试
 */

import {
  calculateMonthlyValue,
  calculateCostBasedPrice,
  determinePricingStrategy,
  calculatePricing,
  getStrategyDescription,
} from '@/lib/pricing-engine';
import type { ValueMetrics, CostMetrics } from '@/types';

describe('pricing-engine', () => {
  const defaultValueMetrics: ValueMetrics = {
    hoursSavedPerUse: 2,
    engineerHourlyRate: 75,
    usageFrequencyPerMonth: 20,
    reliabilityImprovement: 15,
    alternativeCost: 50,
  };

  const defaultCostMetrics: CostMetrics = {
    infrastructureCost: 200,
    apiCost: 100,
    customerAcquisitionCost: 50,
    targetMargin: 70,
  };

  describe('calculateMonthlyValue', () => {
    it('should calculate monthly value from time savings and reliability', () => {
      const value = calculateMonthlyValue(defaultValueMetrics);
      // timeSavingsValue = 2 * 75 * 20 = 3000
      // reliabilityValue = (15/100) * 75 * 10 = 112.5
      expect(value).toBe(3112.5);
    });

    it('should return 0 when all metrics are 0', () => {
      const value = calculateMonthlyValue({
        hoursSavedPerUse: 0,
        engineerHourlyRate: 0,
        usageFrequencyPerMonth: 0,
        reliabilityImprovement: 0,
        alternativeCost: 0,
      });
      expect(value).toBe(0);
    });

    it('should handle large values', () => {
      const value = calculateMonthlyValue({
        hoursSavedPerUse: 10,
        engineerHourlyRate: 200,
        usageFrequencyPerMonth: 40,
        reliabilityImprovement: 50,
        alternativeCost: 500,
      });
      expect(value).toBeGreaterThan(0);
    });
  });

  describe('calculateCostBasedPrice', () => {
    it('should calculate cost-based price with margin', () => {
      const price = calculateCostBasedPrice(defaultCostMetrics);
      expect(price).toBeGreaterThan(0);
    });

    it('should increase with higher target margin', () => {
      const lowMargin = calculateCostBasedPrice({ ...defaultCostMetrics, targetMargin: 30 });
      const highMargin = calculateCostBasedPrice({ ...defaultCostMetrics, targetMargin: 80 });
      expect(highMargin).toBeGreaterThan(lowMargin);
    });

    it('should handle zero infrastructure cost', () => {
      const price = calculateCostBasedPrice({
        ...defaultCostMetrics,
        infrastructureCost: 0,
        apiCost: 0,
      });
      expect(price).toBeGreaterThan(0);
    });
  });

  describe('determinePricingStrategy', () => {
    it('should return premium for high value-to-competitor ratio', () => {
      expect(determinePricingStrategy(300, 10, 50)).toBe('premium');
    });

    it('should return value for moderate ratio', () => {
      expect(determinePricingStrategy(100, 10, 50)).toBe('value');
    });

    it('should return freemium when cost is much lower than competitor', () => {
      expect(determinePricingStrategy(50, 10, 50)).toBe('freemium');
    });

    it('should return penetration for default case', () => {
      expect(determinePricingStrategy(50, 40, 50)).toBe('penetration');
    });
  });

  describe('getStrategyDescription', () => {
    it('should return description for each strategy type', () => {
      expect(getStrategyDescription('penetration')).toContain('渗透');
      expect(getStrategyDescription('value')).toContain('价值');
      expect(getStrategyDescription('premium')).toContain('溢价');
      expect(getStrategyDescription('freemium')).toContain('免费');
    });
  });

  describe('calculatePricing', () => {
    it('should return a complete pricing result', () => {
      const result = calculatePricing(defaultValueMetrics, defaultCostMetrics, 50);

      expect(result).toHaveProperty('valueBased');
      expect(result).toHaveProperty('costBased');
      expect(result).toHaveProperty('competitorBased');
      expect(result).toHaveProperty('recommended');
      expect(result).toHaveProperty('priceRange');
      expect(result).toHaveProperty('monthlyValueDelivered');
      expect(result).toHaveProperty('valueCaptureRate');
      expect(result).toHaveProperty('strategy');
    });

    it('should ensure recommended price is at least the cost-based price', () => {
      const result = calculatePricing(defaultValueMetrics, defaultCostMetrics, 0);
      expect(result.recommended).toBeGreaterThanOrEqual(result.costBased);
    });

    it('should calculate price range around recommended', () => {
      const result = calculatePricing(defaultValueMetrics, defaultCostMetrics, 50);
      expect(result.priceRange.min).toBeLessThanOrEqual(result.recommended);
      expect(result.priceRange.max).toBeGreaterThanOrEqual(result.recommended);
    });

    it('should use value-based as competitor reference when competitor price is 0', () => {
      const result = calculatePricing(defaultValueMetrics, defaultCostMetrics, 0);
      expect(result.competitorBased).toBe(result.valueBased);
    });

    it('should calculate value capture rate as percentage', () => {
      const result = calculatePricing(defaultValueMetrics, defaultCostMetrics, 50);
      expect(result.valueCaptureRate).toBeGreaterThan(0);
      expect(result.valueCaptureRate).toBeLessThan(100);
    });
  });
});
