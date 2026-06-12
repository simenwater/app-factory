"use client";

import { useAppStore } from "@/store";
import { PLAN_LIMITS } from "@/types";
import type { SubscriptionPlan } from "@/types";
import { Check, Crown } from "lucide-react";

/** 各计划的功能列表 */
const PLAN_FEATURES: Record<SubscriptionPlan, string[]> = {
  free: ["最多 5 个角色", "1 个项目", "基础一致性检查", "基础冲突预警"],
  pro: [
    "最多 50 个角色",
    "10 个项目",
    "高级一致性检查",
    "AI 深度分析",
    "导出报告",
    "优先客服",
  ],
  premium: [
    "无限角色",
    "无限项目",
    "AI 深度分析 + GPT-4 级别",
    "API 接入",
    "团队协作",
    "专属客服",
  ],
};

/**
 * 设置面板 — 订阅管理和应用设置
 */
export function SettingsPanel() {
  const { subscription, updateSubscription, currentProject, darkMode, toggleDarkMode } =
    useAppStore();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2
        className="text-xl font-bold mb-6"
        style={{ color: "var(--text-primary)" }}
      >
        设置
      </h2>

      {/* 项目信息 */}
      <section className="mb-8">
        <h3
          className="text-sm font-semibold mb-3"
          style={{ color: "var(--text-secondary)" }}
        >
          项目信息
        </h3>
        <div
          className="p-4 rounded-xl"
          style={{
            backgroundColor: "var(--bg-primary)",
            border: "1px solid var(--border)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: "var(--accent)" }}
            >
              {currentProject?.name.charAt(0) ?? "?"}
            </div>
            <div>
              <div
                className="font-medium text-sm"
                style={{ color: "var(--text-primary)" }}
              >
                {currentProject?.name}
              </div>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                {currentProject?.description ?? "无描述"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 外观设置 */}
      <section className="mb-8">
        <h3
          className="text-sm font-semibold mb-3"
          style={{ color: "var(--text-secondary)" }}
        >
          外观
        </h3>
        <div
          className="p-4 rounded-xl flex items-center justify-between"
          style={{
            backgroundColor: "var(--bg-primary)",
            border: "1px solid var(--border)",
          }}
        >
          <div>
            <div
              className="text-sm font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              深色模式
            </div>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>
              切换浅色/深色主题
            </div>
          </div>
          <button
            onClick={toggleDarkMode}
            className="relative w-12 h-6 rounded-full transition-colors"
            style={{
              backgroundColor: darkMode ? "var(--accent)" : "var(--border)",
            }}
          >
            <div
              className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform"
              style={{
                transform: darkMode ? "translateX(26px)" : "translateX(2px)",
              }}
            />
          </button>
        </div>
      </section>

      {/* 订阅计划 */}
      <section>
        <h3
          className="text-sm font-semibold mb-3"
          style={{ color: "var(--text-secondary)" }}
        >
          订阅计划
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {(["free", "pro", "premium"] as SubscriptionPlan[]).map((plan) => {
            const limits = PLAN_LIMITS[plan];
            const features = PLAN_FEATURES[plan];
            const isActive = subscription.plan === plan;

            return (
              <div
                key={plan}
                className="rounded-xl p-5 transition-all relative"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  border: isActive
                    ? "2px solid var(--accent)"
                    : "1px solid var(--border)",
                }}
              >
                {plan === "pro" && (
                  <div
                    className="absolute -top-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-semibold text-white"
                    style={{ backgroundColor: "var(--accent)" }}
                  >
                    <Crown className="w-3 h-3" /> 推荐
                  </div>
                )}
                <div className="text-center mb-4">
                  <h4
                    className="text-sm font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {limits.name}
                  </h4>
                  <div
                    className="text-xl font-bold mt-1"
                    style={{ color: "var(--accent)" }}
                  >
                    {limits.price}
                  </div>
                </div>

                <ul className="space-y-2 mb-4">
                  {features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-xs"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      <Check
                        className="w-3.5 h-3.5 shrink-0"
                        style={{ color: "var(--accent)" }}
                      />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => updateSubscription(plan)}
                  disabled={isActive}
                  className="w-full py-2 rounded-lg text-xs font-semibold transition-colors disabled:opacity-60"
                  style={{
                    backgroundColor: isActive
                      ? "var(--bg-tertiary)"
                      : "var(--accent)",
                    color: isActive ? "var(--text-muted)" : "white",
                  }}
                >
                  {isActive ? "当前计划" : "升级"}
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
