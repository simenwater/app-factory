/**
 * @fileoverview GitHub 工具函数单元测试
 * @description 测试纯函数（不需要 Octokit 实例的检测函数）
 */

jest.mock('@octokit/rest', () => ({
  Octokit: jest.fn(),
}));

import {
  parseRepoUrl,
  detectFrameworks,
  detectBuildTools,
  detectTestingTools,
  detectPackageManager,
  detectConfigFiles,
  detectEntryPoints,
} from '@/lib/github';
import type { FileNode } from '@/types';

describe('parseRepoUrl', () => {
  it('解析标准 GitHub URL', () => {
    const result = parseRepoUrl('https://github.com/vercel/next.js');
    expect(result).toEqual({ owner: 'vercel', repo: 'next.js' });
  });

  it('解析带 .git 后缀的 URL', () => {
    const result = parseRepoUrl('https://github.com/facebook/react.git');
    expect(result).toEqual({ owner: 'facebook', repo: 'react' });
  });

  it('解析 owner/repo 简写格式', () => {
    const result = parseRepoUrl('vercel/next.js');
    expect(result).toEqual({ owner: 'vercel', repo: 'next.js' });
  });

  it('解析带末尾斜杠的 URL', () => {
    const result = parseRepoUrl('https://github.com/vercel/next.js/');
    expect(result).toEqual({ owner: 'vercel', repo: 'next.js' });
  });

  it('无效 URL 抛出错误', () => {
    expect(() => parseRepoUrl('not-a-url')).toThrow('无效的 GitHub 仓库 URL');
  });

  it('空字符串抛出错误', () => {
    expect(() => parseRepoUrl('')).toThrow('无效的 GitHub 仓库 URL');
  });
});

describe('detectFrameworks', () => {
  it('检测 Next.js 项目', () => {
    const tree: FileNode[] = [
      { path: 'next.config.js', type: 'file' },
      { path: 'src', type: 'dir' },
    ];
    expect(detectFrameworks(tree)).toContain('Next.js');
  });

  it('从 package.json 检测 React', () => {
    const tree: FileNode[] = [{ path: 'src', type: 'dir' }];
    const pkg = JSON.stringify({
      dependencies: { react: '^18.0.0' },
    });
    expect(detectFrameworks(tree, pkg)).toContain('React');
  });

  it('检测 Angular 项目', () => {
    const tree: FileNode[] = [{ path: 'angular.json', type: 'file' }];
    expect(detectFrameworks(tree)).toContain('Angular');
  });

  it('检测 Django 项目', () => {
    const tree: FileNode[] = [{ path: 'manage.py', type: 'file' }];
    expect(detectFrameworks(tree)).toContain('Django');
  });

  it('空项目返回空数组', () => {
    expect(detectFrameworks([])).toEqual([]);
  });
});

describe('detectBuildTools', () => {
  it('检测 Webpack', () => {
    const tree: FileNode[] = [{ path: 'webpack.config.js', type: 'file' }];
    expect(detectBuildTools(tree)).toContain('Webpack');
  });

  it('检测 Vite', () => {
    const tree: FileNode[] = [{ path: 'vite.config.ts', type: 'file' }];
    expect(detectBuildTools(tree)).toContain('Vite');
  });

  it('检测 Cargo (Rust)', () => {
    const tree: FileNode[] = [{ path: 'Cargo.toml', type: 'file' }];
    expect(detectBuildTools(tree)).toContain('Cargo');
  });

  it('检测多个构建工具', () => {
    const tree: FileNode[] = [
      { path: 'webpack.config.js', type: 'file' },
      { path: 'Makefile', type: 'file' },
    ];
    const tools = detectBuildTools(tree);
    expect(tools).toContain('Webpack');
    expect(tools).toContain('Make');
  });
});

describe('detectTestingTools', () => {
  it('从 package.json 检测 Jest', () => {
    const pkg = JSON.stringify({
      devDependencies: { jest: '^29.0.0' },
    });
    expect(detectTestingTools([], pkg)).toContain('Jest');
  });

  it('从 package.json 检测 Playwright', () => {
    const pkg = JSON.stringify({
      devDependencies: { '@playwright/test': '^1.0.0' },
    });
    expect(detectTestingTools([], pkg)).toContain('Playwright');
  });

  it('从文件路径推断测试存在', () => {
    const tree: FileNode[] = [
      { path: 'test/unit/app.test.js', type: 'file' },
    ];
    expect(detectTestingTools(tree).length).toBeGreaterThan(0);
  });
});

describe('detectPackageManager', () => {
  it('检测 npm', () => {
    const tree: FileNode[] = [{ path: 'package-lock.json', type: 'file' }];
    expect(detectPackageManager(tree)).toBe('npm');
  });

  it('检测 yarn', () => {
    const tree: FileNode[] = [{ path: 'yarn.lock', type: 'file' }];
    expect(detectPackageManager(tree)).toBe('yarn');
  });

  it('检测 pnpm', () => {
    const tree: FileNode[] = [{ path: 'pnpm-lock.yaml', type: 'file' }];
    expect(detectPackageManager(tree)).toBe('pnpm');
  });

  it('检测 cargo', () => {
    const tree: FileNode[] = [{ path: 'Cargo.lock', type: 'file' }];
    expect(detectPackageManager(tree)).toBe('cargo');
  });

  it('检测 pip', () => {
    const tree: FileNode[] = [{ path: 'requirements.txt', type: 'file' }];
    expect(detectPackageManager(tree)).toBe('pip');
  });

  it('未检测到返回 unknown', () => {
    expect(detectPackageManager([])).toBe('unknown');
  });
});

describe('detectConfigFiles', () => {
  it('检测 tsconfig', () => {
    const tree: FileNode[] = [
      { path: 'tsconfig.json', type: 'file' },
    ];
    expect(detectConfigFiles(tree)).toContain('tsconfig.json');
  });

  it('检测多种配置文件', () => {
    const tree: FileNode[] = [
      { path: 'tsconfig.json', type: 'file' },
      { path: 'next.config.js', type: 'file' },
      { path: '.eslintrc', type: 'file' },
      { path: 'Dockerfile', type: 'file' },
    ];
    const configs = detectConfigFiles(tree);
    expect(configs.length).toBeGreaterThanOrEqual(3);
  });

  it('忽略目录', () => {
    const tree: FileNode[] = [
      { path: 'config', type: 'dir' },
    ];
    expect(detectConfigFiles(tree)).toEqual([]);
  });
});

describe('detectEntryPoints', () => {
  it('检测 TypeScript 入口', () => {
    const tree: FileNode[] = [
      { path: 'src/index.ts', type: 'file' },
    ];
    expect(detectEntryPoints(tree)).toContain('src/index.ts');
  });

  it('检测 Python 入口', () => {
    const tree: FileNode[] = [
      { path: 'main.py', type: 'file' },
    ];
    expect(detectEntryPoints(tree)).toContain('main.py');
  });

  it('检测 Go 入口', () => {
    const tree: FileNode[] = [
      { path: 'main.go', type: 'file' },
    ];
    expect(detectEntryPoints(tree)).toContain('main.go');
  });

  it('检测 Rust 入口', () => {
    const tree: FileNode[] = [
      { path: 'src/main.rs', type: 'file' },
    ];
    expect(detectEntryPoints(tree)).toContain('src/main.rs');
  });
});
