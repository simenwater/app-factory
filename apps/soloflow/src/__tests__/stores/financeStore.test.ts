/**
 * @description 财务 Store 单元测试
 */

import { useFinanceStore } from "@/store/financeStore";

beforeEach(() => {
  useFinanceStore.setState({ records: [], expenses: 0 });
});

describe("FinanceStore", () => {
  it("应能添加收入记录", () => {
    const { addRecord } = useFinanceStore.getState();
    addRecord({
      invoiceId: "inv-1",
      amount: 5000,
      date: "2026-03-15T00:00:00.000Z",
      category: "项目收入",
      description: "网站项目款",
    });

    expect(useFinanceStore.getState().records).toHaveLength(1);
    expect(useFinanceStore.getState().records[0].amount).toBe(5000);
  });

  it("应能计算总收入", () => {
    const { addRecord, getTotalIncome } = useFinanceStore.getState();
    addRecord({
      invoiceId: "inv-1",
      amount: 5000,
      date: "2026-01-15T00:00:00.000Z",
      category: "项目收入",
      description: "项目 A",
    });
    addRecord({
      invoiceId: "inv-2",
      amount: 3000,
      date: "2026-02-15T00:00:00.000Z",
      category: "咨询费",
      description: "咨询项目",
    });

    expect(getTotalIncome()).toBe(8000);
  });

  it("应能按月查看收入", () => {
    const { addRecord, getIncomeByMonth } = useFinanceStore.getState();
    addRecord({
      invoiceId: "inv-1",
      amount: 5000,
      date: "2026-01-15T00:00:00.000Z",
      category: "项目收入",
      description: "项目 A",
    });
    addRecord({
      invoiceId: "inv-2",
      amount: 3000,
      date: "2026-01-25T00:00:00.000Z",
      category: "项目收入",
      description: "项目 B",
    });
    addRecord({
      invoiceId: "inv-3",
      amount: 2000,
      date: "2026-02-10T00:00:00.000Z",
      category: "项目收入",
      description: "项目 C",
    });

    expect(getIncomeByMonth(2026, 0)).toBe(8000);
    expect(getIncomeByMonth(2026, 1)).toBe(2000);
    expect(getIncomeByMonth(2026, 2)).toBe(0);
  });

  it("应能按分类统计收入", () => {
    const { addRecord, getIncomeByCategory } = useFinanceStore.getState();
    addRecord({
      invoiceId: "inv-1",
      amount: 5000,
      date: "2026-01-15T00:00:00.000Z",
      category: "项目收入",
      description: "项目 A",
    });
    addRecord({
      invoiceId: "inv-2",
      amount: 3000,
      date: "2026-02-15T00:00:00.000Z",
      category: "咨询费",
      description: "咨询项目",
    });
    addRecord({
      invoiceId: "inv-3",
      amount: 2000,
      date: "2026-03-15T00:00:00.000Z",
      category: "项目收入",
      description: "项目 B",
    });

    const categories = getIncomeByCategory();
    expect(categories["项目收入"]).toBe(7000);
    expect(categories["咨询费"]).toBe(3000);
  });

  it("应能设置年度支出", () => {
    const { setExpenses } = useFinanceStore.getState();
    setExpenses(15000);
    expect(useFinanceStore.getState().expenses).toBe(15000);
  });

  it("应能删除收入记录", () => {
    const { addRecord, deleteRecord } = useFinanceStore.getState();
    addRecord({
      invoiceId: "inv-1",
      amount: 5000,
      date: "2026-01-15T00:00:00.000Z",
      category: "项目收入",
      description: "项目 A",
    });

    const record = useFinanceStore.getState().records[0];
    deleteRecord(record.id);
    expect(useFinanceStore.getState().records).toHaveLength(0);
  });
});
