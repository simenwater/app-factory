"use client";

import { Plus, Trash2, Copy, Check } from "lucide-react";
import { useState } from "react";
import { useAppStore } from "@/store";
import {
  calculateTotal,
  formatCurrency,
  generateQuoteText,
  SERVICE_PRESETS,
  calculateItemSubtotal,
} from "@/lib/quote-generator";

/**
 * @description 付费报价单构建组件
 */
export function QuoteBuilder() {
  const { quote, updateQuote, addQuoteItem, removeQuoteItem, updateQuoteItem, loadPreset } =
    useAppStore();
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const total = calculateTotal(quote.items);

  const handleCopyQuote = async () => {
    const text = generateQuoteText(quote);
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Build a Quote</h2>
        <p className="text-(--color-muted)">
          Create a professional quote to send alongside your rejection, converting free requests
          into paid opportunities.
        </p>
      </div>

      {/* Presets */}
      <div>
        <label className="block text-sm font-medium mb-2">Quick Start Templates</label>
        <div className="flex flex-wrap gap-2">
          {SERVICE_PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => loadPreset(preset.items)}
              className="px-3 py-1.5 text-sm rounded-lg border border-(--color-border) hover:border-(--color-primary) hover:text-(--color-primary) transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Client Info */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-1">Client Name</label>
          <input
            type="text"
            value={quote.clientName}
            onChange={(e) => updateQuote({ clientName: e.target.value })}
            placeholder="Client name"
            className="w-full p-3 rounded-xl border border-(--color-border) bg-(--color-surface) text-sm focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Project Name</label>
          <input
            type="text"
            value={quote.projectName}
            onChange={(e) => updateQuote({ projectName: e.target.value })}
            placeholder="Project name"
            className="w-full p-3 rounded-xl border border-(--color-border) bg-(--color-surface) text-sm focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
          />
        </div>
      </div>

      {/* Quote Items */}
      <div className="space-y-3">
        <label className="block text-sm font-medium">Services</label>
        {quote.items.map((item, index) => (
          <div
            key={item.id}
            className="p-4 rounded-xl border border-(--color-border) bg-(--color-surface) space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-(--color-muted)">Item {index + 1}</span>
              {quote.items.length > 1 && (
                <button
                  onClick={() => removeQuoteItem(item.id)}
                  className="text-(--color-danger) hover:bg-(--color-danger)/10 p-1 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <input
              type="text"
              value={item.description}
              onChange={(e) => updateQuoteItem(item.id, { description: e.target.value })}
              placeholder="Service description"
              className="w-full p-2 rounded-lg border border-(--color-border) bg-(--color-background) text-sm focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
            />
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs text-(--color-muted) mb-1">Unit Price</label>
                <input
                  type="number"
                  value={item.unitPrice}
                  onChange={(e) =>
                    updateQuoteItem(item.id, { unitPrice: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full p-2 rounded-lg border border-(--color-border) bg-(--color-background) text-sm focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
                />
              </div>
              <div>
                <label className="block text-xs text-(--color-muted) mb-1">Quantity</label>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuoteItem(item.id, { quantity: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full p-2 rounded-lg border border-(--color-border) bg-(--color-background) text-sm focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
                />
              </div>
              <div>
                <label className="block text-xs text-(--color-muted) mb-1">Unit</label>
                <select
                  value={item.unit}
                  onChange={(e) => updateQuoteItem(item.id, { unit: e.target.value })}
                  className="w-full p-2 rounded-lg border border-(--color-border) bg-(--color-background) text-sm focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
                >
                  <option value="hours">hours</option>
                  <option value="days">days</option>
                  <option value="words">words</option>
                  <option value="pages">pages</option>
                  <option value="project">project</option>
                  <option value="rounds">rounds</option>
                  <option value="units">units</option>
                </select>
              </div>
            </div>
            <div className="text-right text-sm text-(--color-muted)">
              Subtotal: {formatCurrency(calculateItemSubtotal(item), quote.currency)}
            </div>
          </div>
        ))}

        <button
          onClick={addQuoteItem}
          className="w-full py-2 border-2 border-dashed border-(--color-border) rounded-xl text-sm text-(--color-muted) hover:border-(--color-primary) hover:text-(--color-primary) transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </button>
      </div>

      {/* Settings */}
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="block text-sm font-medium mb-1">Currency</label>
          <select
            value={quote.currency}
            onChange={(e) => updateQuote({ currency: e.target.value })}
            className="w-full p-3 rounded-xl border border-(--color-border) bg-(--color-surface) text-sm focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="CNY">CNY (¥)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Valid For (days)</label>
          <input
            type="number"
            value={quote.validDays}
            onChange={(e) => updateQuote({ validDays: parseInt(e.target.value) || 30 })}
            className="w-full p-3 rounded-xl border border-(--color-border) bg-(--color-surface) text-sm focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <input
            type="text"
            value={quote.notes}
            onChange={(e) => updateQuote({ notes: e.target.value })}
            placeholder="Additional notes..."
            className="w-full p-3 rounded-xl border border-(--color-border) bg-(--color-surface) text-sm focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
          />
        </div>
      </div>

      {/* Total & Actions */}
      <div className="p-6 rounded-xl bg-(--color-surface) border border-(--color-border)">
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-bold">Total</span>
          <span className="text-2xl font-bold text-(--color-primary)">
            {formatCurrency(total, quote.currency)}
          </span>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex-1 py-3 px-6 border border-(--color-border) rounded-xl font-medium text-sm hover:bg-(--color-background) transition-colors"
          >
            {showPreview ? "Hide Preview" : "Preview Quote"}
          </button>
          <button
            onClick={handleCopyQuote}
            className="flex-1 py-3 px-6 bg-(--color-primary) hover:bg-(--color-primary-hover) text-white rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" /> Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> Copy Quote
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preview */}
      {showPreview && (
        <div className="p-6 rounded-xl bg-(--color-surface) border border-(--color-border)">
          <pre className="text-sm whitespace-pre-wrap font-mono leading-relaxed">
            {generateQuoteText(quote)}
          </pre>
        </div>
      )}
    </div>
  );
}
