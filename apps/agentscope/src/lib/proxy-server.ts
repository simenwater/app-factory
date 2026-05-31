/**
 * @fileoverview 独立代理服务器 - 拦截 AI 编码代理的 HTTP 请求
 *
 * 使用方式: 将 AI 代理的 API Base URL 指向本代理服务器
 * 例如: OPENAI_API_BASE=http://localhost:8787
 *
 * 代理服务器会记录所有请求/响应并转发到真实的 API 端点
 */

import http from "http";
import https from "https";
import { URL } from "url";
import { v4 as uuidv4 } from "uuid";
import {
  detectProvider,
  extractModelFromBody,
  extractTokenUsage,
  calculateCost,
} from "./pricing";
import type { RequestLog, HttpMethod } from "@/types";

const PROXY_PORT = parseInt(process.env.PROXY_PORT || "8787", 10);
const WEB_PORT = parseInt(process.env.PORT || "3000", 10);

/** 日志存储（内存） */
const logs: RequestLog[] = [];

/** 已知 API 端点映射 */
const API_TARGETS: Record<string, string> = {
  openai: "https://api.openai.com",
  anthropic: "https://api.anthropic.com",
  google: "https://generativelanguage.googleapis.com",
};

/**
 * @description 解析请求体
 */
function parseBody(chunks: Buffer[]): unknown {
  try {
    const raw = Buffer.concat(chunks).toString("utf-8");
    return JSON.parse(raw);
  } catch {
    return Buffer.concat(chunks).toString("utf-8");
  }
}

/**
 * @description 确定目标 URL
 */
function resolveTarget(
  req: http.IncomingMessage,
  body: unknown
): string | null {
  const targetHeader = req.headers["x-agentscope-target"];
  if (targetHeader) return String(targetHeader);

  const authHeader = req.headers["authorization"] || "";
  if (
    req.headers["x-api-key"] ||
    req.headers["anthropic-version"]
  ) {
    return API_TARGETS.anthropic;
  }

  if (req.url?.includes("/v1/") && authHeader) {
    return API_TARGETS.openai;
  }

  return null;
}

/**
 * @description 转发请求到目标服务器
 */
function forwardRequest(
  targetBase: string,
  req: http.IncomingMessage,
  bodyBuffer: Buffer
): Promise<{
  statusCode: number;
  headers: Record<string, string>;
  body: unknown;
}> {
  return new Promise((resolve, reject) => {
    const targetUrl = new URL(req.url || "/", targetBase);
    const isHttps = targetUrl.protocol === "https:";
    const transport = isHttps ? https : http;

    const headers = { ...req.headers };
    delete headers["host"];
    delete headers["x-agentscope-target"];
    delete headers["x-agentscope-agent"];
    headers["host"] = targetUrl.hostname;

    const options: http.RequestOptions = {
      hostname: targetUrl.hostname,
      port: targetUrl.port || (isHttps ? 443 : 80),
      path: targetUrl.pathname + targetUrl.search,
      method: req.method,
      headers,
    };

    const proxyReq = transport.request(options, (proxyRes) => {
      const chunks: Buffer[] = [];
      proxyRes.on("data", (chunk: Buffer) => chunks.push(chunk));
      proxyRes.on("end", () => {
        const respHeaders: Record<string, string> = {};
        for (const [key, val] of Object.entries(proxyRes.headers)) {
          if (val) respHeaders[key] = Array.isArray(val) ? val.join(", ") : val;
        }
        resolve({
          statusCode: proxyRes.statusCode || 500,
          headers: respHeaders,
          body: parseBody(chunks),
        });
      });
    });

    proxyReq.on("error", reject);
    proxyReq.write(bodyBuffer);
    proxyReq.end();
  });
}

/**
 * @description 发送日志到 Web UI
 */
async function notifyWebUI(log: RequestLog): Promise<void> {
  try {
    const data = JSON.stringify(log);
    const req = http.request(
      {
        hostname: "localhost",
        port: WEB_PORT,
        path: "/api/logs",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(data),
        },
      },
      () => {}
    );
    req.on("error", () => {});
    req.write(data);
    req.end();
  } catch {
    // Web UI 可能未运行
  }
}

/**
 * @description 创建并启动代理服务器
 */
function startProxy(): void {
  const server = http.createServer(async (req, res) => {
    // 健康检查端点
    if (req.url === "/health") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "ok", logCount: logs.length }));
      return;
    }

    // 日志查询端点
    if (req.url === "/logs" && req.method === "GET") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(logs.slice(0, 100)));
      return;
    }

    const startTime = Date.now();
    const bodyChunks: Buffer[] = [];

    req.on("data", (chunk: Buffer) => bodyChunks.push(chunk));
    req.on("end", async () => {
      const bodyBuffer = Buffer.concat(bodyChunks);
      const requestBody = parseBody(bodyChunks);
      const targetBase = resolveTarget(req, requestBody);

      const logEntry: RequestLog = {
        id: uuidv4(),
        timestamp: startTime,
        provider: detectProvider(targetBase || req.url || ""),
        model: extractModelFromBody(requestBody),
        method: (req.method || "GET") as HttpMethod,
        url: req.url || "",
        requestHeaders: Object.fromEntries(
          Object.entries(req.headers)
            .filter(([, v]) => v !== undefined)
            .map(([k, v]) => [k, Array.isArray(v) ? v.join(", ") : String(v)])
        ),
        requestBody,
        statusCode: null,
        responseHeaders: {},
        responseBody: null,
        status: "pending",
        duration: null,
        inputTokens: null,
        outputTokens: null,
        estimatedCost: null,
        agentName:
          String(req.headers["x-agentscope-agent"] || "unknown"),
        error: null,
      };

      if (!targetBase) {
        logEntry.status = "error";
        logEntry.error = "Cannot determine target API endpoint";
        logEntry.duration = Date.now() - startTime;
        logs.unshift(logEntry);
        await notifyWebUI(logEntry);

        res.writeHead(502, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            error: "AgentScope: Cannot determine target API. Set X-AgentScope-Target header.",
          })
        );
        return;
      }

      try {
        const response = await forwardRequest(
          targetBase,
          req,
          bodyBuffer
        );
        logEntry.statusCode = response.statusCode;
        logEntry.responseHeaders = response.headers;
        logEntry.responseBody = response.body;
        logEntry.duration = Date.now() - startTime;
        logEntry.status =
          response.statusCode >= 400 ? "error" : "completed";

        const tokenUsage = extractTokenUsage(response.body);
        logEntry.inputTokens = tokenUsage.inputTokens;
        logEntry.outputTokens = tokenUsage.outputTokens;

        if (tokenUsage.inputTokens && tokenUsage.outputTokens) {
          logEntry.estimatedCost = calculateCost(
            logEntry.model,
            tokenUsage.inputTokens,
            tokenUsage.outputTokens
          );
        }

        if (logEntry.status === "error") {
          logEntry.error = `HTTP ${response.statusCode}`;
        }

        // 转发响应
        const resHeaders = { ...response.headers };
        delete resHeaders["transfer-encoding"];
        const bodyStr = JSON.stringify(response.body);
        resHeaders["content-length"] = String(
          Buffer.byteLength(bodyStr)
        );
        res.writeHead(response.statusCode, resHeaders);
        res.end(bodyStr);
      } catch (err) {
        logEntry.status = "error";
        logEntry.error =
          err instanceof Error ? err.message : "Unknown proxy error";
        logEntry.duration = Date.now() - startTime;

        res.writeHead(502, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            error: `AgentScope proxy error: ${logEntry.error}`,
          })
        );
      }

      logs.unshift(logEntry);
      if (logs.length > 10000) logs.length = 10000;
      await notifyWebUI(logEntry);
    });
  });

  server.listen(PROXY_PORT, () => {
    console.log(`🔭 AgentScope Proxy Server running on http://localhost:${PROXY_PORT}`);
    console.log(`   Set your AI agent's API base URL to: http://localhost:${PROXY_PORT}`);
    console.log(`   Web UI: http://localhost:${WEB_PORT}`);
  });
}

startProxy();
