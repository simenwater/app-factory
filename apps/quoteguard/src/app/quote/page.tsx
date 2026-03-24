"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { generateQuote, SERVICE_RATES, getSuggestedRate } from "@/lib/quote";
import { formatCurrency } from "@/lib/utils";
import type { ServiceCategory, BillingMode } from "@/types";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";

/**
 * @description 新建报价单页面
 */
export default function NewQuotePage() {
  const router = useRouter();
  const addQuote = useStore((s) => s.addQuote);
  const settings = useStore((s) => s.settings);

  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [projectName, setProjectName] = useState("");
  const [serviceCategory, setServiceCategory] =
    useState<ServiceCategory>("design");
  const [billingMode, setBillingMode] = useState<BillingMode>("hourly");
  const [description, setDescription] = useState("");
  const [estimatedHours, setEstimatedHours] = useState(10);
  const [hourlyRate, setHourlyRate] = useState(
    settings.defaultHourlyRate || 80
  );

  const suggestedRate = getSuggestedRate(serviceCategory);

  /**
   * @description 处理服务类别变更，自动更新建议费率
   */
  const handleCategoryChange = (cat: ServiceCategory) => {
    setServiceCategory(cat);
    const rate = getSuggestedRate(cat);
    setHourlyRate(rate.defaultRate);
  };

  /**
   * @description 提交报价单
   */
  const handleSubmit = () => {
    if (!clientName || !projectName) return;

    const quote = generateQuote(
      {
        clientName,
        clientEmail,
        projectName,
        serviceCategory,
        billingMode,
        description,
        estimatedHours,
        hourlyRate,
        currency: settings.defaultCurrency,
      },
      settings.defaultValidDays
    );

    addQuote(quote);
    router.push(`/quote/${quote.id}`);
  };

  const estimatedTotal = hourlyRate * estimatedHours;

  return (
    <div className="px-4 pt-6">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/"
          className="rounded-lg p-2 transition-colors hover:bg-border/50 dark:hover:bg-border-dark/50"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl font-bold">新建报价单</h1>
          <p className="text-sm text-text-muted dark:text-text-muted-dark">
            AI 智能生成专业报价
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {/* 客户信息 */}
        <section className="rounded-2xl border border-border bg-surface p-4 dark:border-border-dark dark:bg-surface-dark">
          <h2 className="mb-3 text-sm font-semibold text-text-muted dark:text-text-muted-dark">
            客户信息
          </h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="客户姓名 *"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm outline-none transition-colors focus:border-primary dark:border-border-dark dark:bg-bg-dark"
            />
            <input
              type="email"
              placeholder="客户邮箱（可选）"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              className="w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm outline-none transition-colors focus:border-primary dark:border-border-dark dark:bg-bg-dark"
            />
          </div>
        </section>

        {/* 项目信息 */}
        <section className="rounded-2xl border border-border bg-surface p-4 dark:border-border-dark dark:bg-surface-dark">
          <h2 className="mb-3 text-sm font-semibold text-text-muted dark:text-text-muted-dark">
            项目信息
          </h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="项目名称 *"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm outline-none transition-colors focus:border-primary dark:border-border-dark dark:bg-bg-dark"
            />
            <textarea
              placeholder="项目描述（AI 将据此优化报价内容）"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-xl border border-border bg-bg px-4 py-3 text-sm outline-none transition-colors focus:border-primary dark:border-border-dark dark:bg-bg-dark"
            />
          </div>
        </section>

        {/* 服务类型 */}
        <section className="rounded-2xl border border-border bg-surface p-4 dark:border-border-dark dark:bg-surface-dark">
          <h2 className="mb-3 text-sm font-semibold text-text-muted dark:text-text-muted-dark">
            服务类型
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {(Object.entries(SERVICE_RATES) as [ServiceCategory, typeof SERVICE_RATES.design][]).map(
              ([key, config]) => (
                <button
                  key={key}
                  onClick={() => handleCategoryChange(key)}
                  className={`rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    serviceCategory === key
                      ? "bg-primary text-white"
                      : "bg-bg text-text-muted hover:bg-border/50 dark:bg-bg-dark dark:text-text-muted-dark dark:hover:bg-border-dark/50"
                  }`}
                >
                  {config.label}
                </button>
              )
            )}
          </div>
          <p className="mt-2 text-xs text-text-muted dark:text-text-muted-dark">
            建议费率：{formatCurrency(suggestedRate.min, settings.defaultCurrency)} -{" "}
            {formatCurrency(suggestedRate.max, settings.defaultCurrency)}/小时
          </p>
        </section>

        {/* 计费方式 */}
        <section className="rounded-2xl border border-border bg-surface p-4 dark:border-border-dark dark:bg-surface-dark">
          <h2 className="mb-3 text-sm font-semibold text-text-muted dark:text-text-muted-dark">
            计费方式
          </h2>
          <div className="grid grid-cols-4 gap-2">
            {(
              [
                { key: "hourly", label: "按时" },
                { key: "fixed", label: "固定" },
                { key: "daily", label: "按天" },
                { key: "monthly", label: "按月" },
              ] as { key: BillingMode; label: string }[]
            ).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setBillingMode(key)}
                className={`rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  billingMode === key
                    ? "bg-primary text-white"
                    : "bg-bg text-text-muted hover:bg-border/50 dark:bg-bg-dark dark:text-text-muted-dark dark:hover:bg-border-dark/50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        {/* 费率和工时 */}
        <section className="rounded-2xl border border-border bg-surface p-4 dark:border-border-dark dark:bg-surface-dark">
          <h2 className="mb-3 text-sm font-semibold text-text-muted dark:text-text-muted-dark">
            费率与工时
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs text-text-muted dark:text-text-muted-dark">
                时薪 ({settings.defaultCurrency})
              </label>
              <input
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                min={1}
                className="w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm outline-none transition-colors focus:border-primary dark:border-border-dark dark:bg-bg-dark"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-text-muted dark:text-text-muted-dark">
                预估工时（小时）
              </label>
              <input
                type="number"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(Number(e.target.value))}
                min={1}
                className="w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm outline-none transition-colors focus:border-primary dark:border-border-dark dark:bg-bg-dark"
              />
            </div>
          </div>
          <div className="mt-3 rounded-xl bg-primary/5 p-3 text-center">
            <p className="text-xs text-text-muted dark:text-text-muted-dark">
              预估总价
            </p>
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(estimatedTotal, settings.defaultCurrency)}
            </p>
          </div>
        </section>

        {/* 提交按钮 */}
        <button
          onClick={handleSubmit}
          disabled={!clientName || !projectName}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-base font-semibold text-white shadow-lg transition-all hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Sparkles size={20} />
          生成报价单
        </button>
      </div>

      <div className="h-8" />
    </div>
  );
}
