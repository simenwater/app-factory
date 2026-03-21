"use client";

/**
 * @description 报价单列表组件
 */

import { useState } from "react";
import { Plus, FileDown, Trash2, Edit } from "lucide-react";
import { useQuoteStore } from "@/store/quoteStore";
import { useClientStore } from "@/store/clientStore";
import { useProjectStore } from "@/store/projectStore";
import type { QuoteStatus } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { generateQuotePDF } from "@/lib/pdf";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { QuoteForm } from "./QuoteForm";

const STATUS_COLORS: Record<QuoteStatus, string> = {
  draft: "#6b7280",
  sent: "#3b82f6",
  accepted: "#10b981",
  rejected: "#ef4444",
  expired: "#f59e0b",
};

const STATUS_LABELS: Record<QuoteStatus, string> = {
  draft: "草稿",
  sent: "已发送",
  accepted: "已接受",
  rejected: "已拒绝",
  expired: "已过期",
};

/**
 * @description 报价单列表
 */
export function QuoteList() {
  const { quotes, addQuote, updateQuote, deleteQuote } = useQuoteStore();
  const { getClientById } = useClientStore();
  const { getProjectById } = useProjectStore();
  const [showForm, setShowForm] = useState(false);
  const [editingQuoteId, setEditingQuoteId] = useState<string | null>(null);

  const editingQuote = editingQuoteId ? quotes.find((q) => q.id === editingQuoteId) : null;

  const handleSubmit = (data: Parameters<typeof addQuote>[0]) => {
    if (editingQuote) {
      updateQuote(editingQuote.id, data);
    } else {
      addQuote(data);
    }
    setShowForm(false);
    setEditingQuoteId(null);
  };

  const handleExportPDF = async (quoteId: string) => {
    const quote = quotes.find((q) => q.id === quoteId);
    if (!quote) return;
    const client = getClientById(quote.clientId);
    if (!client) return;
    await generateQuotePDF(quote, client);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text dark:text-text-dark">报价单</h1>
          <p className="text-sm text-text-muted dark:text-text-muted-dark">
            使用 AI 快速生成报价单
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4" />
          新建报价单
        </Button>
      </div>

      {quotes.length === 0 ? (
        <Card className="py-12 text-center">
          <p className="text-text-muted dark:text-text-muted-dark">暂无报价单</p>
          <p className="mt-1 text-sm text-text-muted dark:text-text-muted-dark">
            点击上方按钮创建第一张报价单
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {quotes.map((quote) => {
            const client = getClientById(quote.clientId);
            const project = getProjectById(quote.projectId);
            return (
              <Card key={quote.id} className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-text dark:text-text-dark">
                      {project?.name || "未关联项目"}
                    </p>
                    <Badge color={STATUS_COLORS[quote.status]}>
                      {STATUS_LABELS[quote.status]}
                    </Badge>
                  </div>
                  <p className="text-sm text-text-muted dark:text-text-muted-dark">
                    {client?.name || "未知客户"} · {formatDate(quote.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-lg font-bold text-text dark:text-text-dark">
                    {formatCurrency(quote.total)}
                  </p>
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        setEditingQuoteId(quote.id);
                        setShowForm(true);
                      }}
                      className="rounded p-1.5 text-text-muted hover:text-primary"
                      title="编辑"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleExportPDF(quote.id)}
                      className="rounded p-1.5 text-text-muted hover:text-primary"
                      title="导出 PDF"
                    >
                      <FileDown className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteQuote(quote.id)}
                      className="rounded p-1.5 text-text-muted hover:text-danger"
                      title="删除"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal
        open={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingQuoteId(null);
        }}
        title={editingQuote ? "编辑报价单" : "新建报价单"}
      >
        <QuoteForm
          initialData={
            editingQuote
              ? {
                  projectId: editingQuote.projectId,
                  clientId: editingQuote.clientId,
                  items: editingQuote.items,
                  taxRate: editingQuote.taxRate,
                  status: editingQuote.status,
                  validUntil: editingQuote.validUntil,
                  notes: editingQuote.notes,
                }
              : undefined
          }
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingQuoteId(null);
          }}
        />
      </Modal>
    </div>
  );
}
