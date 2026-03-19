"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Check,
  Sparkles,
  CreditCard,
  Loader2,
  CheckCircle2,
  XCircle,
  Shield,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { subscriptionPlans } from "@/lib/mockData";

/**
 * @component PricingContent
 * 订阅方案内容组件（包含 useSearchParams，需要 Suspense 包裹）
 */
function PricingContent() {
  const tier = useStore((s) => s.settings.subscriptionTier);
  const setSubscriptionTier = useStore((s) => s.setSubscriptionTier);
  const searchParams = useSearchParams();

  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      setSubscriptionTier("pro");
      setShowSuccess(true);
    }
  }, [searchParams, setSubscriptionTier]);

  /**
   * 处理订阅按钮点击 — 发起Stripe Checkout流程
   * @param {string} planId - 方案ID
   */
  const handleSubscribe = async (planId: string) => {
    setError(null);

    if (planId === "free") {
      setSubscriptionTier("free");
      return;
    }

    setLoadingPlan(planId);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.code === "STRIPE_NOT_CONFIGURED") {
          setError(
            "支付系统正在配置中。请管理员设置 STRIPE_SECRET_KEY 等环境变量后重试。"
          );
        } else {
          setError(result.error || "支付请求失败，请稍后重试");
        }
        return;
      }

      if (result.url) {
        window.location.href = result.url;
      } else if (result.free) {
        setSubscriptionTier("free");
      }
    } catch {
      setError("网络错误，请检查您的网络连接后重试");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <>
      {/* Success Banner */}
      {showSuccess && (
        <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-6 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-green-800 dark:text-green-300">
              订阅成功！
            </p>
            <p className="text-xs text-green-600 dark:text-green-400">
              您已升级为专业版，现在可以享受完整的AI深度解读功能
            </p>
          </div>
        </div>
      )}

      {/* Canceled Banner */}
      {searchParams.get("canceled") === "true" && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6 flex items-center gap-3">
          <XCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-700 dark:text-amber-400">
            支付已取消。您可以随时重新选择方案进行订阅。
          </p>
        </div>
      )}

      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-2">
          <CreditCard className="w-5 h-5 text-blue-500" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            选择您的方案
          </h2>
        </div>
        <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          PolicyPulse
          帮助您实时掌握全球政策动向，将复杂的宏观政策翻译为直接影响您业务的简明预警
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6 text-sm text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {subscriptionPlans.map((plan) => {
          const isCurrentPlan =
            (plan.id === "free" && tier === "free") ||
            (plan.id !== "free" && tier === "pro");
          const isLoading = loadingPlan === plan.id;

          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl border p-6 transition-all ${
                plan.highlighted
                  ? "border-blue-500 bg-white dark:bg-slate-900 shadow-xl shadow-blue-500/10 ring-2 ring-blue-500/20"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    <Sparkles className="w-3 h-3" />
                    最受欢迎
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-slate-900 dark:text-white">
                    ${plan.price === 0 ? "0" : plan.price}
                  </span>
                  <span className="text-slate-500 text-sm">
                    /{plan.interval === "month" ? "月" : "年"}
                  </span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check
                      className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                        plan.highlighted ? "text-blue-500" : "text-green-500"
                      }`}
                    />
                    <span className="text-slate-700 dark:text-slate-300">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={isCurrentPlan || isLoading}
                className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
                  isCurrentPlan
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                    : plan.highlighted
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    正在跳转支付...
                  </>
                ) : isCurrentPlan ? (
                  "当前方案"
                ) : plan.price === 0 ? (
                  "使用免费版"
                ) : (
                  "立即订阅"
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Payment Info */}
      <div className="mt-8 space-y-3">
        <div className="flex items-center justify-center gap-6 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            安全加密支付
          </span>
          <span>支持随时取消</span>
          <span>7天无理由退款</span>
        </div>
        <div className="flex items-center justify-center gap-3 opacity-50">
          <svg className="h-6" viewBox="0 0 60 25" fill="none">
            <rect width="60" height="25" rx="4" fill="#1A1F71" />
            <text
              x="30"
              y="16"
              textAnchor="middle"
              fill="white"
              fontSize="10"
              fontWeight="bold"
            >
              VISA
            </text>
          </svg>
          <svg className="h-6" viewBox="0 0 60 25" fill="none">
            <rect width="60" height="25" rx="4" fill="#EB001B" />
            <circle cx="24" cy="12.5" r="8" fill="#EB001B" />
            <circle cx="36" cy="12.5" r="8" fill="#F79E1B" opacity="0.8" />
          </svg>
          <svg className="h-6" viewBox="0 0 60 25" fill="none">
            <rect width="60" height="25" rx="4" fill="#6772E5" />
            <text
              x="30"
              y="16"
              textAnchor="middle"
              fill="white"
              fontSize="9"
              fontWeight="bold"
            >
              Stripe
            </text>
          </svg>
        </div>
        <p className="text-center text-xs text-slate-400">
          由 Stripe 提供安全支付服务 · PCI DSS Level 1 合规
        </p>
      </div>
    </>
  );
}

/**
 * @component PricingPage
 * 订阅方案页面 — 集成Stripe支付流程
 */
export default function PricingPage() {
  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
          </div>
        }
      >
        <PricingContent />
      </Suspense>
    </div>
  );
}
