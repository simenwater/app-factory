"use client";

import { useState } from "react";
import {
  Moon,
  Sun,
  Crown,
  Mail,
  Globe,
  Trash2,
} from "lucide-react";
import { useStore } from "@/store/useStore";

/**
 * @description 设置页面 — 主题、订阅、邮箱等配置
 */
export default function SettingsPage() {
  const settings = useStore((s) => s.settings);
  const updateSettings = useStore((s) => s.updateSettings);
  const setSubscription = useStore((s) => s.setSubscription);
  const clearRecordings = useStore((s) => s.clearRecordings);
  const getRemainingFreeUses = useStore((s) => s.getRemainingFreeUses);
  const [loading, setLoading] = useState<string | null>(null);

  /**
   * @description 发起 Stripe Checkout 订阅流程
   * @param {"monthly" | "yearly"} plan - 订阅计划
   */
  const handleUpgrade = async (plan: "monthly" | "yearly") => {
    setLoading(plan);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "无法创建订阅会话");
      }
    } catch {
      alert("网络错误，请重试");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-6 px-4 pt-6">
      <h1 className="text-xl font-bold text-text dark:text-text-dark">设置</h1>

      {/* 订阅状态 */}
      <section className="rounded-xl bg-surface p-5 shadow-sm dark:bg-surface-dark">
        <div className="mb-4 flex items-center gap-2">
          <Crown size={20} className="text-primary" />
          <h2 className="font-semibold text-text dark:text-text-dark">
            订阅计划
          </h2>
        </div>

        {settings.subscription === "pro" ? (
          <div className="rounded-lg bg-primary/10 p-4 dark:bg-primary/20">
            <p className="font-medium text-primary dark:text-primary-light">
              ✓ Pro 用户 — 无限使用
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-text-muted dark:text-text-muted-dark">
              当前为免费版，剩余 {getRemainingFreeUses()} 次使用
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleUpgrade("monthly")}
                disabled={loading !== null}
                className="flex flex-col items-center gap-1 rounded-xl border-2 border-primary/30 p-4 transition-colors hover:border-primary hover:bg-primary/5"
              >
                <span className="text-lg font-bold text-text dark:text-text-dark">
                  $4.99
                </span>
                <span className="text-xs text-text-muted dark:text-text-muted-dark">
                  每月
                </span>
                {loading === "monthly" && (
                  <span className="text-xs text-primary">加载中...</span>
                )}
              </button>

              <button
                onClick={() => handleUpgrade("yearly")}
                disabled={loading !== null}
                className="relative flex flex-col items-center gap-1 rounded-xl border-2 border-primary p-4 transition-colors hover:bg-primary/5"
              >
                <span className="absolute -top-2 right-2 rounded-full bg-success px-2 py-0.5 text-[10px] font-bold text-white">
                  省33%
                </span>
                <span className="text-lg font-bold text-text dark:text-text-dark">
                  $39.99
                </span>
                <span className="text-xs text-text-muted dark:text-text-muted-dark">
                  每年
                </span>
                {loading === "yearly" && (
                  <span className="text-xs text-primary">加载中...</span>
                )}
              </button>
            </div>

            {/* Demo toggle for testing */}
            <button
              onClick={() => setSubscription("pro")}
              className="text-xs text-text-muted underline dark:text-text-muted-dark"
            >
              模拟升级到 Pro（演示用）
            </button>
          </div>
        )}
      </section>

      {/* 外观设置 */}
      <section className="rounded-xl bg-surface p-5 shadow-sm dark:bg-surface-dark">
        <h2 className="mb-4 font-semibold text-text dark:text-text-dark">
          外观
        </h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {settings.darkMode ? (
              <Moon size={18} className="text-primary-light" />
            ) : (
              <Sun size={18} className="text-warning" />
            )}
            <span className="text-sm text-text dark:text-text-dark">
              深色模式
            </span>
          </div>
          <button
            onClick={() => updateSettings({ darkMode: !settings.darkMode })}
            className={`relative h-7 w-12 rounded-full transition-colors ${
              settings.darkMode ? "bg-primary" : "bg-border dark:bg-border-dark"
            }`}
          >
            <span
              className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform ${
                settings.darkMode ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      </section>

      {/* 邮箱设置 */}
      <section className="rounded-xl bg-surface p-5 shadow-sm dark:bg-surface-dark">
        <div className="mb-4 flex items-center gap-2">
          <Mail size={18} className="text-accent" />
          <h2 className="font-semibold text-text dark:text-text-dark">
            默认邮箱
          </h2>
        </div>
        <input
          type="email"
          placeholder="your@email.com"
          value={settings.email}
          onChange={(e) => updateSettings({ email: e.target.value })}
          className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text placeholder-text-muted focus:border-primary focus:outline-none dark:border-border-dark dark:bg-bg-dark dark:text-text-dark dark:placeholder-text-muted-dark"
        />
        <p className="mt-2 text-xs text-text-muted dark:text-text-muted-dark">
          设置后可一键将格式化内容发送到此邮箱
        </p>
      </section>

      {/* 语言设置 */}
      <section className="rounded-xl bg-surface p-5 shadow-sm dark:bg-surface-dark">
        <div className="mb-4 flex items-center gap-2">
          <Globe size={18} className="text-primary" />
          <h2 className="font-semibold text-text dark:text-text-dark">
            识别语言
          </h2>
        </div>
        <select
          value={settings.language}
          onChange={(e) => updateSettings({ language: e.target.value })}
          className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none dark:border-border-dark dark:bg-bg-dark dark:text-text-dark"
        >
          <option value="auto">自动检测</option>
          <option value="zh">中文</option>
          <option value="en">English</option>
          <option value="ja">日本語</option>
          <option value="ko">한국어</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
          <option value="de">Deutsch</option>
        </select>
      </section>

      {/* 数据管理 */}
      <section className="rounded-xl bg-surface p-5 shadow-sm dark:bg-surface-dark">
        <h2 className="mb-4 font-semibold text-text dark:text-text-dark">
          数据管理
        </h2>
        <button
          onClick={() => {
            if (confirm("确定要清除所有录音历史吗？此操作不可撤销。")) {
              clearRecordings();
            }
          }}
          className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm text-danger transition-colors hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-950/50"
        >
          <Trash2 size={16} />
          清除所有历史记录
        </button>
      </section>

      {/* 关于 */}
      <section className="pb-8 text-center">
        <p className="text-xs text-text-muted dark:text-text-muted-dark">
          VoiceStruct v0.1.0
        </p>
        <p className="mt-1 text-xs text-text-muted dark:text-text-muted-dark">
          Powered by OpenAI Whisper + GPT
        </p>
      </section>
    </div>
  );
}
