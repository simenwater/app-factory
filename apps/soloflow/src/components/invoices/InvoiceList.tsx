"use client";

/**
 * @description 发票列表组件
 */

import { useState } from "react";
import { Plus, FileDown, Trash2, Edit, CheckCircle } from "lucide-react";
import { useInvoiceStore } from "@/store/invoiceStore";
import { useClientStore } from "@/store/clientStore";
import { useProjectStore } from "@/store/projectStore";
import { useFinanceStore } from "@/store/financeStore";
import type { InvoiceStatus } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { generateInvoicePDF } from "@/lib/pdf";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { InvoiceForm } from "./InvoiceForm";

const STATUS_COLORS: Record<InvoiceStatus, string> = {
  draft: "#6b7280",
  sent: "#3b82f6",
  paid: "#10b981",
  overdue: "#ef4444",
  cancelled: "#f59e0b",
};

const STATUS_LABELS: Record<InvoiceStatus, string> = {
  draft: "草稿",
  sent: "已发送",
  paid: "已支付",
  overdue: "已逾期",
  cancelled: "已取消",
};

/**
 * @description 发票列表
 */
export function InvoiceList() {
  const { invoices, addInvoice, updateInvoice, deleteInvoice, markAsPaid } = useInvoiceStore();
  const { getClientById } = useClientStore();
  const { getProjectById } = useProjectStore();
  const { addRecord } = useFinanceStore();
  const [showForm, setShowForm] = useState(false);
  const [editingInvoiceId, setEditingInvoiceId] = useState<string | null>(null);

  const editingInvoice = editingInvoiceId ? invoices.find((i) => i.id === editingInvoiceId) : null;

  const handleSubmit = (data: Parameters<typeof addInvoice>[0]) => {
    if (editingInvoice) {
      updateInvoice(editingInvoice.id, data);
    } else {
      addInvoice(data);
    }
    setShowForm(false);
    setEditingInvoiceId(null);
  };

  const handleMarkPaid = (invoiceId: string) => {
    const invoice = invoices.find((i) => i.id === invoiceId);
    if (!invoice) return;
    markAsPaid(invoiceId);
    addRecord({
      invoiceId,
      amount: invoice.total,
      date: new Date().toISOString(),
      category: "项目收入",
      description: `发票 ${invoice.invoiceNumber} 已支付`,
    });
  };

  const handleExportPDF = async (invoiceId: string) => {
    const invoice = invoices.find((i) => i.id === invoiceId);
    if (!invoice) return;
    const client = getClientById(invoice.clientId);
    if (!client) return;
    await generateInvoicePDF(invoice, client);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text dark:text-text-dark">发票管理</h1>
          <p className="text-sm text-text-muted dark:text-text-muted-dark">
            创建和管理发票
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4" />
          新建发票
        </Button>
      </div>

      {invoices.length === 0 ? (
        <Card className="py-12 text-center">
          <p className="text-text-muted dark:text-text-muted-dark">暂无发票</p>
          <p className="mt-1 text-sm text-text-muted dark:text-text-muted-dark">
            点击上方按钮创建第一张发票
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {invoices.map((invoice) => {
            const client = getClientById(invoice.clientId);
            const project = getProjectById(invoice.projectId);
            return (
              <Card key={invoice.id} className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-sm text-text-muted dark:text-text-muted-dark">
                      {invoice.invoiceNumber}
                    </p>
                    <Badge color={STATUS_COLORS[invoice.status]}>
                      {STATUS_LABELS[invoice.status]}
                    </Badge>
                  </div>
                  <p className="font-medium text-text dark:text-text-dark">
                    {project?.name || "未关联项目"}
                  </p>
                  <p className="text-sm text-text-muted dark:text-text-muted-dark">
                    {client?.name || "未知客户"} · 到期: {formatDate(invoice.dueDate)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-lg font-bold text-text dark:text-text-dark">
                    {formatCurrency(invoice.total)}
                  </p>
                  <div className="flex gap-1">
                    {invoice.status !== "paid" && (
                      <button
                        onClick={() => handleMarkPaid(invoice.id)}
                        className="rounded p-1.5 text-text-muted hover:text-success"
                        title="标记已支付"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setEditingInvoiceId(invoice.id);
                        setShowForm(true);
                      }}
                      className="rounded p-1.5 text-text-muted hover:text-primary"
                      title="编辑"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleExportPDF(invoice.id)}
                      className="rounded p-1.5 text-text-muted hover:text-primary"
                      title="导出 PDF"
                    >
                      <FileDown className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteInvoice(invoice.id)}
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
          setEditingInvoiceId(null);
        }}
        title={editingInvoice ? "编辑发票" : "新建发票"}
      >
        <InvoiceForm
          initialData={
            editingInvoice
              ? {
                  quoteId: editingInvoice.quoteId,
                  projectId: editingInvoice.projectId,
                  clientId: editingInvoice.clientId,
                  items: editingInvoice.items,
                  taxRate: editingInvoice.taxRate,
                  status: editingInvoice.status,
                  dueDate: editingInvoice.dueDate,
                  notes: editingInvoice.notes,
                }
              : undefined
          }
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingInvoiceId(null);
          }}
        />
      </Modal>
    </div>
  );
}
