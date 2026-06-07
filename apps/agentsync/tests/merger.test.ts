/**
 * @fileoverview 合并引擎单元测试
 */

import { Merger } from '../src/core/merger';
import { ConfigSource, ConflictType, DirectiveCategory, ParsedConfig } from '../src/core/types';

describe('Merger', () => {
  const merger = new Merger();

  const config1: ParsedConfig = {
    source: ConfigSource.CLAUDE_MD,
    filePath: '/project/CLAUDE.md',
    projectName: 'Test Project',
    description: 'Main project config',
    techStack: ['TypeScript', 'React'],
    directives: [
      {
        content: 'Always use TypeScript strict mode',
        category: DirectiveCategory.CODE_STYLE,
        source: ConfigSource.CLAUDE_MD,
        priority: 9,
      },
      {
        content: 'Use Jest for unit testing',
        category: DirectiveCategory.TESTING,
        source: ConfigSource.CLAUDE_MD,
        priority: 7,
      },
    ],
    rawContent: '',
  };

  const config2: ParsedConfig = {
    source: ConfigSource.CURSORRULES,
    filePath: '/project/.cursorrules',
    projectName: 'Test Project',
    techStack: ['TypeScript', 'Node.js'],
    directives: [
      {
        content: 'Always use TypeScript strict mode',
        category: DirectiveCategory.CODE_STYLE,
        source: ConfigSource.CURSORRULES,
        priority: 8,
      },
      {
        content: 'Use 2-space indentation for all files',
        category: DirectiveCategory.CODE_STYLE,
        source: ConfigSource.CURSORRULES,
        priority: 6,
      },
    ],
    rawContent: '',
  };

  it('should merge multiple configs', () => {
    const result = merger.merge([config1, config2]);

    expect(result.config).toBeDefined();
    expect(result.stats.sourceCount).toBe(2);
    expect(result.stats.totalDirectives).toBe(4);
  });

  it('should detect duplicate directives', () => {
    const result = merger.merge([config1, config2]);
    expect(result.stats.deduplicatedCount).toBeGreaterThan(0);
  });

  it('should detect conflicts between sources', () => {
    const conflictConfig1: ParsedConfig = {
      source: ConfigSource.CLAUDE_MD,
      filePath: '/CLAUDE.md',
      directives: [
        {
          content: 'Always use semicolons at end of statements',
          category: DirectiveCategory.CODE_STYLE,
          source: ConfigSource.CLAUDE_MD,
          priority: 8,
        },
      ],
      rawContent: '',
    };

    const conflictConfig2: ParsedConfig = {
      source: ConfigSource.CURSORRULES,
      filePath: '/.cursorrules',
      directives: [
        {
          content: 'Never use semicolons at end of statements',
          category: DirectiveCategory.CODE_STYLE,
          source: ConfigSource.CURSORRULES,
          priority: 8,
        },
      ],
      rawContent: '',
    };

    const result = merger.merge([conflictConfig1, conflictConfig2]);
    const contradictions = result.conflicts.filter(
      c => c.type === ConflictType.CONTRADICTING
    );
    expect(contradictions.length).toBeGreaterThan(0);
  });

  it('should produce merge stats', () => {
    const result = merger.merge([config1, config2]);

    expect(result.stats.totalDirectives).toBe(4);
    expect(result.stats.sourceCount).toBe(2);
    expect(result.stats.conflictCount).toBeGreaterThanOrEqual(0);
    expect(result.stats.mergedDirectives).toBeLessThanOrEqual(result.stats.totalDirectives);
  });

  it('should handle single config merge', () => {
    const result = merger.merge([config1]);

    expect(result.stats.sourceCount).toBe(1);
    expect(result.stats.conflictCount).toBe(0);
    expect(result.stats.deduplicatedCount).toBe(0);
  });

  it('should detect overlapping directives', () => {
    const overlapConfig1: ParsedConfig = {
      source: ConfigSource.CLAUDE_MD,
      filePath: '/CLAUDE.md',
      directives: [
        {
          content: 'Use prettier for code formatting with 2 spaces indent',
          category: DirectiveCategory.CODE_STYLE,
          source: ConfigSource.CLAUDE_MD,
          priority: 7,
        },
      ],
      rawContent: '',
    };

    const overlapConfig2: ParsedConfig = {
      source: ConfigSource.CURSORRULES,
      filePath: '/.cursorrules',
      directives: [
        {
          content: 'Use prettier for code formatting with 4 spaces indent',
          category: DirectiveCategory.CODE_STYLE,
          source: ConfigSource.CURSORRULES,
          priority: 7,
        },
      ],
      rawContent: '',
    };

    const result = merger.merge([overlapConfig1, overlapConfig2]);
    expect(result.conflicts.length).toBeGreaterThan(0);
  });
});
