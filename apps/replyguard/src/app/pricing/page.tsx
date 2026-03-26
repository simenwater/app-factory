"use client";

import { useStore } from "@/store/useStore";
import Link from "next/link";
import { ArrowLeft, Check, Sparkles, Zap, Crown } from "lucide-react";
import type { PlanType } from "@/types";

/**
 * @description 订阅计划定价
 */
interface PricingPlan {
  type: PlanType;
  name: string;
  price: string;
  period: string;
  description: string;
  icon: typeof Sparkles;
  features: string[];
  highlighted: boolean;
}

const PLANS: PricingPlan[] = [
  {
    type: "free",
    name: "免费版",
    price: "$0",
    period: "",
    description: "体验核心功能",
    icon: Sparkles,
    features: [
      "3 次免费回复生成",
      "基础情感分析",
      "单一回复风格",
      "社区支持",
    ],
    highlighted: false,
  },
  {
    type: "single",
    name: "单次购买",
    price: "$2.99",
    period: "/ 条",
    description: "按需付费",
    icon: Zap,
    features: [
      "单次回复生成",
      "完整情感分析",
      "三种回复风格",
      "高级语气调整",
    ],
    highlighted: false,
  },
  {
    type: "pro",
    name: "Pro 订阅",
    price: "$9.9",
    period: "/ 月",
    description: "无限次使用",
    icon: Crown,
    features: [
      "无限次回复生成",
      "深度情感分析",
      "三种回复风格",
      "高级语气调整",
      "效果追踪与优化",
      "优先支持",
      "多语言支持",
    ],
    highlighted: true,
  },
];

/**
 * @description 定价页面
 */
export default function PricingPage() {
  const { settings, updateSettings } = useStore();

  const handleSelectPlan = (planType: PlanType) => {
    updateSettings({ plan: planType });
    if (planType === "pro") {
      updateSettings({ freeRepliesRemaining: 999 });
    } else if (planType === "single") {
      updateSettings({
        freeRepliesRemaining: settings.freeRepliesRemaining + 1,
      });
    }
  };

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/"
          className="rounded-lg p-1.5 hover:bg-surface dark:hover:bg-surface-dark"
        >
          <ArrowLeft size={20} className="text-text dark:text-text-dark" />
        </Link>
        <h1 className="text-lg font-bold text-text dark:text-text-dark">
          订阅计划
        </h1>
      </div>

      {/* Current Plan */}
      <div className="mb-6 rounded-xl bg-gradient-to-r from-primary to-primary-light p-4 text-white">
        <p className="text-xs opacity-80">当前计划</p>
        <p className="text-lg font-bold">
          {settings.plan === "free"
            ? "免费版"
            : settings.plan === "single"
              ? "单次购买"
              : "Pro 订阅"}
        </p>
        {settings.plan === "free" && (
          <p className="mt-1 text-xs opacity-80">
            剩余 {settings.freeRepliesRemaining} 次免费生成
          </p>
        )}
      </div>

      {/* Plans */}
      <div className="space-y-4">
        {PLANS.map((plan) => {
          const Icon = plan.icon;
          const isCurrentPlan = settings.plan === plan.type;
          return (
            <div
              key={plan.type}
              className={`rounded-xl border p-4 transition-all ${
                plan.highlighted
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "border-border dark:border-border-dark"
              }`}
            >
              {plan.highlighted && (
                <div className="mb-3 inline-block rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-white">
                  推荐
                </div>
              )}

              <div className="mb-3 flex items-center gap-3">
                <div
                  className={`rounded-lg p-2 ${
                    plan.highlighted ? "bg-primary/10" : "bg-surface dark:bg-surface-dark"
                  }`}
                >
                  <Icon
                    size={20}
                    className={plan.highlighted ? "text-primary" : "text-text-muted dark:text-text-muted-dark"}
                  />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-text dark:text-text-dark">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-text-muted dark:text-text-muted-dark">
                    {plan.description}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <span className="text-2xl font-bold text-text dark:text-text-dark">
                  {plan.price}
                </span>
                <span className="text-sm text-text-muted dark:text-text-muted-dark">
                  {plan.period}
                </span>
              </div>

              <ul className="mb-4 space-y-2">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-xs text-text dark:text-text-dark"
                  >
                    <Check size={14} className="text-success" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSelectPlan(plan.type)}
                disabled={isCurrentPlan}
                className={`w-full rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                  isCurrentPlan
                    ? "bg-surface text-text-muted dark:bg-surface-dark dark:text-text-muted-dark"
                    : plan.highlighted
                      ? "bg-primary text-white hover:bg-primary-dark"
                      : "border border-border text-text hover:border-primary hover:text-primary dark:border-border-dark dark:text-text-dark"
                }`}
              >
                {isCurrentPlan ? "当前计划" : "选择此计划"}
              </button>
            </div>
          );
        })}
      </div>

      {/* FAQ */}
      <div className="mt-8">
        <h2 className="mb-4 text-sm font-semibold text-text dark:text-text-dark">
          常见问题
        </h2>
        <div className="space-y-3">
          {[
            {
              q: "可以随时取消订阅吗？",
              a: "是的，Pro 订阅可随时取消，取消后当月仍可使用至到期。",
            },
            {
              q: "单次购买是什么意思？",
              a: "无需订阅，每次只需支付 $2.99 即可对单条评价进行分析并生成回复。",
            },
            {
              q: "支持哪些支付方式？",
              a: "支持信用卡、PayPal 以及微信/支付宝支付。",
            },
          ].map(({ q, a }) => (
            <div
              key={q}
              className="rounded-xl border border-border bg-surface p-3 dark:border-border-dark dark:bg-surface-dark"
            >
              <p className="mb-1 text-xs font-medium text-text dark:text-text-dark">
                {q}
              </p>
              <p className="text-xs text-text-muted dark:text-text-muted-dark">
                {a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
