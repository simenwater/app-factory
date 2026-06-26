"use client";

import { useStore } from "@/store/useStore";
import { formatCurrency, formatDate } from "@/lib/utils";
import { calculatePerServingCost, calculateSuggestedPrice } from "@/lib/costing";
import { EmptyState } from "@/components/EmptyState";
import Link from "next/link";
import { ChefHat, Plus, Trash2 } from "lucide-react";

/**
 * @description 食谱列表页面
 */
export default function RecipesPage() {
  const recipes = useStore((s) => s.recipes);
  const ingredients = useStore((s) => s.ingredients);
  const removeRecipe = useStore((s) => s.removeRecipe);
  const currency = useStore((s) => s.settings.currency);
  const tier = useStore((s) => s.settings.subscriptionTier);

  const maxFreeRecipes = 3;
  const canCreate = tier === "premium" || recipes.length < maxFreeRecipes;

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text dark:text-text-dark">
          我的食谱
        </h1>
        {canCreate ? (
          <Link
            href="/recipes/new"
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
          >
            <Plus size={16} />
            新建食谱
          </Link>
        ) : (
          <Link
            href="/settings"
            className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-2 text-sm font-medium text-white"
          >
            升级解锁
          </Link>
        )}
      </div>

      {!canCreate && (
        <div className="mb-4 rounded-xl bg-accent/10 p-3 text-center">
          <p className="text-sm text-accent">
            免费版最多 {maxFreeRecipes} 个食谱，升级 Premium 解锁无限食谱
          </p>
        </div>
      )}

      {recipes.length === 0 ? (
        <EmptyState
          icon={ChefHat}
          title="还没有食谱"
          description="创建您的第一个食谱，自动计算成本和建议售价"
        />
      ) : (
        <div className="space-y-3">
          {[...recipes]
            .sort(
              (a, b) =>
                new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            )
            .map((recipe) => {
              const perServing = calculatePerServingCost(recipe, ingredients);
              const suggested = calculateSuggestedPrice(
                perServing,
                recipe.profitMargin,
                recipe.taxRate
              );

              return (
                <div
                  key={recipe.id}
                  className="rounded-xl bg-surface shadow-sm dark:bg-surface-dark"
                >
                  <Link
                    href={`/recipes/${recipe.id}`}
                    className="flex items-center justify-between p-4"
                  >
                    <div>
                      <p className="font-medium text-text dark:text-text-dark">
                        {recipe.name}
                      </p>
                      <p className="text-xs text-text-muted dark:text-text-muted-dark">
                        {recipe.ingredients.length} 种食材 · {recipe.servings} 份 ·{" "}
                        {formatDate(recipe.updatedAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">
                        {formatCurrency(suggested, currency)}
                      </p>
                      <p className="text-xs text-text-muted dark:text-text-muted-dark">
                        成本 {formatCurrency(perServing, currency)}
                      </p>
                    </div>
                  </Link>
                  <div className="flex border-t border-border px-4 py-2 dark:border-border-dark">
                    <button
                      onClick={() => {
                        if (confirm(`确定删除食谱「${recipe.name}」吗？`)) {
                          removeRecipe(recipe.id);
                        }
                      }}
                      className="flex items-center gap-1 text-xs text-danger"
                    >
                      <Trash2 size={12} />
                      删除
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
