/**
 * @fileoverview 客户消息分析引擎
 * 分析客户邮件/消息内容，识别预算意图和风险信号
 */

import { ClientIntentAnalysis, BudgetRisk } from "@/types";

/** 低价压榨的红旗关键词 */
const RED_FLAG_PATTERNS: { pattern: RegExp; flag: string }[] = [
  { pattern: /quick\s*(job|task|project)/i, flag: "暗示项目简单以压低价格" },
  { pattern: /shouldn'?t\s*take\s*(long|much)/i, flag: "暗示工作量不大" },
  { pattern: /simple|easy|straightforward/i, flag: "将需求描述为'简单'来压价" },
  { pattern: /exposure|portfolio|experience/i, flag: "用曝光度/经验代替报酬" },
  { pattern: /budget\s*is\s*(tight|limited|small)/i, flag: "预算有限信号" },
  { pattern: /for\s*free|no\s*budget|volunteer/i, flag: "试图免费获取服务" },
  { pattern: /can'?t\s*(afford|pay)\s*(much|more)/i, flag: "声称无法支付合理费用" },
  { pattern: /student|startup|bootstrap/i, flag: "以身份博取同情降价" },
  { pattern: /test\s*(project|task)|trial/i, flag: "以试用名义获取免费劳动" },
  { pattern: /many\s*(projects?|work)\s*(coming|later|future)/i, flag: "画饼承诺未来工作" },
  { pattern: /other\s*(freelancer|developer|designer)s?\s*(charge|offer|quote)/i, flag: "以他人低价要挟" },
  { pattern: /asap|urgent|rush/i, flag: "紧急需求但可能不愿付加急费" },
  { pattern: /简单|容易|很快/i, flag: "将需求描述为'简单'来压价" },
  { pattern: /预算有限|预算不多|预算紧张/i, flag: "预算有限信号" },
  { pattern: /免费|义务|帮忙/i, flag: "试图免费获取服务" },
  { pattern: /曝光|经验|锻炼/i, flag: "用曝光度/经验代替报酬" },
  { pattern: /后续.*很多|以后.*合作/i, flag: "画饼承诺未来工作" },
  { pattern: /别人.*报价|其他人.*收费/i, flag: "以他人低价要挟" },
];

/** 积极信号关键词 */
const GREEN_FLAG_PATTERNS: { pattern: RegExp; flag: string }[] = [
  { pattern: /budget\s*(is\s*)?\$?\d+/i, flag: "明确预算数字" },
  { pattern: /long[\s-]*term|ongoing/i, flag: "长期合作意向" },
  { pattern: /quality|professional|expert/i, flag: "重视质量" },
  { pattern: /timeline\s*is\s*flexible/i, flag: "时间灵活" },
  { pattern: /fair\s*(rate|price|compensation)/i, flag: "愿意支付合理费用" },
  { pattern: /contract|agreement|scope/i, flag: "正规合作流程" },
  { pattern: /recommend|referr/i, flag: "通过推荐而来" },
  { pattern: /预算.*\d+|报价/i, flag: "明确预算数字" },
  { pattern: /长期|持续/i, flag: "长期合作意向" },
  { pattern: /质量|专业/i, flag: "重视质量" },
  { pattern: /合同|协议/i, flag: "正规合作流程" },
];

/** 预算金额提取模式 */
const BUDGET_PATTERNS = [
  /\$\s*(\d[\d,]*(?:\.\d{2})?)\s*(?:[-–to]+\s*\$?\s*(\d[\d,]*(?:\.\d{2})?))?/gi,
  /(\d[\d,]*(?:\.\d{2})?)\s*(?:USD|dollars?)/gi,
  /budget\s*(?:is|of|around|:)?\s*\$?\s*(\d[\d,]*(?:\.\d{2})?)\s*(?:[-–to]+\s*\$?\s*(\d[\d,]*(?:\.\d{2})?))?/gi,
  /(\d[\d,]*(?:\.\d{2})?)\s*(?:元|块|RMB|CNY)/gi,
];

/**
 * 从文本中提取金额数字
 * @param text - 输入文本
 * @returns 提取的金额列表
 */
function extractAmounts(text: string): number[] {
  const amounts: number[] = [];
  for (const pattern of BUDGET_PATTERNS) {
    pattern.lastIndex = 0;
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const num1 = parseFloat(match[1].replace(/,/g, ""));
      if (!isNaN(num1)) amounts.push(num1);
      if (match[2]) {
        const num2 = parseFloat(match[2].replace(/,/g, ""));
        if (!isNaN(num2)) amounts.push(num2);
      }
    }
  }
  return amounts;
}

/**
 * 评估项目复杂度 (基于关键词分析)
 * @param text - 客户消息文本
 * @returns 复杂度评分 1-10
 */
function assessComplexity(text: string): number {
  let score = 5;

  const complexIndicators = [
    /integrat/i,
    /api/i,
    /database/i,
    /real[\s-]?time/i,
    /machine\s*learning/i,
    /scale|scalab/i,
    /multi[\s-]?(platform|language)/i,
    /custom/i,
    /security|auth/i,
    /e[\s-]?commerce/i,
    /payment/i,
    /集成/i,
    /数据库/i,
    /实时/i,
    /机器学习/i,
    /多平台/i,
    /定制/i,
    /安全/i,
    /支付/i,
  ];

  const simpleIndicators = [
    /landing\s*page/i,
    /static/i,
    /template/i,
    /one[\s-]?page/i,
    /simple\s*form/i,
    /落地页/i,
    /静态/i,
    /模板/i,
    /单页/i,
  ];

  for (const pattern of complexIndicators) {
    if (pattern.test(text)) score += 0.8;
  }
  for (const pattern of simpleIndicators) {
    if (pattern.test(text)) score -= 0.5;
  }

  return Math.max(1, Math.min(10, Math.round(score)));
}

/**
 * 根据红旗数量和严重程度确定风险等级
 * @param redFlagCount - 红旗数量
 * @param hasGreenFlags - 是否有积极信号
 * @returns 风险等级
 */
function determineRiskLevel(
  redFlagCount: number,
  hasGreenFlags: boolean
): BudgetRisk {
  if (redFlagCount >= 4) return "critical";
  if (redFlagCount >= 3) return "high";
  if (redFlagCount >= 1) return hasGreenFlags ? "medium" : "high";
  return "low";
}

/**
 * 分析客户消息，生成意图分析结果
 * @param message - 客户消息原文
 * @returns 分析结果
 */
export function analyzeClientMessage(message: string): ClientIntentAnalysis {
  const redFlags: string[] = [];
  const greenFlags: string[] = [];

  for (const { pattern, flag } of RED_FLAG_PATTERNS) {
    if (pattern.test(message)) {
      if (!redFlags.includes(flag)) {
        redFlags.push(flag);
      }
    }
  }

  for (const { pattern, flag } of GREEN_FLAG_PATTERNS) {
    if (pattern.test(message)) {
      if (!greenFlags.includes(flag)) {
        greenFlags.push(flag);
      }
    }
  }

  const amounts = extractAmounts(message);
  const detectedBudget = {
    min: amounts.length > 0 ? Math.min(...amounts) : null,
    max: amounts.length > 1 ? Math.max(...amounts) : null,
    currency: /元|块|RMB|CNY/i.test(message) ? "CNY" : "USD",
  };

  const complexityScore = assessComplexity(message);
  const riskLevel = determineRiskLevel(redFlags.length, greenFlags.length > 0);

  let summary = "";
  if (riskLevel === "critical") {
    summary = "⚠️ 高危客户：存在多个低价压榨信号，强烈建议拒绝或大幅提高报价。";
  } else if (riskLevel === "high") {
    summary = "🟠 风险较高：检测到明显的压价意图，建议谨慎对待并坚持底线。";
  } else if (riskLevel === "medium") {
    summary = "🟡 存在一些风险信号，但也有积极迹象。建议明确条款后再决定。";
  } else {
    summary = "🟢 客户看起来较为正规，沟通态度积极。建议按正常流程报价。";
  }

  return {
    detectedBudget,
    complexityScore,
    riskLevel,
    redFlags,
    greenFlags,
    summary,
  };
}
