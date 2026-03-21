"use client";

/**
 * @description 发票表单组件
 */

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { QuoteLineItem, InvoiceStatus } from "@/types";
import { useClientStore } from "@/store/clientStore";
import { useProjectStore } from "@/store/projectStore";
import { useQuoteStore } from "@/store/quoteStore";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

interface InvoiceFormProps {
  initialData?: {
    quoteId?: string;
    projectId: string;
    clientId: string;
    items: QuoteLineItem[];
    taxRate: number;
    status: InvoiceStatus;
    dueDate: string;
    notes: string;
  };
  onSubmit: (data: {
    quoteId?: string;
    projectId: string;
    clientId: string;
    items: QuoteLineItem[];
    taxRate: number;
    status: InvoiceStatus;
    dueDate: string;
    notes: string;
  }) => void;
  onCancel: () => void;
}

/**
 * @description 发票表单
 * @param {InvoiceFormProps} props
 */
export function InvoiceForm({ initialData, onSubmit, onCancel }: InvoiceFormProps) {
  const { clients } = useClientStore();
  const { projects } = useProjectStore();
  const { quotes } = useQuoteStore();

  const [projectId, setProjectId] = useState(initialData?.projectId || "");
  const [clientId, setClientId] = useState(initialData?.clientId || "");
  const [quoteId, setQuoteId] = useState(initialData?.quoteId || "");
  const [items, setItems] = useState<QuoteLineItem[]>(initialData?.items || []);
  const [taxRate, setTaxRate] = useState(initialData?.taxRate?.toString() || "10");
  const [status, setStatus] = useState<InvoiceStatus>(initialData?.status || "draft");
  const [dueDate, setDueDate] = useState(initialData?.dueDate || "");
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

  const quoteOptions = [
    { value: "", label: "不关联报价单" },
    ...quotes
      .filter((q) => q.status === "accepted" && (!projectId || q.projectId === projectId))
      .map((q) => ({ value: q.id, label: `报价单 - $${q.total.toFixed(2)}` })),
  ];

  /** @description 从已接受的报价单导入行项 */
  const importFromQuote = (qId: string) => {
    const quote = quotes.find((q) => q.id === qId);
    if (quote) {
      setItems(quote.items.map((i) => ({ ...i, id: crypto.randomUUID() })));
      setTaxRate(quote.taxRate.toString());
      setClientId(quote.clientId);
      setProjectId(quote.projectId);
    }
  };

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
    setItems(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      quoteId: quoteId || undefined,
      projectId,
      clientId,
      items,
      taxRate: parseFloat(taxRate) || 0,
      status,
      dueDate,
      notes,
    });
  };

  const subtotal = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        label="从报价单导入"
        value={quoteId}
        onChange={(e) => {
          setQuoteId(e.target.value);
          if (e.target.value) importFromQuote(e.target.value);
        }}
        options={quoteOptions}
      />

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
        <h3 className="text-sm font-semibold text-text dark:text-text-dark">发票明细</h3>
        <Button type="button" variant="ghost" size="sm" onClick={addItem}>
          <Plus className="h-3 w-3" />
          添加行
        </Button>
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
              />
            </div>
            <div className="w-28">
              <Input
                type="number"
                placeholder="单价"
                value={item.unitPrice}
                onChange={(e) => updateItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)}
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
        />
        <Input
          label="到期日"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>

      <Select
        label="状态"
        value={status}
        onChange={(e) => setStatus(e.target.value as InvoiceStatus)}
        options={[
          { value: "draft", label: "草稿" },
          { value: "sent", label: "已发送" },
          { value: "paid", label: "已支付" },
          { value: "overdue", label: "已逾期" },
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
        <Button type="submit">{initialData ? "更新" : "创建"}发票</Button>
      </div>
    </form>
  );
}
