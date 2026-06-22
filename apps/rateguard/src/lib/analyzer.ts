/**
 * @fileoverview 消息分析引擎 — 检测不合理的免费工作请求
 *
 * 使用基于规则的 NLP 方法分析客户消息，识别"白嫖"信号、
 * 压价话术和不合理期望，给出风险评分和建议响应。
 */

import type { AnalysisResult, RedFlag, RiskLevel, ResponseType } from "@/types";
import { generateId } from "@/lib/utils";

/**
 * @typedef {Object} FlagPattern
 * @property {RegExp} pattern - 匹配正则
 * @property {number} weight - 权重 (0-1)
 * @property {string} description - 说明
 */
interface FlagPattern {
  pattern: RegExp;
  weight: number;
  description: string;
}

/** 红旗关键词模式库 — 中英文混合匹配 */
export const RED_FLAG_PATTERNS: FlagPattern[] = [
  // 免费/不付费信号
  { pattern: /free\s*(of\s*charge)?|免费|不收费|不用付|白做/i, weight: 0.9, description: "明确要求免费服务" },
  { pattern: /no\s*budget|没有?预算|预算为零/i, weight: 0.85, description: "声称没有预算" },
  { pattern: /can'?t\s*(afford|pay)|付不起|承担不了/i, weight: 0.7, description: "声称无力支付" },
  { pattern: /do\s*it\s*for\s*(the\s*)?exposure|曝光度|帮你宣传|帮你推广/i, weight: 0.95, description: "以\"曝光机会\"代替报酬" },
  { pattern: /portfolio\s*(piece|work)|丰富你的?作品集/i, weight: 0.8, description: "以\"充实作品集\"为借口" },
  { pattern: /for\s*(a\s*)?friend|朋友.*帮忙|帮个忙/i, weight: 0.5, description: "打\"朋友牌\"降低预期" },

  // 压价/贬低信号
  { pattern: /shouldn'?t\s*(take|be)\s*(long|hard|much)|很简单|很容易|随手就能做|分分钟/i, weight: 0.75, description: "贬低工作难度和价值" },
  { pattern: /anyone\s*can\s*do|谁都能做|找别人/i, weight: 0.85, description: "暗示可替代性" },
  { pattern: /just\s*(a\s*)?(quick|small|little|simple)|就.*一点点|小活儿/i, weight: 0.6, description: "最小化工作量" },
  { pattern: /too\s*(much|expensive|high)|太贵了|报价太高|价格.*离谱/i, weight: 0.5, description: "直接说价格过高" },

  // 未来画饼信号
  { pattern: /future\s*(work|projects?|business)|以后.*有活|下次|长期合作/i, weight: 0.7, description: "用\"未来合作\"画饼" },
  { pattern: /lots?\s*of\s*(work|projects?)|很多项目|大量的?活/i, weight: 0.65, description: "许诺未来大量订单" },
  { pattern: /equity|stock|shares?|股权|分成|分红/i, weight: 0.8, description: "用股权或分成代替现金报酬" },
  { pattern: /when\s*(we|it)\s*(get|make)\s*money|赚到钱.*再付|先做.*再说/i, weight: 0.9, description: "\"赚到钱再付\"的空头承诺" },

  // 情感操控信号
  { pattern: /i\s*thought\s*(we\s*were|you\s*were)\s*(friends?|cool)|我以为.*朋友/i, weight: 0.75, description: "利用私人关系施压" },
  { pattern: /you('?d|\s*would)\s*do\s*it\s*if\s*you\s*(cared?|really)/i, weight: 0.8, description: "道德绑架" },
  { pattern: /for\s*(a\s*)?(good\s*)?cause|公益|慈善|免费做.*积德/i, weight: 0.55, description: "以\"公益\"为由要求免费" },
  { pattern: /intern|student|学生.*练习|实习/i, weight: 0.65, description: "将专业工作定义为\"练习\"" },

  // 紧急/施压信号
  { pattern: /urgent|asap|right\s*now|马上|立刻|加急|急需/i, weight: 0.4, description: "紧急要求但不提报酬" },
  { pattern: /deadline\s*(is\s*)?(tomorrow|today)|明天.*截止|今天.*要/i, weight: 0.45, description: "不合理的紧迫时间线" },
];

/**
 * 分析消息中的红旗信号
 * @param {string} message - 客户消息
 * @returns {RedFlag[]} 检测到的红旗列表
 */
export function detectRedFlags(message: string): RedFlag[] {
  const flags: RedFlag[] = [];
  const normalizedMessage = message.toLowerCase();

  for (const { pattern, weight, description } of RED_FLAG_PATTERNS) {
    const match = normalizedMessage.match(pattern);
    if (match) {
      flags.push({
        keyword: match[0],
        weight,
        description,
      });
    }
  }

  return flags;
}

/**
 * 计算综合风险评分
 * @param {RedFlag[]} flags - 红旗列表
 * @param {string} message - 原始消息
 * @returns {number} 0-100 的风险评分
 */
export function calculateRiskScore(flags: RedFlag[], message: string): number {
  if (flags.length === 0) return 5;

  const weightSum = flags.reduce((sum, f) => sum + f.weight, 0);
  const maxPossible = flags.length;

  const weightedScore = (weightSum / Math.max(maxPossible, 1)) * 100;

  // 红旗数量越多，风险越高（数量加成）
  const countBonus = Math.min(flags.length * 8, 30);

  // 消息过短（缺乏专业上下文）是轻微加分项
  const brevityBonus = message.length < 50 ? 5 : 0;

  return Math.min(Math.round(weightedScore + countBonus + brevityBonus), 100);
}

/**
 * 根据风险评分判定风险等级
 * @param {number} score - 风险评分
 * @returns {RiskLevel} 风险等级
 */
export function determineRiskLevel(score: number): RiskLevel {
  if (score >= 65) return "high";
  if (score >= 35) return "medium";
  return "low";
}

/**
 * 根据风险等级推荐响应类型
 * @param {RiskLevel} level - 风险等级
 * @param {number} score - 风险评分
 * @returns {ResponseType} 建议的响应类型
 */
export function suggestResponseType(level: RiskLevel, score: number): ResponseType {
  if (level === "high" || score >= 70) return "reject";
  if (level === "medium") return "negotiate";
  return "accept";
}

/**
 * 生成分析摘要文本
 * @param {RedFlag[]} flags - 红旗列表
 * @param {RiskLevel} level - 风险等级
 * @param {number} score - 风险评分
 * @returns {string} 综合分析摘要
 */
export function generateSummary(
  flags: RedFlag[],
  level: RiskLevel,
  score: number
): string {
  if (flags.length === 0) {
    return "该消息未检测到明显的不合理请求信号。客户似乎有合理的合作意图，建议正常回复并给出专业报价。";
  }

  const levelText: Record<RiskLevel, string> = {
    high: "高风险 — 强烈建议拒绝或要求预付款",
    medium: "中等风险 — 建议谨慎协商并明确报价",
    low: "低风险 — 可酌情沟通但需设定边界",
  };

  const topFlags = flags
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 3)
    .map((f) => f.description);

  return `风险评分 ${score}/100（${levelText[level]}）。检测到 ${flags.length} 个警告信号，主要包括：${topFlags.join("、")}。`;
}

/**
 * 执行完整的消息分析
 * @param {string} message - 待分析的客户消息
 * @returns {AnalysisResult} 完整的分析结果
 */
export function analyzeMessage(message: string): AnalysisResult {
  const trimmed = message.trim();
  const flags = detectRedFlags(trimmed);
  const score = calculateRiskScore(flags, trimmed);
  const level = determineRiskLevel(score);
  const responseType = suggestResponseType(level, score);
  const summary = generateSummary(flags, level, score);

  return {
    id: generateId(),
    originalMessage: trimmed,
    riskLevel: level,
    riskScore: score,
    suggestedResponse: responseType,
    redFlags: flags,
    summary,
    createdAt: new Date().toISOString(),
  };
}
