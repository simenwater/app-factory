"use client";

import { Check, Star } from "lucide-react";
import { PlanType } from "@/types";
import { useStore } from "@/store/useStore";

/** 定价方案配置 */
interface PricingPlan {
  id: PlanType;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted: boolean;
}

/** 定价方案列表 */
const plans: PricingPlan[] = [
  {
    id: "free",
    name: "免费版",
    price: "$0",
    period: "永久免费",
    description: "适合个人开发者快速上手",
    features: [
      "最多 3 个项目",
      "全部内置模板库",
      "Markdown 编辑器",
      "本地导出/导入",
      "深色模式",
    ],
    highlighted: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$5",
    period: "/ 月",
    description: "解锁完整功能，提升工作效率",
    features: [
      "无限项目",
      "全部内置模板库",
      "自定义模板",
      "云端同步",
      "多设备管理",
      "导出为 JSON/YAML/MD",
      "优先客服支持",
    ],
    highlighted: true,
  },
  {
    id: "team",
    name: "团队版",
    price: "$12",
    period: "/ 人 / 月",
    description: "为团队协作而设计",
    features: [
      "Pro 全部功能",
      "团队模板共享",
      "权限管理",
      "团队成员管理",
      "审计日志",
      "API 访问",
      "专属客服经理",
    ],
    highlighted: false,
  },
];

/**
 * 定价卡片组件
 * @returns Pricing 组件
 */
export default function PricingCards() {
  const { subscription } = useStore();

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>
          选择适合你的方案
        </h2>
        <p className="text-base" style={{ color: "var(--text-secondary)" }}>
          从免费版开始，随时升级解锁更多功能
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="relative rounded-xl border p-6 transition-all animate-fade-in"
            style={{
              backgroundColor: "var(--bg-card)",
              borderColor: plan.highlighted ? "var(--accent)" : "var(--border-color)",
              boxShadow: plan.highlighted ? "0 0 0 1px var(--accent)" : "none",
            }}
          >
            {plan.highlighted && (
              <div
                className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold text-white"
                style={{ backgroundColor: "var(--accent)" }}
              >
                <Star size={12} />
                最受欢迎
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
                {plan.name}
              </h3>
              <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
                {plan.description}
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
                  {plan.price}
                </span>
                <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                  {plan.period}
                </span>
              </div>
            </div>

            <ul className="space-y-3 mb-6">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check size={16} style={{ color: "var(--accent)" }} />
                  <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <button
              className="w-full px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
              style={{
                backgroundColor: plan.highlighted ? "var(--accent)" : "var(--bg-tertiary)",
                color: plan.highlighted ? "white" : "var(--text-primary)",
              }}
            >
              {subscription.plan === plan.id ? "当前方案" : plan.highlighted ? "升级到 Pro" : "选择方案"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
