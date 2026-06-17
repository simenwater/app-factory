/**
 * @fileoverview 谈判话术模板生成器
 * 自动生成拒绝低价、谈判、有条件接受的话术
 */

import { NegotiationTemplate, PricingSuggestion, ClientIntentAnalysis } from "@/types";

/**
 * 生成拒绝低价的话术模板
 * @param pricing - 定价建议
 * @param analysis - 客户分析
 * @returns 拒绝话术模板
 */
function generateRejectTemplate(
  pricing: PricingSuggestion,
  analysis: ClientIntentAnalysis
): NegotiationTemplate {
  const budgetStr = analysis.detectedBudget.min
    ? `$${analysis.detectedBudget.min}`
    : "您提出的预算";

  return {
    type: "reject",
    title: "礼貌拒绝低价报价",
    tone: "professional",
    content: `感谢您的询问和对我工作的兴趣。

经过仔细评估您的项目需求，我发现${budgetStr}与当前市场行情及项目实际工作量存在较大差距。

基于行业标准和项目复杂度，此类项目的合理费率范围为 $${pricing.minRate}-$${pricing.maxRate}/小时。我的标准费率为 $${pricing.recommendedRate}/小时。

我理解每个项目都有预算考量，但为了确保交付质量和专业标准，我无法在低于 $${pricing.minRate}/小时的费率下承接此项目。

如果未来您的预算有所调整，欢迎随时联系我。祝您顺利找到合适的合作伙伴。

此致`,
  };
}

/**
 * 生成谈判话术模板
 * @param pricing - 定价建议
 * @param analysis - 客户分析
 * @returns 谈判话术模板
 */
function generateNegotiateTemplate(
  pricing: PricingSuggestion,
  analysis: ClientIntentAnalysis
): NegotiationTemplate {
  const hasGreenFlags = analysis.greenFlags.length > 0;

  return {
    type: "negotiate",
    title: "谈判协商话术",
    tone: "friendly",
    content: `感谢您详细的项目说明${hasGreenFlags ? "，我对这个项目很感兴趣" : ""}。

在仔细了解需求后，我想就费用部分进行沟通：

📊 根据项目复杂度评估（${analysis.complexityScore}/10）和行业基准，我的建议费率为：
• 标准费率：$${pricing.recommendedRate}/${pricing.unit}
• 行业基准：$${pricing.industryBenchmark}/${pricing.unit}

💡 我可以提供以下灵活方案：
1. 分阶段交付 — 降低单次付款压力
2. 精简功能范围 — 优先核心需求，后续迭代
3. 长期合作优惠 — 如确认后续项目，可提供 10% 折扣

我相信优质的成果值得合理的投入。您希望我基于哪个方案准备详细报价？

期待您的回复。`,
  };
}

/**
 * 生成有条件接受的话术模板
 * @param pricing - 定价建议
 * @param analysis - 客户分析
 * @returns 有条件接受话术模板
 */
function generateConditionalTemplate(
  pricing: PricingSuggestion,
  analysis: ClientIntentAnalysis
): NegotiationTemplate {
  const redFlagWarnings = analysis.redFlags.slice(0, 2);

  return {
    type: "accept-with-conditions",
    title: "有条件接受",
    tone: "firm",
    content: `感谢您的项目咨询，我有意参与合作。

为确保双方利益，我建议在以下条件下推进：

📋 合作条件：
1. 费率：$${pricing.recommendedRate}/${pricing.unit}（不可议价）
2. 预付款：项目总额的 50% 作为启动金
3. 明确范围：需签署详细的需求文档（SOW）
4. 修改限制：包含 2 轮修改，超出按 $${Math.round(pricing.recommendedRate * 0.5)}/${pricing.unit} 计费
5. 时间线：双方约定的 deadline 不含周末和法定假日${redFlagWarnings.length > 0 ? `\n\n⚠️ 特别说明：我注意到沟通中的一些信号（${redFlagWarnings.join("、")}），为避免后续分歧，以上条件为最终条件。` : ""}

如果这些条件可以接受，我可以在收到预付款后 48 小时内启动项目。

请确认是否同意以上条款。`,
  };
}

/**
 * 生成所有类型的谈判话术模板
 * @param pricing - 定价建议
 * @param analysis - 客户意图分析
 * @returns 话术模板数组
 */
export function generateTemplates(
  pricing: PricingSuggestion,
  analysis: ClientIntentAnalysis
): NegotiationTemplate[] {
  const templates: NegotiationTemplate[] = [];

  if (analysis.riskLevel === "critical" || analysis.riskLevel === "high") {
    templates.push(generateRejectTemplate(pricing, analysis));
  }

  templates.push(generateNegotiateTemplate(pricing, analysis));
  templates.push(generateConditionalTemplate(pricing, analysis));

  return templates;
}
