/**
 * @fileoverview 简历解析工具函数单元测试
 */
import {
  extractSkills,
  extractEmail,
  extractPhone,
  calculateKeywordMatch,
  parseResumeText,
} from "@/lib/resume";

describe("extractSkills", () => {
  it("should extract known skills from text", () => {
    const text =
      "Experienced developer with JavaScript, React, Node.js and Python skills";
    const skills = extractSkills(text);
    expect(skills).toContain("JavaScript");
    expect(skills).toContain("React");
    expect(skills).toContain("Node.js");
    expect(skills).toContain("Python");
  });

  it("should be case insensitive", () => {
    const text = "worked with PYTHON and javascript";
    const skills = extractSkills(text);
    expect(skills).toContain("Python");
    expect(skills).toContain("JavaScript");
  });

  it("should return empty array for text with no skills", () => {
    const text = "I like cats and dogs";
    const skills = extractSkills(text);
    expect(skills).toHaveLength(0);
  });
});

describe("extractEmail", () => {
  it("should extract a valid email", () => {
    const text = "Contact me at john.doe@example.com for details";
    expect(extractEmail(text)).toBe("john.doe@example.com");
  });

  it("should return undefined if no email found", () => {
    expect(extractEmail("no email here")).toBeUndefined();
  });
});

describe("extractPhone", () => {
  it("should extract a phone number", () => {
    const text = "Phone: +1 (555) 123-4567";
    const phone = extractPhone(text);
    expect(phone).toBeDefined();
    expect(phone!.length).toBeGreaterThan(6);
  });

  it("should return undefined if no phone found", () => {
    expect(extractPhone("abc")).toBeUndefined();
  });
});

describe("calculateKeywordMatch", () => {
  it("should return 100% when all keywords match", () => {
    const result = calculateKeywordMatch(
      ["JavaScript", "React", "Node.js"],
      ["JavaScript", "React", "Node.js"]
    );
    expect(result.score).toBe(100);
    expect(result.matched).toHaveLength(3);
    expect(result.missing).toHaveLength(0);
  });

  it("should return 0% when no keywords match", () => {
    const result = calculateKeywordMatch(
      ["JavaScript", "React"],
      ["Python", "Django"]
    );
    expect(result.score).toBe(0);
    expect(result.matched).toHaveLength(0);
    expect(result.missing).toHaveLength(2);
  });

  it("should handle partial matches", () => {
    const result = calculateKeywordMatch(
      ["JavaScript", "React", "Node.js"],
      ["JavaScript", "React", "Python", "Django"]
    );
    expect(result.score).toBe(50);
    expect(result.matched).toHaveLength(2);
    expect(result.missing).toHaveLength(2);
  });

  it("should handle empty job keywords", () => {
    const result = calculateKeywordMatch(["JavaScript"], []);
    expect(result.score).toBe(0);
    expect(result.matched).toHaveLength(0);
    expect(result.missing).toHaveLength(0);
  });

  it("should be case insensitive", () => {
    const result = calculateKeywordMatch(
      ["javascript", "react"],
      ["JavaScript", "React"]
    );
    expect(result.score).toBe(100);
  });
});

describe("parseResumeText", () => {
  it("should extract name from first line", () => {
    const text = "John Doe\njohn@example.com\nExperienced developer";
    const parsed = parseResumeText(text);
    expect(parsed.name).toBe("John Doe");
  });

  it("should extract email", () => {
    const text = "John Doe\njohn@example.com\nJavaScript developer";
    const parsed = parseResumeText(text);
    expect(parsed.email).toBe("john@example.com");
  });

  it("should extract skills", () => {
    const text = "Expert in JavaScript, React, and Python development";
    const parsed = parseResumeText(text);
    expect(parsed.skills.length).toBeGreaterThan(0);
  });
});
