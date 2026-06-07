/**
 * @fileoverview GitHub Copilot Instructions 配置文件解析器
 * @description 解析 .github/copilot-instructions.md 格式
 */

import { ConfigSource, ParsedConfig } from '../core/types';
import { BaseParser } from './base-parser';

export class CopilotParser extends BaseParser {
  readonly source = ConfigSource.COPILOT_INSTRUCTIONS;
  readonly filePatterns = [
    '.github/copilot-instructions.md',
    '**/.github/copilot-instructions.md',
  ];

  /**
   * 解析 copilot-instructions.md 文件内容
   * @param content - 文件原始内容
   * @param filePath - 文件路径
   * @returns 解析后的配置对象
   */
  parse(content: string, filePath: string): ParsedConfig {
    const directives = this.extractDirectives(content, this.source);
    const techStack = this.extractTechStackFromContent(content);

    return {
      source: this.source,
      filePath,
      projectName: this.extractProjectName(filePath),
      description: 'GitHub Copilot project instructions',
      techStack,
      directives,
      rawContent: content,
    };
  }

  /**
   * 从路径中提取项目名
   * @param filePath - 文件路径
   * @returns 项目名称
   */
  private extractProjectName(filePath: string): string {
    const parts = filePath.replace(/\\/g, '/').split('/');
    const githubIndex = parts.findIndex(p => p === '.github');
    if (githubIndex > 0) {
      return parts[githubIndex - 1];
    }
    return 'Unknown Project';
  }

  /**
   * 从内容中提取技术栈
   * @param content - 文件内容
   * @returns 技术栈数组
   */
  private extractTechStackFromContent(content: string): string[] {
    const techStack: string[] = [];
    const knownTechs = [
      'TypeScript', 'JavaScript', 'Python', 'React', 'Vue', 'Angular',
      'Node.js', 'Next.js', 'Express', 'FastAPI', 'Django', 'Rust', 'Go',
      'Java', 'Swift', 'Kotlin', 'Flutter', 'Docker',
    ];

    for (const tech of knownTechs) {
      if (content.includes(tech)) {
        techStack.push(tech);
      }
    }

    return techStack;
  }
}
