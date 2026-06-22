"use client";

/**
 * @fileoverview 费率标准和合同条款管理页
 */

import { useState } from "react";
import {
  DollarSign,
  Plus,
  Trash2,
  FileText,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { EmptyState } from "@/components/EmptyState";
import {
  generateId,
  formatCurrency,
  categoryLabel,
} from "@/lib/utils";
import type { ServiceCategory, Currency } from "@/types";

/** 服务类别选项 */
const CATEGORIES: ServiceCategory[] = [
  "design",
  "development",
  "writing",
  "consulting",
  "marketing",
  "photography",
  "video",
  "translation",
  "other",
];

export default function RatesPage() {
  const {
    rateStandards,
    contractClauses,
    settings,
    addRateStandard,
    removeRateStandard,
    addContractClause,
    removeContractClause,
    updateContractClause,
  } = useStore();

  const [showRateForm, setShowRateForm] = useState(false);
  const [showClauseForm, setShowClauseForm] = useState(false);
  const [expandedClause, setExpandedClause] = useState<string | null>(null);

  // 费率表单状态
  const [rateName, setRateName] = useState("");
  const [rateCategory, setRateCategory] = useState<ServiceCategory>("design");
  const [hourlyRate, setHourlyRate] = useState("");
  const [minFee, setMinFee] = useState("");

  // 条款表单状态
  const [clauseTitle, setClauseTitle] = useState("");
  const [clauseContent, setClauseContent] = useState("");

  /** 添加费率标准 */
  const handleAddRate = () => {
    if (!rateName.trim() || !hourlyRate) return;
    addRateStandard({
      id: generateId(),
      serviceName: rateName.trim(),
      category: rateCategory,
      hourlyRate: parseFloat(hourlyRate),
      minimumProjectFee: parseFloat(minFee) || 0,
      currency: settings.currency as Currency,
      notes: "",
      createdAt: new Date().toISOString(),
    });
    setRateName("");
    setHourlyRate("");
    setMinFee("");
    setShowRateForm(false);
  };

  /** 添加合同条款 */
  const handleAddClause = () => {
    if (!clauseTitle.trim() || !clauseContent.trim()) return;
    addContractClause({
      id: generateId(),
      title: clauseTitle.trim(),
      content: clauseContent.trim(),
      isDefault: false,
      createdAt: new Date().toISOString(),
    });
    setClauseTitle("");
    setClauseContent("");
    setShowClauseForm(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-foreground">费率与条款</h1>

      {/* 费率标准区域 */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <DollarSign size={16} className="text-primary" />
            费率标准
          </h2>
          <button
            onClick={() => setShowRateForm(!showRateForm)}
            className="flex items-center gap-1 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
          >
            {showRateForm ? <X size={14} /> : <Plus size={14} />}
            {showRateForm ? "取消" : "添加"}
          </button>
        </div>

        {/* 添加费率表单 */}
        {showRateForm && (
          <div className="mb-4 space-y-3 rounded-xl bg-surface p-4 border border-border">
            <input
              type="text"
              placeholder="服务名称（如：Logo 设计）"
              value={rateName}
              onChange={(e) => setRateName(e.target.value)}
              className="w-full rounded-lg border border-border bg-background p-2.5 text-sm text-foreground placeholder:text-muted/60 focus:border-primary focus:outline-none"
            />
            <select
              value={rateCategory}
              onChange={(e) => setRateCategory(e.target.value as ServiceCategory)}
              className="w-full rounded-lg border border-border bg-background p-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {categoryLabel(cat)}
                </option>
              ))}
            </select>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="时薪"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                className="rounded-lg border border-border bg-background p-2.5 text-sm text-foreground placeholder:text-muted/60 focus:border-primary focus:outline-none"
              />
              <input
                type="number"
                placeholder="最低项目费"
                value={minFee}
                onChange={(e) => setMinFee(e.target.value)}
                className="rounded-lg border border-border bg-background p-2.5 text-sm text-foreground placeholder:text-muted/60 focus:border-primary focus:outline-none"
              />
            </div>
            <button
              onClick={handleAddRate}
              disabled={!rateName.trim() || !hourlyRate}
              className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-primary-dark active:scale-[0.98] disabled:opacity-50"
            >
              保存费率
            </button>
          </div>
        )}

        {/* 费率列表 */}
        {rateStandards.length === 0 && !showRateForm ? (
          <EmptyState
            icon={DollarSign}
            title="暂无费率标准"
            description="添加你的服务费率，生成报价时将自动引用"
          />
        ) : (
          <div className="space-y-2">
            {rateStandards.map((rate) => (
              <div
                key={rate.id}
                className="group flex items-center justify-between rounded-xl bg-surface p-3 border border-border"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {rate.serviceName}
                  </p>
                  <p className="text-xs text-muted">
                    {categoryLabel(rate.category)} · 时薪{" "}
                    {formatCurrency(rate.hourlyRate, rate.currency)}
                    {rate.minimumProjectFee > 0 &&
                      ` · 最低 ${formatCurrency(rate.minimumProjectFee, rate.currency)}`}
                  </p>
                </div>
                <button
                  onClick={() => removeRateStandard(rate.id)}
                  className="rounded-lg p-1.5 text-muted opacity-0 transition-all hover:bg-danger/10 hover:text-danger group-hover:opacity-100"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 合同条款区域 */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <FileText size={16} className="text-primary" />
            合同条款
          </h2>
          <button
            onClick={() => setShowClauseForm(!showClauseForm)}
            className="flex items-center gap-1 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
          >
            {showClauseForm ? <X size={14} /> : <Plus size={14} />}
            {showClauseForm ? "取消" : "添加"}
          </button>
        </div>

        {/* 添加条款表单 */}
        {showClauseForm && (
          <div className="mb-4 space-y-3 rounded-xl bg-surface p-4 border border-border">
            <input
              type="text"
              placeholder="条款标题"
              value={clauseTitle}
              onChange={(e) => setClauseTitle(e.target.value)}
              className="w-full rounded-lg border border-border bg-background p-2.5 text-sm text-foreground placeholder:text-muted/60 focus:border-primary focus:outline-none"
            />
            <textarea
              placeholder="条款内容"
              value={clauseContent}
              onChange={(e) => setClauseContent(e.target.value)}
              className="w-full resize-none rounded-lg border border-border bg-background p-2.5 text-sm text-foreground placeholder:text-muted/60 focus:border-primary focus:outline-none"
              rows={3}
            />
            <button
              onClick={handleAddClause}
              disabled={!clauseTitle.trim() || !clauseContent.trim()}
              className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-primary-dark active:scale-[0.98] disabled:opacity-50"
            >
              保存条款
            </button>
          </div>
        )}

        {/* 条款列表 */}
        <div className="space-y-2">
          {contractClauses.map((clause) => (
            <div
              key={clause.id}
              className="group rounded-xl bg-surface border border-border overflow-hidden"
            >
              <div
                className="flex cursor-pointer items-center justify-between p-3"
                onClick={() =>
                  setExpandedClause(
                    expandedClause === clause.id ? null : clause.id
                  )
                }
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">
                    {clause.title}
                  </span>
                  {clause.isDefault && (
                    <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                      默认
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {expandedClause === clause.id ? (
                    <ChevronUp size={14} className="text-muted" />
                  ) : (
                    <ChevronDown size={14} className="text-muted" />
                  )}
                </div>
              </div>

              {expandedClause === clause.id && (
                <div className="border-t border-border px-3 pb-3 pt-2">
                  <p className="mb-3 text-sm text-muted leading-relaxed">
                    {clause.content}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateContractClause(clause.id, {
                          isDefault: !clause.isDefault,
                        })
                      }
                      className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted hover:bg-background transition-colors"
                    >
                      {clause.isDefault ? "取消默认" : "设为默认"}
                    </button>
                    <button
                      onClick={() => removeContractClause(clause.id)}
                      className="rounded-lg border border-border px-3 py-1.5 text-xs text-danger hover:bg-danger/10 transition-colors"
                    >
                      删除
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
