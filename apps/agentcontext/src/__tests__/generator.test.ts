/**
 * @fileoverview 配置文件生成器单元测试
 */

import { buildAnalysisSummary, generateFromTemplate } from '@/lib/generator';
import type { AnalysisResult } from '@/types';

/** 测试用的分析结果 mock */
const mockAnalysis: AnalysisResult = {
  id: 'test-id-123',
  repo: {
    owner: 'vercel',
    name: 'next.js',
    fullName: 'vercel/next.js',
    description: 'The React Framework',
    language: 'TypeScript',
    languages: { TypeScript: 50000, JavaScript: 30000, CSS: 5000 },
    defaultBranch: 'canary',
    stars: 120000,
    forks: 26000,
    topics: ['react', 'nextjs', 'ssr', 'framework'],
  },
  structure: [
    { path: 'packages', type: 'dir' },
    { path: 'packages/next', type: 'dir' },
    { path: 'packages/create-next-app', type: 'dir' },
    { path: 'test', type: 'dir' },
    { path: 'docs', type: 'dir' },
    { path: 'examples', type: 'dir' },
    { path: 'package.json', type: 'file' },
    { path: 'tsconfig.json', type: 'file' },
    { path: 'src/index.ts', type: 'file' },
  ],
  frameworks: ['Next.js', 'React'],
  buildTools: ['Turbopack'],
  testingTools: ['Jest', 'Playwright'],
  packageManager: 'pnpm',
  entryPoints: ['src/index.ts'],
  configFiles: ['tsconfig.json'],
  createdAt: new Date().toISOString(),
};

describe('buildAnalysisSummary', () => {
  it('包含仓库名称', () => {
    const summary = buildAnalysisSummary(mockAnalysis);
    expect(summary).toContain('vercel/next.js');
  });

  it('包含语言信息', () => {
    const summary = buildAnalysisSummary(mockAnalysis);
    expect(summary).toContain('TypeScript');
  });

  it('包含框架信息', () => {
    const summary = buildAnalysisSummary(mockAnalysis);
    expect(summary).toContain('Next.js');
    expect(summary).toContain('React');
  });

  it('包含构建工具', () => {
    const summary = buildAnalysisSummary(mockAnalysis);
    expect(summary).toContain('Turbopack');
  });

  it('包含包管理器', () => {
    const summary = buildAnalysisSummary(mockAnalysis);
    expect(summary).toContain('pnpm');
  });

  it('包含 star 数', () => {
    const summary = buildAnalysisSummary(mockAnalysis);
    expect(summary).toContain('120000');
  });
});

describe('generateFromTemplate', () => {
  describe('Cursor 标准 (AGENTS.md)', () => {
    it('生成非空内容', () => {
      const content = generateFromTemplate(mockAnalysis, 'cursor');
      expect(content.length).toBeGreaterThan(100);
    });

    it('包含仓库名', () => {
      const content = generateFromTemplate(mockAnalysis, 'cursor');
      expect(content).toContain('vercel/next.js');
    });

    it('包含技术栈信息', () => {
      const content = generateFromTemplate(mockAnalysis, 'cursor');
      expect(content).toContain('TypeScript');
      expect(content).toContain('Next.js');
    });

    it('包含包管理器命令', () => {
      const content = generateFromTemplate(mockAnalysis, 'cursor');
      expect(content).toContain('pnpm');
    });

    it('包含 Cursor 特定指导', () => {
      const content = generateFromTemplate(mockAnalysis, 'cursor');
      expect(content).toContain('Cursor');
    });

    it('包含 AgentContext 签名', () => {
      const content = generateFromTemplate(mockAnalysis, 'cursor');
      expect(content).toContain('AgentContext');
    });
  });

  describe('Claude 标准 (CLAUDE.md)', () => {
    it('生成非空内容', () => {
      const content = generateFromTemplate(mockAnalysis, 'claude');
      expect(content.length).toBeGreaterThan(100);
    });

    it('包含 Claude 特定指导', () => {
      const content = generateFromTemplate(mockAnalysis, 'claude');
      expect(content).toContain('Claude');
    });

    it('包含框架信息', () => {
      const content = generateFromTemplate(mockAnalysis, 'claude');
      expect(content).toContain('Next.js');
    });
  });

  describe('Copilot 标准', () => {
    it('生成非空内容', () => {
      const content = generateFromTemplate(mockAnalysis, 'copilot');
      expect(content.length).toBeGreaterThan(100);
    });

    it('包含 Copilot 特定指导', () => {
      const content = generateFromTemplate(mockAnalysis, 'copilot');
      expect(content).toContain('Copilot');
    });
  });

  describe('不同包管理器的命令', () => {
    it('npm 项目使用 npm run', () => {
      const npmAnalysis = { ...mockAnalysis, packageManager: 'npm' };
      const content = generateFromTemplate(npmAnalysis, 'cursor');
      expect(content).toContain('npm run');
    });

    it('yarn 项目使用 yarn', () => {
      const yarnAnalysis = { ...mockAnalysis, packageManager: 'yarn' };
      const content = generateFromTemplate(yarnAnalysis, 'cursor');
      expect(content).toContain('yarn');
    });

    it('bun 项目使用 bun run', () => {
      const bunAnalysis = { ...mockAnalysis, packageManager: 'bun' };
      const content = generateFromTemplate(bunAnalysis, 'cursor');
      expect(content).toContain('bun run');
    });
  });
});
