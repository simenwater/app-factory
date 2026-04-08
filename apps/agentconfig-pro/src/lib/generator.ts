import type { RepoInfo, AgentFormat, GenerateOptions, GenerateResult } from "@/types";
import type { DirectoryNode } from "@/types";

/**
 * @description 将目录树渲染为文本格式
 */
function renderTree(nodes: DirectoryNode[], prefix: string = ""): string {
  let result = "";
  const sorted = [...nodes].sort((a, b) => {
    if (a.type === b.type) return a.name.localeCompare(b.name);
    return a.type === "directory" ? -1 : 1;
  });

  sorted.forEach((node, index) => {
    const isLast = index === sorted.length - 1;
    const connector = isLast ? "└── " : "├── ";
    const icon = node.type === "directory" ? "📁 " : "";
    result += `${prefix}${connector}${icon}${node.name}\n`;

    if (node.children && node.children.length > 0) {
      const newPrefix = prefix + (isLast ? "    " : "│   ");
      result += renderTree(node.children, newPrefix);
    }
  });

  return result;
}

/**
 * @description 生成项目概览章节
 */
function generateOverview(repo: RepoInfo): string {
  let section = `## Project Overview\n\n`;
  section += `- **Repository**: ${repo.owner}/${repo.name}\n`;
  if (repo.description) {
    section += `- **Description**: ${repo.description}\n`;
  }
  section += `- **Primary Language**: ${repo.language}\n`;
  if (repo.framework) {
    section += `- **Framework**: ${repo.framework}\n`;
  }
  if (repo.packageManager) {
    section += `- **Package Manager**: ${repo.packageManager}\n`;
  }
  section += `- **Has Tests**: ${repo.hasTests ? "Yes" : "No"}\n`;
  section += `- **Has CI/CD**: ${repo.hasCi ? "Yes" : "No"}\n`;
  return section;
}

/**
 * @description 生成项目架构章节
 */
function generateArchitecture(repo: RepoInfo): string {
  let section = `## Project Architecture\n\n`;
  section += "```\n";
  section += renderTree(repo.structure);
  section += "```\n";
  return section;
}

/**
 * @description 生成代码风格章节
 */
function generateCodeStyle(repo: RepoInfo): string {
  let section = `## Code Style & Conventions\n\n`;

  const hasEslint = repo.configFiles.some((f) => f.includes(".eslint"));
  const hasPrettier = repo.configFiles.some((f) => f.includes(".prettier"));
  const hasTsConfig = repo.configFiles.some((f) => f.includes("tsconfig"));
  const hasEditorConfig = repo.configFiles.some((f) =>
    f.includes(".editorconfig")
  );

  if (hasEslint) section += "- **Linting**: ESLint is configured\n";
  if (hasPrettier) section += "- **Formatting**: Prettier is configured\n";
  if (hasTsConfig) section += "- **TypeScript**: Strict type checking enabled\n";
  if (hasEditorConfig)
    section += "- **Editor Config**: EditorConfig is present\n";

  const langEntries = Object.entries(repo.languages).sort(
    ([, a], [, b]) => b - a
  );
  if (langEntries.length > 0) {
    const total = langEntries.reduce((sum, [, bytes]) => sum + bytes, 0);
    section += "\n### Language Distribution\n\n";
    for (const [lang, bytes] of langEntries.slice(0, 8)) {
      const pct = ((bytes / total) * 100).toFixed(1);
      section += `- ${lang}: ${pct}%\n`;
    }
  }

  return section;
}

/**
 * @description 生成依赖管理章节
 */
function generateDependencies(repo: RepoInfo): string {
  let section = `## Dependencies\n\n`;

  const deps = Object.keys(repo.dependencies);
  const devDeps = Object.keys(repo.devDependencies);

  if (deps.length > 0) {
    section += "### Production Dependencies\n\n";
    const keyDeps = deps.slice(0, 20);
    for (const dep of keyDeps) {
      section += `- \`${dep}\`: ${repo.dependencies[dep]}\n`;
    }
    if (deps.length > 20) {
      section += `- ... and ${deps.length - 20} more\n`;
    }
    section += "\n";
  }

  if (devDeps.length > 0) {
    section += "### Dev Dependencies\n\n";
    const keyDevDeps = devDeps.slice(0, 15);
    for (const dep of keyDevDeps) {
      section += `- \`${dep}\`: ${repo.devDependencies[dep]}\n`;
    }
    if (devDeps.length > 15) {
      section += `- ... and ${devDeps.length - 15} more\n`;
    }
    section += "\n";
  }

  if (deps.length === 0 && devDeps.length === 0) {
    section += "_No package.json dependencies detected._\n";
  }

  return section;
}

/**
 * @description 生成测试指南章节
 */
function generateTestingGuide(repo: RepoInfo): string {
  let section = `## Testing\n\n`;

  if (!repo.hasTests) {
    section +=
      "_No test files detected in this repository. Consider adding tests._\n";
    return section;
  }

  const hasJest = repo.configFiles.some((f) => f.includes("jest.config"));
  const hasVitest = repo.configFiles.some((f) => f.includes("vitest.config"));
  const hasPytest = repo.files.some(
    (f) => f.includes("pytest") || f.includes("conftest.py")
  );

  if (hasJest) {
    section += "- **Test Runner**: Jest\n";
    section += "- **Run Tests**: `npm test` or `npx jest`\n";
  } else if (hasVitest) {
    section += "- **Test Runner**: Vitest\n";
    section += "- **Run Tests**: `npx vitest`\n";
  } else if (hasPytest) {
    section += "- **Test Runner**: pytest\n";
    section += "- **Run Tests**: `pytest`\n";
  }

  const testFiles = repo.files.filter(
    (f) =>
      f.includes("__tests__") ||
      f.includes(".test.") ||
      f.includes(".spec.")
  );
  section += `\n### Test Files (${testFiles.length} found)\n\n`;
  for (const tf of testFiles.slice(0, 15)) {
    section += `- \`${tf}\`\n`;
  }
  if (testFiles.length > 15) {
    section += `- ... and ${testFiles.length - 15} more\n`;
  }

  return section;
}

/**
 * @description 生成贡献指南章节
 */
function generateContributing(repo: RepoInfo): string {
  let section = `## Contributing Guidelines\n\n`;
  section += `### Getting Started\n\n`;

  if (repo.packageManager) {
    const installCmd =
      repo.packageManager === "yarn"
        ? "yarn install"
        : repo.packageManager === "pnpm"
          ? "pnpm install"
          : repo.packageManager === "bun"
            ? "bun install"
            : repo.packageManager === "npm"
              ? "npm install"
              : `# Install dependencies using ${repo.packageManager}`;

    section += "```bash\n";
    section += `git clone https://github.com/${repo.owner}/${repo.name}.git\n`;
    section += `cd ${repo.name}\n`;
    section += `${installCmd}\n`;
    section += "```\n\n";
  }

  if (repo.hasCi) {
    section +=
      "### CI/CD\n\nThis project uses automated CI/CD. Ensure all checks pass before submitting a PR.\n\n";
  }

  section +=
    "### Code Review\n\n- Follow the existing code style\n- Write tests for new features\n- Keep PRs focused and small\n";

  return section;
}

/**
 * @description 获取各格式对应的文件名
 */
export function getFilename(format: AgentFormat): string {
  switch (format) {
    case "cursor":
      return ".cursorrules";
    case "github-copilot":
      return ".github/copilot-instructions.md";
    case "claude":
      return "CLAUDE.md";
    case "generic":
    default:
      return "AGENTS.md";
  }
}

/**
 * @description 获取特定格式的头部说明
 */
function getFormatHeader(format: AgentFormat, repo: RepoInfo): string {
  switch (format) {
    case "cursor":
      return `# Cursor Rules for ${repo.owner}/${repo.name}\n\nThis file provides context and instructions for Cursor AI assistant.\n\n`;
    case "github-copilot":
      return `# Copilot Instructions for ${repo.owner}/${repo.name}\n\nThis file provides context for GitHub Copilot.\n\n`;
    case "claude":
      return `# CLAUDE.md — ${repo.owner}/${repo.name}\n\nThis file provides context for Claude Code to understand and work with this codebase.\n\n`;
    case "generic":
    default:
      return `# AGENTS.md — ${repo.owner}/${repo.name}\n\nThis file provides context for AI coding assistants to understand and work with this codebase.\n\n`;
  }
}

/**
 * @description 根据选项和仓库信息生成完整的 AGENTS.md 内容
 * @param repo - 仓库分析结果
 * @param options - 生成选项
 * @returns 生成结果
 */
export function generateAgentsFile(
  repo: RepoInfo,
  options: GenerateOptions
): GenerateResult {
  const { format } = options;
  let content = getFormatHeader(format, repo);

  content += generateOverview(repo) + "\n";

  if (options.includeArchitecture) {
    content += generateArchitecture(repo) + "\n";
  }

  if (options.includeCodeStyle) {
    content += generateCodeStyle(repo) + "\n";
  }

  if (options.includeDependencies) {
    content += generateDependencies(repo) + "\n";
  }

  if (options.includeTestingGuide) {
    content += generateTestingGuide(repo) + "\n";
  }

  if (options.includeContributing) {
    content += generateContributing(repo) + "\n";
  }

  if (options.customInstructions.trim()) {
    content += `## Custom Instructions\n\n${options.customInstructions.trim()}\n\n`;
  }

  content += `---\n_Generated by [AgentConfig Pro](https://agentconfig.pro) — AI Coding Assistant Configuration Generator_\n`;

  return {
    content,
    filename: getFilename(format),
    format,
    repoInfo: repo,
  };
}
