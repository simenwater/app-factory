"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { generateId, UNIT_LABELS } from "@/lib/utils";
import type { RecipeIngredient, Unit } from "@/types";
import { ArrowLeft, Plus, Trash2, ChefHat } from "lucide-react";
import Link from "next/link";

/**
 * @description 新建食谱页面
 */
export default function NewRecipePage() {
  const router = useRouter();
  const ingredients = useStore((s) => s.ingredients);
  const addRecipe = useStore((s) => s.addRecipe);
  const settings = useStore((s) => s.settings);
  const recipes = useStore((s) => s.recipes);

  const maxFreeRecipes = 3;
  const canCreate =
    settings.subscriptionTier === "premium" || recipes.length < maxFreeRecipes;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [servings, setServings] = useState("1");
  const [profitMargin, setProfitMargin] = useState(
    (settings.defaultProfitMargin * 100).toString()
  );
  const [taxRate, setTaxRate] = useState(
    (settings.defaultTaxRate * 100).toString()
  );
  const [recipeIngredients, setRecipeIngredients] = useState<RecipeIngredient[]>(
    []
  );

  const [selectedIngredientId, setSelectedIngredientId] = useState("");
  const [ingredientQuantity, setIngredientQuantity] = useState("");
  const [ingredientUnit, setIngredientUnit] = useState<Unit>("g");

  /**
   * @description 添加食材到食谱
   */
  function handleAddIngredient() {
    if (!selectedIngredientId || !ingredientQuantity) return;
    const exists = recipeIngredients.find(
      (ri) => ri.ingredientId === selectedIngredientId
    );
    if (exists) return;

    setRecipeIngredients([
      ...recipeIngredients,
      {
        ingredientId: selectedIngredientId,
        quantity: parseFloat(ingredientQuantity),
        unit: ingredientUnit,
      },
    ]);
    setSelectedIngredientId("");
    setIngredientQuantity("");
    setIngredientUnit("g");
  }

  /**
   * @description 移除食谱中的食材
   */
  function handleRemoveIngredient(ingredientId: string) {
    setRecipeIngredients(
      recipeIngredients.filter((ri) => ri.ingredientId !== ingredientId)
    );
  }

  /**
   * @description 提交创建食谱
   */
  function handleSubmit() {
    if (!name.trim() || recipeIngredients.length === 0) return;
    if (!canCreate) return;

    const now = new Date().toISOString();
    addRecipe({
      id: generateId(),
      name: name.trim(),
      description: description.trim(),
      servings: parseInt(servings) || 1,
      ingredients: recipeIngredients,
      profitMargin: (parseFloat(profitMargin) || 60) / 100,
      taxRate: (parseFloat(taxRate) || 6) / 100,
      createdAt: now,
      updatedAt: now,
    });

    router.push("/recipes");
  }

  const availableIngredients = ingredients.filter(
    (i) => !recipeIngredients.find((ri) => ri.ingredientId === i.id)
  );

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center gap-3">
        <Link
          href="/recipes"
          className="rounded-lg p-2 text-text-muted transition-colors hover:bg-border/50 dark:text-text-muted-dark dark:hover:bg-border-dark/50"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-text dark:text-text-dark">
          新建食谱
        </h1>
      </div>

      {!canCreate && (
        <div className="mb-4 rounded-xl bg-accent/10 p-4 text-center">
          <p className="text-sm font-medium text-accent">
            免费版最多 {maxFreeRecipes} 个食谱
          </p>
          <Link
            href="/settings"
            className="mt-2 inline-block text-xs text-accent underline"
          >
            升级 Premium 解锁无限食谱
          </Link>
        </div>
      )}

      <div className="space-y-4">
        <div className="rounded-xl bg-surface p-4 shadow-sm dark:bg-surface-dark">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-muted dark:text-text-muted-dark">
            基本信息
          </h2>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-text-muted dark:text-text-muted-dark">
                食谱名称 *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="如：红烧肉、宫保鸡丁"
                className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text dark:border-border-dark dark:bg-bg-dark dark:text-text-dark"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-text-muted dark:text-text-muted-dark">
                描述
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="简要描述这道菜..."
                rows={2}
                className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text dark:border-border-dark dark:bg-bg-dark dark:text-text-dark"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-text-muted dark:text-text-muted-dark">
                  份数
                </label>
                <input
                  type="number"
                  value={servings}
                  onChange={(e) => setServings(e.target.value)}
                  min="1"
                  className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text dark:border-border-dark dark:bg-bg-dark dark:text-text-dark"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-text-muted dark:text-text-muted-dark">
                  利润率 (%)
                </label>
                <input
                  type="number"
                  value={profitMargin}
                  onChange={(e) => setProfitMargin(e.target.value)}
                  min="0"
                  max="99"
                  className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text dark:border-border-dark dark:bg-bg-dark dark:text-text-dark"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-text-muted dark:text-text-muted-dark">
                  税率 (%)
                </label>
                <input
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  min="0"
                  max="50"
                  className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text dark:border-border-dark dark:bg-bg-dark dark:text-text-dark"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-surface p-4 shadow-sm dark:bg-surface-dark">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-muted dark:text-text-muted-dark">
            食材配料
          </h2>

          {ingredients.length === 0 ? (
            <div className="rounded-lg bg-bg p-4 text-center dark:bg-bg-dark">
              <p className="mb-2 text-sm text-text-muted dark:text-text-muted-dark">
                食材库为空，请先添加食材
              </p>
              <Link
                href="/ingredients"
                className="text-sm font-medium text-primary"
              >
                前往食材库 →
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-3 flex gap-2">
                <select
                  value={selectedIngredientId}
                  onChange={(e) => setSelectedIngredientId(e.target.value)}
                  className="flex-1 rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text dark:border-border-dark dark:bg-bg-dark dark:text-text-dark"
                >
                  <option value="">选择食材...</option>
                  {availableIngredients.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={ingredientQuantity}
                  onChange={(e) => setIngredientQuantity(e.target.value)}
                  placeholder="用量"
                  min="0.01"
                  step="0.01"
                  className="w-20 rounded-lg border border-border bg-bg px-2 py-2 text-sm text-text dark:border-border-dark dark:bg-bg-dark dark:text-text-dark"
                />
                <select
                  value={ingredientUnit}
                  onChange={(e) => setIngredientUnit(e.target.value as Unit)}
                  className="w-20 rounded-lg border border-border bg-bg px-2 py-2 text-sm text-text dark:border-border-dark dark:bg-bg-dark dark:text-text-dark"
                >
                  {Object.entries(UNIT_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAddIngredient}
                  disabled={!selectedIngredientId || !ingredientQuantity}
                  className="rounded-lg bg-primary p-2 text-white disabled:opacity-50"
                >
                  <Plus size={16} />
                </button>
              </div>

              {recipeIngredients.length > 0 && (
                <div className="space-y-2">
                  {recipeIngredients.map((ri) => {
                    const ingredient = ingredients.find(
                      (i) => i.id === ri.ingredientId
                    );
                    if (!ingredient) return null;
                    return (
                      <div
                        key={ri.ingredientId}
                        className="flex items-center justify-between rounded-lg bg-bg px-3 py-2 dark:bg-bg-dark"
                      >
                        <span className="text-sm text-text dark:text-text-dark">
                          {ingredient.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-text-muted dark:text-text-muted-dark">
                            {ri.quantity} {ri.unit}
                          </span>
                          <button
                            onClick={() =>
                              handleRemoveIngredient(ri.ingredientId)
                            }
                            className="text-danger"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={
            !name.trim() || recipeIngredients.length === 0 || !canCreate
          }
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
        >
          <ChefHat size={18} />
          创建食谱
        </button>
      </div>
    </div>
  );
}
