import { v4 as uuidv4 } from "uuid";

/**
 * @description 生成唯一ID
 */
export function generateId(): string {
  return uuidv4();
}

/**
 * @description 生成发票编号 (INV-YYYYMM-XXXX)
 */
export function generateInvoiceNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const random = String(Math.floor(Math.random() * 10000)).padStart(4, "0");
  return `INV-${year}${month}-${random}`;
}

/**
 * @description 格式化货币
 */
export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

/**
 * @description 格式化日期
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * @description 获取状态对应的颜色类名
 */
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    scheduled: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    in_progress: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    draft: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    sent: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    accepted: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    declined: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    unpaid: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    paid: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    partial: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    overdue: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  };
  return colors[status] ?? "bg-gray-100 text-gray-800";
}

/**
 * @description 判断是否是今天
 */
export function isToday(dateString: string): boolean {
  const date = new Date(dateString);
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}
