import type { ResumeData, ATSScoreResult, KeywordMatch } from "@/types";

/**
 * @description AI 简历生成 — 调用后端 API 生成简历内容
 * @param {string} userInput - 用户自由文本输入（经历、技能等）
 * @param {string} [jobDescription] - 目标职位描述
 * @returns {Promise<Partial<ResumeData>>} 生成的简历数据
 */
export async function generateResumeContent(
  userInput: string,
  jobDescription?: string
): Promise<Partial<ResumeData>> {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userInput, jobDescription }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate resume content");
  }

  return response.json();
}

/**
 * @description ATS 评分检测 — 调用后端 API 对简历进行评分
 * @param {ResumeData} resume - 简历数据
 * @param {string} [jobDescription] - 目标职位描述
 * @returns {Promise<ATSScoreResult>} ATS 评分结果
 */
export async function checkATSScore(
  resume: ResumeData,
  jobDescription?: string
): Promise<ATSScoreResult> {
  const response = await fetch("/api/ats-score", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resume, jobDescription }),
  });

  if (!response.ok) {
    throw new Error("Failed to check ATS score");
  }

  return response.json();
}

/**
 * @description 本地 ATS 评分引擎（无需 API）
 * 基于规则对简历进行 ATS 兼容性评分
 * @param {ResumeData} resume - 简历数据
 * @param {string} [jobDescription] - 目标职位描述
 * @returns {ATSScoreResult} ATS 评分结果
 */
export function calculateATSScore(
  resume: ResumeData,
  jobDescription?: string
): ATSScoreResult {
  const categories = [];
  let totalScore = 0;
  let maxTotal = 0;
  const suggestions: string[] = [];

  // 1. Contact info completeness
  const contactFields = [
    resume.personalInfo.fullName,
    resume.personalInfo.email,
    resume.personalInfo.phone,
    resume.personalInfo.location,
  ];
  const filledContacts = contactFields.filter((f) => f.trim().length > 0).length;
  const contactScore = Math.round((filledContacts / 4) * 20);
  categories.push({
    name: "Contact Information",
    score: contactScore,
    maxScore: 20,
    feedback:
      contactScore >= 20
        ? "All essential contact info provided."
        : "Missing some contact details. Provide name, email, phone, and location.",
  });
  if (contactScore < 20)
    suggestions.push(
      "Add all contact information: full name, email, phone, and location."
    );
  totalScore += contactScore;
  maxTotal += 20;

  // 2. Professional summary
  const summaryLength = resume.personalInfo.summary.trim().length;
  const summaryScore =
    summaryLength > 200 ? 15 : summaryLength > 50 ? 10 : summaryLength > 0 ? 5 : 0;
  categories.push({
    name: "Professional Summary",
    score: summaryScore,
    maxScore: 15,
    feedback:
      summaryScore >= 15
        ? "Strong professional summary."
        : "Your summary should be 2-4 sentences highlighting your key qualifications.",
  });
  if (summaryScore < 15)
    suggestions.push(
      "Expand your professional summary to 2-4 sentences (200+ characters)."
    );
  totalScore += summaryScore;
  maxTotal += 15;

  // 3. Work experience
  const expCount = resume.workExperience.length;
  const expWithAchievements = resume.workExperience.filter(
    (w) => w.achievements.length > 0
  ).length;
  const expScore = Math.min(
    25,
    expCount * 5 + expWithAchievements * 5
  );
  categories.push({
    name: "Work Experience",
    score: expScore,
    maxScore: 25,
    feedback:
      expScore >= 20
        ? "Good work experience with measurable achievements."
        : "Add more work experiences with quantifiable achievements.",
  });
  if (expCount === 0)
    suggestions.push("Add at least one work experience entry.");
  if (expWithAchievements < expCount)
    suggestions.push(
      "Add quantifiable achievements (metrics, percentages) to each work experience."
    );
  totalScore += expScore;
  maxTotal += 25;

  // 4. Education
  const eduScore = Math.min(15, resume.education.length * 8);
  categories.push({
    name: "Education",
    score: eduScore,
    maxScore: 15,
    feedback:
      eduScore >= 8
        ? "Education section is adequate."
        : "Add your educational background.",
  });
  if (resume.education.length === 0)
    suggestions.push("Add your educational background.");
  totalScore += eduScore;
  maxTotal += 15;

  // 5. Skills
  const skillScore = Math.min(
    15,
    resume.skills.length * 2
  );
  categories.push({
    name: "Skills",
    score: skillScore,
    maxScore: 15,
    feedback:
      skillScore >= 10
        ? "Good range of skills listed."
        : "Add more relevant skills to improve ATS matching.",
  });
  if (resume.skills.length < 5)
    suggestions.push("Add at least 5 relevant skills.");
  totalScore += skillScore;
  maxTotal += 15;

  // 6. Keyword matching (if job description provided)
  const keywords: KeywordMatch[] = [];
  let keywordScore = 10;
  if (jobDescription && jobDescription.trim().length > 0) {
    const jdWords = extractKeywords(jobDescription);
    const resumeText = buildResumeText(resume).toLowerCase();
    let foundCount = 0;

    for (const word of jdWords) {
      const found = resumeText.includes(word.toLowerCase());
      if (found) foundCount++;
      keywords.push({
        keyword: word,
        found,
        importance: "high",
      });
    }

    keywordScore =
      jdWords.length > 0
        ? Math.round((foundCount / jdWords.length) * 10)
        : 10;

    if (keywordScore < 10) {
      const missing = keywords
        .filter((k) => !k.found)
        .map((k) => k.keyword);
      suggestions.push(
        `Missing keywords from job description: ${missing.slice(0, 5).join(", ")}. Try incorporating these.`
      );
    }
  }
  categories.push({
    name: "Keyword Match",
    score: keywordScore,
    maxScore: 10,
    feedback: jobDescription
      ? `${keywordScore * 10}% keyword match with job description.`
      : "Provide a job description to check keyword matching.",
  });
  totalScore += keywordScore;
  maxTotal += 10;

  const overallScore = maxTotal > 0 ? Math.round((totalScore / maxTotal) * 100) : 0;

  return {
    overallScore,
    categories,
    suggestions,
    keywords,
  };
}

/**
 * @description 从文本中提取关键词
 * @param {string} text - 输入文本
 * @returns {string[]} 提取的关键词列表
 */
export function extractKeywords(text: string): string[] {
  const stopWords = new Set([
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "by", "is", "are", "was", "were", "be", "been", "being",
    "have", "has", "had", "do", "does", "did", "will", "would", "could",
    "should", "may", "might", "can", "shall", "this", "that", "these",
    "those", "we", "you", "they", "it", "our", "your", "their", "its",
    "from", "as", "about", "into", "through", "during", "before", "after",
    "above", "below", "between", "up", "down", "out", "off", "over",
    "under", "again", "further", "then", "once", "all", "each", "every",
    "both", "few", "more", "most", "other", "some", "such", "no", "not",
    "only", "own", "same", "so", "than", "too", "very", "just", "also",
  ]);

  const words = text
    .replace(/[^a-zA-Z0-9\s+#.-]/g, " ")
    .split(/\s+/)
    .filter(
      (w) =>
        w.length > 2 && !stopWords.has(w.toLowerCase()) && !/^\d+$/.test(w)
    );

  const freq = new Map<string, number>();
  for (const w of words) {
    const lower = w.toLowerCase();
    freq.set(lower, (freq.get(lower) ?? 0) + 1);
  }

  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([k]) => k);
}

/**
 * @description 将简历数据拼接为纯文本，用于关键词匹配
 * @param {ResumeData} resume - 简历数据
 * @returns {string} 纯文本简历
 */
export function buildResumeText(resume: ResumeData): string {
  const parts: string[] = [
    resume.personalInfo.fullName,
    resume.personalInfo.summary,
    ...resume.workExperience.map(
      (w) =>
        `${w.position} ${w.company} ${w.description} ${w.achievements.join(" ")}`
    ),
    ...resume.education.map((e) => `${e.degree} ${e.field} ${e.institution}`),
    ...resume.skills.map((s) => s.name),
    ...resume.projects.map(
      (p) => `${p.name} ${p.description} ${p.technologies.join(" ")}`
    ),
  ];
  return parts.join(" ");
}
