"use client";

/**
 * @description 财务面板组件 — 收入追踪与税务估算
 */

import { useMemo, useState } from "react";
import { DollarSign, TrendingUp, Receipt, Calculator } from "lucide-react";
import { useFinanceStore } from "@/store/financeStore";
import { useInvoiceStore } from "@/store/invoiceStore";
import { formatCurrency } from "@/lib/utils";
import { estimateQuarterlyTax } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

/**
 * @description 财务仪表盘
 */
export function FinanceDashboard() {
  const { records, expenses, setExpenses, getMonthlyBreakdown, getIncomeByCategory } = useFinanceStore();
  const { invoices, getTotalRevenue, getPaidInvoices } = useInvoiceStore();
  const [selectedYear] = useState(new Date().getFullYear());

  const totalIncome = useMemo(() => getTotalRevenue(), [invoices, getTotalRevenue]);
  const paidInvoices = useMemo(() => getPaidInvoices(), [invoices, getPaidInvoices]);
  const monthlyData = useMemo(() => getMonthlyBreakdown(selectedYear), [records, selectedYear, getMonthlyBreakdown]);
  const categoryData = useMemo(() => getIncomeByCategory(), [records, getIncomeByCategory]);
  const taxEstimate = useMemo(() => estimateQuarterlyTax(totalIncome, expenses), [totalIncome, expenses]);

  const pendingAmount = invoices
    .filter((i) => i.status === "sent" || i.status === "overdue")
    .reduce((sum, i) => sum + i.total, 0);

  const maxMonthly = Math.max(...monthlyData.map((m) => m.income), 1);

  const MONTHS = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text dark:text-text-dark">财务面板</h1>
        <p className="text-sm text-text-muted dark:text-text-muted-dark">
          收入追踪与税务估算
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="flex items-center gap-4">
          <div className="rounded-xl bg-success/10 p-3">
            <DollarSign className="h-6 w-6 text-success" />
          </div>
          <div>
            <p className="text-sm text-text-muted dark:text-text-muted-dark">总收入</p>
            <p className="text-xl font-bold text-text dark:text-text-dark">
              {formatCurrency(totalIncome)}
            </p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="rounded-xl bg-warning/10 p-3">
            <Receipt className="h-6 w-6 text-warning" />
          </div>
          <div>
            <p className="text-sm text-text-muted dark:text-text-muted-dark">待收款</p>
            <p className="text-xl font-bold text-text dark:text-text-dark">
              {formatCurrency(pendingAmount)}
            </p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="rounded-xl bg-primary/10 p-3">
            <TrendingUp className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-text-muted dark:text-text-muted-dark">已支付发票</p>
            <p className="text-xl font-bold text-text dark:text-text-dark">
              {paidInvoices.length}
            </p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="rounded-xl bg-danger/10 p-3">
            <Calculator className="h-6 w-6 text-danger" />
          </div>
          <div>
            <p className="text-sm text-text-muted dark:text-text-muted-dark">季度预估税</p>
            <p className="text-xl font-bold text-text dark:text-text-dark">
              {formatCurrency(taxEstimate.quarterlyPayment)}
            </p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Monthly Income Chart */}
        <Card>
          <h3 className="mb-4 text-sm font-semibold text-text dark:text-text-dark">
            {selectedYear} 年月度收入
          </h3>
          <div className="flex items-end gap-1.5" style={{ height: 180 }}>
            {monthlyData.map((m, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-t bg-primary/80 transition-all hover:bg-primary"
                  style={{
                    height: `${Math.max((m.income / maxMonthly) * 150, 4)}px`,
                  }}
                  title={`${MONTHS[i]}: ${formatCurrency(m.income)}`}
                />
                <span className="text-[10px] text-text-muted dark:text-text-muted-dark">
                  {MONTHS[i]}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Tax Estimator */}
        <Card>
          <h3 className="mb-4 text-sm font-semibold text-text dark:text-text-dark">
            税务估算
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-muted dark:text-text-muted-dark">年收入</span>
              <span className="font-medium text-text dark:text-text-dark">
                {formatCurrency(totalIncome)}
              </span>
            </div>
            <Input
              label="年度支出"
              type="number"
              value={expenses}
              onChange={(e) => setExpenses(parseFloat(e.target.value) || 0)}
              min="0"
              step="100"
            />
            <div className="rounded-lg bg-bg p-3 dark:bg-bg-dark">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-muted dark:text-text-muted-dark">自雇税</span>
                  <span className="text-text dark:text-text-dark">
                    {formatCurrency(taxEstimate.selfEmploymentTax)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted dark:text-text-muted-dark">收入税</span>
                  <span className="text-text dark:text-text-dark">
                    {formatCurrency(taxEstimate.incomeTax)}
                  </span>
                </div>
                <div className="border-t border-border pt-2 dark:border-border-dark">
                  <div className="flex justify-between font-semibold">
                    <span className="text-text dark:text-text-dark">预估年度总税</span>
                    <span className="text-danger">{formatCurrency(taxEstimate.totalTax)}</span>
                  </div>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-text dark:text-text-dark">每季度应缴</span>
                  <span className="text-primary">{formatCurrency(taxEstimate.quarterlyPayment)}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Income by Category */}
        <Card>
          <h3 className="mb-4 text-sm font-semibold text-text dark:text-text-dark">
            收入分类
          </h3>
          {Object.keys(categoryData).length === 0 ? (
            <p className="text-sm text-text-muted dark:text-text-muted-dark">
              当发票标记为已支付后，收入数据将显示在此处
            </p>
          ) : (
            <div className="space-y-3">
              {Object.entries(categoryData).map(([cat, amount]) => (
                <div key={cat}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-text dark:text-text-dark">{cat}</span>
                    <span className="font-medium text-text dark:text-text-dark">
                      {formatCurrency(amount)}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-border dark:bg-border-dark">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{
                        width: `${Math.min((amount / totalIncome) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recent Payments */}
        <Card>
          <h3 className="mb-4 text-sm font-semibold text-text dark:text-text-dark">
            最近收款
          </h3>
          {records.length === 0 ? (
            <p className="text-sm text-text-muted dark:text-text-muted-dark">
              暂无收款记录
            </p>
          ) : (
            <div className="space-y-3">
              {records.slice(-5).reverse().map((record) => (
                <div key={record.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-text dark:text-text-dark">
                      {record.description}
                    </p>
                    <p className="text-xs text-text-muted dark:text-text-muted-dark">
                      {new Date(record.date).toLocaleDateString("zh-CN")}
                    </p>
                  </div>
                  <span className="font-medium text-success">
                    +{formatCurrency(record.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
