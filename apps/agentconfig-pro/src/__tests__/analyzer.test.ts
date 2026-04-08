import {
  parseGitHubUrl,
  buildDirectoryTree,
  detectFramework,
  detectPackageManager,
  detectConfigFiles,
} from "@/lib/analyzer";

describe("parseGitHubUrl", () => {
  it("should parse standard HTTPS URL", () => {
    const result = parseGitHubUrl("https://github.com/vercel/next.js");
    expect(result).toEqual({ owner: "vercel", repo: "next.js" });
  });

  it("should parse URL with .git suffix", () => {
    const result = parseGitHubUrl(
      "https://github.com/facebook/react.git"
    );
    expect(result).toEqual({ owner: "facebook", repo: "react" });
  });

  it("should parse SSH URL", () => {
    const result = parseGitHubUrl("git@github.com:vercel/next.js.git");
    expect(result).toEqual({ owner: "vercel", repo: "next.js" });
  });

  it("should parse owner/repo shorthand", () => {
    const result = parseGitHubUrl("vercel/next.js");
    expect(result).toEqual({ owner: "vercel", repo: "next.js" });
  });

  it("should return null for invalid URL", () => {
    expect(parseGitHubUrl("not-a-url")).toBeNull();
    expect(parseGitHubUrl("")).toBeNull();
    expect(parseGitHubUrl("https://gitlab.com/user/repo")).toBeNull();
  });

  it("should trim whitespace", () => {
    const result = parseGitHubUrl(
      "  https://github.com/vercel/next.js  "
    );
    expect(result).toEqual({ owner: "vercel", repo: "next.js" });
  });
});

describe("buildDirectoryTree", () => {
  it("should build a tree from file paths", () => {
    const files = ["src/index.ts", "src/lib/utils.ts", "package.json"];
    const tree = buildDirectoryTree(files);

    expect(tree).toHaveLength(2);
    const srcNode = tree.find((n) => n.name === "src");
    expect(srcNode?.type).toBe("directory");
    expect(srcNode?.children).toHaveLength(2);
  });

  it("should respect maxDepth", () => {
    const files = [
      "a/b/c/d/e/f.ts",
      "a/b/c.ts",
    ];
    const tree = buildDirectoryTree(files, 2);
    const aNode = tree.find((n) => n.name === "a");
    expect(aNode?.children).toBeDefined();
    const bNode = aNode?.children?.find((n) => n.name === "b");
    expect(bNode?.children?.find((n) => n.name === "c.ts")).toBeDefined();
  });

  it("should handle empty file list", () => {
    const tree = buildDirectoryTree([]);
    expect(tree).toEqual([]);
  });
});

describe("detectFramework", () => {
  it("should detect Next.js", () => {
    expect(detectFramework(["next.config.ts", "package.json"])).toBe(
      "Next.js"
    );
  });

  it("should detect Vue", () => {
    expect(detectFramework(["vue.config.js"])).toBe("Vue");
  });

  it("should detect Django", () => {
    expect(detectFramework(["manage.py", "requirements.txt"])).toBe(
      "Django"
    );
  });

  it("should detect Go", () => {
    expect(detectFramework(["go.mod", "main.go"])).toBe("Go");
  });

  it("should detect Rust", () => {
    expect(detectFramework(["Cargo.toml", "src/main.rs"])).toBe(
      "Rust (Cargo)"
    );
  });

  it("should return null for unknown framework", () => {
    expect(detectFramework(["README.md", "script.sh"])).toBeNull();
  });
});

describe("detectPackageManager", () => {
  it("should detect npm", () => {
    expect(detectPackageManager(["package-lock.json"])).toBe("npm");
  });

  it("should detect yarn", () => {
    expect(detectPackageManager(["yarn.lock"])).toBe("yarn");
  });

  it("should detect pnpm", () => {
    expect(detectPackageManager(["pnpm-lock.yaml"])).toBe("pnpm");
  });

  it("should detect bun", () => {
    expect(detectPackageManager(["bun.lockb"])).toBe("bun");
  });

  it("should detect pip", () => {
    expect(detectPackageManager(["requirements.txt"])).toBe("pip");
  });

  it("should detect cargo", () => {
    expect(detectPackageManager(["Cargo.lock"])).toBe("cargo");
  });

  it("should detect go modules", () => {
    expect(detectPackageManager(["go.sum"])).toBe("go modules");
  });

  it("should return null when no lockfile found", () => {
    expect(detectPackageManager(["README.md"])).toBeNull();
  });
});

describe("detectConfigFiles", () => {
  it("should detect eslint config", () => {
    const configs = detectConfigFiles([".eslintrc.json", "src/index.ts"]);
    expect(configs).toContain(".eslintrc.json");
    expect(configs).not.toContain("src/index.ts");
  });

  it("should detect multiple configs", () => {
    const files = [
      "tsconfig.json",
      ".prettierrc",
      "Dockerfile",
      ".github/workflows/ci.yml",
      "src/main.ts",
    ];
    const configs = detectConfigFiles(files);
    expect(configs).toHaveLength(4);
  });

  it("should return empty array when no configs", () => {
    expect(detectConfigFiles(["src/index.ts", "README.md"])).toEqual([]);
  });
});
