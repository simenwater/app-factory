import { generateAgentsFile, getFilename } from "@/lib/generator";
import type { RepoInfo, GenerateOptions } from "@/types";

/**
 * @description 创建用于测试的 mock 仓库信息
 */
function createMockRepoInfo(overrides?: Partial<RepoInfo>): RepoInfo {
  return {
    owner: "testowner",
    name: "testrepo",
    description: "A test repository",
    language: "TypeScript",
    languages: { TypeScript: 5000, JavaScript: 2000, CSS: 1000 },
    framework: "Next.js",
    packageManager: "npm",
    hasTests: true,
    hasCi: true,
    structure: [
      {
        name: "src",
        type: "directory",
        children: [
          { name: "index.ts", type: "file" },
          { name: "lib", type: "directory", children: [{ name: "utils.ts", type: "file" }] },
        ],
      },
      { name: "package.json", type: "file" },
    ],
    files: [
      "src/index.ts",
      "src/lib/utils.ts",
      "package.json",
      "tsconfig.json",
      ".eslintrc.json",
      "jest.config.ts",
      "src/__tests__/utils.test.ts",
      ".github/workflows/ci.yml",
    ],
    configFiles: ["tsconfig.json", ".eslintrc.json", "jest.config.ts"],
    dependencies: { next: "^15.0.0", react: "^19.0.0" },
    devDependencies: { typescript: "^5.0.0", jest: "^29.0.0" },
    ...overrides,
  };
}

/**
 * @description 创建用于测试的默认选项
 */
function createDefaultOptions(
  overrides?: Partial<GenerateOptions>
): GenerateOptions {
  return {
    repoUrl: "https://github.com/testowner/testrepo",
    format: "generic",
    includeCodeStyle: true,
    includeArchitecture: true,
    includeDependencies: true,
    includeTestingGuide: true,
    includeContributing: false,
    customInstructions: "",
    ...overrides,
  };
}

describe("getFilename", () => {
  it("should return .cursorrules for cursor format", () => {
    expect(getFilename("cursor")).toBe(".cursorrules");
  });

  it("should return copilot instructions path for github-copilot", () => {
    expect(getFilename("github-copilot")).toBe(
      ".github/copilot-instructions.md"
    );
  });

  it("should return CLAUDE.md for claude format", () => {
    expect(getFilename("claude")).toBe("CLAUDE.md");
  });

  it("should return AGENTS.md for generic format", () => {
    expect(getFilename("generic")).toBe("AGENTS.md");
  });
});

describe("generateAgentsFile", () => {
  it("should generate content with overview section", () => {
    const repo = createMockRepoInfo();
    const options = createDefaultOptions();
    const result = generateAgentsFile(repo, options);

    expect(result.content).toContain("testowner/testrepo");
    expect(result.content).toContain("TypeScript");
    expect(result.content).toContain("Next.js");
    expect(result.content).toContain("npm");
    expect(result.filename).toBe("AGENTS.md");
  });

  it("should include architecture when enabled", () => {
    const repo = createMockRepoInfo();
    const options = createDefaultOptions({ includeArchitecture: true });
    const result = generateAgentsFile(repo, options);

    expect(result.content).toContain("Project Architecture");
    expect(result.content).toContain("src");
  });

  it("should exclude architecture when disabled", () => {
    const repo = createMockRepoInfo();
    const options = createDefaultOptions({ includeArchitecture: false });
    const result = generateAgentsFile(repo, options);

    expect(result.content).not.toContain("Project Architecture");
  });

  it("should include code style when enabled", () => {
    const repo = createMockRepoInfo();
    const options = createDefaultOptions({ includeCodeStyle: true });
    const result = generateAgentsFile(repo, options);

    expect(result.content).toContain("Code Style");
    expect(result.content).toContain("ESLint");
  });

  it("should include dependencies when enabled", () => {
    const repo = createMockRepoInfo();
    const options = createDefaultOptions({ includeDependencies: true });
    const result = generateAgentsFile(repo, options);

    expect(result.content).toContain("Dependencies");
    expect(result.content).toContain("next");
    expect(result.content).toContain("react");
  });

  it("should include testing guide when enabled", () => {
    const repo = createMockRepoInfo();
    const options = createDefaultOptions({ includeTestingGuide: true });
    const result = generateAgentsFile(repo, options);

    expect(result.content).toContain("Testing");
    expect(result.content).toContain("Jest");
  });

  it("should include contributing guide when enabled", () => {
    const repo = createMockRepoInfo();
    const options = createDefaultOptions({ includeContributing: true });
    const result = generateAgentsFile(repo, options);

    expect(result.content).toContain("Contributing");
    expect(result.content).toContain("git clone");
  });

  it("should include custom instructions when provided", () => {
    const repo = createMockRepoInfo();
    const options = createDefaultOptions({
      customInstructions: "Always use functional components",
    });
    const result = generateAgentsFile(repo, options);

    expect(result.content).toContain("Custom Instructions");
    expect(result.content).toContain(
      "Always use functional components"
    );
  });

  it("should use correct header for cursor format", () => {
    const repo = createMockRepoInfo();
    const options = createDefaultOptions({ format: "cursor" });
    const result = generateAgentsFile(repo, options);

    expect(result.content).toContain("Cursor Rules");
    expect(result.filename).toBe(".cursorrules");
    expect(result.format).toBe("cursor");
  });

  it("should use correct header for claude format", () => {
    const repo = createMockRepoInfo();
    const options = createDefaultOptions({ format: "claude" });
    const result = generateAgentsFile(repo, options);

    expect(result.content).toContain("CLAUDE.md");
    expect(result.filename).toBe("CLAUDE.md");
  });

  it("should use correct header for copilot format", () => {
    const repo = createMockRepoInfo();
    const options = createDefaultOptions({ format: "github-copilot" });
    const result = generateAgentsFile(repo, options);

    expect(result.content).toContain("Copilot Instructions");
    expect(result.filename).toBe(".github/copilot-instructions.md");
  });

  it("should include language distribution in code style", () => {
    const repo = createMockRepoInfo();
    const options = createDefaultOptions({ includeCodeStyle: true });
    const result = generateAgentsFile(repo, options);

    expect(result.content).toContain("Language Distribution");
    expect(result.content).toContain("TypeScript");
  });

  it("should always include footer", () => {
    const repo = createMockRepoInfo();
    const options = createDefaultOptions();
    const result = generateAgentsFile(repo, options);

    expect(result.content).toContain("AgentConfig Pro");
  });

  it("should handle repo with no tests", () => {
    const repo = createMockRepoInfo({ hasTests: false });
    const options = createDefaultOptions({ includeTestingGuide: true });
    const result = generateAgentsFile(repo, options);

    expect(result.content).toContain("No test files detected");
  });

  it("should handle repo with no dependencies", () => {
    const repo = createMockRepoInfo({
      dependencies: {},
      devDependencies: {},
    });
    const options = createDefaultOptions({ includeDependencies: true });
    const result = generateAgentsFile(repo, options);

    expect(result.content).toContain("No package.json dependencies detected");
  });
});
