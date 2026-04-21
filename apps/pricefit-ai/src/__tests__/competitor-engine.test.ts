/**
 * @fileoverview 竞品定位引擎单元测试
 */

import {
  extractFeatureColumns,
  calculateAveragePrice,
  determineQuadrant,
  getPositioningSuggestion,
  generateCompetitorMatrix,
} from '@/lib/competitor-engine';
import type { Competitor } from '@/types';

describe('competitor-engine', () => {
  const mockCompetitors: Competitor[] = [
    {
      name: 'CompetitorA',
      price: 29,
      features: ['定价分析', 'A/B 测试', '报告'],
      targetAudience: 'SaaS 企业',
      strengths: ['品牌知名度'],
      weaknesses: ['价格高'],
    },
    {
      name: 'CompetitorB',
      price: 49,
      features: ['定价分析', '竞品追踪', 'API'],
      targetAudience: '大型企业',
      strengths: ['功能全面'],
      weaknesses: ['操作复杂'],
    },
  ];

  describe('extractFeatureColumns', () => {
    it('should extract and deduplicate features from all competitors', () => {
      const features = extractFeatureColumns(mockCompetitors);
      expect(features).toContain('定价分析');
      expect(features).toContain('A/B 测试');
      expect(features).toContain('竞品追踪');
      expect(features).toContain('API');
      expect(features).toContain('报告');
    });

    it('should sort features alphabetically', () => {
      const features = extractFeatureColumns(mockCompetitors);
      const sorted = [...features].sort();
      expect(features).toEqual(sorted);
    });

    it('should return empty array for no competitors', () => {
      expect(extractFeatureColumns([])).toEqual([]);
    });
  });

  describe('calculateAveragePrice', () => {
    it('should return average of all competitor prices', () => {
      expect(calculateAveragePrice(mockCompetitors)).toBe(39);
    });

    it('should return 0 for empty array', () => {
      expect(calculateAveragePrice([])).toBe(0);
    });
  });

  describe('determineQuadrant', () => {
    it('should return high-price-high-value when both are above average', () => {
      expect(determineQuadrant(50, 30, 5, 3)).toBe('high-price-high-value');
    });

    it('should return low-price-high-value when price is low but value is high', () => {
      expect(determineQuadrant(20, 30, 5, 3)).toBe('low-price-high-value');
    });

    it('should return high-price-low-value when price is high but value is low', () => {
      expect(determineQuadrant(50, 30, 2, 3)).toBe('high-price-low-value');
    });

    it('should return low-price-low-value when both are below average', () => {
      expect(determineQuadrant(20, 30, 2, 3)).toBe('low-price-low-value');
    });
  });

  describe('getPositioningSuggestion', () => {
    it('should return relevant suggestion for each quadrant', () => {
      expect(getPositioningSuggestion('high-price-high-value')).toContain('高端');
      expect(getPositioningSuggestion('low-price-high-value')).toContain('性价比');
      expect(getPositioningSuggestion('high-price-low-value')).toContain('警告');
      expect(getPositioningSuggestion('low-price-low-value')).toContain('经济');
    });
  });

  describe('generateCompetitorMatrix', () => {
    it('should generate a complete matrix', () => {
      const matrix = generateCompetitorMatrix(mockCompetitors, 35, ['定价分析', '文案生成', 'API']);

      expect(matrix.competitors).toHaveLength(2);
      expect(matrix.featureColumns.length).toBeGreaterThan(0);
      expect(matrix.positioningSuggestion).toBeTruthy();
      expect(matrix.pricePositionQuadrant).toBeTruthy();
    });

    it('should include features from both competitors and your product', () => {
      const matrix = generateCompetitorMatrix(mockCompetitors, 35, ['独有功能']);
      expect(matrix.featureColumns).toContain('独有功能');
      expect(matrix.featureColumns).toContain('定价分析');
    });
  });
});
