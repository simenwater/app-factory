/**
 * @description 服务类型枚举
 */
export type ServiceCategory =
  | "design"
  | "development"
  | "consulting"
  | "writing"
  | "marketing"
  | "photography"
  | "video"
  | "translation"
  | "teaching"
  | "other";

/**
 * @description 计费模式
 */
export type BillingMode = "hourly" | "fixed" | "daily" | "monthly";

/**
 * @description 报价单项目
 */
export interface QuoteLineItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
}

/**
 * @description 报价单
 */
export interface Quote {
  id: string;
  clientName: string;
  clientEmail: string;
  projectName: string;
  serviceCategory: ServiceCategory;
  billingMode: BillingMode;
  lineItems: QuoteLineItem[];
  notes: string;
  validDays: number;
  currency: string;
  createdAt: string;
  status: "draft" | "sent" | "accepted" | "declined";
}

/**
 * @description 报价输入
 */
export interface QuoteInput {
  clientName: string;
  clientEmail: string;
  projectName: string;
  serviceCategory: ServiceCategory;
  billingMode: BillingMode;
  description: string;
  estimatedHours: number;
  hourlyRate: number;
  currency: string;
}

/**
 * @description 拒绝模板
 */
export interface DeclineTemplate {
  id: string;
  title: string;
  scenario: DeclineScenario;
  tone: DeclineTone;
  body: string;
  isCustom: boolean;
}

/**
 * @description 拒绝场景
 */
export type DeclineScenario =
  | "free_work"
  | "scope_creep"
  | "low_budget"
  | "unreasonable_deadline"
  | "outside_expertise"
  | "general";

/**
 * @description 语气
 */
export type DeclineTone = "professional" | "friendly" | "firm" | "empathetic";

/**
 * @description 客户期望管理清单项
 */
export interface ChecklistItem {
  id: string;
  text: string;
  category: ChecklistCategory;
  checked: boolean;
}

/**
 * @description 清单类别
 */
export type ChecklistCategory =
  | "scope"
  | "timeline"
  | "payment"
  | "communication"
  | "deliverables"
  | "revision";

/**
 * @description 客户项目清单
 */
export interface ClientChecklist {
  id: string;
  clientName: string;
  projectName: string;
  items: ChecklistItem[];
  createdAt: string;
  completedAt: string | null;
}

/**
 * @description 应用设置
 */
export interface AppSettings {
  darkMode: boolean;
  defaultCurrency: string;
  defaultHourlyRate: number;
  defaultValidDays: number;
  businessName: string;
  businessEmail: string;
  subscriptionTier: "free" | "pro";
}

/**
 * @description 服务类别配置
 */
export interface ServiceCategoryConfig {
  label: string;
  icon: string;
  suggestedHourlyRate: { min: number; max: number };
}
