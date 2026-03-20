/**
 * @description 行业类型
 */
export type Industry =
  | "saas"
  | "fintech"
  | "healthtech"
  | "devtools"
  | "martech"
  | "hrtech"
  | "cybersecurity"
  | "ecommerce"
  | "other";

/**
 * @description 行业配置信息
 */
export interface IndustryConfig {
  label: string;
  avgMultiplier: number;
  benchmarkRange: [number, number];
}

/**
 * @description 订阅层级
 */
export type SubscriptionTier = "free" | "premium";

/**
 * @description 定价模型类型
 */
export type PricingModelType =
  | "value_based"
  | "per_seat"
  | "usage_based"
  | "tiered"
  | "flat_rate";

/**
 * @description 客户价值量化输入
 */
export interface ValueInput {
  id: string;
  createdAt: string;
  productName: string;
  industry: Industry;
  targetCustomerSize: "startup" | "smb" | "mid_market" | "enterprise";
  engineerCount: number;
  avgHourlyCost: number;
  hoursSavedPerWeek: number;
  additionalCostSavingsMonthly: number;
  currentProcessDescription: string;
  competitorPrice: number;
}

/**
 * @description 定价层级建议
 */
export interface PricingTier {
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  features: string[];
  valueCapture: number;
}

/**
 * @description 定价推荐结果
 */
export interface PricingRecommendation {
  id: string;
  inputId: string;
  createdAt: string;
  productName: string;
  industry: Industry;
  totalValueDelivered: number;
  recommendedModel: PricingModelType;
  modelReasoning: string;
  tiers: PricingTier[];
  roi: number;
  competitorComparison: string;
  keyInsights: string[];
}

/**
 * @description 用户设置
 */
export interface UserSettings {
  darkMode: boolean;
  currency: string;
  subscriptionTier: SubscriptionTier;
}

/**
 * @description 应用状态
 */
export interface AppState {
  inputs: ValueInput[];
  recommendations: PricingRecommendation[];
  settings: UserSettings;
  addInput: (input: ValueInput) => void;
  removeInput: (id: string) => void;
  addRecommendation: (rec: PricingRecommendation) => void;
  removeRecommendation: (id: string) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  resetStore: () => void;
}
