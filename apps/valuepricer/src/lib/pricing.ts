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
 * @description Industry configuration table with pricing multipliers and benchmark ranges
 */
export const INDUSTRY_CONFIG: Record<Industry, IndustryConfig> = {
  saas: { label: "SaaS / Cloud Services", avgMultiplier: 0.15, benchmarkRange: [49, 499] },
  fintech: { label: "FinTech", avgMultiplier: 0.2, benchmarkRange: [99, 999] },
  healthtech: { label: "HealthTech", avgMultiplier: 0.18, benchmarkRange: [79, 799] },
  devtools: { label: "Developer Tools", avgMultiplier: 0.12, benchmarkRange: [19, 299] },
  martech: { label: "MarTech", avgMultiplier: 0.14, benchmarkRange: [49, 599] },
  hrtech: { label: "HR Tech", avgMultiplier: 0.13, benchmarkRange: [39, 399] },
  cybersecurity: { label: "Cybersecurity", avgMultiplier: 0.22, benchmarkRange: [99, 1299] },
  ecommerce: { label: "E-Commerce", avgMultiplier: 0.1, benchmarkRange: [29, 499] },
  other: { label: "Other", avgMultiplier: 0.12, benchmarkRange: [29, 399] },
};

/**
 * @description Customer size multiplier for pricing adjustments
 */
const SIZE_MULTIPLIER: Record<string, number> = {
  startup: 0.6,
  smb: 0.8,
  mid_market: 1.0,
  enterprise: 1.4,
};

/**
 * @description Calculate the total monthly value delivered to the customer
 * @param {ValueInput} input - Value input
 * @returns {number} Monthly total value (USD)
 */
export function calculateMonthlyValue(input: ValueInput): number {
  const weeklyTimeSavings = input.engineerCount * input.hoursSavedPerWeek * input.avgHourlyCost;
  const monthlyTimeSavings = weeklyTimeSavings * 4.33;
  return monthlyTimeSavings + input.additionalCostSavingsMonthly;
}

/**
 * @description Recommend the most suitable pricing model
 * @param {ValueInput} input - Value input
 * @returns {{ model: PricingModelType; reasoning: string }} Recommended pricing model and rationale
 */
export function recommendPricingModel(input: ValueInput): {
  model: PricingModelType;
  reasoning: string;
} {
  if (input.targetCustomerSize === "enterprise" && input.engineerCount > 20) {
    return {
      model: "per_seat",
      reasoning:
        "For large enterprise customers with many users, per-seat pricing scales linearly with customer size, maximizing revenue.",
    };
  }

  if (input.industry === "devtools" || input.industry === "saas") {
    if (input.targetCustomerSize === "startup") {
      return {
        model: "usage_based",
        reasoning:
          "Usage-based pricing lowers the barrier to entry for startups using developer tools, facilitating user growth.",
      };
    }
    return {
      model: "tiered",
      reasoning:
        "Tiered pricing works well for SaaS/developer tools, allowing customers of different sizes to find the right plan.",
    };
  }

  if (input.targetCustomerSize === "startup" || input.targetCustomerSize === "smb") {
    return {
      model: "flat_rate",
      reasoning:
        "Simple flat-rate pricing for small and medium customers reduces decision friction and improves conversion rates.",
    };
  }

  return {
    model: "value_based",
    reasoning:
      "Value-based pricing ensures the price is proportional to the quantifiable ROI your product delivers to the customer.",
  };
}

/**
 * @description Generate three pricing tiers (Starter/Pro/Enterprise)
 * @param {number} monthlyValue - Monthly delivered value
 * @param {ValueInput} input - Value input
 * @returns {PricingTier[]} Three pricing tiers
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
      name: "Starter",
      monthlyPrice: starterPrice,
      annualPrice: Math.round(starterPrice * 10),
      features: [
        "Core feature access",
        "Basic analytics",
        "Email support",
        "Up to 5 users",
      ],
      valueCapture: starterPrice / monthlyValue,
    },
    {
      name: "Pro",
      monthlyPrice: proPrice,
      annualPrice: Math.round(proPrice * 10),
      features: [
        "All Starter features",
        "Advanced analytics & reports",
        "Priority support",
        "Up to 25 users",
        "API access",
        "Custom integrations",
      ],
      valueCapture: proPrice / monthlyValue,
    },
    {
      name: "Enterprise",
      monthlyPrice: enterprisePrice,
      annualPrice: Math.round(enterprisePrice * 10),
      features: [
        "All Pro features",
        "Unlimited users",
        "Dedicated customer success manager",
        "SLA guarantee",
        "Custom deployment",
        "Advanced security & compliance",
      ],
      valueCapture: enterprisePrice / monthlyValue,
    },
  ];
}

/**
 * @description Generate key insights from analysis
 */
function generateInsights(
  input: ValueInput,
  monthlyValue: number,
  tiers: PricingTier[]
): string[] {
  const insights: string[] = [];
  const industryConfig = INDUSTRY_CONFIG[input.industry];

  insights.push(
    `Your product delivers approximately $${Math.round(monthlyValue).toLocaleString()} in monthly value to customers.`
  );

  const proTier = tiers[1];
  const roi = monthlyValue / proTier.monthlyPrice;
  insights.push(
    `At the Pro tier price, customer ROI is approximately ${roi.toFixed(1)}x — an attractive return on investment.`
  );

  if (input.competitorPrice > 0) {
    const diff = proTier.monthlyPrice - input.competitorPrice;
    if (diff > 0) {
      insights.push(
        `Recommended pricing is $${Math.abs(diff)} above competitors. Ensure strong value communication to justify the premium.`
      );
    } else {
      insights.push(
        `Recommended pricing is $${Math.abs(diff)} below competitors, giving you a competitive price advantage.`
      );
    }
  }

  insights.push(
    `Typical monthly pricing in the ${industryConfig.label} industry ranges from $${industryConfig.benchmarkRange[0]}–$${industryConfig.benchmarkRange[1]}.`
  );

  if (proTier.valueCapture < 0.1) {
    insights.push(
      "Current pricing captures less than 10% of customer value. There is room to increase prices."
    );
  } else if (proTier.valueCapture > 0.3) {
    insights.push(
      "Current pricing captures over 30% of customer value. Be mindful of customer price sensitivity."
    );
  }

  return insights;
}

/**
 * @description Generate competitor comparison analysis
 */
function generateCompetitorComparison(
  input: ValueInput,
  recommendedPrice: number
): string {
  if (input.competitorPrice <= 0) {
    return "No competitor pricing provided. We recommend researching 3-5 competitors in your industry for pricing reference.";
  }

  const ratio = recommendedPrice / input.competitorPrice;
  if (ratio > 1.3) {
    return `Recommended pricing ($${recommendedPrice}/mo) is approximately ${Math.round((ratio - 1) * 100)}% above competitor ($${input.competitorPrice}/mo). A premium pricing strategy requires strong differentiation in features, service, and brand.`;
  }
  if (ratio < 0.7) {
    return `Recommended pricing ($${recommendedPrice}/mo) is approximately ${Math.round((1 - ratio) * 100)}% below competitor ($${input.competitorPrice}/mo). This can work as a market penetration strategy, but ensure long-term sustainability and margins.`;
  }
  return `Recommended pricing ($${recommendedPrice}/mo) is in a similar range to competitor ($${input.competitorPrice}/mo). Consider differentiating through unique features and superior customer experience.`;
}

/**
 * @description Core algorithm: generate complete pricing recommendation from value input
 * @param {ValueInput} input - Customer value quantification input
 * @returns {PricingRecommendation} Pricing recommendation result
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
