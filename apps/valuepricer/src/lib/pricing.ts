import type {
  ValueInput,
  PricingRecommendation,
  PricingTier,
  PricingModelType,
  Industry,
  IndustryConfig,
} from "@/types";
import { generateId } from "./utils";

/**
 * @description 行业配置表，包含定价乘数和基准价格区间
 */
export const INDUSTRY_CONFIG: Record<Industry, IndustryConfig> = {
  saas: { label: "SaaS / 云服务", avgMultiplier: 0.15, benchmarkRange: [49, 499] },
  fintech: { label: "金融科技", avgMultiplier: 0.2, benchmarkRange: [99, 999] },
  healthtech: { label: "医疗科技", avgMultiplier: 0.18, benchmarkRange: [79, 799] },
  devtools: { label: "开发者工具", avgMultiplier: 0.12, benchmarkRange: [19, 299] },
  martech: { label: "营销科技", avgMultiplier: 0.14, benchmarkRange: [49, 599] },
  hrtech: { label: "人力资源科技", avgMultiplier: 0.13, benchmarkRange: [39, 399] },
  cybersecurity: { label: "网络安全", avgMultiplier: 0.22, benchmarkRange: [99, 1299] },
  ecommerce: { label: "电子商务", avgMultiplier: 0.1, benchmarkRange: [29, 499] },
  other: { label: "其他", avgMultiplier: 0.12, benchmarkRange: [29, 399] },
};

/**
 * @description 客户规模对定价的影响系数
 */
const SIZE_MULTIPLIER: Record<string, number> = {
  startup: 0.6,
  smb: 0.8,
  mid_market: 1.0,
  enterprise: 1.4,
};

/**
 * @description 计算客户每月获得的总价值
 * @param {ValueInput} input - 价值输入
 * @returns {number} 每月总价值（美元）
 */
export function calculateMonthlyValue(input: ValueInput): number {
  const weeklyTimeSavings = input.engineerCount * input.hoursSavedPerWeek * input.avgHourlyCost;
  const monthlyTimeSavings = weeklyTimeSavings * 4.33;
  return monthlyTimeSavings + input.additionalCostSavingsMonthly;
}

/**
 * @description 推荐最适合的定价模型
 * @param {ValueInput} input - 价值输入
 * @returns {{ model: PricingModelType; reasoning: string }} 推荐的定价模型和原因
 */
export function recommendPricingModel(input: ValueInput): {
  model: PricingModelType;
  reasoning: string;
} {
  if (input.targetCustomerSize === "enterprise" && input.engineerCount > 20) {
    return {
      model: "per_seat",
      reasoning:
        "大型企业客户且用户数多，按席位定价可以随客户规模线性增长，最大化收入。",
    };
  }

  if (input.industry === "devtools" || input.industry === "saas") {
    if (input.targetCustomerSize === "startup") {
      return {
        model: "usage_based",
        reasoning:
          "开发者工具面向初创公司时，使用量计费降低入门门槛，利于用户增长。",
      };
    }
    return {
      model: "tiered",
      reasoning:
        "SaaS/开发者工具适合分层定价，让不同规模的客户都能找到合适的方案。",
    };
  }

  if (input.targetCustomerSize === "startup" || input.targetCustomerSize === "smb") {
    return {
      model: "flat_rate",
      reasoning:
        "面向中小客户的简单定价方式，降低决策摩擦，提高转化率。",
    };
  }

  return {
    model: "value_based",
    reasoning:
      "基于您产品交付的可量化价值定价，确保价格与客户获得的ROI成正比。",
  };
}

/**
 * @description 生成三层定价方案（基础/专业/企业）
 * @param {number} monthlyValue - 每月交付价值
 * @param {ValueInput} input - 价值输入
 * @returns {PricingTier[]} 三个定价层级
 */
export function generatePricingTiers(
  monthlyValue: number,
  input: ValueInput
): PricingTier[] {
  const industryConfig = INDUSTRY_CONFIG[input.industry];
  const sizeMultiplier = SIZE_MULTIPLIER[input.targetCustomerSize] || 1.0;

  const baseCapture = industryConfig.avgMultiplier * sizeMultiplier;
  const [benchLow, benchHigh] = industryConfig.benchmarkRange;

  const starterPrice = Math.max(
    benchLow,
    Math.round(monthlyValue * baseCapture * 0.5 / 10) * 10
  );
  const proPrice = Math.max(
    Math.round(benchLow * 2),
    Math.round(monthlyValue * baseCapture / 10) * 10
  );
  const enterprisePrice = Math.max(
    Math.round(benchHigh * 0.8),
    Math.round(monthlyValue * baseCapture * 1.8 / 10) * 10
  );

  return [
    {
      name: "Starter 基础版",
      monthlyPrice: starterPrice,
      annualPrice: Math.round(starterPrice * 10),
      features: [
        "核心功能访问",
        "基础数据分析",
        "邮件支持",
        "最多 5 个用户",
      ],
      valueCapture: starterPrice / monthlyValue,
    },
    {
      name: "Pro 专业版",
      monthlyPrice: proPrice,
      annualPrice: Math.round(proPrice * 10),
      features: [
        "所有基础版功能",
        "高级数据分析与报告",
        "优先技术支持",
        "最多 25 个用户",
        "API 访问",
        "自定义集成",
      ],
      valueCapture: proPrice / monthlyValue,
    },
    {
      name: "Enterprise 企业版",
      monthlyPrice: enterprisePrice,
      annualPrice: Math.round(enterprisePrice * 10),
      features: [
        "所有专业版功能",
        "无限用户",
        "专属客户成功经理",
        "SLA 保障",
        "定制化部署",
        "高级安全合规",
      ],
      valueCapture: enterprisePrice / monthlyValue,
    },
  ];
}

/**
 * @description 生成关键洞察
 */
function generateInsights(
  input: ValueInput,
  monthlyValue: number,
  tiers: PricingTier[]
): string[] {
  const insights: string[] = [];
  const industryConfig = INDUSTRY_CONFIG[input.industry];

  insights.push(
    `您的产品每月为客户创造约 $${Math.round(monthlyValue).toLocaleString()} 的价值。`
  );

  const proTier = tiers[1];
  const roi = monthlyValue / proTier.monthlyPrice;
  insights.push(
    `以专业版定价计算，客户 ROI 约为 ${roi.toFixed(1)}x，这是一个有吸引力的投资回报率。`
  );

  if (input.competitorPrice > 0) {
    const diff = proTier.monthlyPrice - input.competitorPrice;
    if (diff > 0) {
      insights.push(
        `推荐定价比竞品高 $${Math.abs(diff)}，需确保在价值沟通上有充分说明。`
      );
    } else {
      insights.push(
        `推荐定价比竞品低 $${Math.abs(diff)}，具备价格竞争优势。`
      );
    }
  }

  insights.push(
    `${industryConfig.label}行业的典型月度定价区间为 $${industryConfig.benchmarkRange[0]}–$${industryConfig.benchmarkRange[1]}。`
  );

  if (proTier.valueCapture < 0.1) {
    insights.push(
      "当前定价仅捕获不到 10% 的客户价值，有提价空间。"
    );
  } else if (proTier.valueCapture > 0.3) {
    insights.push(
      "当前定价捕获超过 30% 的客户价值，需注意客户价格敏感度。"
    );
  }

  return insights;
}

/**
 * @description 竞品对比分析
 */
function generateCompetitorComparison(
  input: ValueInput,
  recommendedPrice: number
): string {
  if (input.competitorPrice <= 0) {
    return "未提供竞品价格信息。建议调研同行业 3-5 个竞品的定价策略作为参考。";
  }

  const ratio = recommendedPrice / input.competitorPrice;
  if (ratio > 1.3) {
    return `推荐定价 ($${recommendedPrice}/月) 高于竞品 ($${input.competitorPrice}/月) 约 ${Math.round((ratio - 1) * 100)}%。溢价策略需要强有力的差异化价值支撑——确保您的产品在功能、服务和品牌上有明显优势。`;
  }
  if (ratio < 0.7) {
    return `推荐定价 ($${recommendedPrice}/月) 低于竞品 ($${input.competitorPrice}/月) 约 ${Math.round((1 - ratio) * 100)}%。这可作为市场渗透策略，但需确保长期可持续性和毛利率。`;
  }
  return `推荐定价 ($${recommendedPrice}/月) 与竞品 ($${input.competitorPrice}/月) 在相似区间。建议通过独特功能和更好的客户体验实现差异化。`;
}

/**
 * @description 核心算法：根据价值输入生成完整的定价推荐
 * @param {ValueInput} input - 客户价值量化输入
 * @returns {PricingRecommendation} 定价推荐结果
 */
export function generatePricingRecommendation(
  input: ValueInput
): PricingRecommendation {
  const monthlyValue = calculateMonthlyValue(input);
  const { model, reasoning } = recommendPricingModel(input);
  const tiers = generatePricingTiers(monthlyValue, input);
  const proTier = tiers[1];
  const roi = monthlyValue / proTier.monthlyPrice;
  const insights = generateInsights(input, monthlyValue, tiers);
  const competitorComparison = generateCompetitorComparison(
    input,
    proTier.monthlyPrice
  );

  return {
    id: generateId(),
    inputId: input.id,
    createdAt: new Date().toISOString(),
    productName: input.productName,
    industry: input.industry,
    totalValueDelivered: monthlyValue,
    recommendedModel: model,
    modelReasoning: reasoning,
    tiers,
    roi,
    competitorComparison,
    keyInsights: insights,
  };
}
