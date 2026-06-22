"use client";

/**
 * @fileoverview 订阅定价页 — 展示免费版和高级版对比
 */

import { Check, X, Crown, Sparkles } from "lucide-react";
import { useStore } from "@/store/useStore";

/** 功能对比项 */
const FEATURES = [
  { name: "AI 消息分析", free: true, premium: true },
  { name: "智能回复生成", free: true, premium: true },
  { name: "费率标准管理", free: true, premium: true },
  { name: "合同条款管理", free: true, premium: true },
  { name: "免费使用次数", free: "5 次", premium: "无限" },
  { name: "历史记录", free: "最近 10 条", premium: "无限" },
  { name: "多语气风格", free: false, premium: true },
  { name: "批量分析", free: false, premium: true },
  { name: "自定义模板", free: false, premium: true },
  { name: "优先支持", free: false, premium: true },
];

export default function PricingPage() {
  const { settings, updateSettings } = useStore();
  const isPremium = settings.subscriptionTier === "premium";

  /** 模拟订阅切换 */
  const handleToggleSubscription = () => {
    updateSettings({
      subscriptionTier: isPremium ? "free" : "premium",
      freeUsesRemaining: isPremium ? 5 : settings.freeUsesRemaining,
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-xl font-bold text-foreground">选择你的方案</h1>
        <p className="mt-1 text-sm text-muted">
          解锁全部功能，保护你的每一分钱
        </p>
      </div>

      {/* 当前状态 */}
      {isPremium && (
        <div className="flex items-center justify-center gap-2 rounded-xl bg-primary/10 p-3">
          <Crown size={16} className="text-primary" />
          <span className="text-sm font-medium text-primary">
            你已是高级版用户
          </span>
        </div>
      )}

      {/* 定价卡片 */}
      <div className="space-y-4">
        {/* 免费版 */}
        <div className="rounded-2xl bg-surface p-5 border border-border">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-foreground">免费版</h2>
            <p className="mt-1 text-sm text-muted">体验核心功能</p>
            <div className="mt-3">
              <span className="text-3xl font-bold text-foreground">$0</span>
              <span className="text-sm text-muted"> /永久</span>
            </div>
          </div>

          <div className="space-y-3">
            {FEATURES.map((f) => (
              <div key={f.name} className="flex items-center gap-3 text-sm">
                {f.free ? (
                  <Check
                    size={16}
                    className="shrink-0 text-success"
                  />
                ) : (
                  <X size={16} className="shrink-0 text-muted/40" />
                )}
                <span className={f.free ? "text-foreground" : "text-muted/50"}>
                  {f.name}
                  {typeof f.free === "string" && (
                    <span className="ml-1 text-xs text-muted">({f.free})</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 高级版 */}
        <div className="relative rounded-2xl bg-surface p-5 border-2 border-primary shadow-lg shadow-primary/10">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-white">
            推荐
          </div>

          <div className="mb-4">
            <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
              <Sparkles size={18} className="text-primary" />
              高级版
            </h2>
            <p className="mt-1 text-sm text-muted">无限使用，全面保护</p>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-foreground">$4.99</span>
              <span className="text-sm text-muted">/月</span>
              <span className="ml-2 rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                或 $29.99 终身
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {FEATURES.map((f) => (
              <div key={f.name} className="flex items-center gap-3 text-sm">
                <Check
                  size={16}
                  className="shrink-0 text-success"
                />
                <span className="text-foreground">
                  {f.name}
                  {typeof f.premium === "string" && (
                    <span className="ml-1 text-xs text-primary font-medium">
                      ({f.premium})
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={handleToggleSubscription}
            className="mt-5 w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-primary-dark active:scale-[0.98]"
          >
            {isPremium ? "取消订阅（模拟）" : "立即升级"}
          </button>
        </div>
      </div>

      <p className="text-center text-xs text-muted">
        付费功能暂为演示模式，正式版将接入 Stripe 支付
      </p>
    </div>
  );
}
