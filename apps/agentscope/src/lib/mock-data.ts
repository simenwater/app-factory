/**
 * @fileoverview 模拟数据生成器 - 用于演示和测试
 */

import { v4 as uuidv4 } from "uuid";
import type { RequestLog, Provider } from "@/types";
import { calculateCost } from "./pricing";

const MODELS: { provider: Provider; model: string }[] = [
  { provider: "anthropic", model: "claude-4-sonnet" },
  { provider: "anthropic", model: "claude-3.5-sonnet" },
  { provider: "openai", model: "gpt-4o" },
  { provider: "openai", model: "gpt-4o-mini" },
  { provider: "openai", model: "o3-mini" },
  { provider: "google", model: "gemini-2.0-flash" },
];

const AGENTS = ["Claude Code", "Codex CLI", "Cursor Agent", "Aider", "Cline"];

const PROMPTS = [
  "Refactor the authentication module to use JWT tokens",
  "Write unit tests for the UserService class",
  "Fix the memory leak in the WebSocket handler",
  "Implement pagination for the /api/users endpoint",
  "Add TypeScript types to the legacy JavaScript module",
  "Optimize the database queries in the reporting module",
  "Create a CI/CD pipeline configuration for GitHub Actions",
  "Review and improve error handling across the codebase",
  "Implement rate limiting for the public API endpoints",
  "Add dark mode support to the settings page",
];

/**
 * @description 生成单条模拟日志
 */
function generateMockLog(timestampOffset: number = 0): RequestLog {
  const { provider, model } = MODELS[Math.floor(Math.random() * MODELS.length)];
  const agent = AGENTS[Math.floor(Math.random() * AGENTS.length)];
  const prompt = PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
  const isError = Math.random() < 0.05;
  const inputTokens = Math.floor(Math.random() * 8000) + 500;
  const outputTokens = Math.floor(Math.random() * 4000) + 100;
  const duration = Math.floor(Math.random() * 15000) + 500;

  const cost = calculateCost(model, inputTokens, outputTokens);

  return {
    id: uuidv4(),
    timestamp: Date.now() - timestampOffset,
    provider,
    model,
    method: "POST",
    url: provider === "openai"
      ? "https://api.openai.com/v1/chat/completions"
      : provider === "anthropic"
        ? "https://api.anthropic.com/v1/messages"
        : "https://generativelanguage.googleapis.com/v1/models/generate",
    requestHeaders: {
      "content-type": "application/json",
      authorization: "Bearer sk-***redacted***",
    },
    requestBody: {
      model,
      messages: [
        { role: "system", content: "You are a helpful coding assistant." },
        { role: "user", content: prompt },
      ],
      max_tokens: 4096,
      temperature: 0,
    },
    statusCode: isError ? 429 : 200,
    responseHeaders: {
      "content-type": "application/json",
      "x-request-id": uuidv4(),
    },
    responseBody: isError
      ? { error: { message: "Rate limit exceeded", type: "rate_limit_error" } }
      : {
          id: `chatcmpl-${uuidv4().slice(0, 8)}`,
          choices: [
            {
              message: {
                role: "assistant",
                content: `Here's the implementation for: ${prompt}\n\n\`\`\`typescript\n// Implementation code here...\n\`\`\``,
              },
            },
          ],
          usage: {
            prompt_tokens: inputTokens,
            completion_tokens: outputTokens,
            total_tokens: inputTokens + outputTokens,
          },
        },
    status: isError ? "error" : "completed",
    duration,
    inputTokens: isError ? null : inputTokens,
    outputTokens: isError ? null : outputTokens,
    estimatedCost: isError ? null : cost,
    agentName: agent,
    error: isError ? "Rate limit exceeded" : null,
  };
}

/**
 * @description 生成一批模拟日志
 * @param count - 日志数量
 */
export function generateMockLogs(count: number = 50): RequestLog[] {
  const logs: RequestLog[] = [];
  for (let i = 0; i < count; i++) {
    const offset = Math.floor(Math.random() * 24 * 60 * 60 * 1000);
    logs.push(generateMockLog(offset));
  }
  return logs.sort((a, b) => b.timestamp - a.timestamp);
}
