import {
  calculateIngredientCost,
  calculateRecipeTotalCost,
  calculatePerServingCost,
  calculateSuggestedPrice,
  calculateActualMargin,
  calculateProfitPerServing,
  generateCostAnalysis,
} from "@/lib/costing";
import type { Ingredient, Recipe } from "@/types";

/**
 * @description 创建测试用食材
 */
function createTestIngredient(overrides?: Partial<Ingredient>): Ingredient {
  return {
    id: "ing-1",
    name: "猪肉",
    category: "meat",
    price: 30,
    unit: "kg",
    quantity: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * @description 创建测试用食谱
 */
function createTestRecipe(overrides?: Partial<Recipe>): Recipe {
  return {
    id: "recipe-1",
    name: "红烧肉",
    description: "经典红烧肉",
    servings: 4,
    ingredients: [
      { ingredientId: "ing-1", quantity: 500, unit: "g" },
      { ingredientId: "ing-2", quantity: 200, unit: "g" },
    ],
    profitMargin: 0.6,
    taxRate: 0.06,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

const testIngredients: Ingredient[] = [
  createTestIngredient({ id: "ing-1", name: "猪肉", price: 30, unit: "kg", quantity: 1 }),
  createTestIngredient({
    id: "ing-2",
    name: "酱油",
    category: "seasoning",
    price: 10,
    unit: "ml",
    quantity: 500,
  }),
];

describe("calculateIngredientCost", () => {
  it("should calculate cost with same units", () => {
    const ingredient = createTestIngredient({ price: 30, unit: "kg", quantity: 1 });
    const ri = { ingredientId: "ing-1", quantity: 1, unit: "kg" as const };
    expect(calculateIngredientCost(ri, ingredient)).toBe(30);
  });

  it("should calculate cost with unit conversion (g to kg)", () => {
    const ingredient = createTestIngredient({ price: 30, unit: "kg", quantity: 1 });
    const ri = { ingredientId: "ing-1", quantity: 500, unit: "g" as const };
    expect(calculateIngredientCost(ri, ingredient)).toBeCloseTo(15, 1);
  });

  it("should handle fractional quantities", () => {
    const ingredient = createTestIngredient({ price: 10, unit: "kg", quantity: 1 });
    const ri = { ingredientId: "ing-1", quantity: 250, unit: "g" as const };
    expect(calculateIngredientCost(ri, ingredient)).toBeCloseTo(2.5, 1);
  });

  it("should handle quantity-based pricing", () => {
    const ingredient = createTestIngredient({
      price: 10,
      unit: "ml",
      quantity: 500,
    });
    const ri = { ingredientId: "ing-2", quantity: 200, unit: "ml" as const };
    expect(calculateIngredientCost(ri, ingredient)).toBeCloseTo(4, 1);
  });
});

describe("calculateRecipeTotalCost", () => {
  it("should sum all ingredient costs", () => {
    const recipe = createTestRecipe();
    const total = calculateRecipeTotalCost(recipe, testIngredients);
    expect(total).toBeGreaterThan(0);
  });

  it("should return 0 for recipe with no ingredients", () => {
    const recipe = createTestRecipe({ ingredients: [] });
    expect(calculateRecipeTotalCost(recipe, testIngredients)).toBe(0);
  });

  it("should skip missing ingredients", () => {
    const recipe = createTestRecipe({
      ingredients: [{ ingredientId: "nonexistent", quantity: 100, unit: "g" }],
    });
    expect(calculateRecipeTotalCost(recipe, testIngredients)).toBe(0);
  });
});

describe("calculatePerServingCost", () => {
  it("should divide total cost by servings", () => {
    const recipe = createTestRecipe({ servings: 4 });
    const total = calculateRecipeTotalCost(recipe, testIngredients);
    const perServing = calculatePerServingCost(recipe, testIngredients);
    expect(perServing).toBeCloseTo(total / 4, 2);
  });

  it("should return 0 for zero servings", () => {
    const recipe = createTestRecipe({ servings: 0 });
    expect(calculatePerServingCost(recipe, testIngredients)).toBe(0);
  });

  it("should return total cost for single serving", () => {
    const recipe = createTestRecipe({ servings: 1 });
    const total = calculateRecipeTotalCost(recipe, testIngredients);
    const perServing = calculatePerServingCost(recipe, testIngredients);
    expect(perServing).toBeCloseTo(total, 2);
  });
});

describe("calculateSuggestedPrice", () => {
  it("should apply profit margin and tax rate", () => {
    const price = calculateSuggestedPrice(10, 0.6, 0.06);
    expect(price).toBeCloseTo(10 / 0.4 * 1.06, 2);
  });

  it("should return 0 for zero cost", () => {
    expect(calculateSuggestedPrice(0, 0.6, 0.06)).toBe(0);
  });

  it("should be higher with higher margin", () => {
    const low = calculateSuggestedPrice(10, 0.3, 0.06);
    const high = calculateSuggestedPrice(10, 0.7, 0.06);
    expect(high).toBeGreaterThan(low);
  });

  it("should be higher with higher tax rate", () => {
    const low = calculateSuggestedPrice(10, 0.6, 0.03);
    const high = calculateSuggestedPrice(10, 0.6, 0.13);
    expect(high).toBeGreaterThan(low);
  });
});

describe("calculateActualMargin", () => {
  it("should return correct margin", () => {
    const margin = calculateActualMargin(26.5, 10, 0.06);
    expect(margin).toBeGreaterThan(0);
    expect(margin).toBeLessThan(1);
  });

  it("should return 0 for zero selling price", () => {
    expect(calculateActualMargin(0, 10, 0.06)).toBe(0);
  });

  it("should be inversely consistent with calculateSuggestedPrice", () => {
    const cost = 10;
    const targetMargin = 0.6;
    const tax = 0.06;
    const price = calculateSuggestedPrice(cost, targetMargin, tax);
    const actualMargin = calculateActualMargin(price, cost, tax);
    expect(actualMargin).toBeCloseTo(targetMargin, 5);
  });
});

describe("calculateProfitPerServing", () => {
  it("should calculate profit correctly", () => {
    const profit = calculateProfitPerServing(26.5, 10, 0.06);
    const priceBeforeTax = 26.5 / 1.06;
    expect(profit).toBeCloseTo(priceBeforeTax - 10, 2);
  });

  it("should be positive when price > cost", () => {
    expect(calculateProfitPerServing(20, 5, 0.06)).toBeGreaterThan(0);
  });

  it("should be negative when price < cost", () => {
    expect(calculateProfitPerServing(5, 20, 0.06)).toBeLessThan(0);
  });
});

describe("generateCostAnalysis", () => {
  it("should produce a complete analysis", () => {
    const recipe = createTestRecipe();
    const analysis = generateCostAnalysis(recipe, testIngredients);

    expect(analysis.totalCost).toBeGreaterThan(0);
    expect(analysis.perServingCost).toBeGreaterThan(0);
    expect(analysis.suggestedPrice).toBeGreaterThan(0);
    expect(analysis.profitPerServing).toBeGreaterThan(0);
    expect(analysis.actualMargin).toBeGreaterThan(0);
    expect(analysis.actualMargin).toBeLessThan(1);
    expect(analysis.ingredientBreakdown.length).toBeGreaterThan(0);
  });

  it("should have ingredient percentages summing to approximately 1", () => {
    const recipe = createTestRecipe();
    const analysis = generateCostAnalysis(recipe, testIngredients);
    const totalPercentage = analysis.ingredientBreakdown.reduce(
      (sum, item) => sum + item.percentage,
      0
    );
    expect(totalPercentage).toBeCloseTo(1, 1);
  });

  it("should sort breakdown by cost descending", () => {
    const recipe = createTestRecipe();
    const analysis = generateCostAnalysis(recipe, testIngredients);
    for (let i = 1; i < analysis.ingredientBreakdown.length; i++) {
      expect(analysis.ingredientBreakdown[i - 1].cost).toBeGreaterThanOrEqual(
        analysis.ingredientBreakdown[i].cost
      );
    }
  });
});
