"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useStore } from "@/store/useStore";
import { generateId } from "@/lib/utils";
import { INDUSTRY_CONFIG, generatePricingRecommendation } from "@/lib/pricing";
import type { Industry, ValueInput } from "@/types";
import { ArrowLeft, Sparkles, Loader2 } from "lucide-react";
import Link from "next/link";

/**
 * @description Customer value quantification form page
 */
export default function CalculatorPage() {
  const router = useRouter();
  const { data: session } = useSession();
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
  const [isGenerating, setIsGenerating] = useState(false);

  /**
   * @description Validate form fields
   */
  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!form.productName.trim()) newErrors.productName = "Please enter a product name";
    if (form.engineerCount <= 0) newErrors.engineerCount = "Please enter a valid number";
    if (form.avgHourlyCost <= 0) newErrors.avgHourlyCost = "Please enter a valid number";
    if (form.hoursSavedPerWeek <= 0)
      newErrors.hoursSavedPerWeek = "Please enter a valid number";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  /**
   * @description Submit form and generate pricing recommendation
   */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setIsGenerating(true);

    try {
      let inputId = generateId();
      const createdAt = new Date().toISOString();

      const input: ValueInput = {
        id: inputId,
        createdAt,
        ...form,
      };

      if (session?.user) {
        const inputRes = await fetch("/api/data/inputs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (inputRes.ok) {
          const savedInput = await inputRes.json();
          inputId = savedInput.id;
          input.id = savedInput.id;
          input.createdAt = savedInput.createdAt;
        }
      }

      addInput(input);
      const recommendation = generatePricingRecommendation(input);

      if (session?.user) {
        const recRes = await fetch("/api/data/recommendations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(recommendation),
        });
        if (recRes.ok) {
          const savedRec = await recRes.json();
          recommendation.id = savedRec.id;
        }
      }

      addRecommendation(recommendation);
      router.push(`/reports/${recommendation.id}`);
    } finally {
      setIsGenerating(false);
    }
  }

  /**
   * @description Update form field value
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
            Value Calculator
          </h1>
          <p className="text-xs text-text-muted dark:text-text-muted-dark">
            Enter customer value to generate a pricing strategy
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="rounded-xl bg-surface p-4 shadow-sm dark:bg-surface-dark">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-text-muted dark:text-text-muted-dark">
            Basic Information
          </h2>

          <div className="mb-4">
            <label className={labelClass}>Product Name *</label>
            <input
              type="text"
              className={inputClass}
              placeholder="e.g. DataSync Pro"
              value={form.productName}
              onChange={(e) => updateField("productName", e.target.value)}
            />
            {errors.productName && (
              <p className={errorClass}>{errors.productName}</p>
            )}
          </div>

          <div className="mb-4">
            <label className={labelClass}>Industry</label>
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
            <label className={labelClass}>Target Customer Size</label>
            <select
              className={inputClass}
              value={form.targetCustomerSize}
              onChange={(e) =>
                updateField("targetCustomerSize", e.target.value)
              }
            >
              <option value="startup">Startup (1-10 people)</option>
              <option value="smb">SMB (10-100 people)</option>
              <option value="mid_market">Mid-Market (100-1,000 people)</option>
              <option value="enterprise">Enterprise (1,000+ people)</option>
            </select>
          </div>
        </div>

        <div className="rounded-xl bg-surface p-4 shadow-sm dark:bg-surface-dark">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-text-muted dark:text-text-muted-dark">
            Value Quantification
          </h2>

          <div className="mb-4">
            <label className={labelClass}>Number of Engineers Impacted *</label>
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
            <label className={labelClass}>Average Engineer Hourly Cost (USD) *</label>
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
            <label className={labelClass}>Hours Saved Per Week *</label>
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
            <label className={labelClass}>Other Monthly Cost Savings (USD)</label>
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
              Including infrastructure, tool licenses, etc.
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-surface p-4 shadow-sm dark:bg-surface-dark">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-text-muted dark:text-text-muted-dark">
            Market Information (Optional)
          </h2>

          <div className="mb-4">
            <label className={labelClass}>Competitor Monthly Price (USD)</label>
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
              Enter to get competitor comparison analysis
              {tier === "free" && " (Premium unlocks detailed competitor data)"}
            </p>
          </div>

          <div>
            <label className={labelClass}>Current Process Description</label>
            <textarea
              className={inputClass}
              rows={3}
              placeholder="Describe the customer's current manual/alternative solution..."
              value={form.currentProcessDescription}
              onChange={(e) =>
                updateField("currentProcessDescription", e.target.value)
              }
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isGenerating}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-semibold text-white shadow-md transition-colors hover:bg-primary-dark active:scale-[0.98] disabled:opacity-70"
        >
          {isGenerating ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles size={18} />
              Generate Pricing Strategy
            </>
          )}
        </button>
      </form>
    </div>
  );
}
