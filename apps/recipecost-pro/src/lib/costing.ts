import type { Ingredient, Recipe, RecipeIngredient } from "@/types";
import { getUnitConversionFactor } from "./utils";

/**
 * @description 计算单个食材在食谱中的成本
 * @param {RecipeIngredient} ri - 食谱中的食材用量
 * @param {Ingredient} ingredient - 食材库中的食材信息
 * @returns {number} 该食材的成本
 */
export function calculateIngredientCost(
  ri: RecipeIngredient,
  ingredient: Ingredient
): number {
  const conversionFactor = getUnitConversionFactor(ri.unit, ingredient.unit);
  const unitPrice = ingredient.price / ingredient.quantity;
  return ri.quantity * conversionFactor * unitPrice;
}

/**
 * @description 计算食谱的总食材成本
 * @param {Recipe} recipe - 食谱信息
 * @param {Ingredient[]} ingredients - 食材库
 * @returns {number} 总食材成本
 */
export function calculateRecipeTotalCost(
  recipe: Recipe,
  ingredients: Ingredient[]
): number {
  return recipe.ingredients.reduce((total, ri) => {
    const ingredient = ingredients.find((i) => i.id === ri.ingredientId);
    if (!ingredient) return total;
    return total + calculateIngredientCost(ri, ingredient);
  }, 0);
}

/**
 * @description 计算单份成本
 * @param {Recipe} recipe - 食谱信息
 * @param {Ingredient[]} ingredients - 食材库
 * @returns {number} 单份成本
 */
export function calculatePerServingCost(
  recipe: Recipe,
  ingredients: Ingredient[]
): number {
  const totalCost = calculateRecipeTotalCost(recipe, ingredients);
  return recipe.servings > 0 ? totalCost / recipe.servings : 0;
}

/**
 * @description 根据利润率计算建议售价
 * @param {number} costPerServing - 单份成本
 * @param {number} profitMargin - 利润率 (0-1)
 * @param {number} taxRate - 税率 (0-1)
 * @returns {number} 建议售价（含税）
 */
export function calculateSuggestedPrice(
  costPerServing: number,
  profitMargin: number,
  taxRate: number
): number {
  const priceBeforeTax = costPerServing / (1 - profitMargin);
  return priceBeforeTax * (1 + taxRate);
}

/**
 * @description 根据售价反算实际利润率
 * @param {number} sellingPrice - 售价
 * @param {number} costPerServing - 单份成本
 * @param {number} taxRate - 税率
 * @returns {number} 实际利润率 (0-1)
 */
export function calculateActualMargin(
  sellingPrice: number,
  costPerServing: number,
  taxRate: number
): number {
  if (sellingPrice <= 0) return 0;
  const priceBeforeTax = sellingPrice / (1 + taxRate);
  return (priceBeforeTax - costPerServing) / priceBeforeTax;
}

/**
 * @description 计算单份利润额
 * @param {number} sellingPrice - 售价
 * @param {number} costPerServing - 单份成本
 * @param {number} taxRate - 税率
 * @returns {number} 每份利润
 */
export function calculateProfitPerServing(
  sellingPrice: number,
  costPerServing: number,
  taxRate: number
): number {
  const priceBeforeTax = sellingPrice / (1 + taxRate);
  return priceBeforeTax - costPerServing;
}

/**
 * @description 食谱完整成本分析结果
 */
export interface CostAnalysis {
  totalCost: number;
  perServingCost: number;
  suggestedPrice: number;
  profitPerServing: number;
  actualMargin: number;
  ingredientBreakdown: {
    ingredientId: string;
    name: string;
    cost: number;
    percentage: number;
  }[];
}

/**
 * @description 生成食谱完整成本分析
 * @param {Recipe} recipe - 食谱信息
 * @param {Ingredient[]} ingredients - 食材库
 * @returns {CostAnalysis} 完整成本分析结果
 */
export function generateCostAnalysis(
  recipe: Recipe,
  ingredients: Ingredient[]
): CostAnalysis {
  const totalCost = calculateRecipeTotalCost(recipe, ingredients);
  const perServingCost = calculatePerServingCost(recipe, ingredients);
  const suggestedPrice = calculateSuggestedPrice(
    perServingCost,
    recipe.profitMargin,
    recipe.taxRate
  );
  const profitPerServing = calculateProfitPerServing(
    suggestedPrice,
    perServingCost,
    recipe.taxRate
  );
  const actualMargin = calculateActualMargin(
    suggestedPrice,
    perServingCost,
    recipe.taxRate
  );

  const ingredientBreakdown = recipe.ingredients
    .map((ri) => {
      const ingredient = ingredients.find((i) => i.id === ri.ingredientId);
      if (!ingredient) return null;
      const cost = calculateIngredientCost(ri, ingredient);
      return {
        ingredientId: ri.ingredientId,
        name: ingredient.name,
        cost,
        percentage: totalCost > 0 ? cost / totalCost : 0,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .sort((a, b) => b.cost - a.cost);

  return {
    totalCost,
    perServingCost,
    suggestedPrice,
    profitPerServing,
    actualMargin,
    ingredientBreakdown,
  };
}
