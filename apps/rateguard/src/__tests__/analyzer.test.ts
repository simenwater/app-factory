/**
 * @fileoverview 消息分析引擎单元测试
 */

import {
  detectRedFlags,
  calculateRiskScore,
  determineRiskLevel,
  suggestResponseType,
  generateSummary,
  analyzeMessage,
  RED_FLAG_PATTERNS,
} from "@/lib/analyzer";

describe("detectRedFlags", () => {
  it("应检测到\"免费\"相关的红旗", () => {
    const flags = detectRedFlags("你能免费帮我做个 logo 吗？");
    expect(flags.length).toBeGreaterThan(0);
    expect(flags.some((f) => f.keyword.includes("免费"))).toBe(true);
  });

  it("应检测到英文\"exposure\"红旗", () => {
    const flags = detectRedFlags(
      "I can't pay you but I'll do it for exposure on my social media"
    );
    expect(flags.length).toBeGreaterThan(0);
    expect(flags.some((f) => f.description.includes("曝光"))).toBe(true);
  });

  it("应检测到\"未来合作\"画饼信号", () => {
    const flags = detectRedFlags("先帮我做这个，以后有很多活给你，长期合作");
    expect(flags.some((f) => f.description.includes("未来") || f.description.includes("许诺"))).toBe(true);
  });

  it("应检测到\"赚到钱再付\"的红旗", () => {
    const flags = detectRedFlags("等我赚到钱了再付给你");
    expect(flags.length).toBeGreaterThan(0);
  });

  it("应检测到贬低工作价值的信号", () => {
    const flags = detectRedFlags("This is very simple, shouldn't take long");
    expect(flags.some((f) => f.description.includes("贬低"))).toBe(true);
  });

  it("应检测多个红旗", () => {
    const message =
      "帮我免费做个网站吧，很简单的，以后有很多项目给你做";
    const flags = detectRedFlags(message);
    expect(flags.length).toBeGreaterThanOrEqual(3);
  });

  it("正常消息不应检测到红旗", () => {
    const flags = detectRedFlags(
      "你好，我想请你帮我设计一个公司网站，预算大概在5万左右，方便报个价吗？"
    );
    expect(flags.length).toBe(0);
  });

  it("应处理空消息", () => {
    const flags = detectRedFlags("");
    expect(flags).toEqual([]);
  });
});

describe("calculateRiskScore", () => {
  it("无红旗时返回低分", () => {
    const score = calculateRiskScore([], "正常消息");
    expect(score).toBe(5);
  });

  it("单个高权重红旗应返回高分", () => {
    const flags = [
      { keyword: "免费", weight: 0.9, description: "明确要求免费服务" },
    ];
    const score = calculateRiskScore(flags, "帮我免费做");
    expect(score).toBeGreaterThan(50);
  });

  it("多个红旗应返回较高的分数", () => {
    const multiple = [
      { keyword: "免费", weight: 0.9, description: "明确要求免费服务" },
      { keyword: "很简单", weight: 0.75, description: "贬低工作难度和价值" },
      { keyword: "以后", weight: 0.7, description: "用\"未来合作\"画饼" },
    ];
    const scoreMultiple = calculateRiskScore(
      multiple,
      "免费做，很简单的，以后有活给你"
    );
    expect(scoreMultiple).toBeGreaterThanOrEqual(80);
  });

  it("短消息有额外加成", () => {
    const flags = [
      { keyword: "free", weight: 0.5, description: "要求免费" },
    ];
    const shortScore = calculateRiskScore(flags, "do it free");
    const longScore = calculateRiskScore(
      flags,
      "I was wondering if you could do this for free, I have limited resources but would appreciate any help"
    );
    expect(shortScore).toBeGreaterThan(longScore);
  });

  it("评分不超过 100", () => {
    const manyFlags = Array(10)
      .fill(null)
      .map((_, i) => ({
        keyword: `flag${i}`,
        weight: 1.0,
        description: `test flag ${i}`,
      }));
    const score = calculateRiskScore(manyFlags, "test");
    expect(score).toBeLessThanOrEqual(100);
  });
});

describe("determineRiskLevel", () => {
  it("65+ 应为高风险", () => {
    expect(determineRiskLevel(65)).toBe("high");
    expect(determineRiskLevel(100)).toBe("high");
  });

  it("35-64 应为中风险", () => {
    expect(determineRiskLevel(35)).toBe("medium");
    expect(determineRiskLevel(64)).toBe("medium");
  });

  it("0-34 应为低风险", () => {
    expect(determineRiskLevel(0)).toBe("low");
    expect(determineRiskLevel(34)).toBe("low");
  });
});

describe("suggestResponseType", () => {
  it("高风险建议拒绝", () => {
    expect(suggestResponseType("high", 80)).toBe("reject");
  });

  it("中风险建议协商", () => {
    expect(suggestResponseType("medium", 50)).toBe("negotiate");
  });

  it("低风险建议接受", () => {
    expect(suggestResponseType("low", 20)).toBe("accept");
  });

  it("中风险但评分>=70 仍建议拒绝", () => {
    expect(suggestResponseType("medium", 70)).toBe("reject");
  });
});

describe("generateSummary", () => {
  it("无红旗时返回正常提示", () => {
    const summary = generateSummary([], "low", 5);
    expect(summary).toContain("未检测到");
  });

  it("有红旗时包含评分和警告信号", () => {
    const flags = [
      { keyword: "免费", weight: 0.9, description: "明确要求免费服务" },
      { keyword: "曝光", weight: 0.95, description: "以\"曝光机会\"代替报酬" },
    ];
    const summary = generateSummary(flags, "high", 85);
    expect(summary).toContain("85");
    expect(summary).toContain("2 个警告信号");
  });
});

describe("analyzeMessage (集成)", () => {
  it("应返回完整的分析结果", () => {
    const result = analyzeMessage("你能免费帮我做个网站吗？很简单的");
    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("originalMessage");
    expect(result).toHaveProperty("riskLevel");
    expect(result).toHaveProperty("riskScore");
    expect(result).toHaveProperty("suggestedResponse");
    expect(result).toHaveProperty("redFlags");
    expect(result).toHaveProperty("summary");
    expect(result).toHaveProperty("createdAt");
    expect(result.riskLevel).toBe("high");
    expect(result.redFlags.length).toBeGreaterThanOrEqual(2);
  });

  it("正常消息应返回低风险", () => {
    const result = analyzeMessage(
      "你好，我们公司需要一个新的官网，预算 10 万，能请你们报个价吗？需要包含首页、产品页和联系我们页面。"
    );
    expect(result.riskLevel).toBe("low");
    expect(result.suggestedResponse).toBe("accept");
  });

  it("应去除消息首尾空白", () => {
    const result = analyzeMessage("  免费帮忙做个 logo  ");
    expect(result.originalMessage).toBe("免费帮忙做个 logo");
  });
});

describe("RED_FLAG_PATTERNS", () => {
  it("所有模式的权重在 0-1 之间", () => {
    for (const p of RED_FLAG_PATTERNS) {
      expect(p.weight).toBeGreaterThanOrEqual(0);
      expect(p.weight).toBeLessThanOrEqual(1);
    }
  });

  it("所有模式都有描述", () => {
    for (const p of RED_FLAG_PATTERNS) {
      expect(p.description.length).toBeGreaterThan(0);
    }
  });
});
