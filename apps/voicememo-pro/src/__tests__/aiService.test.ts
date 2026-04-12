import { buildRewritePrompt, getSystemMessage } from "@/lib/aiService";

describe("buildRewritePrompt", () => {
  it("应该包含原始文本", () => {
    const result = buildRewritePrompt("测试内容", "professional", "linkedin");
    expect(result).toContain("测试内容");
  });

  it("专业风格应包含正式语言要求", () => {
    const result = buildRewritePrompt("内容", "professional", "general");
    expect(result).toContain("专业");
    expect(result).toContain("正式");
  });

  it("休闲风格应包含轻松语言要求", () => {
    const result = buildRewritePrompt("内容", "casual", "general");
    expect(result).toContain("轻松");
    expect(result).toContain("对话式");
  });

  it("营销风格应包含营销语言要求", () => {
    const result = buildRewritePrompt("内容", "marketing", "general");
    expect(result).toContain("感染力");
    expect(result).toContain("营销");
  });

  it("LinkedIn 格式应包含平台要求", () => {
    const result = buildRewritePrompt("内容", "professional", "linkedin");
    expect(result).toContain("LinkedIn");
    expect(result).toContain("3000");
  });

  it("博客格式应包含标题和段落要求", () => {
    const result = buildRewritePrompt("内容", "professional", "blog");
    expect(result).toContain("博客");
    expect(result).toContain("标题");
    expect(result).toContain("Markdown");
  });

  it("邮件格式应包含 CTA 要求", () => {
    const result = buildRewritePrompt("内容", "professional", "email");
    expect(result).toContain("邮件");
    expect(result).toContain("CTA");
  });

  it("推特格式应包含字符限制", () => {
    const result = buildRewritePrompt("内容", "casual", "twitter");
    expect(result).toContain("280");
  });

  it("应包含保留核心思想的规则", () => {
    const result = buildRewritePrompt("测试", "professional", "general");
    expect(result).toContain("保留原文的核心思想");
  });
});

describe("getSystemMessage", () => {
  it("应返回非空字符串", () => {
    const msg = getSystemMessage();
    expect(typeof msg).toBe("string");
    expect(msg.length).toBeGreaterThan(0);
  });

  it("应包含产品名称", () => {
    const msg = getSystemMessage();
    expect(msg).toContain("VoiceMemo Pro");
  });

  it("应描述 AI 助手角色", () => {
    const msg = getSystemMessage();
    expect(msg).toContain("写作助手");
  });
});
