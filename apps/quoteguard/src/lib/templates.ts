import type { DeclineTemplate, DeclineScenario, DeclineTone } from "@/types";
import { generateId } from "./utils";

/**
 * @description 内置拒绝模板库
 */
export const BUILT_IN_TEMPLATES: DeclineTemplate[] = [
  {
    id: "tpl_free_pro",
    title: "礼貌拒绝免费工作",
    scenario: "free_work",
    tone: "professional",
    body: `你好 {clientName}，

感谢你对我工作的认可！很高兴你考虑与我合作 {projectName}。

作为一名专业的 {serviceType}，我需要对每个项目投入大量的时间和专业技能。为了确保能交付高质量的成果，我目前所有项目都是按照标准费率执行的。

我很乐意为你提供一份详细的报价方案——这样你可以充分了解我能为你带来的价值。

如有任何问题，欢迎随时联系我。

{businessName}`,
    isCustom: false,
  },
  {
    id: "tpl_free_friendly",
    title: "友好婉拒免费请求",
    scenario: "free_work",
    tone: "friendly",
    body: `Hi {clientName}，

谢谢你的来信！很高兴你喜欢我的作品 😊

不过很抱歉，我目前无法承接无偿项目。{serviceType} 是我的全职工作，每个项目都需要不少心血。

我可以给你发一份合理的报价，也许我们可以找到一个双方都满意的方案？如果预算有限，我也可以建议一些精简的合作方式。

期待你的回复！

{businessName}`,
    isCustom: false,
  },
  {
    id: "tpl_scope_pro",
    title: "制止范围蔓延",
    scenario: "scope_creep",
    tone: "firm",
    body: `你好 {clientName}，

感谢你对 {projectName} 的补充想法。

我注意到这些新需求已经超出了我们最初商定的项目范围。根据我们的协议，当前项目包含的内容是：
[原始范围描述]

额外的工作需要重新评估工时和费用。我会尽快给你一份补充报价，涵盖这些新需求。

为了不影响当前进度，建议我们先完成已商定的交付物，再讨论扩展部分。

{businessName}`,
    isCustom: false,
  },
  {
    id: "tpl_budget_emp",
    title: "应对预算过低",
    scenario: "low_budget",
    tone: "empathetic",
    body: `你好 {clientName}，

感谢你分享了 {projectName} 的详细信息。我理解预算是每个项目的重要考量。

但坦白说，以目前的预算很难确保交付你期望的质量水平。我的定价反映了多年的专业经验和对品质的承诺。

以下是我能提供的几个替代方案：
1. 精简项目范围，聚焦核心需求
2. 分阶段进行，先完成最重要的部分
3. 推荐其他可能更适合你预算的同行

无论你怎么决定，我都很乐意帮忙。

{businessName}`,
    isCustom: false,
  },
  {
    id: "tpl_deadline_firm",
    title: "拒绝不合理截止日",
    scenario: "unreasonable_deadline",
    tone: "firm",
    body: `你好 {clientName}，

感谢你对 {projectName} 的信任。

不过，经过评估我认为在你提出的时间内无法保证交付质量。高质量的 {serviceType} 工作需要充分的时间来执行、审查和打磨。

为了确保最佳结果，我建议：
- 调整截止日期至 [合理日期]
- 或者缩小初始交付范围，后续迭代完善

赶工出来的成果往往需要更多的返工成本。我相信合理的时间安排对双方都是最优解。

{businessName}`,
    isCustom: false,
  },
  {
    id: "tpl_expertise_pro",
    title: "超出专业范围",
    scenario: "outside_expertise",
    tone: "professional",
    body: `你好 {clientName}，

感谢你考虑我来做 {projectName}。

我仔细评估了项目需求后，认为这个项目超出了我的核心专业领域。与其勉强承接可能无法达到最佳效果的项目，我更愿意对你坦诚。

我可以推荐几位在这个领域更有经验的同行。同时，如果你有任何涉及 {serviceType} 的需求，我随时欢迎合作。

祝项目顺利！

{businessName}`,
    isCustom: false,
  },
  {
    id: "tpl_general_friendly",
    title: "通用友好婉拒",
    scenario: "general",
    tone: "friendly",
    body: `Hi {clientName}，

谢谢你联系我！很高兴认识你。

遗憾的是，由于目前的工作安排，我暂时无法承接这个项目。

不过，如果将来有合适的机会，我很愿意再讨论合作的可能性。你也可以关注我的作品集，了解我最新的可用时间。

祝一切顺利！

{businessName}`,
    isCustom: false,
  },
];

/**
 * @description 根据场景和语气筛选模板
 * @param {DeclineTemplate[]} templates - 模板列表
 * @param {DeclineScenario | ''} scenario - 筛选场景
 * @param {DeclineTone | ''} tone - 筛选语气
 * @returns {DeclineTemplate[]} 符合条件的模板
 */
export function filterTemplates(
  templates: DeclineTemplate[],
  scenario: DeclineScenario | "",
  tone: DeclineTone | ""
): DeclineTemplate[] {
  return templates.filter((t) => {
    if (scenario && t.scenario !== scenario) return false;
    if (tone && t.tone !== tone) return false;
    return true;
  });
}

/**
 * @description 填充模板变量
 * @param {string} body - 模板内容
 * @param {Record<string, string>} vars - 变量映射
 * @returns {string} 替换后的内容
 */
export function fillTemplate(
  body: string,
  vars: Record<string, string>
): string {
  let result = body;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, "g"), value);
  }
  return result;
}

/**
 * @description 创建自定义模板
 * @param {Omit<DeclineTemplate, 'id' | 'isCustom'>} data - 模板数据
 * @returns {DeclineTemplate} 新模板
 */
export function createCustomTemplate(
  data: Omit<DeclineTemplate, "id" | "isCustom">
): DeclineTemplate {
  return {
    ...data,
    id: generateId(),
    isCustom: true,
  };
}
