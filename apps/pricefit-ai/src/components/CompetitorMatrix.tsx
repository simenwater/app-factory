'use client';

import { useState } from 'react';
import { useAppStore } from '@/store';
import Card from './Card';
import InputField from './InputField';
import { Plus, Trash2, LayoutGrid, ArrowRight } from 'lucide-react';
import type { Competitor } from '@/types';

/**
 * @description 竞品定位对比矩阵页面
 */
export default function CompetitorMatrixView() {
  const {
    competitors,
    competitorMatrix,
    pricingResult,
    addCompetitor,
    removeCompetitor,
    generateMatrix,
  } = useAppStore();

  const [newCompetitor, setNewCompetitor] = useState<Competitor>({
    name: '',
    price: 0,
    features: [],
    targetAudience: '',
    strengths: [],
    weaknesses: [],
  });
  const [featuresInput, setFeaturesInput] = useState('');
  const [strengthsInput, setStrengthsInput] = useState('');
  const [weaknessesInput, setWeaknessesInput] = useState('');

  const [yourPrice, setYourPrice] = useState(pricingResult?.recommended || 29);
  const [yourFeaturesInput, setYourFeaturesInput] = useState('');

  const handleAddCompetitor = () => {
    if (!newCompetitor.name) return;
    addCompetitor({
      ...newCompetitor,
      features: featuresInput.split('、').map((s) => s.trim()).filter(Boolean),
      strengths: strengthsInput.split('、').map((s) => s.trim()).filter(Boolean),
      weaknesses: weaknessesInput.split('、').map((s) => s.trim()).filter(Boolean),
    });
    setNewCompetitor({ name: '', price: 0, features: [], targetAudience: '', strengths: [], weaknesses: [] });
    setFeaturesInput('');
    setStrengthsInput('');
    setWeaknessesInput('');
  };

  const handleGenerateMatrix = () => {
    const yourFeatures = yourFeaturesInput.split('、').map((s) => s.trim()).filter(Boolean);
    generateMatrix(yourPrice, yourFeatures);
  };

  const quadrantLabels: Record<string, string> = {
    'high-price-high-value': '🌟 高端定位',
    'high-price-low-value': '⚠️ 危险区域',
    'low-price-high-value': '🚀 最佳性价比',
    'low-price-low-value': '💡 经济定位',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">
          <span className="bg-gradient-to-r from-brand-600 to-purple-500 bg-clip-text text-transparent">
            竞品定位对比矩阵
          </span>
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          输入竞品信息，自动生成功能对比矩阵和差异化定位建议
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 添加竞品 */}
        <Card title="➕ 添加竞品">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">竞品名称</label>
              <input
                type="text"
                value={newCompetitor.name}
                onChange={(e) => setNewCompetitor({ ...newCompetitor, name: e.target.value })}
                placeholder="如：Stripe Billing"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <InputField
              label="月度价格"
              value={newCompetitor.price}
              onChange={(v) => setNewCompetitor({ ...newCompetitor, price: v })}
              unit="$/月"
              min={0}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">核心功能</label>
              <input
                type="text"
                value={featuresInput}
                onChange={(e) => setFeaturesInput(e.target.value)}
                placeholder="用顿号分隔，如：定价分析、A/B 测试"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">目标用户</label>
              <input
                type="text"
                value={newCompetitor.targetAudience}
                onChange={(e) => setNewCompetitor({ ...newCompetitor, targetAudience: e.target.value })}
                placeholder="如：中大型 SaaS 企业"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">主要优势</label>
              <input
                type="text"
                value={strengthsInput}
                onChange={(e) => setStrengthsInput(e.target.value)}
                placeholder="用顿号分隔"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">主要劣势</label>
              <input
                type="text"
                value={weaknessesInput}
                onChange={(e) => setWeaknessesInput(e.target.value)}
                placeholder="用顿号分隔"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <button
              onClick={handleAddCompetitor}
              disabled={!newCompetitor.name}
              className="w-full py-2 bg-brand-600 hover:bg-brand-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              添加竞品
            </button>
          </div>
        </Card>

        {/* 竞品列表 + 你的产品 */}
        <div className="space-y-4">
          <Card title="🏷️ 你的产品">
            <div className="space-y-3">
              <InputField
                label="你的产品月度价格"
                value={yourPrice}
                onChange={setYourPrice}
                unit="$/月"
                min={0}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">你的产品功能</label>
                <input
                  type="text"
                  value={yourFeaturesInput}
                  onChange={(e) => setYourFeaturesInput(e.target.value)}
                  placeholder="用顿号分隔你的产品核心功能"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
          </Card>

          {competitors.length > 0 && (
            <Card title={`📋 已添加竞品 (${competitors.length})`}>
              <div className="space-y-2">
                {competitors.map((c, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-sm">{c.name}</p>
                      <p className="text-xs text-gray-500">${c.price}/月 · {c.features.length} 项功能</p>
                    </div>
                    <button
                      onClick={() => removeCompetitor(i)}
                      className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>

      {competitors.length > 0 && (
        <div className="flex justify-center">
          <button
            onClick={handleGenerateMatrix}
            className="px-8 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
          >
            <LayoutGrid className="w-5 h-5" />
            生成对比矩阵
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {competitorMatrix && (
        <div className="animate-slide-up space-y-6">
          {/* 功能对比表 */}
          <Card title="📊 功能对比矩阵">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-2 px-3 font-medium text-gray-500">功能</th>
                    <th className="text-center py-2 px-3 font-medium text-brand-600 dark:text-brand-400">
                      你的产品
                    </th>
                    {competitorMatrix.competitors.map((c, i) => (
                      <th key={i} className="text-center py-2 px-3 font-medium text-gray-700 dark:text-gray-300">
                        {c.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-2 px-3 font-medium">价格</td>
                    <td className="py-2 px-3 text-center font-semibold text-brand-600">${yourPrice}/月</td>
                    {competitorMatrix.competitors.map((c, i) => (
                      <td key={i} className="py-2 px-3 text-center">${c.price}/月</td>
                    ))}
                  </tr>
                  {competitorMatrix.featureColumns.map((feature) => {
                    const yourFeatures = yourFeaturesInput.split('、').map((s) => s.trim());
                    return (
                      <tr key={feature} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-2 px-3">{feature}</td>
                        <td className="py-2 px-3 text-center">
                          {yourFeatures.includes(feature) ? (
                            <span className="text-emerald-500">✓</span>
                          ) : (
                            <span className="text-gray-300 dark:text-gray-600">—</span>
                          )}
                        </td>
                        {competitorMatrix.competitors.map((c, i) => (
                          <td key={i} className="py-2 px-3 text-center">
                            {c.features.includes(feature) ? (
                              <span className="text-emerald-500">✓</span>
                            ) : (
                              <span className="text-gray-300 dark:text-gray-600">—</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          {/* 定位分析 */}
          <Card title="🎯 定位分析">
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-brand-50 dark:bg-brand-900/20 rounded-xl">
                <span className="text-3xl">
                  {quadrantLabels[competitorMatrix.pricePositionQuadrant]?.split(' ')[0]}
                </span>
                <div>
                  <p className="font-semibold text-brand-800 dark:text-brand-200">
                    {quadrantLabels[competitorMatrix.pricePositionQuadrant]}
                  </p>
                  <p className="text-sm text-brand-700 dark:text-brand-300 mt-1">
                    {competitorMatrix.positioningSuggestion}
                  </p>
                </div>
              </div>

              {competitorMatrix.competitors.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {competitorMatrix.competitors.map((c, i) => (
                    <div key={i} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="font-medium text-sm mb-2">{c.name}</p>
                      {c.strengths.length > 0 && (
                        <div className="mb-1">
                          <span className="text-xs text-emerald-600 font-medium">优势：</span>
                          <span className="text-xs text-gray-600 dark:text-gray-400">{c.strengths.join('、')}</span>
                        </div>
                      )}
                      {c.weaknesses.length > 0 && (
                        <div>
                          <span className="text-xs text-red-500 font-medium">劣势：</span>
                          <span className="text-xs text-gray-600 dark:text-gray-400">{c.weaknesses.join('、')}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
