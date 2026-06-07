/**
 * @fileoverview 解析器注册表
 * @description 管理所有可用的配置文件解析器
 */

import { BaseParser } from './base-parser';
import { ClaudeParser } from './claude-parser';
import { CopilotParser } from './copilot-parser';
import { CursorRulesParser } from './cursorrules-parser';
import { WindsurfParser } from './windsurf-parser';

export { BaseParser } from './base-parser';
export { ClaudeParser } from './claude-parser';
export { CopilotParser } from './copilot-parser';
export { CursorRulesParser } from './cursorrules-parser';
export { WindsurfParser } from './windsurf-parser';

/**
 * 获取所有已注册的解析器
 * @returns 解析器实例数组
 */
export function getAllParsers(): BaseParser[] {
  return [
    new ClaudeParser(),
    new CursorRulesParser(),
    new CopilotParser(),
    new WindsurfParser(),
  ];
}

/**
 * 根据文件路径查找匹配的解析器
 * @param filePath - 配置文件路径
 * @returns 匹配的解析器或 null
 */
export function findParser(filePath: string): BaseParser | null {
  const parsers = getAllParsers();
  return parsers.find(p => p.matches(filePath)) || null;
}
