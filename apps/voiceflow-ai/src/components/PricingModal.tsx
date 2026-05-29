"use client";

import { useState } from "react";
import { X, Check, Zap } from "lucide-react";
import { useAppStore } from "@/store";

/**
 * @description 定价弹窗组件 - 展示订阅计划
 */
export function PricingModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { updateSubscription } = useAppStore();
  const [loading, setLoading] = useState<string | null>(null);

  if (!isOpen) return null;

  const plans = [
    {
      id: "monthly",
      name: "月度版",
      price: "$9.9",
      period: "/月",
      features: [
        "无限转录次数",
        "AI 智能摘要",
        "多格式导出",
        "优先处理队列",
        "历史记录云端同步",
      ],
      popular: true,
    },
    {
      id: "yearly",
      name: "年度版",
      price: "$49",
      period: "/年",
      features: [
        "包含月度版所有功能",
        "节省 59%",
        "优先技术支持",
        "API 访问权限",
        "团队协作功能",
      ],
      popular: false,
    },
  ];

  /**
   * @description 模拟订阅处理
   */
  const handleSubscribe = async (planId: string) => {
    setLoading(planId);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    updateSubscription({
      plan: planId as "monthly" | "yearly",
      isActive: true,
    });
    setLoading(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative mx-4 w-full max-w-2xl rounded-2xl bg-[var(--card)] p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted)] transition-colors hover:bg-[var(--secondary)]"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary)]/10">
            <Zap className="h-6 w-6 text-[var(--primary)]" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--foreground)]">
            升级 VoiceFlow AI
          </h2>
          <p className="mt-2 text-[var(--muted)]">
            解锁无限转录和高级整理功能
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-xl border p-6 ${
                plan.popular
                  ? "border-[var(--primary)] shadow-lg shadow-[var(--primary)]/10"
                  : "border-[var(--border)]"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--primary)] px-3 py-1 text-xs font-medium text-white">
                  最受欢迎
                </div>
              )}
              <h3 className="text-lg font-semibold text-[var(--foreground)]">
                {plan.name}
              </h3>
              <div className="mt-2">
                <span className="text-3xl font-bold text-[var(--foreground)]">
                  {plan.price}
                </span>
                <span className="text-[var(--muted)]">{plan.period}</span>
              </div>
              <ul className="mt-4 space-y-2">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm text-[var(--foreground)]"
                  >
                    <Check className="h-4 w-4 text-[var(--success)]" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={loading !== null}
                className={`mt-6 w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  plan.popular
                    ? "bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]"
                    : "border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--secondary)]"
                } disabled:opacity-50`}
              >
                {loading === plan.id ? "处理中..." : "立即订阅"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
