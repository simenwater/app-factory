/**
 * @fileoverview 项目结构扫描引擎
 * 分析项目目录结构、检测语言和框架
 */

import { FileNode, ScanResult, LanguageStat } from "@/types";

/** 应忽略的目录列表 */
const IGNORED_DIRS = new Set([
  "node_modules", ".git", ".next", "dist", "build", ".cache",
  "__pycache__", ".vscode", ".idea", "coverage", ".turbo",
  "vendor", "target", ".gradle", ".dart_tool",
]);

/** 应忽略的文件列表 */
const IGNORED_FILES = new Set([
  ".DS_Store", "Thumbs.db", ".env", ".env.local",
]);

/** 语言扩展名映射 */
const EXTENSION_LANGUAGE_MAP: Record<string, string> = {
  ".ts": "TypeScript", ".tsx": "TypeScript",
  ".js": "JavaScript", ".jsx": "JavaScript",
  ".py": "Python",
  ".rs": "Rust",
  ".go": "Go",
  ".java": "Java",
  ".kt": "Kotlin",
  ".swift": "Swift",
  ".dart": "Dart",
  ".rb": "Ruby",
  ".php": "PHP",
  ".css": "CSS", ".scss": "SCSS", ".less": "LESS",
  ".html": "HTML",
  ".vue": "Vue",
  ".svelte": "Svelte",
  ".md": "Markdown",
  ".json": "JSON",
  ".yaml": "YAML", ".yml": "YAML",
  ".toml": "TOML",
  ".sql": "SQL",
  ".sh": "Shell",
  ".c": "C", ".h": "C",
  ".cpp": "C++", ".hpp": "C++",
  ".cs": "C#",
};

/** 框架检测规则 */
const FRAMEWORK_INDICATORS: Record<string, string[]> = {
  "Next.js": ["next.config.js", "next.config.ts", "next.config.mjs"],
  "React": ["react", "react-dom"],
  "Vue": ["vue.config.js", "nuxt.config.js", "nuxt.config.ts"],
  "Angular": ["angular.json"],
  "Svelte": ["svelte.config.js"],
  "Django": ["manage.py", "django"],
  "Flask": ["flask"],
  "FastAPI": ["fastapi"],
  "Express": ["express"],
  "NestJS": ["@nestjs/core"],
  "Tailwind CSS": ["tailwind.config.js", "tailwind.config.ts", "@tailwindcss/postcss"],
};

/**
 * 模拟扫描文件系统节点（客户端演示用）
 * @param entries - 文件条目列表
 * @returns 文件节点树
 */
export function buildFileTree(entries: { path: string; type: "file" | "directory" }[]): FileNode[] {
  const root: FileNode[] = [];
  const map = new Map<string, FileNode>();

  for (const entry of entries) {
    const parts = entry.path.split("/").filter(Boolean);
    const name = parts[parts.length - 1];

    if (IGNORED_DIRS.has(name) || IGNORED_FILES.has(name)) continue;

    const node: FileNode = {
      name,
      path: entry.path,
      type: entry.type,
      extension: entry.type === "file" ? getExtension(name) : undefined,
      children: entry.type === "directory" ? [] : undefined,
    };

    map.set(entry.path, node);

    const parentPath = parts.slice(0, -1).join("/");
    if (parentPath && map.has(parentPath)) {
      map.get(parentPath)!.children?.push(node);
    } else {
      root.push(node);
    }
  }

  return root;
}

/**
 * 获取文件扩展名
 * @param filename - 文件名
 * @returns 扩展名
 */
function getExtension(filename: string): string {
  const idx = filename.lastIndexOf(".");
  return idx >= 0 ? filename.slice(idx) : "";
}

/**
 * 从文件树中统计语言分布
 * @param files - 文件节点列表
 * @returns 语言统计数组
 */
export function analyzeLanguages(files: FileNode[]): LanguageStat[] {
  const counts: Record<string, number> = {};
  let total = 0;

  function walk(nodes: FileNode[]) {
    for (const node of nodes) {
      if (node.type === "file" && node.extension) {
        const lang = EXTENSION_LANGUAGE_MAP[node.extension];
        if (lang) {
          counts[lang] = (counts[lang] || 0) + 1;
          total++;
        }
      }
      if (node.children) walk(node.children);
    }
  }

  walk(files);

  return Object.entries(counts)
    .map(([language, fileCount]) => ({
      language,
      fileCount,
      percentage: total > 0 ? Math.round((fileCount / total) * 100) : 0,
    }))
    .sort((a, b) => b.fileCount - a.fileCount);
}

/**
 * 检测项目使用的框架
 * @param fileNames - 所有文件名列表
 * @param packageJson - package.json 内容（可选）
 * @returns 检测到的框架列表
 */
export function detectFrameworks(
  fileNames: string[],
  packageJson?: { dependencies?: Record<string, string>; devDependencies?: Record<string, string> }
): string[] {
  const detected: string[] = [];
  const allDeps = {
    ...packageJson?.dependencies,
    ...packageJson?.devDependencies,
  };

  for (const [framework, indicators] of Object.entries(FRAMEWORK_INDICATORS)) {
    for (const indicator of indicators) {
      if (fileNames.includes(indicator) || allDeps[indicator]) {
        if (!detected.includes(framework)) {
          detected.push(framework);
        }
        break;
      }
    }
  }

  return detected;
}

/**
 * 生成项目结构的树形文本表示
 * @param nodes - 文件节点列表
 * @param prefix - 前缀字符串
 * @param maxDepth - 最大深度
 * @returns 树形文本
 */
export function generateTreeText(nodes: FileNode[], prefix = "", maxDepth = 3): string {
  if (maxDepth <= 0) return prefix + "...\n";

  let result = "";
  const sorted = [...nodes].sort((a, b) => {
    if (a.type !== b.type) return a.type === "directory" ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  sorted.forEach((node, i) => {
    const isLast = i === sorted.length - 1;
    const connector = isLast ? "└── " : "├── ";
    const childPrefix = isLast ? "    " : "│   ";

    result += prefix + connector + node.name + (node.type === "directory" ? "/" : "") + "\n";

    if (node.children && node.children.length > 0) {
      result += generateTreeText(node.children, prefix + childPrefix, maxDepth - 1);
    }
  });

  return result;
}

/**
 * 创建演示用的扫描结果
 * @param projectName - 项目名称
 * @returns 扫描结果
 */
export function createDemoScanResult(projectName: string): ScanResult {
  const demoEntries = [
    { path: "src", type: "directory" as const },
    { path: "src/app", type: "directory" as const },
    { path: "src/app/page.tsx", type: "file" as const },
    { path: "src/app/layout.tsx", type: "file" as const },
    { path: "src/app/globals.css", type: "file" as const },
    { path: "src/components", type: "directory" as const },
    { path: "src/components/Header.tsx", type: "file" as const },
    { path: "src/components/Footer.tsx", type: "file" as const },
    { path: "src/lib", type: "directory" as const },
    { path: "src/lib/utils.ts", type: "file" as const },
    { path: "src/types", type: "directory" as const },
    { path: "src/types/index.ts", type: "file" as const },
    { path: "public", type: "directory" as const },
    { path: "public/favicon.ico", type: "file" as const },
    { path: "package.json", type: "file" as const },
    { path: "tsconfig.json", type: "file" as const },
    { path: "next.config.ts", type: "file" as const },
    { path: "README.md", type: "file" as const },
  ];

  const fileTree = buildFileTree(demoEntries);
  const languages = analyzeLanguages(fileTree);
  const fileNames = demoEntries.map((e) => e.path.split("/").pop()!);

  return {
    id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
    projectName,
    rootPath: `./${projectName}`,
    fileTree,
    totalFiles: demoEntries.filter((e) => e.type === "file").length,
    totalDirs: demoEntries.filter((e) => e.type === "directory").length,
    languages,
    frameworks: detectFrameworks(fileNames, {
      dependencies: { react: "^19.0.0", "react-dom": "^19.0.0", next: "^15.0.0" },
      devDependencies: { typescript: "^5.0.0", "@tailwindcss/postcss": "^4.0.0" },
    }),
    scannedAt: new Date().toISOString(),
  };
}
