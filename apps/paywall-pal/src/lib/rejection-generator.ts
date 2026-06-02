/**
 * @fileoverview 礼貌拒绝消息生成器
 */

import { RejectionConfig, RejectionMessage, RejectionTone } from "@/types";

/**
 * 根据语气风格生成拒绝模板
 */
const TEMPLATES: Record<RejectionTone, { subjects: string[]; bodies: string[] }> = {
  friendly: {
    subjects: [
      "Thanks for reaching out! Let's talk about working together",
      "Appreciate your message - here's how we can collaborate",
      "Hey! I'd love to help - here's my process",
    ],
    bodies: [
      `Hi there! 👋

Thanks so much for thinking of me for this project - I really appreciate you reaching out!

I've given it some thought, and while I'd love to help, I'm not able to take on unpaid work at this time. Like many freelancers, my time and skills are how I support myself, so I need to ensure all projects are compensated fairly.

That said, I'd genuinely love to work with you! Here's what I can offer:

{QUOTE_SECTION}

I'm happy to discuss scope, timelines, and find something that works for both of us. Would you like to chat about a paid arrangement?

Looking forward to hearing from you!

{SIGNATURE}`,
      `Hey! 😊

Thank you for your message - it sounds like an interesting project!

I want to be upfront: I only take on paid engagements these days. I've found that paid collaborations lead to better outcomes for everyone involved - more commitment, clearer expectations, and better results.

{QUOTE_SECTION}

If budget is a concern, I'm open to discussing flexible payment options or adjusted scope. Let me know what works for you!

Best,

{SIGNATURE}`,
    ],
  },
  professional: {
    subjects: [
      "Re: Your project inquiry - Engagement terms",
      "Project inquiry response - Services & pricing",
      "Thank you for your inquiry - Next steps",
    ],
    bodies: [
      `Dear Client,

Thank you for your inquiry regarding this project. I appreciate your interest in my services.

After reviewing your request, I'd like to clarify my engagement terms. All professional services I provide are offered on a paid basis, reflecting the expertise, time, and resources required to deliver quality work.

{QUOTE_SECTION}

I believe in transparent pricing and delivering exceptional value. I'd be happy to discuss how we can structure an engagement that meets your needs and budget.

Please don't hesitate to reach out if you'd like to proceed with a paid arrangement.

Best regards,

{SIGNATURE}`,
      `Hello,

Thank you for reaching out about your project. I appreciate you considering me for this work.

I want to set clear expectations from the start: my professional services are available exclusively through paid engagements. This ensures I can dedicate the necessary focus, resources, and quality assurance to every project I undertake.

{QUOTE_SECTION}

I'm confident we can find a scope and pricing structure that works for both parties. Please let me know if you'd like to discuss further.

Kind regards,

{SIGNATURE}`,
    ],
  },
  firm: {
    subjects: [
      "Re: Project request - My terms",
      "Regarding your request - Professional terms apply",
      "Project inquiry - Paid engagements only",
    ],
    bodies: [
      `Hi,

Thank you for your message. I'll be direct: I do not accept unpaid work, regardless of the project scope or promised future benefits.

My time and expertise have value, and I maintain strict boundaries around compensation. This is non-negotiable.

{QUOTE_SECTION}

If you have a budget and would like to work together professionally, I'm happy to discuss. Otherwise, I wish you the best in finding the right fit for your project.

{SIGNATURE}`,
      `Hello,

I appreciate you reaching out. However, I need to be clear: I do not work for free, for exposure, for equity in unproven ventures, or for vague promises of future payment.

Professional work requires professional compensation. Period.

{QUOTE_SECTION}

If you have an actual budget allocated for this work, let's talk. I deliver excellent results for clients who value professional expertise.

Regards,

{SIGNATURE}`,
    ],
  },
};

/**
 * 生成礼貌拒绝消息
 * @param config - 拒绝模板配置
 * @returns 生成的拒绝消息
 */
export function generateRejection(config: RejectionConfig): RejectionMessage {
  const { tone, includeQuote, signature } = config;
  const template = TEMPLATES[tone];

  const subjectIndex = Math.floor(Math.random() * template.subjects.length);
  const bodyIndex = Math.floor(Math.random() * template.bodies.length);

  const subject = template.subjects[subjectIndex];
  let body = template.bodies[bodyIndex];

  const quoteSection = includeQuote
    ? `Here's a quick overview of my standard rates:

• Consultation/Discovery Call: Free (30 min)
• Project-based work: Starting from $500
• Hourly rate: $75-150/hr depending on complexity
• Rush jobs (< 48hr turnaround): +50% premium

I can provide a detailed custom quote once we discuss your specific requirements.`
    : "I'd be happy to provide a custom quote once we discuss your specific requirements.";

  body = body.replace("{QUOTE_SECTION}", quoteSection);
  body = body.replace("{SIGNATURE}", signature || "Best,\n[Your Name]");

  return { subject, body, tone };
}

/**
 * 获取所有可用的语气选项
 * @returns 语气选项数组
 */
export function getToneOptions(): { value: RejectionTone; label: string; description: string }[] {
  return [
    { value: "friendly", label: "Friendly", description: "Warm and approachable, leaves door open" },
    { value: "professional", label: "Professional", description: "Business-like and formal" },
    { value: "firm", label: "Firm", description: "Direct and assertive, clear boundaries" },
  ];
}
