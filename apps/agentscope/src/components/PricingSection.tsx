"use client";

import { useStore } from "@/lib/store";
import { Check } from "lucide-react";
import type { SubscriptionPlan } from "@/types";

/** 订阅计划配置 */
const plans: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    billingCycle: "monthly",
    features: [
      "最多 100 条日志记录",
      "基础统计仪表盘",
      "JSON 导出",
      "单一代理支持",
    ],
  },
  {
    id: "pro-monthly",
    name: "Pro",
    price: 5,
    billingCycle: "monthly",
    isPopular: true,
    features: [
      "无限日志记录",
      "完整统计仪表盘",
      "JSON / CSV 导出",
      "多代理支持",
      "自定义定价配置",
      "历史数据保留 90 天",
      "优先支持",
    ],
  },
  {
    id: "pro-lifetime",
    name: "Pro 终身版",
    price: 29,
    billingCycle: "lifetime",
    features: [
      "Pro 全部功能",
      "终身免费更新",
      "无限历史数据",
      "团队协作（即将推出）",
      "自托管支持",
      "优先功能请求",
    ],
  },
];

/**
 * @description 订阅定价区域
 */
export default function PricingSection() {
  const darkMode = useStore((s) => s.darkMode);

  return (
    <div className="py-12">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold mb-2">选择您的计划</h2>
        <p
          className={`text-sm ${
            darkMode ? "text-text-secondary" : "text-light-text-secondary"
          }`}
        >
          开始免费使用，按需升级
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative flex flex-col rounded-2xl border p-6 transition-all hover:scale-[1.02] ${
              plan.isPopular
                ? "border-accent ring-1 ring-accent/20"
                : darkMode
                  ? "border-border"
                  : "border-light-border"
            } ${
              darkMode
                ? "bg-bg-card"
                : "bg-light-bg-card shadow-sm"
            }`}
          >
            {plan.isPopular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-0.5 text-[10px] font-semibold text-white">
                最受欢迎
              </div>
            )}

            <div className="mb-4">
              <h3 className="text-lg font-bold">{plan.name}</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-bold">
                  ${plan.price}
                </span>
                <span
                  className={`text-xs ${
                    darkMode ? "text-text-muted" : "text-light-text-muted"
                  }`}
                >
                  {plan.billingCycle === "monthly"
                    ? plan.price > 0
                      ? "/月"
                      : ""
                    : "一次性"}
                </span>
              </div>
            </div>

            <ul className="mb-6 flex-1 space-y-2.5">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-xs">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                  <span
                    className={
                      darkMode ? "text-text-secondary" : "text-light-text-secondary"
                    }
                  >
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <button
              className={`w-full rounded-lg py-2.5 text-sm font-semibold transition-colors ${
                plan.isPopular
                  ? "bg-accent text-white hover:bg-accent-hover"
                  : darkMode
                    ? "bg-bg-tertiary text-text-primary hover:bg-border"
                    : "bg-light-bg-tertiary text-light-text-primary hover:bg-light-border"
              }`}
              onClick={() => {
                alert(
                  `即将接入 Stripe 支付：${plan.name} — $${plan.price}${
                    plan.billingCycle === "monthly" ? "/月" : " 终身"
                  }`
                );
              }}
            >
              {plan.price === 0 ? "当前计划" : "升级"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
