/**
 * @fileoverview Zustand Store 单元测试
 */

import { useStore } from "@/store/useStore";
import type { AnalysisResult, GeneratedReply, RateStandard, ContractClause } from "@/types";

/** 在每个测试前重置 store */
beforeEach(() => {
  useStore.getState().resetStore();
});

const mockAnalysis: AnalysisResult = {
  id: "analysis-1",
  originalMessage: "测试消息",
  riskLevel: "high",
  riskScore: 85,
  suggestedResponse: "reject",
  redFlags: [],
  summary: "测试摘要",
  createdAt: new Date().toISOString(),
};

const mockReply: GeneratedReply = {
  id: "reply-1",
  analysisId: "analysis-1",
  type: "reject",
  subject: "测试主题",
  body: "测试正文",
  tone: "formal",
  createdAt: new Date().toISOString(),
};

const mockRate: RateStandard = {
  id: "rate-1",
  serviceName: "网站设计",
  category: "design",
  hourlyRate: 500,
  minimumProjectFee: 5000,
  currency: "CNY",
  notes: "",
  createdAt: new Date().toISOString(),
};

describe("分析历史管理", () => {
  it("添加分析记录", () => {
    useStore.getState().addAnalysis(mockAnalysis);
    expect(useStore.getState().analyses).toHaveLength(1);
    expect(useStore.getState().analyses[0].id).toBe("analysis-1");
  });

  it("新记录插入到头部", () => {
    const second = { ...mockAnalysis, id: "analysis-2" };
    useStore.getState().addAnalysis(mockAnalysis);
    useStore.getState().addAnalysis(second);
    expect(useStore.getState().analyses[0].id).toBe("analysis-2");
  });

  it("删除分析记录同时删除关联回复", () => {
    useStore.getState().addAnalysis(mockAnalysis);
    useStore.getState().addReply(mockReply);
    expect(useStore.getState().replies).toHaveLength(1);

    useStore.getState().removeAnalysis("analysis-1");
    expect(useStore.getState().analyses).toHaveLength(0);
    expect(useStore.getState().replies).toHaveLength(0);
  });
});

describe("回复管理", () => {
  it("添加回复", () => {
    useStore.getState().addReply(mockReply);
    expect(useStore.getState().replies).toHaveLength(1);
  });

  it("删除回复", () => {
    useStore.getState().addReply(mockReply);
    useStore.getState().removeReply("reply-1");
    expect(useStore.getState().replies).toHaveLength(0);
  });
});

describe("费率标准管理", () => {
  it("添加费率", () => {
    useStore.getState().addRateStandard(mockRate);
    expect(useStore.getState().rateStandards).toHaveLength(1);
  });

  it("更新费率", () => {
    useStore.getState().addRateStandard(mockRate);
    useStore.getState().updateRateStandard("rate-1", { hourlyRate: 600 });
    expect(useStore.getState().rateStandards[0].hourlyRate).toBe(600);
  });

  it("删除费率", () => {
    useStore.getState().addRateStandard(mockRate);
    useStore.getState().removeRateStandard("rate-1");
    expect(useStore.getState().rateStandards).toHaveLength(0);
  });
});

describe("合同条款管理", () => {
  it("初始化带有默认条款", () => {
    const clauses = useStore.getState().contractClauses;
    expect(clauses.length).toBeGreaterThan(0);
    expect(clauses.some((c) => c.isDefault)).toBe(true);
  });

  it("添加条款", () => {
    const initial = useStore.getState().contractClauses.length;
    const clause: ContractClause = {
      id: "custom-1",
      title: "自定义条款",
      content: "测试内容",
      isDefault: false,
      createdAt: new Date().toISOString(),
    };
    useStore.getState().addContractClause(clause);
    expect(useStore.getState().contractClauses).toHaveLength(initial + 1);
  });

  it("更新条款默认状态", () => {
    const firstClause = useStore.getState().contractClauses[0];
    const originalDefault = firstClause.isDefault;
    useStore.getState().updateContractClause(firstClause.id, {
      isDefault: !originalDefault,
    });
    expect(
      useStore.getState().contractClauses.find((c) => c.id === firstClause.id)
        ?.isDefault
    ).toBe(!originalDefault);
  });

  it("删除条款", () => {
    const initial = useStore.getState().contractClauses.length;
    const firstId = useStore.getState().contractClauses[0].id;
    useStore.getState().removeContractClause(firstId);
    expect(useStore.getState().contractClauses).toHaveLength(initial - 1);
  });
});

describe("设置管理", () => {
  it("默认设置正确", () => {
    const settings = useStore.getState().settings;
    expect(settings.darkMode).toBe(false);
    expect(settings.currency).toBe("CNY");
    expect(settings.defaultTone).toBe("formal");
    expect(settings.subscriptionTier).toBe("free");
    expect(settings.freeUsesRemaining).toBe(5);
  });

  it("更新设置", () => {
    useStore.getState().updateSettings({ darkMode: true, currency: "USD" });
    const settings = useStore.getState().settings;
    expect(settings.darkMode).toBe(true);
    expect(settings.currency).toBe("USD");
    expect(settings.defaultTone).toBe("formal"); // 未修改的保持不变
  });

  it("减少免费次数", () => {
    useStore.getState().decrementFreeUses();
    expect(useStore.getState().settings.freeUsesRemaining).toBe(4);
  });

  it("免费次数不低于 0", () => {
    for (let i = 0; i < 10; i++) {
      useStore.getState().decrementFreeUses();
    }
    expect(useStore.getState().settings.freeUsesRemaining).toBe(0);
  });
});

describe("重置 Store", () => {
  it("重置后恢复所有默认值", () => {
    useStore.getState().addAnalysis(mockAnalysis);
    useStore.getState().addReply(mockReply);
    useStore.getState().addRateStandard(mockRate);
    useStore.getState().updateSettings({ darkMode: true });

    useStore.getState().resetStore();

    expect(useStore.getState().analyses).toHaveLength(0);
    expect(useStore.getState().replies).toHaveLength(0);
    expect(useStore.getState().rateStandards).toHaveLength(0);
    expect(useStore.getState().settings.darkMode).toBe(false);
    expect(useStore.getState().contractClauses.length).toBeGreaterThan(0);
  });
});
