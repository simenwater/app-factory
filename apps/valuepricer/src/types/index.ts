/**
 * @description Industry type
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
 * @description Industry configuration
 */
export interface IndustryConfig {
  label: string;
  avgMultiplier: number;
  benchmarkRange: [number, number];
}

/**
 * @description Subscription tier
 */
export type SubscriptionTier = "free" | "premium";

/**
 * @description Pricing model type
 */
export type PricingModelType =
  | "value_based"
  | "per_seat"
  | "usage_based"
  | "tiered"
  | "flat_rate";

/**
 * @description Customer value quantification input
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
 * @description Pricing tier recommendation
 */
export interface PricingTier {
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  features: string[];
  valueCapture: number;
}

/**
 * @description Pricing recommendation result
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
 * @description User settings
 */
export interface UserSettings {
  darkMode: boolean;
  currency: string;
  subscriptionTier: SubscriptionTier;
}

/**
 * @description Application state
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
  setInputs: (inputs: ValueInput[]) => void;
  setRecommendations: (recommendations: PricingRecommendation[]) => void;
}
