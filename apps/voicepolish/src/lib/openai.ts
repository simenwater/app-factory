import OpenAI from "openai";

let openaiInstance: OpenAI | null = null;

/**
 * @function getOpenAI
 * 获取 OpenAI SDK 实例（延迟初始化，避免构建时报错）
 * @returns {OpenAI} OpenAI 实例
 */
export function getOpenAI(): OpenAI {
  if (!openaiInstance) {
    openaiInstance = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openaiInstance;
}
