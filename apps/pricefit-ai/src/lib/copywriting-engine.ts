/**
 * @fileoverview 定价页面文案 AI 生成引擎
 * 内置模板 + AI 增强的文案生成系统
 */

import type { CopywritingInput, CopywritingResult, PricingTier } from '@/types';

/**
 * 生成主标题
 * @param {CopywritingInput} input - 文案输入
 * @returns {string} 生成的主标题
 */
export function generateHeadline(input: CopywritingInput): string {
  const templates = [
    `为${input.targetAudience}打造的${input.valueProposition}`,
    `${input.productName} — ${input.valueProposition}`,
    `用 ${input.productName} 释放你的${input.valueProposition}`,
    `停止浪费时间，开始用 ${input.productName} ${input.valueProposition}`,
  ];
  return templates[Math.floor(input.productName.length % templates.length)];
}

/**
 * 生成副标题
 * @param {CopywritingInput} input - 文案输入
 * @returns {string} 生成的副标题
 */
export function generateSubheadline(input: CopywritingInput): string {
  return `${input.productDescription}。被全球${input.targetAudience}信赖和使用。`;
}

/**
 * 为定价层级生成销售描述
 * @param {PricingTier} tier - 定价层级
 * @param {string} targetAudience - 目标用户
 * @returns {{ description: string; cta: string }} 描述和 CTA
 */
export function generateTierCopy(
  tier: PricingTier,
  targetAudience: string
): { description: string; cta: string } {
  if (tier.price === 0) {
    return {
      description: `零成本开始体验核心功能。适合刚起步的${targetAudience}，无需信用卡即可开始。`,
      cta: '免费开始',
    };
  }

  if (tier.isRecommended) {
    return {
      description: `最受欢迎的选择。解锁全部高级功能，专为认真的${targetAudience}设计，让你的每一分投入都获得超额回报。`,
      cta: '立即升级',
    };
  }

  return {
    description: `${tier.features.length} 项专业功能，为追求卓越的${targetAudience}量身定制。获取完整的企业级能力。`,
    cta: '联系我们',
  };
}

/**
 * 生成 FAQ 列表
 * @param {CopywritingInput} input - 文案输入
 * @returns {Array<{ question: string; answer: string }>} FAQ 列表
 */
export function generateFAQs(input: CopywritingInput): { question: string; answer: string }[] {
  const freeTier = input.pricingTiers.find((t) => t.price === 0);
  const paidTier = input.pricingTiers.find((t) => t.price > 0);

  const faqs = [
    {
      question: `${input.productName} 适合我吗？`,
      answer: `如果你是${input.targetAudience}，并且需要${input.valueProposition}，那么 ${input.productName} 正是为你设计的。`,
    },
    {
      question: '我可以随时取消订阅吗？',
      answer: '当然可以！我们的订阅完全灵活，你可以随时取消，没有任何隐藏费用或长期合约。',
    },
    {
      question: '你们提供退款保证吗？',
      answer: '是的，我们提供 14 天无条件退款保证。如果产品不适合你，我们全额退款。',
    },
  ];

  if (freeTier) {
    faqs.push({
      question: '免费版和付费版有什么区别？',
      answer: `免费版包含${freeTier.features.slice(0, 2).join('、')}等核心功能。${paidTier ? `升级到付费版可解锁${paidTier.features.slice(0, 3).join('、')}等高级功能。` : ''}`,
    });
  }

  faqs.push({
    question: '如何获取技术支持？',
    answer: '我们通过邮件和在线聊天提供技术支持。付费用户享有优先响应。',
  });

  return faqs;
}

/**
 * 生成社会证明文案
 * @param {CopywritingInput} input - 文案输入
 * @returns {string} 社会证明文案
 */
export function generateSocialProof(input: CopywritingInput): string {
  return `已有超过 500+ ${input.targetAudience}使用 ${input.productName} 来${input.valueProposition}。加入他们，开启你的增长之旅。`;
}

/**
 * 生成完整的定价页面文案
 * @param {CopywritingInput} input - 文案输入
 * @returns {CopywritingResult} 完整文案结果
 */
export function generateCopywriting(input: CopywritingInput): CopywritingResult {
  const tierDescriptions = input.pricingTiers.map((tier) => {
    const copy = generateTierCopy(tier, input.targetAudience);
    return {
      tierName: tier.name,
      description: copy.description,
      cta: copy.cta,
    };
  });

  return {
    headline: generateHeadline(input),
    subheadline: generateSubheadline(input),
    tierDescriptions,
    faqs: generateFAQs(input),
    socialProof: generateSocialProof(input),
  };
}
