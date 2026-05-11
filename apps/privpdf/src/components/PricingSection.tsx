"use client";

import { Check, Star } from "lucide-react";
import { useStore } from "@/store/useStore";
import type { PlanType } from "@/types";

/**
 * @description 定价方案展示组件
 */

interface PricingPlan {
  id: PlanType;
  name: string;
  price: string;
  period: string;
  features: string[];
  highlighted: boolean;
}

const plans: PricingPlan[] = [
  {
    id: "free",
    name: "免费版",
    price: "$0",
    period: "永久免费",
    features: [
      "PDF 合并与分割",
      "电子签名",
      "最多 5 个文件",
      "完全本地运行",
    ],
    highlighted: false,
  },
  {
    id: "pro",
    name: "Pro 版",
    price: "$5",
    period: "每月",
    features: [
      "所有免费版功能",
      "OCR 文本识别",
      "批量处理",
      "最多 50 个文件",
      "优先更新",
    ],
    highlighted: true,
  },
  {
    id: "lifetime",
    name: "终身版",
    price: "$29",
    period: "一次付清",
    features: [
      "所有 Pro 版功能",
      "终身免费更新",
      "最多 100 个文件",
      "未来新功能",
    ],
    highlighted: false,
  },
];

export default function PricingSection() {
  const currentPlan = useStore((s) => s.plan);
  const setPlan = useStore((s) => s.setPlan);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">选择适合你的方案</h2>
        <p
          className="mt-2 text-sm"
          style={{ color: "var(--color-text-secondary)" }}
        >
          所有方案均支持完全本地运行，你的文件永远不会离开设备。
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="relative rounded-xl border p-6"
            style={{
              borderColor: plan.highlighted
                ? "var(--color-primary)"
                : "var(--color-border)",
              backgroundColor: plan.highlighted
                ? "var(--color-primary-light)"
                : "var(--color-bg)",
            }}
          >
            {plan.highlighted && (
              <div
                className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-0.5 text-xs font-medium text-white"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                <Star size={10} className="mr-1 inline" />
                推荐
              </div>
            )}

            <h3 className="text-lg font-bold">{plan.name}</h3>
            <div className="mt-2">
              <span className="text-3xl font-bold">{plan.price}</span>
              <span
                className="ml-1 text-sm"
                style={{ color: "var(--color-text-muted)" }}
              >
                {plan.period}
              </span>
            </div>

            <ul className="mt-4 space-y-2">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <Check
                    size={14}
                    style={{ color: "var(--color-success)" }}
                  />
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => setPlan(plan.id)}
              disabled={currentPlan === plan.id}
              className="mt-5 w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-50"
              style={{
                backgroundColor:
                  currentPlan === plan.id
                    ? "var(--color-bg-tertiary)"
                    : plan.highlighted
                      ? "var(--color-primary)"
                      : "var(--color-bg-tertiary)",
                color:
                  currentPlan === plan.id
                    ? "var(--color-text-muted)"
                    : plan.highlighted
                      ? "#fff"
                      : "var(--color-text)",
              }}
            >
              {currentPlan === plan.id ? "当前方案" : "选择方案"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
