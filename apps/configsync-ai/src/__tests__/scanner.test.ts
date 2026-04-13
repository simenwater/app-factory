/**
 * @fileoverview 扫描引擎单元测试
 */

import {
  buildFileTree,
  analyzeLanguages,
  detectFrameworks,
  generateTreeText,
  createDemoScanResult,
} from "@/lib/scanner";

describe("buildFileTree", () => {
  it("应正确构建文件节点树", () => {
    const entries = [
      { path: "src", type: "directory" as const },
      { path: "src/index.ts", type: "file" as const },
      { path: "package.json", type: "file" as const },
    ];

    const tree = buildFileTree(entries);
    expect(tree.length).toBeGreaterThan(0);
    expect(tree.some((n) => n.name === "src")).toBe(true);
    expect(tree.some((n) => n.name === "package.json")).toBe(true);
  });

  it("应过滤忽略的目录", () => {
    const entries = [
      { path: "node_modules", type: "directory" as const },
      { path: "src", type: "directory" as const },
    ];

    const tree = buildFileTree(entries);
    expect(tree.some((n) => n.name === "node_modules")).toBe(false);
    expect(tree.some((n) => n.name === "src")).toBe(true);
  });

  it("应过滤忽略的文件", () => {
    const entries = [
      { path: ".DS_Store", type: "file" as const },
      { path: "index.ts", type: "file" as const },
    ];

    const tree = buildFileTree(entries);
    expect(tree.some((n) => n.name === ".DS_Store")).toBe(false);
    expect(tree.some((n) => n.name === "index.ts")).toBe(true);
  });

  it("应正确设置文件扩展名", () => {
    const entries = [
      { path: "app.tsx", type: "file" as const },
      { path: "styles.css", type: "file" as const },
    ];

    const tree = buildFileTree(entries);
    expect(tree.find((n) => n.name === "app.tsx")?.extension).toBe(".tsx");
    expect(tree.find((n) => n.name === "styles.css")?.extension).toBe(".css");
  });
});

describe("analyzeLanguages", () => {
  it("应正确统计语言分布", () => {
    const entries = [
      { path: "a.ts", type: "file" as const },
      { path: "b.tsx", type: "file" as const },
      { path: "c.js", type: "file" as const },
    ];
    const tree = buildFileTree(entries);
    const languages = analyzeLanguages(tree);

    expect(languages.length).toBe(2);
    const ts = languages.find((l) => l.language === "TypeScript");
    expect(ts).toBeDefined();
    expect(ts!.fileCount).toBe(2);
  });

  it("应返回空数组当无文件时", () => {
    const languages = analyzeLanguages([]);
    expect(languages).toEqual([]);
  });

  it("应按文件数排序", () => {
    const entries = [
      { path: "a.ts", type: "file" as const },
      { path: "b.ts", type: "file" as const },
      { path: "c.ts", type: "file" as const },
      { path: "d.js", type: "file" as const },
    ];
    const tree = buildFileTree(entries);
    const languages = analyzeLanguages(tree);

    expect(languages[0].language).toBe("TypeScript");
  });
});

describe("detectFrameworks", () => {
  it("应通过文件名检测框架", () => {
    const fileNames = ["next.config.ts", "package.json"];
    const frameworks = detectFrameworks(fileNames);
    expect(frameworks).toContain("Next.js");
  });

  it("应通过 package.json 依赖检测框架", () => {
    const fileNames = ["package.json"];
    const packageJson = {
      dependencies: { react: "^19.0.0", next: "^15.0.0" },
      devDependencies: { "@tailwindcss/postcss": "^4.0.0" },
    };
    const frameworks = detectFrameworks(fileNames, packageJson);
    expect(frameworks).toContain("React");
    expect(frameworks).toContain("Tailwind CSS");
  });

  it("应在无匹配时返回空数组", () => {
    const frameworks = detectFrameworks(["random.txt"]);
    expect(frameworks).toEqual([]);
  });
});

describe("generateTreeText", () => {
  it("应生成树形文本", () => {
    const entries = [
      { path: "src", type: "directory" as const },
      { path: "src/index.ts", type: "file" as const },
    ];
    const tree = buildFileTree(entries);
    const text = generateTreeText(tree);

    expect(text).toContain("src/");
    expect(text).toContain("index.ts");
  });

  it("空节点应返回空字符串", () => {
    expect(generateTreeText([])).toBe("");
  });
});

describe("createDemoScanResult", () => {
  it("应创建有效的扫描结果", () => {
    const result = createDemoScanResult("test-project");
    expect(result.projectName).toBe("test-project");
    expect(result.totalFiles).toBeGreaterThan(0);
    expect(result.totalDirs).toBeGreaterThan(0);
    expect(result.languages.length).toBeGreaterThan(0);
    expect(result.frameworks.length).toBeGreaterThan(0);
    expect(result.scannedAt).toBeTruthy();
  });
});
