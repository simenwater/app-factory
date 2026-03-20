/**
 * @description Generate a simple unique ID
 * @returns {string} Unique identifier
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

/**
 * @description Format a currency value
 * @param {number} amount - Amount
 * @param {string} currency - Currency code
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * @description Format a percentage value
 * @param {number} value - Percentage value (e.g. 0.15 = 15%)
 * @returns {string} Formatted percentage string
 */
export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(0)}%`;
}

/**
 * @description Format a date string in MM/DD/YYYY format
 * @param {string} dateStr - ISO date string
 * @returns {string} Formatted date
 */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * @description Convert customer size enum to readable label
 */
export function customerSizeLabel(size: string): string {
  const labels: Record<string, string> = {
    startup: "Startup",
    smb: "SMB",
    mid_market: "Mid-Market",
    enterprise: "Enterprise",
  };
  return labels[size] || size;
}
