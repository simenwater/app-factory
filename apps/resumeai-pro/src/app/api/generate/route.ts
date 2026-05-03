import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

/**
 * @description AI 简历生成 API
 * 接收用户自由文本输入和可选的职位描述，返回结构化简历数据。
 * 如果配置了 OPENAI_API_KEY 则调用 OpenAI，否则使用本地规则引擎解析。
 */
export async function POST(req: NextRequest) {
  try {
    const { userInput, jobDescription } = await req.json();

    if (!userInput || typeof userInput !== "string") {
      return NextResponse.json(
        { error: "userInput is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (apiKey) {
      return await generateWithAI(userInput, jobDescription, apiKey);
    }

    return NextResponse.json(parseResumeFromText(userInput));
  } catch (error) {
    console.error("Generate API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * @description 使用 OpenAI API 生成简历
 */
async function generateWithAI(
  userInput: string,
  jobDescription: string | undefined,
  apiKey: string
) {
  const systemPrompt = `You are a professional resume writer. Given a user's input about their background, generate a structured, ATS-friendly resume. Return ONLY valid JSON matching this structure:
{
  "personalInfo": { "fullName": "", "email": "", "phone": "", "location": "", "linkedin": "", "website": "", "summary": "" },
  "workExperience": [{ "company": "", "position": "", "startDate": "", "endDate": "", "current": false, "description": "", "achievements": [] }],
  "education": [{ "institution": "", "degree": "", "field": "", "startDate": "", "endDate": "", "gpa": "" }],
  "skills": [{ "name": "", "level": "intermediate" }],
  "projects": [{ "name": "", "description": "", "technologies": [], "url": "" }]
}
Use action verbs and quantifiable achievements. Optimize for ATS scanning.`;

  const userPrompt = jobDescription
    ? `User input:\n${userInput}\n\nTarget job description:\n${jobDescription}\n\nPlease tailor the resume to match this job description.`
    : `User input:\n${userInput}`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
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
      temperature: 0.7,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error("OpenAI API error:", err);
    return NextResponse.json(parseResumeFromText(userInput));
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  try {
    const parsed = JSON.parse(content);
    const enriched = enrichParsedData(parsed);
    return NextResponse.json(enriched);
  } catch {
    return NextResponse.json(parseResumeFromText(userInput));
  }
}

/**
 * @description 为 AI 返回的数据添加 id 字段
 */
function enrichParsedData(data: Record<string, unknown>) {
  const addIds = <T extends Record<string, unknown>>(items: T[]): (T & { id: string })[] =>
    items?.map((item) => ({ ...item, id: uuidv4() })) ?? [];

  return {
    ...data,
    workExperience: addIds(data.workExperience as Record<string, unknown>[] ?? []),
    education: addIds(data.education as Record<string, unknown>[] ?? []),
    skills: addIds(data.skills as Record<string, unknown>[] ?? []),
    projects: addIds(data.projects as Record<string, unknown>[] ?? []),
  };
}

/**
 * @description 本地规则引擎：从自由文本中提取简历结构化数据
 */
function parseResumeFromText(text: string) {
  const lines = text.split("\n").filter((l) => l.trim());

  const emailMatch = text.match(
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
  );
  const phoneMatch = text.match(
    /[\+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}/
  );
  const nameGuess = lines[0]?.trim() || "";

  const skillKeywords = [
    "JavaScript", "TypeScript", "Python", "Java", "React", "Next.js", "Node.js",
    "Vue.js", "Angular", "SQL", "MongoDB", "PostgreSQL", "AWS", "Docker",
    "Kubernetes", "Git", "CI/CD", "Agile", "REST API", "GraphQL", "HTML",
    "CSS", "Tailwind", "Figma", "Swift", "Kotlin", "Go", "Rust", "C++",
    "Machine Learning", "AI", "Data Analysis", "Excel", "Tableau", "Power BI",
  ];

  const foundSkills = skillKeywords.filter((kw) =>
    text.toLowerCase().includes(kw.toLowerCase())
  );

  return {
    personalInfo: {
      fullName: nameGuess,
      email: emailMatch?.[0] || "",
      phone: phoneMatch?.[0]?.trim() || "",
      location: "",
      linkedin: "",
      website: "",
      summary: lines.length > 1 ? lines.slice(1, 4).join(" ") : "",
    },
    workExperience: [],
    education: [],
    skills: foundSkills.map((s) => ({
      id: uuidv4(),
      name: s,
      level: "intermediate" as const,
    })),
    projects: [],
  };
}
