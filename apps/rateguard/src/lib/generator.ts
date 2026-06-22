/**
 * @fileoverview 回复和报价生成引擎
 *
 * 根据分析结果和用户费率标准，生成专业的拒绝话术、
 * 协商回复或正式报价邮件。
 */

import type {
  AnalysisResult,
  GeneratedReply,
  ResponseType,
  RateStandard,
  ContractClause,
} from "@/types";
import { generateId, formatCurrency } from "@/lib/utils";

/**
 * @typedef {Object} GenerateOptions
 * @property {"formal"|"friendly"} tone - 语气风格
 * @property {string} displayName - 用户名/公司名
 * @property {RateStandard[]} [rates] - 费率标准（用于生成报价）
 * @property {ContractClause[]} [clauses] - 合同条款
 */
interface GenerateOptions {
  tone: "formal" | "friendly";
  displayName: string;
  rates?: RateStandard[];
  clauses?: ContractClause[];
}

/** 拒绝模板库 — 正式语气 */
const FORMAL_REJECTION_TEMPLATES = [
  `感谢您的来信和对我们服务的兴趣。

经过仔细评估，我们无法以无偿或大幅低于市场标准的条件承接此项目。我们的定价体系基于行业标准和团队的专业经验，确保每位客户都能获得高质量的交付成果。

如果您有预算并希望进一步讨论合作，我们非常乐意为您量身定制一份详细报价。

祝商祺`,

  `感谢您的咨询。

我们十分重视每一位潜在客户的需求，但遗憾的是，本次项目的条件与我们的服务标准不符。我们的专业服务需要投入大量时间、技能和资源，因此需要合理的预算支持。

如您的预算有调整空间，欢迎随时联系我们获取正式报价。

此致敬礼`,
];

/** 拒绝模板库 — 友好语气 */
const FRIENDLY_REJECTION_TEMPLATES = [
  `你好！感谢你的消息 😊

非常感谢你想到我，但这次恐怕没办法免费帮忙。作为一名专业人士，我的时间和技能也需要合理的报酬来维持生计。

如果你有预算的话，我很乐意聊聊合作方案！期待下次有机会一起合作。

祝好`,

  `嗨！谢谢你的来信 ✨

我很理解预算紧张的感觉，但是这个项目需要投入不少专业时间和精力，所以没办法免费做哦。

如果你有预算可以商量，我可以给你一个性价比不错的方案。随时联系我聊聊！

Best`,
];

/** 协商模板库 — 正式语气 */
const FORMAL_NEGOTIATION_TEMPLATES = [
  `感谢您的来信。

我们对您的项目很感兴趣，但目前提出的条件需要进一步协商。基于项目的需求范围和复杂度，我们提供以下报价供您参考：

{QUOTE_SECTION}

以上报价包含{CLAUSE_SECTION}。

如果这个方案在您的预算范围内，我们可以进一步讨论项目细节和时间安排。

祝商祺`,
];

/** 协商模板库 — 友好语气 */
const FRIENDLY_NEGOTIATION_TEMPLATES = [
  `你好！

谢谢你的来信，这个项目听起来挺有意思的！不过价格方面我们需要商量一下。

根据项目需求，我这边的报价是：

{QUOTE_SECTION}

{CLAUSE_SECTION}

如果这个预算 OK 的话，我们可以进一步聊细节。期待你的回复！

Best`,
];

/**
 * 从模板数组中随机选取一个
 * @param {string[]} templates - 模板数组
 * @returns {string} 随机选取的模板
 */
function pickTemplate(templates: string[]): string {
  return templates[Math.floor(Math.random() * templates.length)];
}

/**
 * 生成报价区块文本
 * @param {RateStandard[]} rates - 费率标准
 * @returns {string} 格式化的报价文本
 */
export function buildQuoteSection(rates: RateStandard[]): string {
  if (!rates || rates.length === 0) {
    return "• 具体报价请根据项目需求另行协商";
  }

  return rates
    .map(
      (r) =>
        `• ${r.serviceName}：时薪 ${formatCurrency(r.hourlyRate, r.currency)}，最低项目费 ${formatCurrency(r.minimumProjectFee, r.currency)}`
    )
    .join("\n");
}

/**
 * 生成合同条款摘要文本
 * @param {ContractClause[]} clauses - 合同条款
 * @returns {string} 条款摘要
 */
export function buildClauseSection(clauses: ContractClause[]): string {
  const defaults = clauses?.filter((c) => c.isDefault) ?? [];
  if (defaults.length === 0) {
    return "标准合作条款";
  }
  return defaults.map((c) => c.title).join("、");
}

/**
 * 生成拒绝回复
 * @param {AnalysisResult} analysis - 分析结果
 * @param {GenerateOptions} options - 生成选项
 * @returns {GeneratedReply} 拒绝回复
 */
export function generateRejection(
  analysis: AnalysisResult,
  options: GenerateOptions
): GeneratedReply {
  const templates =
    options.tone === "formal"
      ? FORMAL_REJECTION_TEMPLATES
      : FRIENDLY_REJECTION_TEMPLATES;

  const body = `${pickTemplate(templates)}\n\n${options.displayName}`;

  return {
    id: generateId(),
    analysisId: analysis.id,
    type: "reject",
    subject:
      options.tone === "formal"
        ? "关于项目合作事宜的回复"
        : "回复：关于项目合作",
    body,
    tone: options.tone,
    createdAt: new Date().toISOString(),
  };
}

/**
 * 生成协商/报价回复
 * @param {AnalysisResult} analysis - 分析结果
 * @param {GenerateOptions} options - 生成选项
 * @returns {GeneratedReply} 协商回复
 */
export function generateNegotiation(
  analysis: AnalysisResult,
  options: GenerateOptions
): GeneratedReply {
  const templates =
    options.tone === "formal"
      ? FORMAL_NEGOTIATION_TEMPLATES
      : FRIENDLY_NEGOTIATION_TEMPLATES;

  let body = pickTemplate(templates);
  body = body.replace("{QUOTE_SECTION}", buildQuoteSection(options.rates ?? []));
  body = body.replace(
    "{CLAUSE_SECTION}",
    buildClauseSection(options.clauses ?? [])
  );
  body += `\n\n${options.displayName}`;

  return {
    id: generateId(),
    analysisId: analysis.id,
    type: "negotiate",
    subject:
      options.tone === "formal"
        ? "项目报价 — " + options.displayName
        : "报价参考 ✨",
    body,
    tone: options.tone,
    createdAt: new Date().toISOString(),
  };
}

/**
 * 生成接受/正常回复
 * @param {AnalysisResult} analysis - 分析结果
 * @param {GenerateOptions} options - 生成选项
 * @returns {GeneratedReply} 接受回复
 */
export function generateAcceptance(
  analysis: AnalysisResult,
  options: GenerateOptions
): GeneratedReply {
  const body =
    options.tone === "formal"
      ? `感谢您的来信。\n\n我们对您的项目很感兴趣，非常乐意进一步讨论合作细节。\n\n以下是我们的标准费率供参考：\n\n${buildQuoteSection(options.rates ?? [])}\n\n期待您的回复。\n\n${options.displayName}`
      : `你好！\n\n谢谢你的来信，这个项目看起来很棒！我很感兴趣 😊\n\n这是我的费率参考：\n\n${buildQuoteSection(options.rates ?? [])}\n\n我们可以进一步聊聊细节！\n\n${options.displayName}`;

  return {
    id: generateId(),
    analysisId: analysis.id,
    type: "accept",
    subject:
      options.tone === "formal"
        ? "关于项目合作的回复"
        : "很高兴收到你的消息！",
    body,
    tone: options.tone,
    createdAt: new Date().toISOString(),
  };
}

/**
 * 根据分析结果自动生成合适的回复
 * @param {AnalysisResult} analysis - 分析结果
 * @param {GenerateOptions} options - 生成选项
 * @param {ResponseType} [overrideType] - 覆盖的响应类型
 * @returns {GeneratedReply} 生成的回复
 */
export function generateReply(
  analysis: AnalysisResult,
  options: GenerateOptions,
  overrideType?: ResponseType
): GeneratedReply {
  const type = overrideType ?? analysis.suggestedResponse;

  switch (type) {
    case "reject":
      return generateRejection(analysis, options);
    case "negotiate":
      return generateNegotiation(analysis, options);
    case "accept":
      return generateAcceptance(analysis, options);
    default:
      return generateNegotiation(analysis, options);
  }
}
