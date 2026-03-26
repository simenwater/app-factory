import type { ReplyStyle, SentimentAnalysis, ReplyDraft } from "@/types";
import { generateId } from "./utils";

/**
 * @description 回复模板配置
 */
interface ReplyTemplate {
  opening: string[];
  body: string[];
  closing: string[];
  tone: string;
}

/**
 * @description 各风格的回复模板
 */
const TEMPLATES: Record<ReplyStyle, ReplyTemplate> = {
  apology: {
    opening: [
      "非常感谢您抽出时间分享反馈。对于您的不愉快体验，我深感抱歉。",
      "感谢您的评价，我对给您带来的不便深表歉意。",
      "Thank you for your feedback. I sincerely apologize for the experience you had.",
    ],
    body: [
      "您提到的问题我非常重视，这不是我们期望提供的服务水准。我已经在积极改进相关流程，确保类似情况不再发生。",
      "I take your concerns very seriously and have already begun addressing the issues you mentioned to ensure a better experience going forward.",
      "我理解您的失望，您的反馈帮助我发现了服务中的不足。我已采取以下措施来改进...",
    ],
    closing: [
      "如果您愿意，我希望有机会弥补这次体验。请随时联系我，我很乐意为您提供满意的解决方案。",
      "I would truly appreciate the opportunity to make things right. Please don't hesitate to reach out to me directly.",
      "再次为给您带来的不便深表歉意，期待有机会为您提供更好的服务。",
    ],
    tone: "诚恳道歉型",
  },
  explanation: {
    opening: [
      "感谢您分享了这次体验的详细情况。我想就您提到的几个方面做一些说明。",
      "Thank you for taking the time to share your experience. I'd like to provide some context regarding the points you raised.",
      "感谢您的反馈。为了让其他客户能更全面地了解情况，我想补充一些背景信息。",
    ],
    body: [
      "关于您提到的问题，实际情况是这样的：在整个服务过程中，我们始终遵循行业标准流程，并在每个关键节点与您进行了沟通确认。",
      "I'd like to clarify that throughout our engagement, we followed standard industry practices and maintained open communication at every stage.",
      "就您反馈的具体问题，我需要说明的是：我们的服务流程经过精心设计，旨在确保每位客户都能获得最佳体验。在您的案例中...",
    ],
    closing: [
      "我尊重您的看法，同时也希望这些补充信息能帮助全面了解情况。如有任何疑问，欢迎随时交流。",
      "I respect your perspective and hope this additional context is helpful. I'm always open to further discussion.",
      "如果您有任何其他问题或想进一步了解，请随时联系我。我始终致力于提供透明、专业的服务。",
    ],
    tone: "专业解释型",
  },
  counter: {
    opening: [
      "感谢您的反馈。为了确保公正性，我想就这条评价中的某些表述做一些澄清。",
      "Thank you for sharing your perspective. However, I feel it's important to address some inaccuracies in this review for the benefit of other potential clients.",
      "我注意到了这条评价，并认为有必要提供一些重要的补充信息。",
    ],
    body: [
      "在我们的合作过程中，所有服务内容、时间线和费用都已在合同中明确列出并经双方确认。我保留了完整的沟通记录，可以证实每一步工作都按照约定进行。",
      "Our entire working relationship was documented, with clear agreements on deliverables, timeline, and costs. I have comprehensive records of all communications that demonstrate the service was delivered as agreed.",
      "事实与评价中描述的情况有所出入。作为一个重视声誉的专业人士，我有责任指出这些不准确之处...",
    ],
    closing: [
      "我始终欢迎建设性的反馈，但我也有义务维护我的专业声誉。如果您愿意，我很乐意私下讨论并找到双方都满意的解决方案。",
      "While I welcome constructive feedback, I also have a responsibility to present an accurate picture. I'm open to discussing this privately to reach a fair resolution.",
      "如需查看相关记录或进一步了解情况，请直接联系我。我对我的专业水准充满信心。",
    ],
    tone: "专业反驳型",
  },
};

/**
 * @description 根据情感分析和评价原文生成一条回复草稿
 * @param style - 回复风格
 * @param originalText - 评价原文
 * @param sentiment - 情感分析结果
 * @param businessName - 商家名称
 * @returns 回复草稿
 */
export function generateReply(
  style: ReplyStyle,
  originalText: string,
  sentiment: SentimentAnalysis,
  businessName: string
): ReplyDraft {
  const template = TEMPLATES[style];

  const isEnglish = /^[a-zA-Z\s.,!?'"()-]+$/.test(originalText.trim().slice(0, 50));

  const openingIdx = isEnglish ? Math.min(2, template.opening.length - 1) : Math.floor(Math.random() * Math.min(2, template.opening.length));
  const bodyIdx = isEnglish ? Math.min(1, template.body.length - 1) : Math.floor(Math.random() * Math.min(2, template.body.length));
  const closingIdx = isEnglish ? Math.min(1, template.closing.length - 1) : Math.floor(Math.random() * Math.min(2, template.closing.length));

  let content = `${template.opening[openingIdx]}\n\n${template.body[bodyIdx]}\n\n${template.closing[closingIdx]}`;

  if (businessName) {
    content += `\n\n${isEnglish ? "Best regards" : "此致"},\n${businessName}`;
  }

  return {
    id: generateId(),
    style,
    content,
    tone: template.tone,
    createdAt: new Date().toISOString(),
  };
}

/**
 * @description 一次性生成三种风格的回复草稿
 * @param originalText - 评价原文
 * @param sentiment - 情感分析结果
 * @param businessName - 商家名称
 * @returns 三条回复草稿
 */
export function generateAllReplies(
  originalText: string,
  sentiment: SentimentAnalysis,
  businessName: string
): ReplyDraft[] {
  const styles: ReplyStyle[] = ["apology", "explanation", "counter"];
  return styles.map((style) =>
    generateReply(style, originalText, sentiment, businessName)
  );
}
