/**
 * @fileoverview 消息分析引擎 - 识别免费工作请求
 */

import { AnalysisResult } from "@/types";

/**
 * 免费工作请求的关键词/短语模式
 * 每个模式有权重，用于计算置信度
 */
const FREE_WORK_PATTERNS: { pattern: RegExp; weight: number; indicator: string }[] = [
  { pattern: /free\s*(of\s*charge)?/i, weight: 0.3, indicator: "Mentions 'free'" },
  { pattern: /no\s*budget/i, weight: 0.4, indicator: "No budget available" },
  { pattern: /exposure|visibility|portfolio/i, weight: 0.25, indicator: "Offers exposure instead of payment" },
  { pattern: /favor|help\s*me\s*out/i, weight: 0.2, indicator: "Asking for a favor" },
  { pattern: /quick\s*(one|task|job|thing)/i, weight: 0.15, indicator: "Minimizing scope ('quick thing')" },
  { pattern: /won'?t\s*take\s*(long|much\s*time)/i, weight: 0.2, indicator: "Downplaying effort required" },
  { pattern: /can'?t\s*(afford|pay)/i, weight: 0.35, indicator: "Cannot afford to pay" },
  { pattern: /just\s*(a\s*small|a\s*little|a\s*simple)/i, weight: 0.15, indicator: "Minimizing work scope" },
  { pattern: /for\s*free/i, weight: 0.4, indicator: "Explicitly requesting free work" },
  { pattern: /no\s*money|don'?t\s*have\s*(the\s*)?money/i, weight: 0.35, indicator: "Claims no money" },
  { pattern: /great\s*(for\s*your|opportunity)/i, weight: 0.2, indicator: "Framing as an opportunity" },
  { pattern: /intern(ship)?|volunteer/i, weight: 0.2, indicator: "Suggesting unpaid/intern work" },
  { pattern: /test\s*(project|task)|trial/i, weight: 0.15, indicator: "Unpaid test/trial request" },
  { pattern: /pay\s*(you\s*)?(later|next\s*time|eventually)/i, weight: 0.3, indicator: "Vague future payment promise" },
  { pattern: /revenue\s*shar(e|ing)|equity|profit\s*shar/i, weight: 0.25, indicator: "Offers equity/revenue share instead" },
  { pattern: /startup|bootstrap/i, weight: 0.1, indicator: "Startup context (potential budget issue)" },
  { pattern: /shout\s*out|credit|mention/i, weight: 0.2, indicator: "Offers credit/shoutout instead" },
  { pattern: /友情价|免费|帮个忙|白嫖|不给钱/i, weight: 0.4, indicator: "中文免费请求关键词" },
  { pattern: /没有预算|没预算|预算有限/i, weight: 0.35, indicator: "声称没有预算" },
  { pattern: /曝光|流量|机会/i, weight: 0.2, indicator: "以曝光/机会代替付费" },
];

/**
 * 付费意图的正面指标（降低免费请求判断）
 */
const PAID_INTENT_PATTERNS: { pattern: RegExp; weight: number }[] = [
  { pattern: /budget\s*(is|of)\s*\$?\d/i, weight: -0.3 },
  { pattern: /rate|pricing|quote|invoice/i, weight: -0.2 },
  { pattern: /pay(ing|ment)?.*\$?\d/i, weight: -0.3 },
  { pattern: /hire|contract|retainer/i, weight: -0.15 },
  { pattern: /报价|付费|预算\d/i, weight: -0.25 },
];

/**
 * 分析客户消息，判断是否为免费工作请求
 * @param message - 客户发来的消息文本
 * @returns 分析结果
 */
export function analyzeMessage(message: string): AnalysisResult {
  if (!message.trim()) {
    return {
      isFreeWorkRequest: false,
      confidence: 0,
      indicators: [],
      summary: "No message provided.",
    };
  }

  const indicators: string[] = [];
  let totalScore = 0;

  for (const { pattern, weight, indicator } of FREE_WORK_PATTERNS) {
    if (pattern.test(message)) {
      totalScore += weight;
      indicators.push(indicator);
    }
  }

  for (const { pattern, weight } of PAID_INTENT_PATTERNS) {
    if (pattern.test(message)) {
      totalScore += weight;
    }
  }

  const confidence = Math.max(0, Math.min(1, totalScore));
  const isFreeWorkRequest = confidence >= 0.3;

  let summary: string;
  if (confidence >= 0.7) {
    summary = "⚠️ High probability this is a free work request. Multiple strong indicators detected.";
  } else if (confidence >= 0.5) {
    summary = "⚡ Likely a free work request. Several indicators suggest unpaid expectations.";
  } else if (confidence >= 0.3) {
    summary = "🔍 Possible free work request. Some indicators present but not conclusive.";
  } else {
    summary = "✅ This appears to be a legitimate paid inquiry.";
  }

  return { isFreeWorkRequest, confidence, indicators, summary };
}
