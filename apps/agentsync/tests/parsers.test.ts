/**
 * @fileoverview 解析器单元测试
 */

import { ClaudeParser } from '../src/parsers/claude-parser';
import { CursorRulesParser } from '../src/parsers/cursorrules-parser';
import { CopilotParser } from '../src/parsers/copilot-parser';
import { WindsurfParser } from '../src/parsers/windsurf-parser';
import { findParser, getAllParsers } from '../src/parsers';
import { ConfigSource, DirectiveCategory } from '../src/core/types';

describe('ClaudeParser', () => {
  const parser = new ClaudeParser();

  it('should match CLAUDE.md files', () => {
    expect(parser.matches('CLAUDE.md')).toBe(true);
    expect(parser.matches('/project/CLAUDE.md')).toBe(true);
    expect(parser.matches('README.md')).toBe(false);
  });

  it('should parse basic CLAUDE.md content', () => {
    const content = `# My Project

This is a TypeScript project using React and Node.js.

## Code Style

- Use camelCase for variables
- Always use TypeScript strict mode
- Prefer functional components

## Testing

- Write unit tests for all utilities
- Use Jest for testing
`;

    const result = parser.parse(content, '/project/CLAUDE.md');

    expect(result.source).toBe(ConfigSource.CLAUDE_MD);
    expect(result.projectName).toBe('My Project');
    expect(result.techStack).toContain('TypeScript');
    expect(result.techStack).toContain('React');
    expect(result.techStack).toContain('Node.js');
    expect(result.directives.length).toBeGreaterThan(0);
  });

  it('should categorize code style directives', () => {
    const content = `# Project

## Code Style

- Use prettier for formatting
- Use eslint for linting
- Prefer camelCase naming convention
`;

    const result = parser.parse(content, '/project/CLAUDE.md');
    const styleDirectives = result.directives.filter(
      d => d.category === DirectiveCategory.CODE_STYLE
    );
    expect(styleDirectives.length).toBeGreaterThan(0);
  });

  it('should handle empty content', () => {
    const result = parser.parse('', '/project/CLAUDE.md');
    expect(result.directives).toHaveLength(0);
    expect(result.source).toBe(ConfigSource.CLAUDE_MD);
  });

  it('should extract project name from header', () => {
    const content = '# Amazing App\n\nSome description.';
    const result = parser.parse(content, '/project/CLAUDE.md');
    expect(result.projectName).toBe('Amazing App');
  });

  it('should fallback to directory name for project name', () => {
    const content = 'Just some rules without a header.';
    const result = parser.parse(content, '/workspace/myapp/CLAUDE.md');
    expect(result.projectName).toBe('myapp');
  });
});

describe('CursorRulesParser', () => {
  const parser = new CursorRulesParser();

  it('should match .cursorrules files', () => {
    expect(parser.matches('.cursorrules')).toBe(true);
    expect(parser.matches('/project/.cursorrules')).toBe(true);
    expect(parser.matches('.eslintrc')).toBe(false);
  });

  it('should parse bullet-point rules', () => {
    const content = `- Always use TypeScript
- Use functional programming patterns
- Never use var, always use const or let
- Must write tests for all new functions`;

    const result = parser.parse(content, '/project/.cursorrules');

    expect(result.source).toBe(ConfigSource.CURSORRULES);
    expect(result.directives.length).toBeGreaterThan(0);
  });

  it('should infer high priority for must/always/never rules', () => {
    const content = `- Must always use strict mode
- You can optionally add comments`;

    const result = parser.parse(content, '/project/.cursorrules');
    const mustRule = result.directives.find(d => d.content.includes('strict mode'));
    const canRule = result.directives.find(d => d.content.includes('optionally'));

    expect(mustRule!.priority).toBeGreaterThan(canRule!.priority);
  });

  it('should detect tech stack from content', () => {
    const content = `- This project uses React and TypeScript
- Use Next.js for routing`;

    const result = parser.parse(content, '/project/.cursorrules');
    expect(result.techStack).toContain('React');
    expect(result.techStack).toContain('TypeScript');
    expect(result.techStack).toContain('Next.js');
  });
});

describe('CopilotParser', () => {
  const parser = new CopilotParser();

  it('should match copilot-instructions.md files', () => {
    expect(parser.matches('.github/copilot-instructions.md')).toBe(true);
    expect(parser.matches('/project/.github/copilot-instructions.md')).toBe(true);
    expect(parser.matches('copilot.md')).toBe(false);
  });

  it('should parse copilot instructions', () => {
    const content = `# Project Guidelines

Use Python 3.12 with FastAPI.

## Security

- Always validate user input
- Never expose API keys in code
`;

    const result = parser.parse(content, '/project/.github/copilot-instructions.md');

    expect(result.source).toBe(ConfigSource.COPILOT_INSTRUCTIONS);
    expect(result.directives.length).toBeGreaterThan(0);
    expect(result.techStack).toContain('Python');
    expect(result.techStack).toContain('FastAPI');
  });
});

describe('WindsurfParser', () => {
  const parser = new WindsurfParser();

  it('should match .windsurfrules files', () => {
    expect(parser.matches('.windsurfrules')).toBe(true);
    expect(parser.matches('/project/.windsurfrules')).toBe(true);
  });

  it('should parse windsurf rules', () => {
    const content = `# Rules

- Use Vue 3 composition API
- Follow Angular style guide for structure
`;

    const result = parser.parse(content, '/project/.windsurfrules');
    expect(result.source).toBe(ConfigSource.WINDSURF_RULES);
    expect(result.techStack).toContain('Vue');
    expect(result.techStack).toContain('Angular');
  });
});

describe('Parser Registry', () => {
  it('should return all parsers', () => {
    const parsers = getAllParsers();
    expect(parsers.length).toBe(4);
  });

  it('should find correct parser by file path', () => {
    expect(findParser('CLAUDE.md')).toBeInstanceOf(ClaudeParser);
    expect(findParser('.cursorrules')).toBeInstanceOf(CursorRulesParser);
    expect(findParser('.github/copilot-instructions.md')).toBeInstanceOf(CopilotParser);
    expect(findParser('.windsurfrules')).toBeInstanceOf(WindsurfParser);
  });

  it('should return null for unknown files', () => {
    expect(findParser('unknown.txt')).toBeNull();
    expect(findParser('.eslintrc')).toBeNull();
  });
});
