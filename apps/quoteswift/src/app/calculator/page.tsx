"use client";

import { useState } from "react";
import { Calculator, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { useStore } from "@/store/useStore";
import { calculateProfit, formatCurrency } from "@/lib/utils";

/**
 * @description 利润与成本计算器页面
 */
export default function CalculatorPage() {
  const currency = useStore((s) => s.settings.currency);

  const [revenue, setRevenue] = useState("");
  const [laborCost, setLaborCost] = useState("");
  const [materialCost, setMaterialCost] = useState("");
  const [overhead, setOverhead] = useState("");

  const result = calculateProfit({
    revenue: parseFloat(revenue) || 0,
    laborCost: parseFloat(laborCost) || 0,
    materialCost: parseFloat(materialCost) || 0,
    overhead: parseFloat(overhead) || 0,
  });

  const hasInput = parseFloat(revenue) > 0;
  const isProfit = result.profit >= 0;

  return (
    <div className="px-4 pt-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text dark:text-text-dark">
          利润计算器
        </h1>
        <p className="text-sm text-text-muted dark:text-text-muted-dark">
          快速评估项目盈利能力
        </p>
      </div>

      <section className="mb-6 rounded-xl border border-border bg-surface p-4 dark:border-border-dark dark:bg-surface-dark">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
          <DollarSign size={16} />
          收入
        </h2>
        <div>
          <label className="mb-1 block text-xs text-text-muted dark:text-text-muted-dark">
            报价总金额
          </label>
          <input
            type="number"
            placeholder="0.00"
            value={revenue}
            onChange={(e) => setRevenue(e.target.value)}
            className="w-full rounded-lg border border-border bg-bg px-3 py-3 text-lg font-semibold outline-none focus:border-primary dark:border-border-dark dark:bg-bg-dark dark:text-text-dark"
            min="0"
            step="0.01"
          />
        </div>
      </section>

      <section className="mb-6 rounded-xl border border-border bg-surface p-4 dark:border-border-dark dark:bg-surface-dark">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
          <TrendingDown size={16} />
          成本
        </h2>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs text-text-muted dark:text-text-muted-dark">
              人工成本
            </label>
            <input
              type="number"
              placeholder="0.00"
              value={laborCost}
              onChange={(e) => setLaborCost(e.target.value)}
              className="w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-border-dark dark:bg-bg-dark dark:text-text-dark"
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-text-muted dark:text-text-muted-dark">
              材料成本
            </label>
            <input
              type="number"
              placeholder="0.00"
              value={materialCost}
              onChange={(e) => setMaterialCost(e.target.value)}
              className="w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-border-dark dark:bg-bg-dark dark:text-text-dark"
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-text-muted dark:text-text-muted-dark">
              其他开销（交通、工具等）
            </label>
            <input
              type="number"
              placeholder="0.00"
              value={overhead}
              onChange={(e) => setOverhead(e.target.value)}
              className="w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-border-dark dark:bg-bg-dark dark:text-text-dark"
              min="0"
              step="0.01"
            />
          </div>
        </div>
      </section>

      {hasInput && (
        <section className="mb-6 rounded-xl border border-primary/30 bg-primary/5 p-4">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary">
            <Calculator size={16} />
            计算结果
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-text-muted dark:text-text-muted-dark">收入</span>
              <span className="font-medium text-text dark:text-text-dark">
                {formatCurrency(result.revenue, currency)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-muted dark:text-text-muted-dark">人工成本</span>
              <span className="text-danger">
                -{formatCurrency(result.laborCost, currency)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-muted dark:text-text-muted-dark">材料成本</span>
              <span className="text-danger">
                -{formatCurrency(result.materialCost, currency)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-muted dark:text-text-muted-dark">其他开销</span>
              <span className="text-danger">
                -{formatCurrency(result.overhead, currency)}
              </span>
            </div>
            <div className="flex justify-between border-t border-primary/20 pt-2 text-sm">
              <span className="text-text-muted dark:text-text-muted-dark">总成本</span>
              <span className="font-medium text-text dark:text-text-dark">
                {formatCurrency(result.totalCost, currency)}
              </span>
            </div>
            <div className="flex justify-between border-t border-primary/20 pt-3">
              <span className="flex items-center gap-1.5 text-base font-semibold">
                {isProfit ? (
                  <TrendingUp size={18} className="text-success" />
                ) : (
                  <TrendingDown size={18} className="text-danger" />
                )}
                <span className={isProfit ? "text-success" : "text-danger"}>
                  {isProfit ? "利润" : "亏损"}
                </span>
              </span>
              <span
                className={`text-xl font-bold ${isProfit ? "text-success" : "text-danger"}`}
              >
                {formatCurrency(Math.abs(result.profit), currency)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-muted dark:text-text-muted-dark">利润率</span>
              <span
                className={`font-semibold ${
                  result.profitMargin >= 20
                    ? "text-success"
                    : result.profitMargin >= 0
                    ? "text-warning"
                    : "text-danger"
                }`}
              >
                {result.profitMargin.toFixed(1)}%
              </span>
            </div>
          </div>

          {result.profitMargin < 20 && result.profitMargin >= 0 && (
            <div className="mt-4 rounded-lg bg-warning/10 p-3 text-xs text-warning">
              提示：利润率低于 20%，建议适当提高报价或降低成本。
            </div>
          )}
          {result.profitMargin < 0 && (
            <div className="mt-4 rounded-lg bg-danger/10 p-3 text-xs text-danger">
              警告：该项目处于亏损状态，请重新评估定价或成本。
            </div>
          )}
        </section>
      )}

      <button
        onClick={() => {
          setRevenue("");
          setLaborCost("");
          setMaterialCost("");
          setOverhead("");
        }}
        className="w-full rounded-xl border border-border py-2.5 text-sm text-text-muted transition-colors hover:bg-surface dark:border-border-dark dark:hover:bg-surface-dark"
      >
        清除所有
      </button>
    </div>
  );
}
