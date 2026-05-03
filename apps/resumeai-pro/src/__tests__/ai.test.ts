import {
  calculateATSScore,
  extractKeywords,
  buildResumeText,
} from "@/lib/ai";
import type { ResumeData } from "@/types";

/**
 * @description 创建测试用简历数据
 */
function createTestResume(overrides?: Partial<ResumeData>): ResumeData {
  return {
    id: "test-1",
    title: "Test Resume",
    personalInfo: {
      fullName: "John Doe",
      email: "john@example.com",
      phone: "+1-234-567-8900",
      location: "San Francisco, CA",
      linkedin: "linkedin.com/in/johndoe",
      website: "johndoe.dev",
      summary:
        "Experienced software engineer with 5 years of experience building scalable web applications using React, TypeScript, and Node.js. Led cross-functional teams to deliver high-impact projects.",
    },
    workExperience: [
      {
        id: "exp-1",
        company: "Tech Corp",
        position: "Senior Software Engineer",
        startDate: "2021-01",
        endDate: "",
        current: true,
        description:
          "Led development of microservices architecture serving 1M+ users.",
        achievements: [
          "Reduced page load time by 40% through code splitting and caching strategies",
          "Mentored 3 junior engineers, improving team velocity by 25%",
        ],
      },
    ],
    education: [
      {
        id: "edu-1",
        institution: "MIT",
        degree: "Bachelor of Science",
        field: "Computer Science",
        startDate: "2014",
        endDate: "2018",
        gpa: "3.8",
      },
    ],
    skills: [
      { id: "s1", name: "React", level: "expert" },
      { id: "s2", name: "TypeScript", level: "expert" },
      { id: "s3", name: "Node.js", level: "advanced" },
      { id: "s4", name: "Python", level: "advanced" },
      { id: "s5", name: "AWS", level: "intermediate" },
      { id: "s6", name: "Docker", level: "intermediate" },
    ],
    projects: [
      {
        id: "p1",
        name: "Open Source CLI Tool",
        description: "A command-line tool for automating deployments.",
        technologies: ["Go", "Docker", "AWS"],
        url: "github.com/johndoe/cli-tool",
      },
    ],
    template: "professional",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    ...overrides,
  };
}

describe("calculateATSScore", () => {
  it("should return a high score for a complete resume", () => {
    const resume = createTestResume();
    const result = calculateATSScore(resume);

    expect(result.overallScore).toBeGreaterThanOrEqual(70);
    expect(result.categories).toHaveLength(6);
    expect(result.suggestions).toBeDefined();
    expect(Array.isArray(result.keywords)).toBe(true);
  });

  it("should return a low score for an empty resume", () => {
    const resume = createTestResume({
      personalInfo: {
        fullName: "",
        email: "",
        phone: "",
        location: "",
        summary: "",
      },
      workExperience: [],
      education: [],
      skills: [],
      projects: [],
    });

    const result = calculateATSScore(resume);
    expect(result.overallScore).toBeLessThan(30);
    expect(result.suggestions.length).toBeGreaterThan(0);
  });

  it("should include keyword matching when job description is provided", () => {
    const resume = createTestResume();
    const jobDesc =
      "Looking for a Senior React Developer with experience in TypeScript, Node.js, and AWS. Must have experience with microservices and CI/CD pipelines.";

    const result = calculateATSScore(resume, jobDesc);

    expect(result.keywords.length).toBeGreaterThan(0);
    const reactKw = result.keywords.find((k) => k.keyword === "react");
    expect(reactKw?.found).toBe(true);
  });

  it("should give full contact info score when all fields are filled", () => {
    const resume = createTestResume();
    const result = calculateATSScore(resume);

    const contactCategory = result.categories.find(
      (c) => c.name === "Contact Information"
    );
    expect(contactCategory?.score).toBe(contactCategory?.maxScore);
  });

  it("should give higher summary score for longer summaries", () => {
    const shortResume = createTestResume({
      personalInfo: {
        ...createTestResume().personalInfo,
        summary: "Short summary.",
      },
    });
    const longResume = createTestResume();

    const shortResult = calculateATSScore(shortResume);
    const longResult = calculateATSScore(longResume);

    const shortSummary = shortResult.categories.find(
      (c) => c.name === "Professional Summary"
    );
    const longSummary = longResult.categories.find(
      (c) => c.name === "Professional Summary"
    );

    expect(longSummary!.score).toBeGreaterThan(shortSummary!.score);
  });
});

describe("extractKeywords", () => {
  it("should extract meaningful keywords from text", () => {
    const text =
      "We are looking for a Senior React Developer with experience in TypeScript and Node.js.";
    const keywords = extractKeywords(text);

    expect(keywords.length).toBeGreaterThan(0);
    expect(keywords).toContain("react");
    expect(keywords).toContain("typescript");
  });

  it("should filter out stop words", () => {
    const text = "the a an and or but in on at to for of with";
    const keywords = extractKeywords(text);

    expect(keywords).toHaveLength(0);
  });

  it("should return up to 20 keywords", () => {
    const longText = Array.from({ length: 50 }, (_, i) => `keyword${i}`)
      .join(" ")
      .repeat(3);
    const keywords = extractKeywords(longText);

    expect(keywords.length).toBeLessThanOrEqual(20);
  });
});

describe("buildResumeText", () => {
  it("should combine all resume sections into text", () => {
    const resume = createTestResume();
    const text = buildResumeText(resume);

    expect(text).toContain("John Doe");
    expect(text).toContain("Senior Software Engineer");
    expect(text).toContain("React");
    expect(text).toContain("Open Source CLI Tool");
    expect(text).toContain("Computer Science");
  });

  it("should handle empty resume data", () => {
    const resume = createTestResume({
      personalInfo: {
        fullName: "",
        email: "",
        phone: "",
        location: "",
        summary: "",
      },
      workExperience: [],
      education: [],
      skills: [],
      projects: [],
    });

    const text = buildResumeText(resume);
    expect(typeof text).toBe("string");
  });
});
