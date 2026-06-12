import type { Template } from "@/types";

/**
 * @description 预定义的输出模板列表
 */
export const TEMPLATES: Template[] = [
  {
    id: "email",
    name: "Email",
    icon: "mail",
    description: "将语音转为专业邮件格式",
    prompt:
      "Convert the following transcribed speech into a professional, well-structured email. Include a subject line, greeting, body paragraphs, and a closing. Fix any grammar issues and make the tone professional but friendly. Output in the same language as the input.",
  },
  {
    id: "todo",
    name: "To-Do",
    icon: "list-checks",
    description: "提取待办事项列表",
    prompt:
      "Extract all action items and tasks from the following transcribed speech. Format them as a clean, prioritized to-do list using markdown checkboxes (- [ ]). Group related items together if applicable. Output in the same language as the input.",
  },
  {
    id: "blog",
    name: "Blog Draft",
    icon: "file-text",
    description: "整理为博客文章草稿",
    prompt:
      "Transform the following transcribed speech into a well-structured blog post draft. Include a compelling title, introduction, organized body sections with headers, and a conclusion. Maintain the speaker's voice and key ideas while improving clarity and flow. Output in the same language as the input.",
  },
  {
    id: "meeting",
    name: "Meeting Notes",
    icon: "users",
    description: "整理为会议纪要",
    prompt:
      "Organize the following transcribed speech into structured meeting notes. Include: Summary, Key Discussion Points, Decisions Made, Action Items (with owners if mentioned), and Next Steps. Use bullet points for clarity. Output in the same language as the input.",
  },
  {
    id: "custom",
    name: "Custom",
    icon: "sparkles",
    description: "自定义格式化指令",
    prompt:
      "Clean up and structure the following transcribed speech into a well-organized document. Fix grammar, remove filler words, and organize the content logically with appropriate headers and formatting. Output in the same language as the input.",
  },
];

/**
 * @description 根据模板ID获取模板
 * @param {string} id - 模板ID
 * @returns {Template | undefined} 模板对象
 */
export function getTemplateById(id: string): Template | undefined {
  return TEMPLATES.find((t) => t.id === id);
}

/**
 * @description 获取免费试用次数上限
 */
export const FREE_TRIAL_LIMIT = 3;
