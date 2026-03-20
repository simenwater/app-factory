"use client";

import { useStore } from "@/store/useStore";
import { Check, Crown, Zap } from "lucide-react";

/**
 * @description 免费特性列表
 */
const freePlanFeatures = [
  "基础定价计算器",
  "行业定价模型推荐",
  "每月 3 份报告",
  "基础价值分析",
];

/**
 * @description Premium 特性列表
 */
const premiumFeatures = [
  "所有免费版功能",
  "高级定价模型",
  "详细竞品对比数据",
  "无限报告生成",
  "PDF 报告导出",
  "多币种支持",
  "优先客户支持",
  "定价 A/B 测试建议",
];

/**
 * @description 订阅定价页面
 */
export default function PricingPage() {
  const tier = useStore((s) => s.settings.subscriptionTier);
  const updateSettings = useStore((s) => s.updateSettings);

  /**
   * @description 模拟订阅切换（MVP 无实际支付集成）
   */
  function handleSubscribe() {
    if (tier === "free") {
      updateSettings({ subscriptionTier: "premium" });
    } else {
      updateSettings({ subscriptionTier: "free" });
    }
  }

  return (
    <div className="p-4">
      <div className="mb-6 text-center">
        <h1 className="mb-2 text-2xl font-bold text-text dark:text-text-dark">
          升级你的定价策略
        </h1>
        <p className="text-sm text-text-muted dark:text-text-muted-dark">
          解锁高级功能，做出更明智的定价决策
        </p>
      </div>

      <div className="space-y-4">
        <div
          className={`rounded-xl border-2 p-5 ${
            tier === "free"
              ? "border-primary bg-primary/5 dark:bg-primary/10"
              : "border-border bg-surface dark:border-border-dark dark:bg-surface-dark"
          }`}
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap size={20} className="text-text-muted dark:text-text-muted-dark" />
              <h2 className="text-lg font-semibold text-text dark:text-text-dark">
                Free 免费版
              </h2>
            </div>
            {tier === "free" && (
              <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-white">
                当前方案
              </span>
            )}
          </div>
          <p className="mb-4 text-3xl font-bold text-text dark:text-text-dark">
            $0
            <span className="text-sm font-normal text-text-muted dark:text-text-muted-dark">
              /月
            </span>
          </p>
          <ul className="space-y-2">
            {freePlanFeatures.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-2 text-sm text-text-muted dark:text-text-muted-dark"
              >
                <Check size={16} className="text-success" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div
          className={`rounded-xl border-2 p-5 ${
            tier === "premium"
              ? "border-primary bg-primary/5 dark:bg-primary/10"
              : "border-border bg-surface dark:border-border-dark dark:bg-surface-dark"
          }`}
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown size={20} className="text-primary" />
              <h2 className="text-lg font-semibold text-text dark:text-text-dark">
                Premium 专业版
              </h2>
            </div>
            {tier === "premium" && (
              <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-white">
                当前方案
              </span>
            )}
          </div>
          <p className="mb-1 text-3xl font-bold text-text dark:text-text-dark">
            $9
            <span className="text-sm font-normal text-text-muted dark:text-text-muted-dark">
              /月
            </span>
          </p>
          <p className="mb-4 text-xs text-text-muted dark:text-text-muted-dark">
            年付 $90/年（省 $18）
          </p>
          <ul className="mb-5 space-y-2">
            {premiumFeatures.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-2 text-sm text-text-muted dark:text-text-muted-dark"
              >
                <Check size={16} className="text-primary" />
                {feature}
              </li>
            ))}
          </ul>
          <button
            onClick={handleSubscribe}
            className={`w-full rounded-xl py-3 font-semibold transition-colors ${
              tier === "premium"
                ? "bg-border text-text-muted dark:bg-border-dark dark:text-text-muted-dark"
                : "bg-primary text-white hover:bg-primary-dark"
            }`}
          >
            {tier === "premium" ? "取消订阅" : "升级到 Premium"}
          </button>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-text-muted dark:text-text-muted-dark">
        MVP 演示版 · 实际支付功能即将上线
      </p>
    </div>
  );
}
