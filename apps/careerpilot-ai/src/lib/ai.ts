/**
 * @fileoverview AI 服务层 — 调用 OpenAI API 进行简历优化和 JD 匹配分析
 */

/** AI 优化简历的请求体 */
export interface OptimizeResumeRequest {
  resumeText: string;
  jobDescription?: string;
}

/** AI 优化简历的响应体 */
export interface OptimizeResumeResponse {
  optimizedText: string;
  highlights: string[];
}

/** AI 匹配分析的请求体 */
export interface MatchAnalysisRequest {
  resumeText: string;
  jobDescription: string;
  jobTitle: string;
}

/** AI 匹配分析的响应体 */
export interface MatchAnalysisResponse {
  overallScore: number;
  skillMatch: number;
  experienceMatch: number;
  keywordMatch: number;
  suggestions: string[];
  matchedKeywords: string[];
  missingKeywords: string[];
  coverLetter: string;
}

/**
 * 调用后端 API 优化简历
 * @param data - 简历文本和可选的 JD
 * @returns 优化后的简历和亮点
 */
export async function optimizeResume(
  data: OptimizeResumeRequest
): Promise<OptimizeResumeResponse> {
  const res = await fetch("/api/resume", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to optimize resume");
  }

  return res.json();
}

/**
 * 调用后端 API 进行 JD 匹配分析
 * @param data - 简历、JD 和职位名称
 * @returns 匹配评分和建议
 */
export async function analyzeMatch(
  data: MatchAnalysisRequest
): Promise<MatchAnalysisResponse> {
  const res = await fetch("/api/jobs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to analyze match");
  }

  return res.json();
}
