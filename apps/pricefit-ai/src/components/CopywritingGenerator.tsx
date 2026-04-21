'use client';

import { useState } from 'react';
import { useAppStore } from '@/store';
import Card from './Card';
import { Wand2, ArrowRight, Copy, Check } from 'lucide-react';
import type { PricingTier } from '@/types';

/**
 * @description 定价页面文案 AI 生成器页面
 */
export default function CopywritingGenerator() {
  const { copywritingInput, copywritingResult, setCopywritingInput, generateCopy } = useAppStore();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const updateTier = (index: number, updates: Partial<PricingTier>) => {
    const tiers = [...copywritingInput.pricingTiers];
    tiers[index] = { ...tiers[index], ...updates };
    setCopywritingInput({ pricingTiers: tiers });
  };

  const addTier = () => {
    setCopywritingInput({
      pricingTiers: [
        ...copywritingInput.pricingTiers,
        { name: '新方案', price: 0, features: [], isRecommended: false },
      ],
    });
  };

  const removeTier = (index: number) => {
    setCopywritingInput({
      pricingTiers: copywritingInput.pricingTiers.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">
          <span className="bg-gradient-to-r from-brand-600 to-amber-500 bg-clip-text text-transparent">
            定价页面文案生成器
          </span>
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          输入产品信息和定价方案，自动生成高转化率的定价页面文案
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 产品信息 */}
        <Card title="🏷️ 产品信息">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">产品名称</label>
              <input
                type="text"
                value={copywritingInput.productName}
                onChange={(e) => setCopywritingInput({ productName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">产品描述</label>
              <textarea
                value={copywritingInput.productDescription}
                onChange={(e) => setCopywritingInput({ productDescription: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-brand-500 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">目标用户</label>
              <input
                type="text"
                value={copywritingInput.targetAudience}
                onChange={(e) => setCopywritingInput({ targetAudience: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">核心价值主张</label>
              <input
                type="text"
                value={copywritingInput.valueProposition}
                onChange={(e) => setCopywritingInput({ valueProposition: e.target.value })}
                placeholder="如：节省 80% 的重复工作时间"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        </Card>

        {/* 定价方案 */}
        <Card title="💳 定价方案">
          <div className="space-y-4">
            {copywritingInput.pricingTiers.map((tier, i) => (
              <div key={i} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tier.name}
                    onChange={(e) => updateTier(i, { name: e.target.value })}
                    className="flex-1 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm outline-none"
                    placeholder="方案名称"
                  />
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-500">$</span>
                    <input
                      type="number"
                      value={tier.price}
                      onChange={(e) => updateTier(i, { price: parseFloat(e.target.value) || 0 })}
                      className="w-20 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm outline-none"
                      min={0}
                    />
                    <span className="text-xs text-gray-500">/月</span>
                  </div>
                  <button
                    onClick={() => removeTier(i)}
                    className="p-1 text-red-400 hover:text-red-600 transition-colors"
                  >
                    ✕
                  </button>
                </div>
                <input
                  type="text"
                  value={tier.features.join('、')}
                  onChange={(e) =>
                    updateTier(i, { features: e.target.value.split('、').map((s) => s.trim()).filter(Boolean) })
                  }
                  placeholder="功能列表（顿号分隔）"
                  className="w-full px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm outline-none"
                />
                <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <input
                    type="checkbox"
                    checked={tier.isRecommended || false}
                    onChange={(e) => updateTier(i, { isRecommended: e.target.checked })}
                    className="rounded"
                  />
                  标记为推荐方案
                </label>
              </div>
            ))}
            <button
              onClick={addTier}
              className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-500 hover:text-brand-600 hover:border-brand-400 transition-colors"
            >
              + 添加定价方案
            </button>
          </div>
        </Card>
      </div>

      <div className="flex justify-center">
        <button
          onClick={generateCopy}
          className="px-8 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
        >
          <Wand2 className="w-5 h-5" />
          生成定价页面文案
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {copywritingResult && (
        <div className="animate-slide-up space-y-6">
          {/* 标题文案 */}
          <Card title="📝 标题文案">
            <div className="space-y-4">
              <CopyBlock
                label="主标题"
                text={copywritingResult.headline}
                fieldId="headline"
                copied={copiedField}
                onCopy={handleCopy}
              />
              <CopyBlock
                label="副标题"
                text={copywritingResult.subheadline}
                fieldId="subheadline"
                copied={copiedField}
                onCopy={handleCopy}
              />
              <CopyBlock
                label="社会证明"
                text={copywritingResult.socialProof}
                fieldId="social"
                copied={copiedField}
                onCopy={handleCopy}
              />
            </div>
          </Card>

          {/* 定价方案文案 */}
          <Card title="💰 定价方案文案">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {copywritingResult.tierDescriptions.map((tier, i) => (
                <div
                  key={i}
                  className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
                >
                  <h4 className="font-semibold mb-2">{tier.tierName}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{tier.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-brand-600 dark:text-brand-400">
                      CTA: {tier.cta}
                    </span>
                    <button
                      onClick={() => handleCopy(`${tier.description}\n\nCTA: ${tier.cta}`, `tier-${i}`)}
                      className="p-1 text-gray-400 hover:text-brand-600 transition-colors"
                    >
                      {copiedField === `tier-${i}` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* FAQ */}
          <Card title="❓ FAQ 文案">
            <div className="space-y-3">
              {copywritingResult.faqs.map((faq, i) => (
                <div key={i} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-sm mb-1">{faq.question}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{faq.answer}</p>
                    </div>
                    <button
                      onClick={() => handleCopy(`Q: ${faq.question}\nA: ${faq.answer}`, `faq-${i}`)}
                      className="p-1 text-gray-400 hover:text-brand-600 transition-colors shrink-0"
                    >
                      {copiedField === `faq-${i}` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* 预览 */}
          <Card title="👁️ 定价页面预览">
            <PricingPagePreview />
          </Card>
        </div>
      )}
    </div>
  );
}

function CopyBlock({
  label,
  text,
  fieldId,
  copied,
  onCopy,
}: {
  label: string;
  text: string;
  fieldId: string;
  copied: string | null;
  onCopy: (text: string, id: string) => void;
}) {
  return (
    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-gray-500">{label}</span>
        <button
          onClick={() => onCopy(text, fieldId)}
          className="p-1 text-gray-400 hover:text-brand-600 transition-colors"
        >
          {copied === fieldId ? (
            <Check className="w-3.5 h-3.5 text-emerald-500" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
      <p className="text-sm font-medium">{text}</p>
    </div>
  );
}

/**
 * @description 定价页面实时预览组件
 */
function PricingPagePreview() {
  const { copywritingInput, copywritingResult } = useAppStore();

  if (!copywritingResult) return null;

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="bg-gradient-to-b from-brand-600 to-brand-800 text-white text-center py-12 px-4">
        <h2 className="text-2xl font-bold mb-2">{copywritingResult.headline}</h2>
        <p className="text-brand-100 max-w-lg mx-auto">{copywritingResult.subheadline}</p>
      </div>

      <div className="p-6 bg-white dark:bg-gray-900">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {copywritingInput.pricingTiers.map((tier, i) => {
            const desc = copywritingResult.tierDescriptions[i];
            return (
              <div
                key={i}
                className={`p-4 rounded-xl border-2 text-center ${
                  tier.isRecommended
                    ? 'border-brand-500 shadow-lg relative'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                {tier.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-brand-600 text-white text-xs rounded-full">
                    {tier.badge}
                  </span>
                )}
                <h3 className="font-semibold mb-1">{tier.name}</h3>
                <div className="text-2xl font-bold mb-2">
                  {tier.price === 0 ? '免费' : `$${tier.price}`}
                  {tier.price > 0 && <span className="text-sm font-normal text-gray-500">/月</span>}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{desc?.description}</p>
                <ul className="text-xs text-left space-y-1 mb-4">
                  {tier.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-1.5">
                      <span className="text-emerald-500">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                    tier.isRecommended
                      ? 'bg-brand-600 text-white hover:bg-brand-700'
                      : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {desc?.cta || '开始使用'}
                </button>
              </div>
            );
          })}
        </div>
        <p className="text-center text-xs text-gray-500 mt-6">{copywritingResult.socialProof}</p>
      </div>
    </div>
  );
}
