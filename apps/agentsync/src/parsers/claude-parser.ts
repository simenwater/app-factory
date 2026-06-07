/**
 * @fileoverview CLAUDE.md 配置文件解析器
 * @description 解析 Anthropic Claude 的项目配置文件格式
 */

import { ConfigSource, ParsedConfig } from '../core/types';
import { BaseParser } from './base-parser';

export class ClaudeParser extends BaseParser {
  readonly source = ConfigSource.CLAUDE_MD;
  readonly filePatterns = ['CLAUDE.md', '**/CLAUDE.md'];

  /**
   * 解析 CLAUDE.md 文件内容
   * @param content - 文件原始内容
   * @param filePath - 文件路径
   * @returns 解析后的配置对象
   */
  parse(content: string, filePath: string): ParsedConfig {
    const sections = this.parseSections(content);
    const directives = this.extractDirectives(content, this.source);

    const techStack = this.extractTechStack(content);
    const projectName = this.extractProjectName(content, filePath);
    const description = this.extractDescription(content);

    return {
      source: this.source,
      filePath,
      projectName,
      description,
      techStack,
      directives,
      rawContent: content,
      metadata: {
        sectionCount: String(sections.length),
      },
    };
  }

  /**
   * 提取 Markdown 标题段落
   * @param content - Markdown 内容
   * @returns 段落信息数组
   */
  private parseSections(content: string): Array<{ title: string; content: string; level: number }> {
    const sections: Array<{ title: string; content: string; level: number }> = [];
    const lines = content.split('\n');
    let currentSection: { title: string; content: string; level: number } | null = null;

    for (const line of lines) {
      const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
      if (headerMatch) {
        if (currentSection) {
          sections.push(currentSection);
        }
        currentSection = {
          title: headerMatch[2].trim(),
          content: '',
          level: headerMatch[1].length,
        };
      } else if (currentSection) {
        currentSection.content += line + '\n';
      }
    }

    if (currentSection) {
      sections.push(currentSection);
    }

    return sections;
  }

  /**
   * 从内容中提取技术栈信息
   * @param content - 文件内容
   * @returns 技术栈数组
   */
  private extractTechStack(content: string): string[] {
    const techStack: string[] = [];
    const techPatterns = [
      /(?:tech\s*stack|technologies|框架|技术栈)[:\s]*([^\n]+)/i,
      /(?:using|built with|使用)[:\s]*([^\n]+)/i,
    ];

    for (const pattern of techPatterns) {
      const match = content.match(pattern);
      if (match) {
        const items = match[1].split(/[,，、]/).map(s => s.trim()).filter(Boolean);
        techStack.push(...items);
      }
    }

    const knownTechs = [
      'TypeScript', 'JavaScript', 'Python', 'React', 'Vue', 'Angular',
      'Node.js', 'Next.js', 'Express', 'FastAPI', 'Django', 'Flask',
      'Rust', 'Go', 'Java', 'Swift', 'Kotlin', 'Flutter', 'Docker',
    ];

    for (const tech of knownTechs) {
      if (content.includes(tech) && !techStack.includes(tech)) {
        techStack.push(tech);
      }
    }

    return [...new Set(techStack)];
  }

  /**
   * 从内容或路径中提取项目名称
   * @param content - 文件内容
   * @param filePath - 文件路径
   * @returns 项目名称
   */
  private extractProjectName(content: string, filePath: string): string {
    const titleMatch = content.match(/^#\s+(.+)$/m);
    if (titleMatch) {
      return titleMatch[1].trim();
    }

    const parts = filePath.replace(/\\/g, '/').split('/');
    const mdIndex = parts.findIndex(p => p === 'CLAUDE.md');
    if (mdIndex > 0) {
      return parts[mdIndex - 1];
    }

    return 'Unknown Project';
  }

  /**
   * 提取项目描述
   * @param content - 文件内容
   * @returns 项目描述
   */
  private extractDescription(content: string): string {
    const lines = content.split('\n');
    const firstHeader = lines.findIndex(l => l.startsWith('#'));

    if (firstHeader >= 0 && firstHeader < lines.length - 1) {
      const descLines: string[] = [];
      for (let i = firstHeader + 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('#')) break;
        if (line) descLines.push(line);
        if (descLines.length >= 3) break;
      }
      return descLines.join(' ');
    }

    return '';
  }
}
