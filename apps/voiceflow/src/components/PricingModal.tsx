"use client";

import { X, Check, Sparkles } from "lucide-react";
import { useStore } from "@/store/useStore";
import type { SubscriptionPlan } from "@/types";

/**
 * @description 定价方案
 */
const PLANS: {
  plan: SubscriptionPlan;
  name: string;
  price: string;
  period: string;
  features: string[];
  highlight?: boolean;
}[] = [
  {
    plan: "free",
    name: "免费试用",
    price: "$0",
    period: "",
    features: ["3 次免费转录", "基础 AI 总结", "Markdown 导出"],
  },
  {
    plan: "monthly",
    name: "月度订阅",
    price: "$4.99",
    period: "/月",
    features: [
      "无限次转录",
      "高级 AI 分析",
      "多说话人区分",
      "自定义模板",
      "全格式导出",
    ],
    highlight: true,
  },
  {
    plan: "lifetime",
    name: "终身买断",
    price: "$49.99",
    period: "一次性",
    features: [
      "所有月度功能",
      "终身免费更新",
      "优先技术支持",
      "API 访问",
    ],
  },
];

/**
 * @description 定价弹窗组件
 */
export default function PricingModal({ onClose }: { onClose: () => void }) {
  const setSubscription = useStore((s) => s.setSubscription);

  /**
   * @description 处理订阅（MVP 阶段模拟付费）
   */
  const handleSubscribe = (plan: SubscriptionPlan) => {
    setSubscription(plan);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center">
      <div className="w-full max-w-lg rounded-t-2xl bg-surface p-6 sm:rounded-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-text">升级 VoiceFlow</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 hover:bg-surface-alt"
          >
            <X className="h-5 w-5 text-text-muted" />
          </button>
        </div>

        <div className="space-y-3">
          {PLANS.map((p) => (
            <div
              key={p.plan}
              className={`rounded-xl border-2 p-4 transition-all ${
                p.highlight
                  ? "border-primary bg-primary/5"
                  : "border-border"
              }`}
            >
              <div className="mb-3 flex items-baseline justify-between">
                <div>
                  <h3 className="font-semibold text-text">{p.name}</h3>
                  {p.highlight && (
                    <span className="text-xs text-primary">推荐</span>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-text">
                    {p.price}
                  </span>
                  <span className="text-sm text-text-muted">{p.period}</span>
                </div>
              </div>
              <ul className="mb-3 space-y-1.5">
                {p.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-sm text-text-muted"
                  >
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                    {f}
                  </li>
                ))}
              </ul>
              {p.plan !== "free" && (
                <button
                  onClick={() => handleSubscribe(p.plan)}
                  className={`w-full rounded-xl py-2.5 text-sm font-medium transition-all ${
                    p.highlight
                      ? "bg-primary text-white hover:bg-primary-hover"
                      : "bg-surface-alt text-text hover:bg-border"
                  }`}
                >
                  {p.plan === "lifetime" ? "立即购买" : "开始订阅"}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
