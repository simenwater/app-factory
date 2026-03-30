"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { ArrowLeft, Plus, Trash2, Package } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import {
  calculateSubtotal,
  calculateTax,
  calculateTotal,
  formatCurrency,
  generateQuoteNumber,
  getDefaultValidUntil,
} from "@/lib/utils";
import type { QuoteLineItem, CustomerInfo } from "@/types";

/**
 * @description 新建报价单页面
 */
export default function NewQuotePage() {
  const router = useRouter();
  const addQuote = useStore((s) => s.addQuote);
  const services = useStore((s) => s.services);
  const settings = useStore((s) => s.settings);
  const getNextQuoteIndex = useStore((s) => s.getNextQuoteIndex);
  const isFreeLimitReached = useStore((s) => s.isFreeLimitReached);

  const [customer, setCustomer] = useState<CustomerInfo>({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [items, setItems] = useState<QuoteLineItem[]>([]);
  const [notes, setNotes] = useState("");
  const [showServicePicker, setShowServicePicker] = useState(false);

  const subtotal = calculateSubtotal(items);
  const tax = calculateTax(subtotal, settings.taxRate);
  const total = calculateTotal(subtotal, tax);

  /**
   * @description 添加空行项目
   */
  function addEmptyItem() {
    setItems([
      ...items,
      {
        id: uuidv4(),
        description: "",
        quantity: 1,
        unitPrice: 0,
        unit: "次",
      },
    ]);
  }

  /**
   * @description 从服务库添加项目
   */
  function addFromService(serviceId: string) {
    const service = services.find((s) => s.id === serviceId);
    if (!service) return;
    setItems([
      ...items,
      {
        id: uuidv4(),
        serviceId: service.id,
        description: service.name,
        quantity: 1,
        unitPrice: service.unitPrice,
        unit: service.unit,
      },
    ]);
    setShowServicePicker(false);
  }

  /**
   * @description 更新行项目
   */
  function updateItem(id: string, updates: Partial<QuoteLineItem>) {
    setItems(items.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  }

  /**
   * @description 删除行项目
   */
  function removeItem(id: string) {
    setItems(items.filter((item) => item.id !== id));
  }

  /**
   * @description 提交报价单
   */
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!customer.name || items.length === 0) return;

    if (isFreeLimitReached()) {
      alert("免费版报价单数量已达上限，请升级到 Pro 版本");
      return;
    }

    const now = new Date().toISOString();
    addQuote({
      id: uuidv4(),
      quoteNumber: generateQuoteNumber(getNextQuoteIndex()),
      customer,
      items,
      subtotal,
      tax,
      total,
      laborCost: 0,
      materialCost: 0,
      profitMargin: 0,
      status: "draft",
      validUntil: getDefaultValidUntil(),
      notes,
      templateId: "",
      createdAt: now,
      updatedAt: now,
    });

    router.push("/quotes");
  }

  return (
    <div className="px-4 pt-6">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/quotes"
          className="rounded-lg p-2 text-text-muted transition-colors hover:bg-surface dark:hover:bg-surface-dark"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-text dark:text-text-dark">
          新建报价单
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-xl border border-border bg-surface p-4 dark:border-border-dark dark:bg-surface-dark">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
            客户信息
          </h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="客户姓名 *"
              value={customer.name}
              onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
              className="w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-border-dark dark:bg-bg-dark dark:text-text-dark"
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="email"
                placeholder="邮箱"
                value={customer.email}
                onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                className="rounded-lg border border-border bg-bg px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-border-dark dark:bg-bg-dark dark:text-text-dark"
              />
              <input
                type="tel"
                placeholder="电话"
                value={customer.phone}
                onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                className="rounded-lg border border-border bg-bg px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-border-dark dark:bg-bg-dark dark:text-text-dark"
              />
            </div>
            <input
              type="text"
              placeholder="地址"
              value={customer.address}
              onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
              className="w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-border-dark dark:bg-bg-dark dark:text-text-dark"
            />
          </div>
        </section>

        <section className="rounded-xl border border-border bg-surface p-4 dark:border-border-dark dark:bg-surface-dark">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
              服务项目
            </h2>
            <div className="flex gap-2">
              {services.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowServicePicker(!showServicePicker)}
                  className="flex items-center gap-1 rounded-lg border border-primary px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/5"
                >
                  <Package size={14} />
                  从服务库
                </button>
              )}
              <button
                type="button"
                onClick={addEmptyItem}
                className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-primary-dark"
              >
                <Plus size={14} />
                手动添加
              </button>
            </div>
          </div>

          {showServicePicker && (
            <div className="mb-4 rounded-lg border border-border bg-bg p-3 dark:border-border-dark dark:bg-bg-dark">
              <p className="mb-2 text-xs font-medium text-text-muted dark:text-text-muted-dark">
                选择服务项目：
              </p>
              <div className="max-h-40 space-y-2 overflow-y-auto">
                {services.map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => addFromService(service.id)}
                    className="flex w-full items-center justify-between rounded-lg border border-border bg-surface p-2.5 text-left text-sm transition-colors hover:bg-primary/5 dark:border-border-dark dark:bg-surface-dark"
                  >
                    <span className="text-text dark:text-text-dark">{service.name}</span>
                    <span className="text-xs text-primary font-medium">
                      {formatCurrency(service.unitPrice, settings.currency)}/{service.unit}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {items.length === 0 ? (
            <p className="py-6 text-center text-sm text-text-muted dark:text-text-muted-dark">
              请添加至少一项服务
            </p>
          ) : (
            <div className="space-y-3">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-border bg-bg p-3 dark:border-border-dark dark:bg-bg-dark"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-text-muted">
                      项目 {index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="rounded p-1 text-danger transition-colors hover:bg-red-50 dark:hover:bg-red-950"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="服务描述 *"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, { description: e.target.value })}
                    className="mb-2 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary dark:border-border-dark dark:bg-surface-dark dark:text-text-dark"
                    required
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="mb-1 block text-xs text-text-muted">数量</label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(item.id, { quantity: parseFloat(e.target.value) || 0 })
                        }
                        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary dark:border-border-dark dark:bg-surface-dark dark:text-text-dark"
                        min="0"
                        step="0.5"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-text-muted">单价</label>
                      <input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) =>
                          updateItem(item.id, { unitPrice: parseFloat(e.target.value) || 0 })
                        }
                        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary dark:border-border-dark dark:bg-surface-dark dark:text-text-dark"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-text-muted">单位</label>
                      <input
                        type="text"
                        value={item.unit}
                        onChange={(e) => updateItem(item.id, { unit: e.target.value })}
                        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary dark:border-border-dark dark:bg-surface-dark dark:text-text-dark"
                      />
                    </div>
                  </div>
                  <p className="mt-2 text-right text-sm font-medium text-primary">
                    小计：{formatCurrency(item.quantity * item.unitPrice, settings.currency)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-xl border border-border bg-surface p-4 dark:border-border-dark dark:bg-surface-dark">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
            备注
          </h2>
          <textarea
            placeholder="补充说明（可选）"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full resize-none rounded-lg border border-border bg-bg px-3 py-2.5 text-sm outline-none focus:border-primary dark:border-border-dark dark:bg-bg-dark dark:text-text-dark"
          />
        </section>

        {items.length > 0 && (
          <section className="rounded-xl border border-primary/30 bg-primary/5 p-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-text-muted dark:text-text-muted-dark">
                <span>小计</span>
                <span>{formatCurrency(subtotal, settings.currency)}</span>
              </div>
              {settings.taxRate > 0 && (
                <div className="flex justify-between text-text-muted dark:text-text-muted-dark">
                  <span>税 ({settings.taxRate}%)</span>
                  <span>{formatCurrency(tax, settings.currency)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-primary/20 pt-2 text-lg font-bold text-primary">
                <span>总计</span>
                <span>{formatCurrency(total, settings.currency)}</span>
              </div>
            </div>
          </section>
        )}

        <button
          type="submit"
          disabled={!customer.name || items.length === 0}
          className="w-full rounded-xl bg-primary py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
        >
          创建报价单
        </button>
      </form>
    </div>
  );
}
