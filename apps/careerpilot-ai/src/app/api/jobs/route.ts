/**
 * @fileoverview JD 匹配分析 API Route — POST /api/jobs
 * 分析简历与职位描述的匹配度，提供建议和求职信
 */
import { NextRequest, NextResponse } from "next/server";
import { extractSkills, calculateKeywordMatch } from "@/lib/resume";

/**
 * POST /api/jobs
 * @param req - 包含 resumeText, jobDescription, jobTitle 的请求体
 * @returns 匹配评分、建议和生成的求职信
 */
export async function POST(req: NextRequest) {
  try {
    const { resumeText, jobDescription, jobTitle } = await req.json();

    if (!resumeText || !jobDescription) {
      return NextResponse.json(
        { error: "resumeText and jobDescription are required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return fallbackMatch(resumeText, jobDescription, jobTitle);
    }

    const systemPrompt = `You are an expert ATS (Applicant Tracking System) analyzer and career advisor.
Analyze the match between a resume and job description. Return JSON with:
{
  "overallScore": <0-100>,
  "skillMatch": <0-100>,
  "experienceMatch": <0-100>,
  "keywordMatch": <0-100>,
  "suggestions": ["suggestion1", "suggestion2", ...],
  "matchedKeywords": ["keyword1", ...],
  "missingKeywords": ["keyword1", ...],
  "coverLetter": "A professional cover letter tailored to this job"
}`;

    const userPrompt = `Resume:\n${resumeText}\n\nJob Title: ${jobTitle || "Not specified"}\n\nJob Description:\n${jobDescription}`;

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.5,
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) {
      console.error("OpenAI error:", await res.text());
      return fallbackMatch(resumeText, jobDescription, jobTitle);
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return fallbackMatch(resumeText, jobDescription, jobTitle);
    }

    const parsed = JSON.parse(content);
    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Match analysis error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * 当 OpenAI API 不可用时的降级匹配分析
 * @param resumeText - 简历文本
 * @param jobDescription - 职位描述
 * @param jobTitle - 职位名称
 * @returns 基于关键词的基本匹配结果
 */
function fallbackMatch(resumeText: string, jobDescription: string, jobTitle?: string) {
  const resumeSkills = extractSkills(resumeText);
  const jobSkills = extractSkills(jobDescription);
  const { score, matched, missing } = calculateKeywordMatch(resumeSkills, jobSkills);

  const overallScore = Math.min(100, Math.round(score * 0.6 + 40));
  const skillMatch = score;
  const experienceMatch = Math.min(100, Math.round(score * 0.8 + 20));
  const keywordMatch = score;

  const suggestions: string[] = [];
  if (missing.length > 0) {
    suggestions.push(`Consider adding these skills: ${missing.join(", ")}`);
  }
  if (score < 50) {
    suggestions.push("Your resume may need significant tailoring for this role");
  }
  suggestions.push("Add quantified achievements to strengthen your application");
  suggestions.push("Configure OPENAI_API_KEY for AI-powered deep analysis");

  const coverLetter = `Dear Hiring Manager,

I am writing to express my interest in the ${jobTitle || "position"} role. With my background in ${matched.slice(0, 3).join(", ") || "relevant technologies"}, I am confident in my ability to contribute to your team.

${matched.length > 0 ? `My experience with ${matched.join(", ")} aligns well with your requirements.` : "I am eager to bring my skills and experience to this role."}

I look forward to the opportunity to discuss how my qualifications align with your needs.

Best regards`;

  return NextResponse.json({
    overallScore,
    skillMatch,
    experienceMatch,
    keywordMatch,
    suggestions,
    matchedKeywords: matched,
    missingKeywords: missing,
    coverLetter,
  });
}
