/**
 * @fileoverview 回复生成引擎单元测试
 */

import {
  buildQuoteSection,
  buildClauseSection,
  generateReply,
} from "@/lib/generator";
import type { AnalysisResult, RateStandard, ContractClause } from "@/types";

/** 测试用分析结果 */
const mockHighRiskAnalysis: AnalysisResult = {
  id: "test-1",
  originalMessage: "帮我免费做个网站",
  riskLevel: "high",
  riskScore: 85,
  suggestedResponse: "reject",
  redFlags: [
    { keyword: "免费", weight: 0.9, description: "明确要求免费服务" },
  ],
  summary: "高风险消息",
  createdAt: new Date().toISOString(),
};

const mockMediumRiskAnalysis: AnalysisResult = {
  ...mockHighRiskAnalysis,
  id: "test-2",
  riskLevel: "medium",
  riskScore: 50,
  suggestedResponse: "negotiate",
};

const mockLowRiskAnalysis: AnalysisResult = {
  ...mockHighRiskAnalysis,
  id: "test-3",
  riskLevel: "low",
  riskScore: 15,
  suggestedResponse: "accept",
  redFlags: [],
};

/** 测试用费率标准 */
const mockRates: RateStandard[] = [
  {
    id: "rate-1",
    serviceName: "网站设计",
    category: "design",
    hourlyRate: 500,
    minimumProjectFee: 5000,
    currency: "CNY",
    notes: "",
    createdAt: new Date().toISOString(),
  },
];

/** 测试用合同条款 */
const mockClauses: ContractClause[] = [
  {
    id: "clause-1",
    title: "预付款条款",
    content: "需支付 50% 预付款",
    isDefault: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "clause-2",
    title: "修改次数",
    content: "包含 2 次免费修改",
    isDefault: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "clause-3",
    title: "加急费",
    content: "加收 30%",
    isDefault: false,
    createdAt: new Date().toISOString(),
  },
];

describe("buildQuoteSection", () => {
  it("有费率时返回格式化的报价", () => {
    const quote = buildQuoteSection(mockRates);
    expect(quote).toContain("网站设计");
    expect(quote).toContain("时薪");
    expect(quote).toContain("最低");
  });

  it("无费率时返回默认文本", () => {
    const quote = buildQuoteSection([]);
    expect(quote).toContain("另行协商");
  });
});

describe("buildClauseSection", () => {
  it("应只包含默认条款", () => {
    const section = buildClauseSection(mockClauses);
    expect(section).toContain("预付款条款");
    expect(section).toContain("修改次数");
    expect(section).not.toContain("加急费");
  });

  it("无默认条款时返回标准文本", () => {
    const section = buildClauseSection([
      { ...mockClauses[2], isDefault: false },
    ]);
    expect(section).toBe("标准合作条款");
  });

  it("空数组时返回标准文本", () => {
    expect(buildClauseSection([])).toBe("标准合作条款");
  });
});

describe("generateReply", () => {
  const baseOptions = {
    tone: "formal" as const,
    displayName: "测试公司",
    rates: mockRates,
    clauses: mockClauses,
  };

  it("高风险分析应自动生成拒绝回复", () => {
    const reply = generateReply(mockHighRiskAnalysis, baseOptions);
    expect(reply.type).toBe("reject");
    expect(reply.analysisId).toBe("test-1");
    expect(reply.body).toContain("测试公司");
    expect(reply.tone).toBe("formal");
    expect(reply.id).toBeTruthy();
    expect(reply.createdAt).toBeTruthy();
  });

  it("中风险分析应自动生成协商回复", () => {
    const reply = generateReply(mockMediumRiskAnalysis, baseOptions);
    expect(reply.type).toBe("negotiate");
    expect(reply.body).toContain("网站设计");
  });

  it("低风险分析应自动生成接受回复", () => {
    const reply = generateReply(mockLowRiskAnalysis, baseOptions);
    expect(reply.type).toBe("accept");
  });

  it("可以覆盖响应类型", () => {
    const reply = generateReply(mockHighRiskAnalysis, baseOptions, "negotiate");
    expect(reply.type).toBe("negotiate");
  });

  it("友好语气应包含 emoji", () => {
    const reply = generateReply(mockHighRiskAnalysis, {
      ...baseOptions,
      tone: "friendly",
    });
    expect(reply.tone).toBe("friendly");
  });

  it("无费率时协商回复仍可生成", () => {
    const reply = generateReply(mockMediumRiskAnalysis, {
      ...baseOptions,
      rates: [],
    });
    expect(reply.type).toBe("negotiate");
    expect(reply.body).toContain("另行协商");
  });

  it("每次调用生成不同 ID", () => {
    const reply1 = generateReply(mockHighRiskAnalysis, baseOptions);
    const reply2 = generateReply(mockHighRiskAnalysis, baseOptions);
    expect(reply1.id).not.toBe(reply2.id);
  });
});
