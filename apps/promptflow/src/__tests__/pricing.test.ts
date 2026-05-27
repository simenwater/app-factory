import { getPlan, hasFeature, PLANS } from '@/lib/pricing';

/**
 * @description 定价模块单元测试
 */
describe('pricing', () => {
  describe('PLANS', () => {
    it('should have free and pro plans', () => {
      expect(PLANS.length).toBe(2);
      expect(PLANS.map((p) => p.tier)).toEqual(['free', 'pro']);
    });

    it('free plan should be $0', () => {
      const free = PLANS.find((p) => p.tier === 'free');
      expect(free?.price).toBe(0);
    });

    it('pro plan should be $9', () => {
      const pro = PLANS.find((p) => p.tier === 'pro');
      expect(pro?.price).toBe(9);
    });
  });

  describe('getPlan', () => {
    it('should return correct plan by tier', () => {
      expect(getPlan('free').tier).toBe('free');
      expect(getPlan('pro').tier).toBe('pro');
    });
  });

  describe('hasFeature', () => {
    it('free plan should not have version history', () => {
      expect(hasFeature('free', 'versionHistory')).toBe(false);
    });

    it('free plan should not have cloud sync', () => {
      expect(hasFeature('free', 'cloudSync')).toBe(false);
    });

    it('pro plan should have version history', () => {
      expect(hasFeature('pro', 'versionHistory')).toBe(true);
    });

    it('pro plan should have cloud sync', () => {
      expect(hasFeature('pro', 'cloudSync')).toBe(true);
    });

    it('pro plan should have export', () => {
      expect(hasFeature('pro', 'export')).toBe(true);
    });

    it('free plan should not have export', () => {
      expect(hasFeature('free', 'export')).toBe(false);
    });
  });
});
