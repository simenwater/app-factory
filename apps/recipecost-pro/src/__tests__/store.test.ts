import { useStore } from "@/store/useStore";
import type { Ingredient, Recipe } from "@/types";

/**
 * @description 重置 Store 到初始状态
 */
function resetStore() {
  useStore.getState().resetStore();
}

/**
 * @description 创建测试用 Ingredient
 */
function createMockIngredient(id: string = "ing-1"): Ingredient {
  return {
    id,
    name: "猪肉",
    category: "meat",
    price: 30,
    unit: "kg",
    quantity: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * @description 创建测试用 Recipe
 */
function createMockRecipe(id: string = "recipe-1"): Recipe {
  return {
    id,
    name: "红烧肉",
    description: "经典红烧肉",
    servings: 4,
    ingredients: [{ ingredientId: "ing-1", quantity: 500, unit: "g" }],
    profitMargin: 0.6,
    taxRate: 0.06,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

describe("useStore", () => {
  beforeEach(resetStore);

  describe("ingredients", () => {
    it("should start with empty ingredients", () => {
      expect(useStore.getState().ingredients).toEqual([]);
    });

    it("should add an ingredient", () => {
      const ingredient = createMockIngredient();
      useStore.getState().addIngredient(ingredient);
      expect(useStore.getState().ingredients).toHaveLength(1);
      expect(useStore.getState().ingredients[0].id).toBe("ing-1");
    });

    it("should update an ingredient", () => {
      const ingredient = createMockIngredient();
      useStore.getState().addIngredient(ingredient);
      useStore.getState().updateIngredient("ing-1", { price: 35 });
      expect(useStore.getState().ingredients[0].price).toBe(35);
    });

    it("should remove an ingredient", () => {
      const ingredient = createMockIngredient();
      useStore.getState().addIngredient(ingredient);
      useStore.getState().removeIngredient("ing-1");
      expect(useStore.getState().ingredients).toHaveLength(0);
    });
  });

  describe("recipes", () => {
    it("should start with empty recipes", () => {
      expect(useStore.getState().recipes).toEqual([]);
    });

    it("should add a recipe", () => {
      const recipe = createMockRecipe();
      useStore.getState().addRecipe(recipe);
      expect(useStore.getState().recipes).toHaveLength(1);
      expect(useStore.getState().recipes[0].id).toBe("recipe-1");
    });

    it("should update a recipe", () => {
      const recipe = createMockRecipe();
      useStore.getState().addRecipe(recipe);
      useStore.getState().updateRecipe("recipe-1", { profitMargin: 0.7 });
      expect(useStore.getState().recipes[0].profitMargin).toBe(0.7);
    });

    it("should remove a recipe", () => {
      const recipe = createMockRecipe();
      useStore.getState().addRecipe(recipe);
      useStore.getState().removeRecipe("recipe-1");
      expect(useStore.getState().recipes).toHaveLength(0);
    });
  });

  describe("settings", () => {
    it("should have default settings", () => {
      const settings = useStore.getState().settings;
      expect(settings.darkMode).toBe(false);
      expect(settings.currency).toBe("CNY");
      expect(settings.defaultTaxRate).toBe(0.06);
      expect(settings.defaultProfitMargin).toBe(0.6);
      expect(settings.subscriptionTier).toBe("free");
    });

    it("should update settings partially", () => {
      useStore.getState().updateSettings({ darkMode: true });
      expect(useStore.getState().settings.darkMode).toBe(true);
      expect(useStore.getState().settings.currency).toBe("CNY");
    });

    it("should update subscription tier", () => {
      useStore.getState().updateSettings({ subscriptionTier: "premium" });
      expect(useStore.getState().settings.subscriptionTier).toBe("premium");
    });

    it("should update currency", () => {
      useStore.getState().updateSettings({ currency: "USD" });
      expect(useStore.getState().settings.currency).toBe("USD");
    });
  });

  describe("resetStore", () => {
    it("should reset all data to defaults", () => {
      useStore.getState().addIngredient(createMockIngredient());
      useStore.getState().addRecipe(createMockRecipe());
      useStore.getState().updateSettings({ darkMode: true, subscriptionTier: "premium" });

      useStore.getState().resetStore();
      expect(useStore.getState().ingredients).toEqual([]);
      expect(useStore.getState().recipes).toEqual([]);
      expect(useStore.getState().settings.darkMode).toBe(false);
      expect(useStore.getState().settings.subscriptionTier).toBe("free");
    });
  });
});
