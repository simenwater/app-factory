import type { RepoInfo, DirectoryNode } from "@/types";

/**
 * @description 解析 GitHub 仓库 URL，提取 owner 和 repo name
 * @param url - GitHub 仓库完整 URL
 * @returns 包含 owner 和 repo 的元组，解析失败返回 null
 */
export function parseGitHubUrl(
  url: string
): { owner: string; repo: string } | null {
  const patterns = [
    /^https?:\/\/github\.com\/([^/]+)\/([^/]+?)(\.git)?$/,
    /^git@github\.com:([^/]+)\/([^/]+?)(\.git)?$/,
    /^([^/]+)\/([^/]+)$/,
  ];

  for (const pattern of patterns) {
    const match = url.trim().match(pattern);
    if (match) {
      return { owner: match[1], repo: match[2] };
    }
  }
  return null;
}

/**
 * @description 从 GitHub API 获取仓库的目录树
 * @param owner - 仓库所有者
 * @param repo - 仓库名称
 * @returns 文件路径数组
 */
async function fetchRepoTree(
  owner: string,
  repo: string
): Promise<string[]> {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/HEAD?recursive=1`,
    {
      headers: {
        Accept: "application/vnd.github.v3+json",
        ...(process.env.GITHUB_TOKEN
          ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
          : {}),
      },
    }
  );

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return (data.tree || [])
    .filter((item: { type: string }) => item.type === "blob")
    .map((item: { path: string }) => item.path);
}

/**
 * @description 从 GitHub API 获取仓库基本信息
 */
async function fetchRepoMetadata(
  owner: string,
  repo: string
): Promise<{ description: string; language: string }> {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}`,
    {
      headers: {
        Accept: "application/vnd.github.v3+json",
        ...(process.env.GITHUB_TOKEN
          ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
          : {}),
      },
    }
  );

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return {
    description: data.description || "",
    language: data.language || "Unknown",
  };
}

/**
 * @description 获取仓库使用的语言分布
 */
async function fetchLanguages(
  owner: string,
  repo: string
): Promise<Record<string, number>> {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/languages`,
    {
      headers: {
        Accept: "application/vnd.github.v3+json",
        ...(process.env.GITHUB_TOKEN
          ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
          : {}),
      },
    }
  );

  if (!res.ok) return {};
  return res.json();
}

/**
 * @description 从文件路径获取 package.json 内容
 */
async function fetchFileContent(
  owner: string,
  repo: string,
  path: string
): Promise<string | null> {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
    {
      headers: {
        Accept: "application/vnd.github.v3+json",
        ...(process.env.GITHUB_TOKEN
          ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
          : {}),
      },
    }
  );

  if (!res.ok) return null;
  const data = await res.json();
  if (data.content) {
    return Buffer.from(data.content, "base64").toString("utf-8");
  }
  return null;
}

/**
 * @description 从文件路径列表构建目录树
 * @param files - 文件路径列表
 * @param maxDepth - 最大显示深度
 */
export function buildDirectoryTree(
  files: string[],
  maxDepth: number = 3
): DirectoryNode[] {
  const root: DirectoryNode[] = [];

  for (const filePath of files) {
    const parts = filePath.split("/");
    if (parts.length > maxDepth + 1) continue;

    let current = root;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isFile = i === parts.length - 1;

      let existing = current.find((n) => n.name === part);
      if (!existing) {
        existing = {
          name: part,
          type: isFile ? "file" : "directory",
          ...(isFile ? {} : { children: [] }),
        };
        current.push(existing);
      }

      if (!isFile && existing.children) {
        current = existing.children;
      }
    }
  }

  return root;
}

/**
 * @description 检测项目使用的框架
 */
export function detectFramework(files: string[]): string | null {
  const frameworkIndicators: Record<string, string[]> = {
    "Next.js": ["next.config.js", "next.config.ts", "next.config.mjs"],
    React: ["src/App.tsx", "src/App.jsx", "src/App.js"],
    Vue: ["vue.config.js", "nuxt.config.js", "nuxt.config.ts"],
    "Nuxt.js": ["nuxt.config.js", "nuxt.config.ts"],
    Angular: ["angular.json", ".angular.json"],
    Svelte: ["svelte.config.js", "svelte.config.ts"],
    Django: ["manage.py", "settings.py"],
    Flask: ["app.py", "wsgi.py"],
    "Ruby on Rails": ["Gemfile", "config/routes.rb"],
    Express: ["server.js", "app.js"],
    "Spring Boot": ["pom.xml", "build.gradle"],
    Laravel: ["artisan", "composer.json"],
    Flutter: ["pubspec.yaml", "lib/main.dart"],
    "Rust (Cargo)": ["Cargo.toml"],
    Go: ["go.mod"],
  };

  for (const [framework, indicators] of Object.entries(frameworkIndicators)) {
    if (indicators.some((ind) => files.includes(ind))) {
      return framework;
    }
  }
  return null;
}

/**
 * @description 检测包管理器
 */
export function detectPackageManager(files: string[]): string | null {
  if (files.includes("pnpm-lock.yaml")) return "pnpm";
  if (files.includes("yarn.lock")) return "yarn";
  if (files.includes("bun.lockb")) return "bun";
  if (files.includes("package-lock.json")) return "npm";
  if (files.includes("Pipfile.lock")) return "pipenv";
  if (files.includes("poetry.lock")) return "poetry";
  if (files.includes("requirements.txt")) return "pip";
  if (files.includes("Cargo.lock")) return "cargo";
  if (files.includes("go.sum")) return "go modules";
  if (files.includes("Gemfile.lock")) return "bundler";
  return null;
}

/**
 * @description 识别项目中的配置文件
 */
export function detectConfigFiles(files: string[]): string[] {
  const configPatterns = [
    /^\.env/,
    /^tsconfig/,
    /^jest\.config/,
    /^vitest\.config/,
    /^\.eslint/,
    /^\.prettier/,
    /^docker-compose/,
    /^Dockerfile/,
    /^\.github\//,
    /^\.husky\//,
    /^tailwind\.config/,
    /^webpack\.config/,
    /^vite\.config/,
    /^babel\.config/,
    /^next\.config/,
    /^nuxt\.config/,
    /^\.editorconfig/,
    /^Makefile/,
  ];

  return files.filter((f) => configPatterns.some((p) => p.test(f)));
}

/**
 * @description 完整分析一个 GitHub 仓库
 * @param repoUrl - 仓库 URL 或 owner/repo 格式
 * @returns 仓库分析结果
 */
export async function analyzeRepo(repoUrl: string): Promise<RepoInfo> {
  const parsed = parseGitHubUrl(repoUrl);
  if (!parsed) {
    throw new Error("Invalid GitHub repository URL");
  }

  const { owner, repo } = parsed;

  const [files, metadata, languages] = await Promise.all([
    fetchRepoTree(owner, repo),
    fetchRepoMetadata(owner, repo),
    fetchLanguages(owner, repo),
  ]);

  let dependencies: Record<string, string> = {};
  let devDependencies: Record<string, string> = {};

  if (files.includes("package.json")) {
    const pkgContent = await fetchFileContent(owner, repo, "package.json");
    if (pkgContent) {
      try {
        const pkg = JSON.parse(pkgContent);
        dependencies = pkg.dependencies || {};
        devDependencies = pkg.devDependencies || {};
      } catch {
        // ignore parse errors
      }
    }
  }

  const hasTests = files.some(
    (f) =>
      f.includes("__tests__") ||
      f.includes(".test.") ||
      f.includes(".spec.") ||
      f.includes("test/") ||
      f.includes("tests/")
  );

  const hasCi = files.some(
    (f) =>
      f.startsWith(".github/workflows/") ||
      f.includes(".gitlab-ci") ||
      f.includes("Jenkinsfile") ||
      f.includes(".circleci")
  );

  return {
    owner,
    name: repo,
    description: metadata.description,
    language: metadata.language,
    languages,
    framework: detectFramework(files),
    packageManager: detectPackageManager(files),
    hasTests,
    hasCi,
    structure: buildDirectoryTree(files),
    files,
    configFiles: detectConfigFiles(files),
    dependencies,
    devDependencies,
  };
}
