"use client";

import { useStore } from "@/store/useStore";
import { formatCurrency } from "@/lib/utils";
import { calculatePerServingCost, calculateSuggestedPrice } from "@/lib/costing";
import Link from "next/link";
import {
  ChefHat,
  Package,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Crown,
} from "lucide-react";

/**
 * @description 首页仪表盘，展示概览信息和快速操作
 */
export default function HomePage() {
  const ingredients = useStore((s) => s.ingredients);
  const recipes = useStore((s) => s.recipes);
  const settings = useStore((s) => s.settings);

  const totalRecipeCosts = recipes.reduce((sum, recipe) => {
    const cost = calculatePerServingCost(recipe, ingredients);
    return sum + cost;
  }, 0);

  const avgCost = recipes.length > 0 ? totalRecipeCosts / recipes.length : 0;

  return (
    <div className="p-4">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text dark:text-text-dark">
            RecipeCost Pro
          </h1>
          <p className="text-sm text-text-muted dark:text-text-muted-dark">
            食谱成本计算与定价工具
          </p>
        </div>
        {settings.subscriptionTier === "premium" && (
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Crown size={12} className="mr-1 inline" />
            Premium
          </span>
        )}
      </div>

      <div className="mb-6 grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-surface p-4 shadow-sm dark:bg-surface-dark">
          <div className="mb-1 flex items-center gap-1 text-text-muted dark:text-text-muted-dark">
            <Package size={14} />
            <span className="text-xs">食材</span>
          </div>
          <p className="text-2xl font-bold text-text dark:text-text-dark">
            {ingredients.length}
          </p>
        </div>
        <div className="rounded-xl bg-surface p-4 shadow-sm dark:bg-surface-dark">
          <div className="mb-1 flex items-center gap-1 text-text-muted dark:text-text-muted-dark">
            <ChefHat size={14} />
            <span className="text-xs">食谱</span>
          </div>
          <p className="text-2xl font-bold text-text dark:text-text-dark">
            {recipes.length}
          </p>
        </div>
        <div className="rounded-xl bg-surface p-4 shadow-sm dark:bg-surface-dark">
          <div className="mb-1 flex items-center gap-1 text-text-muted dark:text-text-muted-dark">
            <TrendingUp size={14} />
            <span className="text-xs">均价</span>
          </div>
          <p className="text-xl font-bold text-primary">
            {formatCurrency(avgCost, settings.currency)}
          </p>
        </div>
      </div>

      <div className="mb-6 space-y-3">
        <Link
          href="/ingredients"
          className="flex items-center justify-between rounded-xl bg-primary p-4 text-white shadow-md transition-transform active:scale-[0.98]"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-white/20 p-2">
              <Package size={20} />
            </div>
            <div>
              <p className="font-semibold">管理食材库</p>
              <p className="text-xs text-white/80">添加和管理您的食材与价格</p>
            </div>
          </div>
          <ArrowRight size={20} />
        </Link>

        <Link
          href="/recipes/new"
          className="flex items-center justify-between rounded-xl bg-accent p-4 text-white shadow-md transition-transform active:scale-[0.98]"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-white/20 p-2">
              <Sparkles size={20} />
            </div>
            <div>
              <p className="font-semibold">创建新食谱</p>
              <p className="text-xs text-white/80">计算食材成本，获取定价建议</p>
            </div>
          </div>
          <ArrowRight size={20} />
        </Link>
      </div>

      <div className="mb-4">
        <h2 className="mb-3 text-lg font-semibold text-text dark:text-text-dark">
          最近食谱
        </h2>
        {recipes.length === 0 ? (
          <div className="rounded-xl bg-surface p-6 text-center shadow-sm dark:bg-surface-dark">
            <ChefHat
              size={32}
              className="mx-auto mb-2 text-text-muted dark:text-text-muted-dark"
            />
            <p className="text-sm text-text-muted dark:text-text-muted-dark">
              还没有食谱，开始创建您的第一个食谱吧！
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {recipes
              .slice(-5)
              .reverse()
              .map((recipe) => {
                const perServing = calculatePerServingCost(recipe, ingredients);
                const suggested = calculateSuggestedPrice(
                  perServing,
                  recipe.profitMargin,
                  recipe.taxRate
                );
                return (
                  <Link
                    key={recipe.id}
                    href={`/recipes/${recipe.id}`}
                    className="flex items-center justify-between rounded-xl bg-surface p-4 shadow-sm transition-colors hover:bg-border/30 dark:bg-surface-dark dark:hover:bg-border-dark/30"
                  >
                    <div>
                      <p className="font-medium text-text dark:text-text-dark">
                        {recipe.name}
                      </p>
                      <p className="text-xs text-text-muted dark:text-text-muted-dark">
                        {recipe.ingredients.length} 种食材 · {recipe.servings} 份
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">
                        {formatCurrency(suggested, settings.currency)}
                      </p>
                      <p className="text-xs text-text-muted dark:text-text-muted-dark">
                        成本 {formatCurrency(perServing, settings.currency)}
                      </p>
                    </div>
                  </Link>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
