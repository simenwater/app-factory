import type { Job, Invoice, UserSettings } from "@/types";

/**
 * @description 将二维数组转换为 CSV 字符串（含正确的转义处理）
 * @param {string[][]} rows - 二维数组，每行为一条记录
 * @returns {string} RFC 4180 兼容的 CSV 字符串
 */
function toCSV(rows: string[][]): string {
  return rows
    .map((row) =>
      row
        .map((cell) => {
          const escaped = String(cell ?? "").replace(/"/g, '""');
          return /[",\n\r]/.test(escaped) ? `"${escaped}"` : escaped;
        })
        .join(",")
    )
    .join("\n");
}

/**
 * @description 触发浏览器下载指定内容的文件
 * @param {string} content - 文件内容
 * @param {string} filename - 文件名
 * @param {string} mimeType - MIME 类型
 */
function downloadFile(content: string, filename: string, mimeType: string) {
  const bom = "\uFEFF";
  const blob = new Blob([bom + content], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * @description 导出工作任务为 CSV 文件
 * @param {Job[]} jobs - 工作任务列表
 * @param {UserSettings} settings - 用户设置
 */
export function exportJobsCSV(jobs: Job[], settings: UserSettings): void {
  const header = [
    "Title",
    "Status",
    "Customer",
    "Customer Email",
    "Customer Phone",
    "Location",
    "Scheduled Date",
    "Scheduled Time",
    "Duration (min)",
    `Price (${settings.currency})`,
    "Notes",
    "Created At",
  ];

  const rows = jobs.map((j) => [
    j.title,
    j.status,
    j.customer.name,
    j.customer.email,
    j.customer.phone,
    j.location,
    j.scheduledDate,
    j.scheduledTime,
    String(j.estimatedDuration),
    String(j.price),
    j.notes || "",
    j.createdAt,
  ]);

  const csv = toCSV([header, ...rows]);
  const date = new Date().toISOString().slice(0, 10);
  downloadFile(csv, `fieldflow-jobs-${date}.csv`, "text/csv");
}

/**
 * @description 导出发票为 CSV 文件
 * @param {Invoice[]} invoices - 发票列表
 * @param {UserSettings} settings - 用户设置
 */
export function exportInvoicesCSV(
  invoices: Invoice[],
  settings: UserSettings
): void {
  const header = [
    "Invoice #",
    "Customer",
    "Status",
    "Payment Status",
    `Subtotal (${settings.currency})`,
    `Tax (${settings.currency})`,
    `Total (${settings.currency})`,
    `Paid Amount (${settings.currency})`,
    "Due Date",
    "Paid Date",
    "Items",
    "Created At",
  ];

  const rows = invoices.map((inv) => [
    inv.invoiceNumber,
    inv.customer.name,
    inv.invoiceStatus,
    inv.paymentStatus,
    String(inv.subtotal),
    String(inv.tax),
    String(inv.total),
    String(inv.paidAmount),
    inv.dueDate,
    inv.paidDate || "",
    inv.items.map((i) => `${i.description} x${i.quantity}`).join("; "),
    inv.createdAt,
  ]);

  const csv = toCSV([header, ...rows]);
  const date = new Date().toISOString().slice(0, 10);
  downloadFile(csv, `fieldflow-invoices-${date}.csv`, "text/csv");
}

/**
 * @description 导出所有数据为 CSV（工作 + 发票打包）
 * @param {Job[]} jobs - 工作列表
 * @param {Invoice[]} invoices - 发票列表
 * @param {UserSettings} settings - 用户设置
 */
export function exportAllDataCSV(
  jobs: Job[],
  invoices: Invoice[],
  settings: UserSettings
): void {
  exportJobsCSV(jobs, settings);
  setTimeout(() => exportInvoicesCSV(invoices, settings), 300);
}
