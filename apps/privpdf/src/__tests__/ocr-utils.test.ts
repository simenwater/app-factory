/**
 * @fileoverview OCR 工具函数单元测试
 */

import { getSupportedLanguages, fileToDataUrl } from "@/lib/ocr-utils";

describe("getSupportedLanguages", () => {
  it("应返回语言列表", () => {
    const languages = getSupportedLanguages();
    expect(languages.length).toBeGreaterThan(0);
  });

  it("应包含英语", () => {
    const languages = getSupportedLanguages();
    const eng = languages.find((l) => l.code === "eng");
    expect(eng).toBeDefined();
    expect(eng?.name).toBe("English");
  });

  it("应包含简体中文", () => {
    const languages = getSupportedLanguages();
    const zh = languages.find((l) => l.code === "chi_sim");
    expect(zh).toBeDefined();
    expect(zh?.name).toBe("简体中文");
  });

  it("每个语言应有 code 和 name", () => {
    const languages = getSupportedLanguages();
    languages.forEach((lang) => {
      expect(lang.code).toBeTruthy();
      expect(lang.name).toBeTruthy();
    });
  });
});

describe("fileToDataUrl", () => {
  it("应将 Blob 转为 data URL", async () => {
    const blob = new Blob(["hello"], { type: "text/plain" });
    const dataUrl = await fileToDataUrl(blob);
    expect(dataUrl).toMatch(/^data:text\/plain;base64,/);
  });

  it("应将 File 转为 data URL", async () => {
    const file = new File(["test content"], "test.txt", { type: "text/plain" });
    const dataUrl = await fileToDataUrl(file);
    expect(dataUrl).toMatch(/^data:/);
  });
});
