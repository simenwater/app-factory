/**
 * @fileoverview 配置文件解析器基类
 * @description 所有具体解析器的抽象基类，定义解析接口
 */

import { ConfigSource, Directive, DirectiveCategory, ParsedConfig } from '../core/types';

/** 解析器基类 */
export abstract class BaseParser {
  /** 配置来源标识 */
  abstract readonly source: ConfigSource;

  /** 支持的文件名模式 */
  abstract readonly filePatterns: string[];

  /**
   * 解析配置文件内容
   * @param content - 文件原始内容
   * @param filePath - 文件路径
   * @returns 解析后的配置对象
   */
  abstract parse(content: string, filePath: string): ParsedConfig;

  /**
   * 检测文件是否匹配此解析器
   * @param filePath - 文件路径
   * @returns 是否匹配
   */
  matches(filePath: string): boolean {
    const normalizedPath = filePath.replace(/\\/g, '/');
    return this.filePatterns.some(pattern => {
      if (pattern.startsWith('**/')) {
        return normalizedPath.endsWith(pattern.slice(3));
      }
      return normalizedPath.endsWith(pattern);
    });
  }

  /**
   * 基于关键词智能分类指令
   * @param content - 指令文本内容
   * @returns 推断的指令类别
   */
  protected categorize(content: string): DirectiveCategory {
    const lower = content.toLowerCase();

    const categoryKeywords: Record<DirectiveCategory, string[]> = {
      [DirectiveCategory.CODE_STYLE]: [
        'style', 'format', 'indent', 'naming', 'convention', 'lint',
        'prettier', 'eslint', 'camelcase', 'snake_case',
      ],
      [DirectiveCategory.ARCHITECTURE]: [
        'architecture', 'pattern', 'structure', 'module', 'layer',
        'component', 'service', 'repository', 'mvc', 'mvvm',
      ],
      [DirectiveCategory.TESTING]: [
        'test', 'spec', 'jest', 'mocha', 'coverage', 'unit test',
        'integration', 'e2e', 'mock', 'assert',
      ],
      [DirectiveCategory.DOCUMENTATION]: [
        'document', 'comment', 'jsdoc', 'readme', 'changelog',
        'api doc', 'swagger', 'typedoc',
      ],
      [DirectiveCategory.WORKFLOW]: [
        'workflow', 'git', 'commit', 'branch', 'ci', 'cd', 'deploy',
        'pipeline', 'review', 'merge',
      ],
      [DirectiveCategory.DEPENDENCIES]: [
        'dependency', 'package', 'npm', 'yarn', 'pip', 'version',
        'upgrade', 'install', 'module',
      ],
      [DirectiveCategory.SECURITY]: [
        'security', 'auth', 'encrypt', 'token', 'secret', 'csrf',
        'xss', 'sql injection', 'sanitize', 'validate',
      ],
      [DirectiveCategory.PERFORMANCE]: [
        'performance', 'optimize', 'cache', 'lazy', 'bundle',
        'minify', 'compress', 'memory', 'speed',
      ],
      [DirectiveCategory.GENERAL]: [],
    };

    let bestCategory = DirectiveCategory.GENERAL;
    let maxScore = 0;

    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (category === DirectiveCategory.GENERAL) continue;
      const score = keywords.filter(kw => lower.includes(kw)).length;
      if (score > maxScore) {
        maxScore = score;
        bestCategory = category as DirectiveCategory;
      }
    }

    return bestCategory;
  }

  /**
   * 将 Markdown 内容拆分为指令列表
   * @param content - Markdown 内容
   * @param source - 配置来源
   * @returns 指令数组
   */
  protected extractDirectives(content: string, source: ConfigSource): Directive[] {
    const directives: Directive[] = [];
    const lines = content.split('\n');
    let currentBlock = '';
    let blockStartLine = 0;
    let inCodeBlock = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.trim().startsWith('```')) {
        inCodeBlock = !inCodeBlock;
        currentBlock += line + '\n';
        continue;
      }

      if (inCodeBlock) {
        currentBlock += line + '\n';
        continue;
      }

      if (line.startsWith('#') || (line.trim() === '' && currentBlock.trim())) {
        if (currentBlock.trim()) {
          directives.push({
            content: currentBlock.trim(),
            category: this.categorize(currentBlock),
            source,
            priority: 5,
            lineNumber: blockStartLine + 1,
          });
        }
        currentBlock = line.startsWith('#') ? '' : '';
        if (line.startsWith('#')) {
          blockStartLine = i;
        }
      } else {
        if (!currentBlock) {
          blockStartLine = i;
        }
        currentBlock += line + '\n';
      }
    }

    if (currentBlock.trim()) {
      directives.push({
        content: currentBlock.trim(),
        category: this.categorize(currentBlock),
        source,
        priority: 5,
        lineNumber: blockStartLine + 1,
      });
    }

    return directives;
  }
}
