/**
 * @fileoverview .cursorrules 配置文件解析器
 * @description 解析 Cursor IDE 的项目规则配置文件
 */

import { ConfigSource, Directive, DirectiveCategory, ParsedConfig } from '../core/types';
import { BaseParser } from './base-parser';

export class CursorRulesParser extends BaseParser {
  readonly source = ConfigSource.CURSORRULES;
  readonly filePatterns = ['.cursorrules', '**/.cursorrules'];

  /**
   * 解析 .cursorrules 文件内容
   * @param content - 文件原始内容
   * @param filePath - 文件路径
   * @returns 解析后的配置对象
   */
  parse(content: string, filePath: string): ParsedConfig {
    const directives = this.parseRules(content);
    const techStack = this.extractTechStack(content);

    return {
      source: this.source,
      filePath,
      projectName: this.extractProjectName(filePath),
      description: 'Cursor IDE project rules',
      techStack,
      directives,
      rawContent: content,
    };
  }

  /**
   * 解析规则内容为指令列表
   * @param content - 规则文件内容
   * @returns 指令数组
   */
  private parseRules(content: string): Directive[] {
    const directives: Directive[] = [];
    const lines = content.split('\n');
    let currentRule = '';
    let ruleStartLine = 0;
    let inCodeBlock = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.trim().startsWith('```')) {
        inCodeBlock = !inCodeBlock;
        currentRule += line + '\n';
        continue;
      }

      if (inCodeBlock) {
        currentRule += line + '\n';
        continue;
      }

      const isBullet = /^[\s]*[-*•]\s/.test(line);
      const isNumbered = /^[\s]*\d+[.)]\s/.test(line);
      const isHeader = /^#{1,6}\s/.test(line);
      const isEmpty = line.trim() === '';

      if ((isBullet || isNumbered) && !inCodeBlock) {
        if (currentRule.trim()) {
          directives.push(this.createDirective(currentRule.trim(), ruleStartLine));
        }
        currentRule = line + '\n';
        ruleStartLine = i;
      } else if (isHeader) {
        if (currentRule.trim()) {
          directives.push(this.createDirective(currentRule.trim(), ruleStartLine));
        }
        currentRule = '';
        ruleStartLine = i + 1;
      } else if (isEmpty && currentRule.trim() && !inCodeBlock) {
        directives.push(this.createDirective(currentRule.trim(), ruleStartLine));
        currentRule = '';
      } else {
        if (!currentRule && line.trim()) {
          ruleStartLine = i;
        }
        currentRule += line + '\n';
      }
    }

    if (currentRule.trim()) {
      directives.push(this.createDirective(currentRule.trim(), ruleStartLine));
    }

    return directives;
  }

  /**
   * 创建指令对象
   * @param content - 指令内容
   * @param lineNumber - 行号
   * @returns 指令对象
   */
  private createDirective(content: string, lineNumber: number): Directive {
    return {
      content: content.replace(/^[\s]*[-*•]\s/, '').replace(/^[\s]*\d+[.)]\s/, ''),
      category: this.categorize(content),
      source: this.source,
      priority: this.inferPriority(content),
      lineNumber: lineNumber + 1,
    };
  }

  /**
   * 根据内容推断优先级
   * @param content - 指令内容
   * @returns 优先级 (1-10)
   */
  private inferPriority(content: string): number {
    const lower = content.toLowerCase();
    if (lower.includes('must') || lower.includes('always') || lower.includes('never') || lower.includes('必须')) {
      return 9;
    }
    if (lower.includes('should') || lower.includes('prefer') || lower.includes('建议')) {
      return 7;
    }
    if (lower.includes('can') || lower.includes('may') || lower.includes('optional') || lower.includes('可以')) {
      return 4;
    }
    return 5;
  }

  /**
   * 从文件路径推断项目名
   * @param filePath - 文件路径
   * @returns 项目名称
   */
  private extractProjectName(filePath: string): string {
    const parts = filePath.replace(/\\/g, '/').split('/');
    const ruleIndex = parts.findIndex(p => p === '.cursorrules');
    if (ruleIndex > 0) {
      return parts[ruleIndex - 1];
    }
    return 'Unknown Project';
  }

  /**
   * 从内容中提取技术栈
   * @param content - 文件内容
   * @returns 技术栈数组
   */
  private extractTechStack(content: string): string[] {
    const techStack: string[] = [];
    const knownTechs = [
      'TypeScript', 'JavaScript', 'Python', 'React', 'Vue', 'Angular',
      'Node.js', 'Next.js', 'Express', 'FastAPI', 'Django', 'Rust', 'Go',
    ];

    for (const tech of knownTechs) {
      if (content.includes(tech)) {
        techStack.push(tech);
      }
    }

    return techStack;
  }
}
