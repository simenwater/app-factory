/**
 * @fileoverview 日志导出功能 - 支持 JSON 和 CSV 格式
 */

import type { RequestLog, ExportFormat } from "@/types";

/**
 * @description 将日志导出为指定格式的字符串
 * @param logs - 要导出的日志列表
 * @param format - 导出格式
 * @returns 格式化后的字符串
 */
export function exportLogs(logs: RequestLog[], format: ExportFormat): string {
  if (format === "json") {
    return exportAsJSON(logs);
  }
  return exportAsCSV(logs);
}

/**
 * @description 导出为 JSON 格式
 */
function exportAsJSON(logs: RequestLog[]): string {
  const exportData = logs.map((log) => ({
    id: log.id,
    timestamp: new Date(log.timestamp).toISOString(),
    provider: log.provider,
    model: log.model,
    method: log.method,
    url: log.url,
    statusCode: log.statusCode,
    status: log.status,
    duration: log.duration,
    inputTokens: log.inputTokens,
    outputTokens: log.outputTokens,
    estimatedCost: log.estimatedCost,
    agentName: log.agentName,
    requestBody: log.requestBody,
    responseBody: log.responseBody,
    error: log.error,
  }));
  return JSON.stringify(exportData, null, 2);
}

/**
 * @description 导出为 CSV 格式
 */
function exportAsCSV(logs: RequestLog[]): string {
  const headers = [
    "ID",
    "Timestamp",
    "Provider",
    "Model",
    "Method",
    "URL",
    "Status Code",
    "Status",
    "Duration (ms)",
    "Input Tokens",
    "Output Tokens",
    "Estimated Cost ($)",
    "Agent Name",
    "Error",
  ];

  const rows = logs.map((log) => [
    log.id,
    new Date(log.timestamp).toISOString(),
    log.provider,
    log.model,
    log.method,
    log.url,
    log.statusCode ?? "",
    log.status,
    log.duration ?? "",
    log.inputTokens ?? "",
    log.outputTokens ?? "",
    log.estimatedCost ?? "",
    log.agentName,
    log.error ?? "",
  ]);

  const escapeCsv = (val: unknown): string => {
    const str = String(val);
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const csvLines = [
    headers.map(escapeCsv).join(","),
    ...rows.map((row) => row.map(escapeCsv).join(",")),
  ];

  return csvLines.join("\n");
}

/**
 * @description 触发浏览器下载
 * @param content - 文件内容
 * @param filename - 文件名
 * @param mimeType - MIME 类型
 */
export function downloadFile(
  content: string,
  filename: string,
  mimeType: string
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * @description 导出并下载日志文件
 * @param logs - 要导出的日志列表
 * @param format - 导出格式
 */
export function exportAndDownload(
  logs: RequestLog[],
  format: ExportFormat
): void {
  const content = exportLogs(logs, format);
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const ext = format === "json" ? "json" : "csv";
  const mimeType =
    format === "json" ? "application/json" : "text/csv";
  const filename = `agentscope-logs-${timestamp}.${ext}`;
  downloadFile(content, filename, mimeType);
}
