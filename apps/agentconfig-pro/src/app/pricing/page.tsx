"use client";

import type { PricingPlan } from "@/types";
import { Check, Zap, Crown } from "lucide-react";

/**
 * @description 定价方案数据
 */
const PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "免费版",
    price: "$0",
    priceNote: "永久免费",
    features: [
      "单仓库分析",
      "AGENTS.md 通用格式",
      "基础项目结构分析",
      "每天 5 次生成",
    ],
    highlighted: false,
    cta: "开始使用",
  },
  {
    id: "pro",
    name: "专业版",
    price: "$5",
    priceNote: "/月",
    features: [
      "无限仓库分析",
      "所有导出格式",
      "深度代码风格分析",
      "自定义规则模板",
      "多仓库批量管理",
      "优先技术支持",
    ],
    highlighted: true,
    cta: "升级 Pro",
  },
  {
    id: "lifetime",
    name: "终身版",
    price: "$29",
    priceNote: "一次性付费",
    features: [
      "专业版全部功能",
      "终身免费更新",
      "私有仓库支持",
      "团队共享模板",
      "API 访问",
      "优先技术支持",
    ],
    highlighted: false,
    cta: "一次买断",
  },
];

/**
 * @description 定价页面
 */
export default function PricingPage() {
  return (
    <div className="space-y-8 py-8">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-text dark:text-text-dark">
          选择适合你的方案
        </h2>
        <p className="mt-2 text-base text-text-muted dark:text-text-muted-dark">
          免费开始，按需升级
        </p>
      </div>

      <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-3">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-2xl border-2 p-6 transition-all ${
              plan.highlighted
                ? "border-primary bg-primary/5 shadow-xl shadow-primary/10 dark:bg-primary/10"
                : "border-border dark:border-border-dark"
            }`}
          >
            {plan.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-accent px-4 py-1 text-xs font-bold text-white">
                推荐
              </div>
            )}

            <div className="mb-4 flex items-center gap-2">
              {plan.id === "free" && (
                <Zap className="h-5 w-5 text-text-muted dark:text-text-muted-dark" />
              )}
              {plan.id === "pro" && (
                <Crown className="h-5 w-5 text-primary" />
              )}
              {plan.id === "lifetime" && (
                <Crown className="h-5 w-5 text-warning" />
              )}
              <span className="text-lg font-bold text-text dark:text-text-dark">
                {plan.name}
              </span>
            </div>

            <div className="mb-6">
              <span className="text-4xl font-extrabold text-text dark:text-text-dark">
                {plan.price}
              </span>
              <span className="text-sm text-text-muted dark:text-text-muted-dark">
                {plan.priceNote}
              </span>
            </div>

            <ul className="mb-6 space-y-2.5">
              {plan.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2 text-sm text-text dark:text-text-dark"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  {feature}
                </li>
              ))}
            </ul>

            <button
              className={`w-full rounded-xl py-3 text-sm font-bold transition-all ${
                plan.highlighted
                  ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25 hover:shadow-xl"
                  : "border-2 border-border text-text hover:border-primary hover:text-primary dark:border-border-dark dark:text-text-dark dark:hover:border-primary"
              }`}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      <div className="text-center text-xs text-text-muted dark:text-text-muted-dark">
        支持 Stripe 安全支付 · 7 天退款保证
      </div>
    </div>
  );
}
