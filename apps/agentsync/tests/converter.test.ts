/**
 * @fileoverview 转换器单元测试
 */

import { Converter } from '../src/core/converter';
import { ConfigSource, DirectiveCategory, ParsedConfig } from '../src/core/types';

describe('Converter', () => {
  const converter = new Converter();

  const mockConfig: ParsedConfig = {
    source: ConfigSource.CLAUDE_MD,
    filePath: '/project/CLAUDE.md',
    projectName: 'Test Project',
    description: 'A test project for unit testing',
    techStack: ['TypeScript', 'React'],
    directives: [
      {
        content: 'Use camelCase for variables',
        category: DirectiveCategory.CODE_STYLE,
        source: ConfigSource.CLAUDE_MD,
        priority: 7,
      },
      {
        content: 'Write unit tests for all functions',
        category: DirectiveCategory.TESTING,
        source: ConfigSource.CLAUDE_MD,
        priority: 8,
      },
      {
        content: 'Follow MVC architecture pattern',
        category: DirectiveCategory.ARCHITECTURE,
        source: ConfigSource.CLAUDE_MD,
        priority: 6,
      },
    ],
    rawContent: '# Test',
  };

  it('should convert a single config to AgentsConfig', () => {
    const result = converter.convert(mockConfig);

    expect(result.version).toBe('1.0.0');
    expect(result.projectName).toBe('Test Project');
    expect(result.description).toBe('A test project for unit testing');
    expect(result.techStack).toContain('TypeScript');
    expect(result.techStack).toContain('React');
    expect(result.sources).toContain(ConfigSource.CLAUDE_MD);
    expect(result.sections.length).toBeGreaterThan(0);
  });

  it('should organize directives into sections by category', () => {
    const result = converter.convert(mockConfig);

    const codeStyleSection = result.sections.find(
      s => s.category === DirectiveCategory.CODE_STYLE
    );
    expect(codeStyleSection).toBeDefined();
    expect(codeStyleSection!.directives.length).toBe(1);
    expect(codeStyleSection!.directives[0].content).toBe('Use camelCase for variables');
  });

  it('should merge multiple configs', () => {
    const config2: ParsedConfig = {
      source: ConfigSource.CURSORRULES,
      filePath: '/project/.cursorrules',
      projectName: 'Test Project',
      techStack: ['Node.js', 'Express'],
      directives: [
        {
          content: 'Use 2-space indentation',
          category: DirectiveCategory.CODE_STYLE,
          source: ConfigSource.CURSORRULES,
          priority: 5,
        },
      ],
      rawContent: '',
    };

    const result = converter.convertMultiple([mockConfig, config2]);

    expect(result.techStack).toContain('TypeScript');
    expect(result.techStack).toContain('React');
    expect(result.techStack).toContain('Node.js');
    expect(result.techStack).toContain('Express');
    expect(result.sources).toContain(ConfigSource.CLAUDE_MD);
    expect(result.sources).toContain(ConfigSource.CURSORRULES);
  });

  it('should select the best project name from configs', () => {
    const config1: ParsedConfig = {
      source: ConfigSource.CLAUDE_MD,
      filePath: '/CLAUDE.md',
      projectName: 'Unknown Project',
      directives: [],
      rawContent: '',
    };

    const config2: ParsedConfig = {
      source: ConfigSource.CURSORRULES,
      filePath: '/.cursorrules',
      projectName: 'My Real Project',
      directives: [],
      rawContent: '',
    };

    const result = converter.convertMultiple([config1, config2]);
    expect(result.projectName).toBe('My Real Project');
  });

  it('should set generated timestamp', () => {
    const result = converter.convert(mockConfig);
    expect(result.generatedAt).toBeDefined();
    expect(new Date(result.generatedAt).getTime()).not.toBeNaN();
  });

  it('should handle empty directives', () => {
    const emptyConfig: ParsedConfig = {
      source: ConfigSource.CLAUDE_MD,
      filePath: '/CLAUDE.md',
      projectName: 'Empty',
      directives: [],
      rawContent: '',
    };

    const result = converter.convert(emptyConfig);
    expect(result.sections).toHaveLength(0);
  });
});
