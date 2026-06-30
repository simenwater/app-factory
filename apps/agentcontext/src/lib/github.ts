/**
 * @fileoverview GitHub API 集成模块，负责仓库数据获取和代码结构分析
 */

import { Octokit } from '@octokit/rest';
import type { RepoInfo, FileNode } from '@/types';

/**
 * 解析 GitHub 仓库 URL，提取 owner 和 repo 名
 * @param {string} url - GitHub 仓库 URL
 * @returns {{ owner: string; repo: string }} 仓库所有者和名称
 * @throws {Error} 无效的 GitHub URL
 */
export function parseRepoUrl(url: string): { owner: string; repo: string } {
  const patterns = [
    /github\.com\/([^/]+)\/([^/]+?)(?:\.git)?(?:\/|$)/,
    /^([^/]+)\/([^/]+)$/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return { owner: match[1], repo: match[2] };
    }
  }

  throw new Error('无效的 GitHub 仓库 URL');
}

/**
 * 创建 Octokit 客户端
 * @param {string} [token] - GitHub Personal Access Token
 * @returns {Octokit} Octokit 实例
 */
function createClient(token?: string): Octokit {
  return new Octokit({ auth: token || process.env.GITHUB_TOKEN });
}

/**
 * 获取仓库基本信息
 * @param {string} owner - 仓库所有者
 * @param {string} repo - 仓库名称
 * @param {string} [token] - GitHub Token
 * @returns {Promise<RepoInfo>} 仓库信息
 */
export async function getRepoInfo(
  owner: string,
  repo: string,
  token?: string
): Promise<RepoInfo> {
  const octokit = createClient(token);

  const [repoData, languagesData] = await Promise.all([
    octokit.repos.get({ owner, repo }),
    octokit.repos.listLanguages({ owner, repo }),
  ]);

  return {
    owner,
    name: repo,
    fullName: repoData.data.full_name,
    description: repoData.data.description || '',
    language: repoData.data.language || 'Unknown',
    languages: languagesData.data as Record<string, number>,
    defaultBranch: repoData.data.default_branch,
    stars: repoData.data.stargazers_count,
    forks: repoData.data.forks_count,
    topics: repoData.data.topics || [],
  };
}

/** 需要忽略的目录/文件模式 */
const IGNORE_PATTERNS = [
  'node_modules',
  '.git',
  '.next',
  'dist',
  'build',
  '__pycache__',
  '.cache',
  'vendor',
  '.DS_Store',
  'coverage',
  '.env',
];

/**
 * 获取仓库文件树结构
 * @param {string} owner - 仓库所有者
 * @param {string} repo - 仓库名称
 * @param {string} [token] - GitHub Token
 * @returns {Promise<FileNode[]>} 文件树
 */
export async function getRepoTree(
  owner: string,
  repo: string,
  token?: string
): Promise<FileNode[]> {
  const octokit = createClient(token);

  try {
    const { data } = await octokit.git.getTree({
      owner,
      repo,
      tree_sha: 'HEAD',
      recursive: 'true',
    });

    const nodes: FileNode[] = [];

    for (const item of data.tree) {
      if (!item.path) continue;

      const shouldIgnore = IGNORE_PATTERNS.some(
        (pattern) =>
          item.path!.includes(`/${pattern}/`) ||
          item.path!.startsWith(`${pattern}/`) ||
          item.path === pattern
      );

      if (shouldIgnore) continue;

      nodes.push({
        path: item.path,
        type: item.type === 'tree' ? 'dir' : 'file',
        size: item.size,
      });
    }

    return nodes;
  } catch {
    return [];
  }
}

/**
 * 获取仓库中特定文件的内容
 * @param {string} owner - 仓库所有者
 * @param {string} repo - 仓库名称
 * @param {string} path - 文件路径
 * @param {string} [token] - GitHub Token
 * @returns {Promise<string>} 文件内容
 */
export async function getFileContent(
  owner: string,
  repo: string,
  path: string,
  token?: string
): Promise<string> {
  const octokit = createClient(token);

  try {
    const { data } = await octokit.repos.getContent({ owner, repo, path });

    if ('content' in data && data.encoding === 'base64') {
      return Buffer.from(data.content, 'base64').toString('utf-8');
    }

    return '';
  } catch {
    return '';
  }
}

/** 常见框架检测模式 */
const FRAMEWORK_PATTERNS: Record<string, string[]> = {
  'Next.js': ['next.config.js', 'next.config.ts', 'next.config.mjs'],
  React: ['package.json'],
  Vue: ['vue.config.js', 'nuxt.config.ts', 'nuxt.config.js'],
  Angular: ['angular.json'],
  Svelte: ['svelte.config.js'],
  Django: ['manage.py', 'django'],
  Flask: ['app.py', 'wsgi.py'],
  'Spring Boot': ['pom.xml', 'build.gradle'],
  Express: ['package.json'],
  FastAPI: ['main.py'],
  Rails: ['Gemfile', 'config/routes.rb'],
  Laravel: ['artisan', 'composer.json'],
};

/**
 * 从文件树中检测项目使用的框架
 * @param {FileNode[]} tree - 文件树
 * @param {string} [packageJson] - package.json 内容
 * @returns {string[]} 检测到的框架列表
 */
export function detectFrameworks(
  tree: FileNode[],
  packageJson?: string
): string[] {
  const filePaths = tree.map((n) => n.path);
  const frameworks: string[] = [];

  for (const [framework, patterns] of Object.entries(FRAMEWORK_PATTERNS)) {
    if (framework === 'React' || framework === 'Express') {
      if (packageJson) {
        try {
          const pkg = JSON.parse(packageJson);
          const deps = { ...pkg.dependencies, ...pkg.devDependencies };
          if (framework === 'React' && deps['react']) {
            frameworks.push('React');
          }
          if (framework === 'Express' && deps['express']) {
            frameworks.push('Express');
          }
        } catch {
          /* empty */
        }
      }
      continue;
    }

    for (const pattern of patterns) {
      if (filePaths.some((p) => p.endsWith(pattern) || p.includes(pattern))) {
        frameworks.push(framework);
        break;
      }
    }
  }

  return [...new Set(frameworks)];
}

/**
 * 检测项目构建工具
 * @param {FileNode[]} tree - 文件树
 * @returns {string[]} 构建工具列表
 */
export function detectBuildTools(tree: FileNode[]): string[] {
  const filePaths = tree.map((n) => n.path);
  const tools: string[] = [];

  const toolMap: Record<string, string[]> = {
    Webpack: ['webpack.config.js', 'webpack.config.ts'],
    Vite: ['vite.config.js', 'vite.config.ts'],
    Rollup: ['rollup.config.js', 'rollup.config.ts'],
    esbuild: ['esbuild.config.js'],
    Turbopack: ['turbo.json'],
    Gradle: ['build.gradle', 'build.gradle.kts'],
    Maven: ['pom.xml'],
    Make: ['Makefile'],
    CMake: ['CMakeLists.txt'],
    Cargo: ['Cargo.toml'],
  };

  for (const [tool, patterns] of Object.entries(toolMap)) {
    if (patterns.some((p) => filePaths.some((fp) => fp.endsWith(p)))) {
      tools.push(tool);
    }
  }

  return tools;
}

/**
 * 检测测试框架
 * @param {FileNode[]} tree - 文件树
 * @param {string} [packageJson] - package.json 内容
 * @returns {string[]} 测试框架列表
 */
export function detectTestingTools(
  tree: FileNode[],
  packageJson?: string
): string[] {
  const tools: string[] = [];
  const filePaths = tree.map((n) => n.path);

  if (packageJson) {
    try {
      const pkg = JSON.parse(packageJson);
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      if (deps['jest']) tools.push('Jest');
      if (deps['vitest']) tools.push('Vitest');
      if (deps['mocha']) tools.push('Mocha');
      if (deps['cypress']) tools.push('Cypress');
      if (deps['playwright'] || deps['@playwright/test'])
        tools.push('Playwright');
      if (deps['pytest'] || deps['unittest']) tools.push('pytest');
    } catch {
      /* empty */
    }
  }

  if (filePaths.some((p) => p.includes('test') || p.includes('spec'))) {
    if (tools.length === 0) tools.push('Unknown Test Framework');
  }

  return [...new Set(tools)];
}

/**
 * 检测包管理器
 * @param {FileNode[]} tree - 文件树
 * @returns {string} 包管理器名称
 */
export function detectPackageManager(tree: FileNode[]): string {
  const filePaths = tree.map((n) => n.path);

  if (filePaths.some((p) => p === 'pnpm-lock.yaml')) return 'pnpm';
  if (filePaths.some((p) => p === 'yarn.lock')) return 'yarn';
  if (filePaths.some((p) => p === 'bun.lockb')) return 'bun';
  if (filePaths.some((p) => p === 'package-lock.json')) return 'npm';
  if (filePaths.some((p) => p === 'Cargo.lock')) return 'cargo';
  if (filePaths.some((p) => p === 'go.sum')) return 'go modules';
  if (filePaths.some((p) => p === 'Pipfile.lock')) return 'pipenv';
  if (filePaths.some((p) => p === 'poetry.lock')) return 'poetry';
  if (filePaths.some((p) => p === 'requirements.txt')) return 'pip';
  if (filePaths.some((p) => p === 'Gemfile.lock')) return 'bundler';
  if (filePaths.some((p) => p === 'composer.lock')) return 'composer';

  return 'unknown';
}

/**
 * 检测配置文件
 * @param {FileNode[]} tree - 文件树
 * @returns {string[]} 配置文件列表
 */
export function detectConfigFiles(tree: FileNode[]): string[] {
  const configPatterns = [
    /\.config\.(js|ts|mjs|cjs)$/,
    /tsconfig.*\.json$/,
    /\.eslintrc/,
    /\.prettierrc/,
    /\.babelrc/,
    /docker-compose/,
    /Dockerfile/,
    /\.env\.example/,
    /\.github\/workflows/,
  ];

  return tree
    .filter((n) => n.type === 'file')
    .filter((n) => configPatterns.some((p) => p.test(n.path)))
    .map((n) => n.path)
    .slice(0, 20);
}

/**
 * 检测项目入口文件
 * @param {FileNode[]} tree - 文件树
 * @returns {string[]} 入口文件列表
 */
export function detectEntryPoints(tree: FileNode[]): string[] {
  const entryPatterns = [
    'src/index.ts',
    'src/index.js',
    'src/main.ts',
    'src/main.js',
    'src/app.ts',
    'src/app.js',
    'src/App.tsx',
    'src/App.jsx',
    'index.ts',
    'index.js',
    'main.py',
    'app.py',
    'main.go',
    'cmd/main.go',
    'src/main.rs',
    'lib/main.dart',
  ];

  const filePaths = tree.filter((n) => n.type === 'file').map((n) => n.path);
  return entryPatterns.filter((p) => filePaths.some((fp) => fp.endsWith(p)));
}
