/**
 * @fileoverview 配置文件转换器
 * @description 将解析后的配置文件转换为 AGENTS.md 标准格式
 */

import {
  AgentsConfig,
  AgentsSection,
  DirectiveCategory,
  ParsedConfig,
} from './types';

export class Converter {
  /**
   * 将单个解析后的配置转换为 AGENTS.md 格式
   * @param parsed - 解析后的配置对象
   * @returns AGENTS.md 标准配置
   */
  convert(parsed: ParsedConfig): AgentsConfig {
    return this.convertMultiple([parsed]);
  }

  /**
   * 将多个解析后的配置合并转换为 AGENTS.md 格式
   * @param configs - 解析后的配置对象数组
   * @returns AGENTS.md 标准配置
   */
  convertMultiple(configs: ParsedConfig[]): AgentsConfig {
    const projectName = this.resolveProjectName(configs);
    const description = this.resolveDescription(configs);
    const techStack = this.resolveTechStack(configs);
    const sections = this.buildSections(configs);
    const sources = [...new Set(configs.map(c => c.source))];

    return {
      version: '1.0.0',
      projectName,
      description,
      techStack,
      sections,
      sources,
      generatedAt: new Date().toISOString(),
    };
  }

  /**
   * 决定项目名称 (取第一个有效值)
   * @param configs - 配置数组
   * @returns 项目名称
   */
  private resolveProjectName(configs: ParsedConfig[]): string {
    for (const config of configs) {
      if (config.projectName && config.projectName !== 'Unknown Project') {
        return config.projectName;
      }
    }
    return configs[0]?.projectName || 'My Project';
  }

  /**
   * 决定项目描述 (取最长的描述)
   * @param configs - 配置数组
   * @returns 项目描述
   */
  private resolveDescription(configs: ParsedConfig[]): string {
    let best = '';
    for (const config of configs) {
      if (config.description && config.description.length > best.length) {
        best = config.description;
      }
    }
    return best;
  }

  /**
   * 合并所有技术栈 (去重)
   * @param configs - 配置数组
   * @returns 技术栈数组
   */
  private resolveTechStack(configs: ParsedConfig[]): string[] {
    const allTech = new Set<string>();
    for (const config of configs) {
      if (config.techStack) {
        config.techStack.forEach(t => allTech.add(t));
      }
    }
    return [...allTech];
  }

  /**
   * 按类别构建配置段落
   * @param configs - 配置数组
   * @returns 配置段落数组
   */
  private buildSections(configs: ParsedConfig[]): AgentsSection[] {
    const categoryMap = new Map<DirectiveCategory, AgentsSection>();

    const categoryOrder: DirectiveCategory[] = [
      DirectiveCategory.GENERAL,
      DirectiveCategory.CODE_STYLE,
      DirectiveCategory.ARCHITECTURE,
      DirectiveCategory.TESTING,
      DirectiveCategory.DOCUMENTATION,
      DirectiveCategory.WORKFLOW,
      DirectiveCategory.DEPENDENCIES,
      DirectiveCategory.SECURITY,
      DirectiveCategory.PERFORMANCE,
    ];

    for (const category of categoryOrder) {
      categoryMap.set(category, {
        title: this.getCategoryTitle(category),
        category,
        directives: [],
      });
    }

    for (const config of configs) {
      for (const directive of config.directives) {
        const section = categoryMap.get(directive.category);
        if (section) {
          section.directives.push(directive);
        }
      }
    }

    return categoryOrder
      .map(cat => categoryMap.get(cat)!)
      .filter(section => section.directives.length > 0);
  }

  /**
   * 获取类别标题
   * @param category - 指令类别
   * @returns 类别标题
   */
  private getCategoryTitle(category: DirectiveCategory): string {
    const titles: Record<DirectiveCategory, string> = {
      [DirectiveCategory.CODE_STYLE]: 'Code Style & Formatting',
      [DirectiveCategory.ARCHITECTURE]: 'Architecture & Patterns',
      [DirectiveCategory.TESTING]: 'Testing',
      [DirectiveCategory.DOCUMENTATION]: 'Documentation',
      [DirectiveCategory.WORKFLOW]: 'Workflow & CI/CD',
      [DirectiveCategory.DEPENDENCIES]: 'Dependencies',
      [DirectiveCategory.SECURITY]: 'Security',
      [DirectiveCategory.PERFORMANCE]: 'Performance',
      [DirectiveCategory.GENERAL]: 'General Guidelines',
    };
    return titles[category];
  }
}
