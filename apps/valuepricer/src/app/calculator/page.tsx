"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { generateId } from "@/lib/utils";
import { INDUSTRY_CONFIG, generatePricingRecommendation } from "@/lib/pricing";
import type { Industry, ValueInput } from "@/types";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";

/**
 * @description 客户价值量化输入表单页面
 */
export default function CalculatorPage() {
  const router = useRouter();
  const addInput = useStore((s) => s.addInput);
  const addRecommendation = useStore((s) => s.addRecommendation);
  const tier = useStore((s) => s.settings.subscriptionTier);

  const [form, setForm] = useState({
    productName: "",
    industry: "saas" as Industry,
    targetCustomerSize: "smb" as ValueInput["targetCustomerSize"],
    engineerCount: 5,
    avgHourlyCost: 75,
    hoursSavedPerWeek: 10,
    additionalCostSavingsMonthly: 0,
    currentProcessDescription: "",
    competitorPrice: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  /**
   * @description 表单验证
   */
  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!form.productName.trim()) newErrors.productName = "请输入产品名称";
    if (form.engineerCount <= 0) newErrors.engineerCount = "请输入有效数值";
    if (form.avgHourlyCost <= 0) newErrors.avgHourlyCost = "请输入有效数值";
    if (form.hoursSavedPerWeek <= 0)
      newErrors.hoursSavedPerWeek = "请输入有效数值";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  /**
   * @description 提交表单，生成定价推荐
   */
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const input: ValueInput = {
      id: generateId(),
      createdAt: new Date().toISOString(),
      ...form,
    };

    addInput(input);
    const recommendation = generatePricingRecommendation(input);
    addRecommendation(recommendation);
    router.push(`/reports/${recommendation.id}`);
  }

  /**
   * @description 更新表单字段
   */
  function updateField(field: string, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  const inputClass =
    "w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-border-dark dark:bg-surface-dark dark:text-text-dark";
  const labelClass =
    "mb-1 block text-sm font-medium text-text dark:text-text-dark";
  const errorClass = "mt-1 text-xs text-danger";

  return (
    <div className="p-4">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/"
          className="rounded-lg p-2 text-text-muted transition-colors hover:bg-border/30 dark:text-text-muted-dark dark:hover:bg-border-dark/30"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-text dark:text-text-dark">
            价值量化计算器
          </h1>
          <p className="text-xs text-text-muted dark:text-text-muted-dark">
            输入客户获得的价值，生成定价策略
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="rounded-xl bg-surface p-4 shadow-sm dark:bg-surface-dark">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-text-muted dark:text-text-muted-dark">
            基本信息
          </h2>

          <div className="mb-4">
            <label className={labelClass}>产品名称 *</label>
            <input
              type="text"
              className={inputClass}
              placeholder="例如: DataSync Pro"
              value={form.productName}
              onChange={(e) => updateField("productName", e.target.value)}
            />
            {errors.productName && (
              <p className={errorClass}>{errors.productName}</p>
            )}
          </div>

          <div className="mb-4">
            <label className={labelClass}>所属行业</label>
            <select
              className={inputClass}
              value={form.industry}
              onChange={(e) => updateField("industry", e.target.value)}
            >
              {Object.entries(INDUSTRY_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>目标客户规模</label>
            <select
              className={inputClass}
              value={form.targetCustomerSize}
              onChange={(e) =>
                updateField("targetCustomerSize", e.target.value)
              }
            >
              <option value="startup">初创公司 (1-10人)</option>
              <option value="smb">中小企业 (10-100人)</option>
              <option value="mid_market">中型企业 (100-1000人)</option>
              <option value="enterprise">大型企业 (1000+人)</option>
            </select>
          </div>
        </div>

        <div className="rounded-xl bg-surface p-4 shadow-sm dark:bg-surface-dark">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-text-muted dark:text-text-muted-dark">
            价值量化
          </h2>

          <div className="mb-4">
            <label className={labelClass}>受影响的工程师数量 *</label>
            <input
              type="number"
              className={inputClass}
              min="1"
              value={form.engineerCount}
              onChange={(e) =>
                updateField("engineerCount", parseInt(e.target.value) || 0)
              }
            />
            {errors.engineerCount && (
              <p className={errorClass}>{errors.engineerCount}</p>
            )}
          </div>

          <div className="mb-4">
            <label className={labelClass}>工程师平均时薪 (USD) *</label>
            <input
              type="number"
              className={inputClass}
              min="1"
              value={form.avgHourlyCost}
              onChange={(e) =>
                updateField("avgHourlyCost", parseInt(e.target.value) || 0)
              }
            />
            {errors.avgHourlyCost && (
              <p className={errorClass}>{errors.avgHourlyCost}</p>
            )}
          </div>

          <div className="mb-4">
            <label className={labelClass}>每周节省的小时数 *</label>
            <input
              type="number"
              className={inputClass}
              min="0.5"
              step="0.5"
              value={form.hoursSavedPerWeek}
              onChange={(e) =>
                updateField(
                  "hoursSavedPerWeek",
                  parseFloat(e.target.value) || 0
                )
              }
            />
            {errors.hoursSavedPerWeek && (
              <p className={errorClass}>{errors.hoursSavedPerWeek}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>其他每月成本节省 (USD)</label>
            <input
              type="number"
              className={inputClass}
              min="0"
              value={form.additionalCostSavingsMonthly}
              onChange={(e) =>
                updateField(
                  "additionalCostSavingsMonthly",
                  parseInt(e.target.value) || 0
                )
              }
            />
            <p className="mt-1 text-xs text-text-muted dark:text-text-muted-dark">
              包括基础设施、工具许可证等节省
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-surface p-4 shadow-sm dark:bg-surface-dark">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-text-muted dark:text-text-muted-dark">
            市场信息（可选）
          </h2>

          <div className="mb-4">
            <label className={labelClass}>竞品月度价格 (USD)</label>
            <input
              type="number"
              className={inputClass}
              min="0"
              value={form.competitorPrice}
              onChange={(e) =>
                updateField("competitorPrice", parseInt(e.target.value) || 0)
              }
            />
            <p className="mt-1 text-xs text-text-muted dark:text-text-muted-dark">
              填写后可获取竞品对比分析
              {tier === "free" && " (Premium 解锁详细竞品数据)"}
            </p>
          </div>

          <div>
            <label className={labelClass}>当前流程描述</label>
            <textarea
              className={inputClass}
              rows={3}
              placeholder="描述客户当前使用的手动/替代方案..."
              value={form.currentProcessDescription}
              onChange={(e) =>
                updateField("currentProcessDescription", e.target.value)
              }
            />
          </div>
        </div>

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-semibold text-white shadow-md transition-colors hover:bg-primary-dark active:scale-[0.98]"
        >
          <Sparkles size={18} />
          生成定价策略
        </button>
      </form>
    </div>
  );
}
