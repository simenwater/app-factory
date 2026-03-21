"use client";

/**
 * @description 报价单表单组件 — AI 辅助生成报价行项
 */

import { useState } from "react";
import { Sparkles, Plus, Trash2 } from "lucide-react";
import type { QuoteLineItem, QuoteStatus } from "@/types";
import { useClientStore } from "@/store/clientStore";
import { useProjectStore } from "@/store/projectStore";
import { generateQuoteItems } from "@/lib/ai";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

interface QuoteFormProps {
  initialData?: {
    projectId: string;
    clientId: string;
    items: QuoteLineItem[];
    taxRate: number;
    status: QuoteStatus;
    validUntil: string;
    notes: string;
  };
  onSubmit: (data: {
    projectId: string;
    clientId: string;
    items: QuoteLineItem[];
    taxRate: number;
    status: QuoteStatus;
    validUntil: string;
    notes: string;
  }) => void;
  onCancel: () => void;
}

/**
 * @description 报价单表单
 * @param {QuoteFormProps} props
 */
export function QuoteForm({ initialData, onSubmit, onCancel }: QuoteFormProps) {
  const { clients } = useClientStore();
  const { projects } = useProjectStore();

  const [projectId, setProjectId] = useState(initialData?.projectId || "");
  const [clientId, setClientId] = useState(initialData?.clientId || "");
  const [items, setItems] = useState<QuoteLineItem[]>(initialData?.items || []);
  const [taxRate, setTaxRate] = useState(initialData?.taxRate?.toString() || "10");
  const [status, setStatus] = useState<QuoteStatus>(initialData?.status || "draft");
  const [validUntil, setValidUntil] = useState(initialData?.validUntil || "");
  const [notes, setNotes] = useState(initialData?.notes || "");

  const clientOptions = [
    { value: "", label: "选择客户" },
    ...clients.map((c) => ({ value: c.id, label: c.name })),
  ];

  const projectOptions = [
    { value: "", label: "选择项目" },
    ...projects
      .filter((p) => !clientId || p.clientId === clientId)
      .map((p) => ({ value: p.id, label: p.name })),
  ];

  const addItem = () => {
    setItems([
      ...items,
      { id: crypto.randomUUID(), description: "", quantity: 1, unitPrice: 0 },
    ]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const updateItem = (id: string, field: keyof QuoteLineItem, value: string | number) => {
    setItems(
      items.map((i) => (i.id === id ? { ...i, [field]: value } : i))
    );
  };

  /** @description AI 自动生成报价行项 */
  const handleAIGenerate = () => {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;
    const generated = generateQuoteItems(project);
    setItems(generated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      projectId,
      clientId,
      items,
      taxRate: parseFloat(taxRate) || 0,
      status,
      validUntil,
      notes,
    });
  };

  const subtotal = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="客户"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          options={clientOptions}
        />
        <Select
          label="项目"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          options={projectOptions}
        />
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text dark:text-text-dark">报价明细</h3>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleAIGenerate}
            disabled={!projectId}
          >
            <Sparkles className="h-3 w-3" />
            AI 生成
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={addItem}>
            <Plus className="h-3 w-3" />
            添加行
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-end gap-2">
            <div className="flex-1">
              <Input
                placeholder="描述"
                value={item.description}
                onChange={(e) => updateItem(item.id, "description", e.target.value)}
              />
            </div>
            <div className="w-20">
              <Input
                type="number"
                placeholder="数量"
                value={item.quantity}
                onChange={(e) => updateItem(item.id, "quantity", parseFloat(e.target.value) || 0)}
                min="0"
              />
            </div>
            <div className="w-28">
              <Input
                type="number"
                placeholder="单价"
                value={item.unitPrice}
                onChange={(e) => updateItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)}
                min="0"
                step="0.01"
              />
            </div>
            <button
              type="button"
              onClick={() => removeItem(item.id)}
              className="mb-0.5 rounded p-1.5 text-text-muted hover:text-danger"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="rounded-lg bg-bg p-3 text-right text-sm dark:bg-bg-dark">
        <p className="text-text-muted dark:text-text-muted-dark">
          小计: ${subtotal.toFixed(2)}
        </p>
        <p className="text-text-muted dark:text-text-muted-dark">
          税额 ({taxRate}%): ${(subtotal * (parseFloat(taxRate) || 0) / 100).toFixed(2)}
        </p>
        <p className="mt-1 text-lg font-bold text-text dark:text-text-dark">
          总计: ${(subtotal * (1 + (parseFloat(taxRate) || 0) / 100)).toFixed(2)}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="税率 (%)"
          type="number"
          value={taxRate}
          onChange={(e) => setTaxRate(e.target.value)}
          min="0"
          max="100"
        />
        <Input
          label="有效期至"
          type="date"
          value={validUntil}
          onChange={(e) => setValidUntil(e.target.value)}
        />
      </div>

      <Select
        label="状态"
        value={status}
        onChange={(e) => setStatus(e.target.value as QuoteStatus)}
        options={[
          { value: "draft", label: "草稿" },
          { value: "sent", label: "已发送" },
          { value: "accepted", label: "已接受" },
          { value: "rejected", label: "已拒绝" },
        ]}
      />

      <div className="space-y-1">
        <label className="block text-sm font-medium text-text dark:text-text-dark">
          备注
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-border-dark dark:bg-surface-dark dark:text-text-dark"
          placeholder="备注信息..."
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          取消
        </Button>
        <Button type="submit">{initialData ? "更新" : "创建"}报价单</Button>
      </div>
    </form>
  );
}
