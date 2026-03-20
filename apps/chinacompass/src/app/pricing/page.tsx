"use client";

import { useState } from "react";
import { CreditCard, Check, Zap, ArrowRight, MessageSquare } from "lucide-react";
import Link from "next/link";
import { subscriptionPlans } from "@/lib/mockData";

/**
 * @description 订阅方案与定价页面
 */
export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (planId: string) => {
    setSelectedPlan(planId);
    setLoading(true);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.message || "订阅功能即将上线，敬请期待！");
      }
    } catch {
      alert("网络错误，请稍后重试");
    } finally {
      setLoading(false);
      setSelectedPlan(null);
    }
  };

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto animate-fade-in">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <CreditCard className="w-6 h-6 text-navy-600" />
          <h1 className="text-2xl font-bold">订阅方案</h1>
        </div>
        <p className="text-gray-500 max-w-lg mx-auto">
          选择适合您业务的方案，从免费版开始，随时升级获取更多功能
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {subscriptionPlans.map((plan) => (
          <div
            key={plan.id}
            className={`relative bg-white rounded-2xl border-2 p-6 transition-all ${
              plan.recommended
                ? "border-brand-500 shadow-lg shadow-brand-100"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            {plan.recommended && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-brand-500 text-white text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  推荐
                </span>
              </div>
            )}

            <div className="text-center mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {plan.name}
              </h3>
              <div className="text-3xl font-bold text-gray-900">
                {plan.priceLabel}
              </div>
              {plan.price > 0 && (
                <p className="text-sm text-gray-400 mt-1">按月计费</p>
              )}
            </div>

            <ul className="space-y-3 mb-6">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe(plan.id)}
              disabled={loading && selectedPlan === plan.id}
              className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                plan.recommended
                  ? "bg-brand-500 hover:bg-brand-600 text-white"
                  : plan.price === 0
                  ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  : "bg-navy-800 hover:bg-navy-900 text-white"
              }`}
            >
              {loading && selectedPlan === plan.id ? (
                "处理中..."
              ) : plan.price === 0 ? (
                "当前方案"
              ) : plan.price === -1 ? (
                <>
                  联系我们
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  立即订阅
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl font-bold text-center mb-6">常见问题</h2>
        <div className="space-y-4">
          {[
            {
              q: "免费版有什么限制？",
              a: "免费版支持3个国家的基础政策监控和每月5次AI解读。升级专业版即可解锁全部功能。",
            },
            {
              q: "可以随时取消订阅吗？",
              a: "可以，您可以随时取消订阅。取消后当前计费周期内仍可使用专业版功能。",
            },
            {
              q: "企业版有什么额外服务？",
              a: "企业版提供API集成接口、专属合规顾问、定制报告和SLA保障。请联系我们获取详细方案。",
            },
            {
              q: "支持哪些支付方式？",
              a: "支持支付宝、微信支付和企业对公转账。国际信用卡支付即将上线。",
            },
          ].map((faq) => (
            <div
              key={faq.q}
              className="bg-white border border-gray-200 rounded-xl p-5"
            >
              <h3 className="font-medium text-gray-900 mb-2">{faq.q}</h3>
              <p className="text-sm text-gray-500">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact CTA */}
      <div className="text-center mt-12">
        <p className="text-gray-500 mb-3">还有其他问题？</p>
        <Link
          href="/advisor"
          className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 font-medium"
        >
          <MessageSquare className="w-4 h-4" />
          咨询AI顾问
        </Link>
      </div>
    </div>
  );
}
