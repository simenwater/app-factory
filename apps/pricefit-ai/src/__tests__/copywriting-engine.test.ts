/**
 * @fileoverview 文案生成引擎单元测试
 */

import {
  generateHeadline,
  generateSubheadline,
  generateTierCopy,
  generateFAQs,
  generateSocialProof,
  generateCopywriting,
} from '@/lib/copywriting-engine';
import type { CopywritingInput } from '@/types';

describe('copywriting-engine', () => {
  const defaultInput: CopywritingInput = {
    productName: 'TestProduct',
    productDescription: '一款测试产品',
    targetAudience: '开发者',
    valueProposition: '提升效率',
    pricingTiers: [
      { name: '免费版', price: 0, features: ['基础功能', '社区支持'], isRecommended: false },
      { name: '专业版', price: 19, features: ['全部功能', '优先支持', 'API'], isRecommended: true, badge: '推荐' },
      { name: '企业版', price: 49, features: ['全部功能', '专属支持', 'SLA'], isRecommended: false },
    ],
  };

  describe('generateHeadline', () => {
    it('should generate a headline containing product name or value proposition', () => {
      const headline = generateHeadline(defaultInput);
      const containsRelevant =
        headline.includes(defaultInput.productName) ||
        headline.includes(defaultInput.valueProposition) ||
        headline.includes(defaultInput.targetAudience);
      expect(containsRelevant).toBe(true);
    });
  });

  describe('generateSubheadline', () => {
    it('should include product description and target audience', () => {
      const sub = generateSubheadline(defaultInput);
      expect(sub).toContain(defaultInput.productDescription);
      expect(sub).toContain(defaultInput.targetAudience);
    });
  });

  describe('generateTierCopy', () => {
    it('should generate free tier copy with "免费" CTA', () => {
      const copy = generateTierCopy({ name: '免费版', price: 0, features: [] }, '开发者');
      expect(copy.cta).toContain('免费');
    });

    it('should generate recommended tier copy with upgrade CTA', () => {
      const copy = generateTierCopy(
        { name: '专业版', price: 19, features: ['功能1'], isRecommended: true },
        '开发者'
      );
      expect(copy.cta).toContain('升级');
    });

    it('should generate enterprise tier copy with contact CTA', () => {
      const copy = generateTierCopy(
        { name: '企业版', price: 99, features: ['功能1', '功能2'] },
        '开发者'
      );
      expect(copy.cta).toContain('联系');
    });
  });

  describe('generateFAQs', () => {
    it('should generate at least 3 FAQs', () => {
      const faqs = generateFAQs(defaultInput);
      expect(faqs.length).toBeGreaterThanOrEqual(3);
    });

    it('should include product-specific FAQ when free tier exists', () => {
      const faqs = generateFAQs(defaultInput);
      const hasFreeTierFAQ = faqs.some((f) => f.question.includes('免费') || f.answer.includes('免费'));
      expect(hasFreeTierFAQ).toBe(true);
    });

    it('should include cancellation FAQ', () => {
      const faqs = generateFAQs(defaultInput);
      const hasCancelFAQ = faqs.some((f) => f.question.includes('取消'));
      expect(hasCancelFAQ).toBe(true);
    });
  });

  describe('generateSocialProof', () => {
    it('should include product name and target audience', () => {
      const proof = generateSocialProof(defaultInput);
      expect(proof).toContain(defaultInput.productName);
      expect(proof).toContain(defaultInput.targetAudience);
    });
  });

  describe('generateCopywriting', () => {
    it('should return a complete copywriting result', () => {
      const result = generateCopywriting(defaultInput);

      expect(result).toHaveProperty('headline');
      expect(result).toHaveProperty('subheadline');
      expect(result).toHaveProperty('tierDescriptions');
      expect(result).toHaveProperty('faqs');
      expect(result).toHaveProperty('socialProof');
    });

    it('should generate tier descriptions for each input tier', () => {
      const result = generateCopywriting(defaultInput);
      expect(result.tierDescriptions).toHaveLength(defaultInput.pricingTiers.length);
    });

    it('should include tier names in descriptions', () => {
      const result = generateCopywriting(defaultInput);
      result.tierDescriptions.forEach((td, i) => {
        expect(td.tierName).toBe(defaultInput.pricingTiers[i].name);
      });
    });
  });
});
