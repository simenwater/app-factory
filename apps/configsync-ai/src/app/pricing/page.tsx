"use client";

/**
 * @fileoverview 定价页面
 * 展示订阅计划与变现框架
 */

import { useStore } from "@/store/useStore";
import { PlanType } from "@/types";
import { Check, Star, Users, Zap } from "lucide-react";

/** 定价计划数据 */
const plans: {
  id: PlanType;
  name: string;
  price: number;
  yearlyPrice: number;
  description: string;
  icon: typeof Zap;
  features: string[];
  highlighted?: boolean;
}[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    yearlyPrice: 0,
    description: "个人开发者免费使用",
    icon: Zap,
    features: [
      "本地单机使用",
      "最多 3 个配置模板",
      "基础冲突检测",
      "社区支持",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 5,
    yearlyPrice: 40,
    description: "专业开发者首选",
    icon: Star,
    highlighted: true,
    features: [
      "无限配置模板",
      "云端同步",
      "高级冲突检测与自动合并",
      "自定义模板创建",
      "优先客户支持",
      "多项目管理",
      "导出为多种格式",
    ],
  },
  {
    id: "team",
    name: "Team",
    price: 12,
    yearlyPrice: 96,
    description: "团队协作与管理",
    icon: Users,
    features: [
      "所有 Pro 功能",
      "团队模板共享",
      "权限与角色管理",
      "审计日志",
      "API 访问",
      "专属客户经理",
      "自定义集成",
      "SSO 登录",
    ],
  },
];

/**
 * 定价页面组件
 * @returns JSX 元素
 */
export default function PricingPage() {
  const { settings, setPlan } = useStore();
  const currentPlan = settings.subscription.plan;

  return (
    <div className="animate-fade-in space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl">
          选择适合你的计划
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          免费开始，随时升级。年付享 <span className="font-medium text-violet-500">33%</span> 折扣。
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => {
          const isCurrentPlan = currentPlan === plan.id;
          const Icon = plan.icon;

          return (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-2xl border p-6 transition-all ${
                plan.highlighted
                  ? "border-violet-500 bg-white shadow-xl shadow-violet-500/10 dark:border-violet-400 dark:bg-zinc-900"
                  : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-500 to-indigo-600 px-4 py-1 text-xs font-medium text-white">
                  最受欢迎
                </div>
              )}

              <div className="mb-4 flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                  plan.highlighted
                    ? "bg-gradient-to-br from-violet-500 to-indigo-600 text-white"
                    : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                }`}>
                  <Icon size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900 dark:text-white">{plan.name}</h3>
                  <p className="text-xs text-zinc-500">{plan.description}</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-zinc-900 dark:text-white">
                    ${plan.price}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-sm text-zinc-500">/月</span>
                  )}
                </div>
                {plan.yearlyPrice > 0 && (
                  <div className="mt-1 text-xs text-zinc-500">
                    年付 ${plan.yearlyPrice}/年（省 ${plan.price * 12 - plan.yearlyPrice}）
                  </div>
                )}
              </div>

              <ul className="mb-6 flex-1 space-y-2.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                    <Check size={16} className="mt-0.5 shrink-0 text-violet-500" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setPlan(plan.id)}
                disabled={isCurrentPlan}
                className={`w-full rounded-lg py-2.5 text-sm font-medium transition-colors ${
                  isCurrentPlan
                    ? "cursor-default bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500"
                    : plan.highlighted
                    ? "bg-gradient-to-r from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-xl"
                    : "border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                }`}
              >
                {isCurrentPlan ? "当前计划" : plan.price === 0 ? "免费开始" : "升级到 " + plan.name}
              </button>
            </div>
          );
        })}
      </div>

      {/* FAQ */}
      <div className="mx-auto max-w-2xl">
        <h2 className="mb-6 text-center text-xl font-bold text-zinc-900 dark:text-white">
          常见问题
        </h2>
        <div className="space-y-4">
          {[
            {
              q: "免费版有什么限制？",
              a: "免费版支持本地单机使用，最多可使用 3 个配置模板，包含基础冲突检测功能。",
            },
            {
              q: "可以随时取消订阅吗？",
              a: "当然可以。你可以随时取消订阅，订阅将在当前计费周期结束后停止。",
            },
            {
              q: "团队版支持多少人？",
              a: "Team 计划按每人每月 $12 计费，支持无限团队成员，包含所有协作功能。",
            },
            {
              q: "数据安全如何保障？",
              a: "所有项目扫描在本地完成，仅配置模板和元数据会同步到云端。Pro 及以上计划支持端到端加密。",
            },
          ].map((faq) => (
            <div
              key={faq.q}
              className="rounded-xl border border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <h3 className="font-medium text-zinc-900 dark:text-white">{faq.q}</h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
