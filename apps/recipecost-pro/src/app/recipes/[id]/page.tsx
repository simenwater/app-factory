"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { useStore } from "@/store/useStore";
import { formatCurrency, formatPercent, CATEGORY_CONFIG } from "@/lib/utils";
import { generateCostAnalysis } from "@/lib/costing";
import { generatePricingLabelPDF } from "@/lib/pdf";
import {
  ArrowLeft,
  Download,
  TrendingUp,
  DollarSign,
  BarChart3,
  Percent,
  ChefHat,
} from "lucide-react";
import Link from "next/link";

/**
 * @description 食谱详情页面 — 成本分析与定价
 */
export default function RecipeDetailPage() {
  const params = useParams();
  const recipes = useStore((s) => s.recipes);
  const ingredients = useStore((s) => s.ingredients);
  const updateRecipe = useStore((s) => s.updateRecipe);
  const currency = useStore((s) => s.settings.currency);

  const recipe = recipes.find((r) => r.id === params.id);

  const [customMargin, setCustomMargin] = useState<string>(
    recipe ? (recipe.profitMargin * 100).toString() : "60"
  );

  if (!recipe) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <ChefHat size={48} className="mb-4 text-text-muted dark:text-text-muted-dark" />
        <p className="mb-4 text-text-muted dark:text-text-muted-dark">
          食谱未找到
        </p>
        <Link href="/recipes" className="text-primary">
          返回食谱列表
        </Link>
      </div>
    );
  }

  const effectiveMargin = (parseFloat(customMargin) || 0) / 100;
  const modifiedRecipe = { ...recipe, profitMargin: effectiveMargin };
  const analysis = generateCostAnalysis(modifiedRecipe, ingredients);

  /**
   * @description 更新利润率
   */
  function handleMarginChange(value: string) {
    setCustomMargin(value);
    const margin = parseFloat(value);
    if (!isNaN(margin) && margin >= 0 && margin < 100) {
      updateRecipe(recipe!.id, { profitMargin: margin / 100 });
    }
  }

  /**
   * @description 导出 PDF
   */
  function handleExportPDF() {
    generatePricingLabelPDF(modifiedRecipe, ingredients, currency);
  }

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center gap-3">
        <Link
          href="/recipes"
          className="rounded-lg p-2 text-text-muted transition-colors hover:bg-border/50 dark:text-text-muted-dark dark:hover:bg-border-dark/50"
        >
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-text dark:text-text-dark">
            {recipe.name}
          </h1>
          {recipe.description && (
            <p className="text-xs text-text-muted dark:text-text-muted-dark">
              {recipe.description}
            </p>
          )}
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-surface p-4 shadow-sm dark:bg-surface-dark">
          <div className="mb-1 flex items-center gap-1.5 text-text-muted dark:text-text-muted-dark">
            <DollarSign size={14} />
            <span className="text-xs">单份成本</span>
          </div>
          <p className="text-xl font-bold text-text dark:text-text-dark">
            {formatCurrency(analysis.perServingCost, currency)}
          </p>
        </div>
        <div className="rounded-xl bg-primary/10 p-4 shadow-sm">
          <div className="mb-1 flex items-center gap-1.5 text-primary">
            <TrendingUp size={14} />
            <span className="text-xs">建议售价</span>
          </div>
          <p className="text-xl font-bold text-primary">
            {formatCurrency(analysis.suggestedPrice, currency)}
          </p>
        </div>
        <div className="rounded-xl bg-surface p-4 shadow-sm dark:bg-surface-dark">
          <div className="mb-1 flex items-center gap-1.5 text-text-muted dark:text-text-muted-dark">
            <BarChart3 size={14} />
            <span className="text-xs">每份利润</span>
          </div>
          <p className="text-xl font-bold text-success">
            {formatCurrency(analysis.profitPerServing, currency)}
          </p>
        </div>
        <div className="rounded-xl bg-surface p-4 shadow-sm dark:bg-surface-dark">
          <div className="mb-1 flex items-center gap-1.5 text-text-muted dark:text-text-muted-dark">
            <Percent size={14} />
            <span className="text-xs">总成本</span>
          </div>
          <p className="text-xl font-bold text-text dark:text-text-dark">
            {formatCurrency(analysis.totalCost, currency)}
          </p>
        </div>
      </div>

      <div className="mb-4 rounded-xl bg-surface p-4 shadow-sm dark:bg-surface-dark">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-muted dark:text-text-muted-dark">
          利润率调整
        </h2>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="10"
            max="90"
            value={customMargin}
            onChange={(e) => handleMarginChange(e.target.value)}
            className="flex-1 accent-primary"
          />
          <div className="flex items-center gap-1">
            <input
              type="number"
              value={customMargin}
              onChange={(e) => handleMarginChange(e.target.value)}
              min="0"
              max="99"
              className="w-16 rounded-lg border border-border bg-bg px-2 py-1 text-center text-sm text-text dark:border-border-dark dark:bg-bg-dark dark:text-text-dark"
            />
            <span className="text-sm text-text-muted dark:text-text-muted-dark">
              %
            </span>
          </div>
        </div>
        <p className="mt-2 text-xs text-text-muted dark:text-text-muted-dark">
          调整利润率后建议售价：
          <span className="font-semibold text-primary">
            {" "}
            {formatCurrency(analysis.suggestedPrice, currency)}
          </span>
        </p>
      </div>

      <div className="mb-4 rounded-xl bg-surface p-4 shadow-sm dark:bg-surface-dark">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-muted dark:text-text-muted-dark">
          食材成本明细
        </h2>
        <div className="space-y-2">
          {analysis.ingredientBreakdown.map((item) => {
            const ingredient = ingredients.find(
              (i) => i.id === item.ingredientId
            );
            return (
              <div
                key={item.ingredientId}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">
                    {ingredient
                      ? CATEGORY_CONFIG[ingredient.category].emoji
                      : "📦"}
                  </span>
                  <span className="text-sm text-text dark:text-text-dark">
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-16 overflow-hidden rounded-full bg-border dark:bg-border-dark">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${item.percentage * 100}%` }}
                    />
                  </div>
                  <span className="w-12 text-right text-xs text-text-muted dark:text-text-muted-dark">
                    {formatPercent(item.percentage)}
                  </span>
                  <span className="w-16 text-right text-sm font-medium text-text dark:text-text-dark">
                    {formatCurrency(item.cost, currency)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mb-4 rounded-xl bg-surface p-4 shadow-sm dark:bg-surface-dark">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-muted dark:text-text-muted-dark">
          食谱信息
        </h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-text-muted dark:text-text-muted-dark">
              份数
            </span>
            <p className="font-medium text-text dark:text-text-dark">
              {recipe.servings}
            </p>
          </div>
          <div>
            <span className="text-text-muted dark:text-text-muted-dark">
              税率
            </span>
            <p className="font-medium text-text dark:text-text-dark">
              {formatPercent(recipe.taxRate)}
            </p>
          </div>
          <div>
            <span className="text-text-muted dark:text-text-muted-dark">
              食材种类
            </span>
            <p className="font-medium text-text dark:text-text-dark">
              {recipe.ingredients.length}
            </p>
          </div>
          <div>
            <span className="text-text-muted dark:text-text-muted-dark">
              利润率
            </span>
            <p className="font-medium text-primary">
              {formatPercent(effectiveMargin)}
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={handleExportPDF}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
      >
        <Download size={18} />
        导出定价标签 PDF
      </button>
    </div>
  );
}
