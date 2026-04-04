/**
 * @fileoverview 简历解析与关键词提取工具函数
 */
import type { ParsedResume } from "@/types";

/**
 * 从简历文本中提取结构化数据（轻量级本地解析）
 * @param text - 简历原始文本
 * @returns 解析后的简历结构
 */
export function parseResumeText(text: string): ParsedResume {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  const skills = extractSkills(text);
  const email = extractEmail(text);
  const phone = extractPhone(text);
  const name = lines[0] || undefined;

  return {
    name,
    email,
    phone,
    summary: extractSection(text, ["summary", "objective", "profile", "about"]),
    skills,
    experience: [],
    education: [],
  };
}

/**
 * 从文本中提取技能关键词
 * @param text - 原始文本
 * @returns 技能列表
 */
export function extractSkills(text: string): string[] {
  const commonSkills = [
    "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Go", "Rust", "Ruby", "PHP", "Swift",
    "React", "Angular", "Vue", "Next.js", "Node.js", "Express", "Django", "Flask", "Spring",
    "AWS", "Azure", "GCP", "Docker", "Kubernetes", "CI/CD", "Git",
    "SQL", "PostgreSQL", "MySQL", "MongoDB", "Redis", "GraphQL",
    "Machine Learning", "Deep Learning", "NLP", "Computer Vision",
    "Agile", "Scrum", "JIRA", "Figma", "Photoshop",
    "REST API", "Microservices", "Serverless",
    "HTML", "CSS", "Sass", "Tailwind",
    "TensorFlow", "PyTorch", "Pandas", "NumPy",
    "Linux", "Terraform", "Ansible",
    "Project Management", "Product Management", "Data Analysis",
    "Communication", "Leadership", "Problem Solving",
  ];

  const lower = text.toLowerCase();
  return commonSkills.filter((skill) =>
    lower.includes(skill.toLowerCase())
  );
}

/**
 * 从文本中提取邮箱
 * @param text - 原始文本
 * @returns 邮箱地址或 undefined
 */
export function extractEmail(text: string): string | undefined {
  const match = text.match(/[\w.-]+@[\w.-]+\.\w{2,}/);
  return match?.[0];
}

/**
 * 从文本中提取电话号码
 * @param text - 原始文本
 * @returns 电话号码或 undefined
 */
export function extractPhone(text: string): string | undefined {
  const match = text.match(/[\+]?[\d\s\-().]{7,15}/);
  return match?.[0]?.trim();
}

/**
 * 从文本中提取指定段落内容
 * @param text - 原始文本
 * @param headers - 可能的段落标题
 * @returns 段落内容或 undefined
 */
function extractSection(text: string, headers: string[]): string | undefined {
  const lower = text.toLowerCase();
  for (const header of headers) {
    const idx = lower.indexOf(header);
    if (idx === -1) continue;
    const start = text.indexOf("\n", idx);
    if (start === -1) continue;
    const end = text.indexOf("\n\n", start + 1);
    return text.slice(start, end === -1 ? start + 500 : end).trim();
  }
  return undefined;
}

/**
 * 计算两组关键词的匹配度
 * @param resumeKeywords - 简历关键词
 * @param jobKeywords - 职位关键词
 * @returns 匹配信息
 */
export function calculateKeywordMatch(
  resumeKeywords: string[],
  jobKeywords: string[]
): { score: number; matched: string[]; missing: string[] } {
  const resumeSet = new Set(resumeKeywords.map((k) => k.toLowerCase()));
  const matched: string[] = [];
  const missing: string[] = [];

  for (const kw of jobKeywords) {
    if (resumeSet.has(kw.toLowerCase())) {
      matched.push(kw);
    } else {
      missing.push(kw);
    }
  }

  const score = jobKeywords.length > 0 ? (matched.length / jobKeywords.length) * 100 : 0;
  return { score: Math.round(score), matched, missing };
}
