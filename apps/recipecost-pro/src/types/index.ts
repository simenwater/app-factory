/**
 * @description 计量单位类型
 */
export type Unit = "g" | "kg" | "ml" | "L" | "个" | "片" | "根" | "把" | "勺" | "杯";

/**
 * @description 货币类型
 */
export type Currency = "CNY" | "USD" | "EUR" | "GBP" | "JPY";

/**
 * @description 订阅层级
 */
export type SubscriptionTier = "free" | "premium";

/**
 * @description 食材分类
 */
export type IngredientCategory =
  | "meat"
  | "seafood"
  | "vegetable"
  | "fruit"
  | "dairy"
  | "grain"
  | "seasoning"
  | "oil"
  | "other";

/**
 * @description 食材分类配置
 */
export interface CategoryConfig {
  label: string;
  emoji: string;
}

/**
 * @description 食材信息
 */
export interface Ingredient {
  id: string;
  name: string;
  category: IngredientCategory;
  price: number;
  unit: Unit;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * @description 食谱中的食材用量
 */
export interface RecipeIngredient {
  ingredientId: string;
  quantity: number;
  unit: Unit;
}

/**
 * @description 食谱信息
 */
export interface Recipe {
  id: string;
  name: string;
  description: string;
  servings: number;
  ingredients: RecipeIngredient[];
  profitMargin: number;
  taxRate: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * @description 用户设置
 */
export interface UserSettings {
  darkMode: boolean;
  currency: Currency;
  defaultTaxRate: number;
  defaultProfitMargin: number;
  subscriptionTier: SubscriptionTier;
}

/**
 * @description 应用状态
 */
export interface AppState {
  ingredients: Ingredient[];
  recipes: Recipe[];
  settings: UserSettings;
  addIngredient: (ingredient: Ingredient) => void;
  updateIngredient: (id: string, updates: Partial<Ingredient>) => void;
  removeIngredient: (id: string) => void;
  addRecipe: (recipe: Recipe) => void;
  updateRecipe: (id: string, updates: Partial<Recipe>) => void;
  removeRecipe: (id: string) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  resetStore: () => void;
}
