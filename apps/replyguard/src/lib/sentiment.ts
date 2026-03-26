import type { SentimentAnalysis, RiskLevel } from "@/types";
import { scoreToRiskLevel } from "./utils";

/**
 * @description 负面关键词及其权重映射
 */
const NEGATIVE_KEYWORDS: Record<string, number> = {
  terrible: 15, awful: 15, horrible: 15, worst: 15, disgusting: 15,
  scam: 20, fraud: 20, rip: 15, cheat: 18, lie: 16, liar: 18,
  bad: 8, poor: 8, slow: 6, rude: 12, unprofessional: 14,
  disappointed: 10, frustrating: 10, waste: 12, overpriced: 10,
  never: 8, avoid: 12, refund: 10, complaint: 8, broken: 10,
  糟糕: 12, 差: 10, 烂: 15, 骗: 20, 坑: 15, 垃圾: 15,
  失望: 10, 不推荐: 12, 退款: 10, 差评: 12, 不满: 10,
  恶心: 15, 投诉: 10, 欺诈: 20, 敷衍: 12, 态度差: 14,
};

/**
 * @description 情感标签映射
 */
const EMOTION_TAGS: Record<string, string[]> = {
  anger: ["terrible", "awful", "horrible", "worst", "rude", "糟糕", "烂", "垃圾", "恶心", "态度差"],
  distrust: ["scam", "fraud", "cheat", "lie", "liar", "骗", "欺诈"],
  disappointment: ["disappointed", "frustrating", "waste", "poor", "失望", "差评", "不满", "敷衍"],
  urgency: ["refund", "complaint", "avoid", "never", "退款", "投诉", "不推荐"],
  pricing: ["overpriced", "rip", "坑", "差"],
};

/**
 * @description 分析评价文本的情感和风险等级
 * @param text - 评价原文
 * @returns 情感分析结果
 */
export function analyzeSentiment(text: string): SentimentAnalysis {
  const lower = text.toLowerCase();
  let score = 0;
  const foundKeywords: string[] = [];
  const emotionSet = new Set<string>();

  for (const [keyword, weight] of Object.entries(NEGATIVE_KEYWORDS)) {
    if (lower.includes(keyword.toLowerCase())) {
      score += weight;
      foundKeywords.push(keyword);
    }
  }

  for (const [emotion, triggers] of Object.entries(EMOTION_TAGS)) {
    for (const trigger of triggers) {
      if (lower.includes(trigger.toLowerCase())) {
        emotionSet.add(emotion);
        break;
      }
    }
  }

  if (text.includes("!") || text.includes("！")) score += 5;
  if (text.toUpperCase() === text && text.length > 10) score += 10;
  if (text.length > 300) score += 5;

  score = Math.min(score, 100);

  const riskLevel: RiskLevel = scoreToRiskLevel(score);

  const summary = generateSummary(riskLevel, foundKeywords, emotionSet);

  return {
    score,
    riskLevel,
    keywords: foundKeywords,
    emotionTags: Array.from(emotionSet),
    summary,
  };
}

/**
 * @description 根据分析结果生成摘要
 */
function generateSummary(
  riskLevel: RiskLevel,
  keywords: string[],
  emotions: Set<string>
): string {
  const riskDescriptions: Record<RiskLevel, string> = {
    low: "该评价负面情绪较轻，建议礼貌回复即可。",
    medium: "该评价有一定负面情绪，建议认真对待并给出解释。",
    high: "该评价负面情绪较强，需要专业且诚恳的回复来挽回声誉。",
    critical: "该评价具有极强负面情绪，可能严重影响声誉，需要立即、谨慎地处理。",
  };

  let summary = riskDescriptions[riskLevel];

  if (emotions.has("distrust")) {
    summary += " 评价涉及信任问题，回复时需要提供事实依据。";
  }
  if (emotions.has("anger")) {
    summary += " 客户情绪激动，回复语气需保持冷静和专业。";
  }
  if (emotions.has("pricing")) {
    summary += " 涉及价格争议，建议说明服务价值。";
  }

  return summary;
}
