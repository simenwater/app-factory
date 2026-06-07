/**
 * @fileoverview 智能合并引擎
 * @description 多来源配置文件的智能合并与冲突检测
 */

import {
  AgentsConfig,
  ConflictType,
  Directive,
  MergeConflict,
  MergeResult,
  MergeStats,
  ParsedConfig,
} from './types';
import { Converter } from './converter';

export class Merger {
  private converter: Converter;

  constructor() {
    this.converter = new Converter();
  }

  /**
   * 合并多个配置文件
   * @param configs - 解析后的配置数组
   * @returns 合并结果 (含冲突信息)
   */
  merge(configs: ParsedConfig[]): MergeResult {
    const allDirectives = configs.flatMap(c => c.directives);
    const conflicts = this.detectConflicts(allDirectives);
    const deduplicatedCount = this.countDuplicates(allDirectives);
    const deduplicated = this.deduplicate(allDirectives);

    const deduplicatedConfigs: ParsedConfig[] = [{
      source: configs[0]?.source || configs[0].source,
      filePath: 'merged',
      projectName: undefined,
      description: undefined,
      techStack: [...new Set(configs.flatMap(c => c.techStack || []))],
      directives: deduplicated,
      rawContent: '',
    }];

    const mergedConfig = this.converter.convertMultiple(configs);
    mergedConfig.sections = mergedConfig.sections.map(section => ({
      ...section,
      directives: this.deduplicate(section.directives),
    }));

    const stats: MergeStats = {
      totalDirectives: allDirectives.length,
      mergedDirectives: deduplicated.length,
      conflictCount: conflicts.length,
      deduplicatedCount,
      sourceCount: configs.length,
    };

    return { config: mergedConfig, conflicts, stats };
  }

  /**
   * 检测指令间的冲突
   * @param directives - 全部指令数组
   * @returns 冲突列表
   */
  detectConflicts(directives: Directive[]): MergeConflict[] {
    const conflicts: MergeConflict[] = [];
    let conflictId = 0;

    for (let i = 0; i < directives.length; i++) {
      for (let j = i + 1; j < directives.length; j++) {
        const a = directives[i];
        const b = directives[j];

        if (a.source === b.source) continue;

        const conflictType = this.checkConflict(a, b);
        if (conflictType) {
          conflicts.push({
            id: `conflict-${++conflictId}`,
            directiveA: a,
            directiveB: b,
            type: conflictType,
            description: this.describeConflict(a, b, conflictType),
            resolution: {
              strategy: conflictType === ConflictType.DUPLICATE ? 'keep_a' : 'manual',
            },
          });
        }
      }
    }

    return conflicts;
  }

  /**
   * 检查两条指令是否存在冲突
   * @param a - 指令A
   * @param b - 指令B
   * @returns 冲突类型或 null
   */
  private checkConflict(a: Directive, b: Directive): ConflictType | null {
    if (a.category !== b.category) return null;

    const similarity = this.computeSimilarity(a.content, b.content);

    if (similarity > 0.9) {
      return ConflictType.DUPLICATE;
    }

    if (similarity > 0.5) {
      if (this.hasContradiction(a.content, b.content)) {
        return ConflictType.CONTRADICTING;
      }
      return ConflictType.OVERLAPPING;
    }

    return null;
  }

  /**
   * 计算两段文本的相似度 (Jaccard 系数)
   * @param textA - 文本A
   * @param textB - 文本B
   * @returns 相似度 (0-1)
   */
  private computeSimilarity(textA: string, textB: string): number {
    const wordsA = new Set(this.tokenize(textA));
    const wordsB = new Set(this.tokenize(textB));

    if (wordsA.size === 0 && wordsB.size === 0) return 1;

    const intersection = new Set([...wordsA].filter(w => wordsB.has(w)));
    const union = new Set([...wordsA, ...wordsB]);

    return intersection.size / union.size;
  }

  /**
   * 文本分词
   * @param text - 输入文本
   * @returns 词元数组
   */
  private tokenize(text: string): string[] {
    return text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2);
  }

  /**
   * 检测两段文本是否包含矛盾
   * @param textA - 文本A
   * @param textB - 文本B
   * @returns 是否矛盾
   */
  private hasContradiction(textA: string, textB: string): boolean {
    const contradictionPairs = [
      ['always', 'never'],
      ['must', 'must not'],
      ['should', 'should not'],
      ['enable', 'disable'],
      ['use', 'avoid'],
      ['allow', 'forbid'],
      ['include', 'exclude'],
    ];

    const lowerA = textA.toLowerCase();
    const lowerB = textB.toLowerCase();

    for (const [pos, neg] of contradictionPairs) {
      if (
        (lowerA.includes(pos) && lowerB.includes(neg)) ||
        (lowerA.includes(neg) && lowerB.includes(pos))
      ) {
        return true;
      }
    }

    return false;
  }

  /**
   * 生成冲突描述
   * @param a - 指令A
   * @param b - 指令B
   * @param type - 冲突类型
   * @returns 冲突描述文本
   */
  private describeConflict(a: Directive, b: Directive, type: ConflictType): string {
    switch (type) {
      case ConflictType.DUPLICATE:
        return `Duplicate directive found in ${a.source} and ${b.source}`;
      case ConflictType.CONTRADICTING:
        return `Contradicting rules between ${a.source} and ${b.source}: "${a.content.slice(0, 50)}..." vs "${b.content.slice(0, 50)}..."`;
      case ConflictType.OVERLAPPING:
        return `Overlapping rules in ${a.source} and ${b.source} for category ${a.category}`;
    }
  }

  /**
   * 去除重复指令
   * @param directives - 原始指令列表
   * @returns 去重后的指令列表
   */
  private deduplicate(directives: Directive[]): Directive[] {
    const unique: Directive[] = [];

    for (const directive of directives) {
      const isDuplicate = unique.some(existing =>
        this.computeSimilarity(existing.content, directive.content) > 0.9
      );
      if (!isDuplicate) {
        unique.push(directive);
      }
    }

    return unique;
  }

  /**
   * 计算重复指令数
   * @param directives - 指令列表
   * @returns 重复数量
   */
  private countDuplicates(directives: Directive[]): number {
    return directives.length - this.deduplicate(directives).length;
  }
}
