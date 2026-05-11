/**
 * @fileoverview Zustand Store 单元测试
 */

import { useStore } from "@/store/useStore";
import type { PDFFileInfo } from "@/types";

/** 创建测试用 PDFFileInfo */
function createMockFile(id: string, name: string): PDFFileInfo {
  return {
    id,
    file: new File(["test"], name, { type: "application/pdf" }),
    name,
    size: 1024,
    pageCount: 5,
  };
}

describe("useStore", () => {
  beforeEach(() => {
    useStore.setState({
      activeTab: "merge",
      theme: "system",
      plan: "free",
      files: [],
      signatures: [],
      isProcessing: false,
      processingProgress: 0,
    });
  });

  describe("activeTab", () => {
    it("默认标签页应为 merge", () => {
      expect(useStore.getState().activeTab).toBe("merge");
    });

    it("应能切换标签页", () => {
      useStore.getState().setActiveTab("split");
      expect(useStore.getState().activeTab).toBe("split");
    });
  });

  describe("theme", () => {
    it("默认主题应为 system", () => {
      expect(useStore.getState().theme).toBe("system");
    });

    it("应能切换到深色模式", () => {
      useStore.getState().setTheme("dark");
      expect(useStore.getState().theme).toBe("dark");
    });
  });

  describe("files", () => {
    it("初始文件列表应为空", () => {
      expect(useStore.getState().files).toEqual([]);
    });

    it("应能添加文件", () => {
      const mockFile = createMockFile("1", "test.pdf");
      useStore.getState().addFiles([mockFile]);
      expect(useStore.getState().files).toHaveLength(1);
      expect(useStore.getState().files[0].name).toBe("test.pdf");
    });

    it("应能删除文件", () => {
      const mockFile = createMockFile("1", "test.pdf");
      useStore.getState().addFiles([mockFile]);
      useStore.getState().removeFile("1");
      expect(useStore.getState().files).toHaveLength(0);
    });

    it("应能清空文件列表", () => {
      useStore.getState().addFiles([
        createMockFile("1", "a.pdf"),
        createMockFile("2", "b.pdf"),
      ]);
      useStore.getState().clearFiles();
      expect(useStore.getState().files).toHaveLength(0);
    });

    it("应能重排文件顺序", () => {
      useStore.getState().addFiles([
        createMockFile("1", "a.pdf"),
        createMockFile("2", "b.pdf"),
        createMockFile("3", "c.pdf"),
      ]);
      useStore.getState().reorderFiles(0, 2);
      const names = useStore.getState().files.map((f) => f.name);
      expect(names).toEqual(["b.pdf", "c.pdf", "a.pdf"]);
    });
  });

  describe("signatures", () => {
    it("应能添加签名", () => {
      useStore.getState().addSignature({
        id: "sig1",
        dataUrl: "data:image/png;base64,test",
        createdAt: Date.now(),
      });
      expect(useStore.getState().signatures).toHaveLength(1);
    });

    it("应能删除签名", () => {
      useStore.getState().addSignature({
        id: "sig1",
        dataUrl: "data:image/png;base64,test",
        createdAt: Date.now(),
      });
      useStore.getState().removeSignature("sig1");
      expect(useStore.getState().signatures).toHaveLength(0);
    });
  });

  describe("plan & featureAccess", () => {
    it("免费版不应有 OCR 权限", () => {
      const access = useStore.getState().getFeatureAccess();
      expect(access.ocr).toBe(false);
      expect(access.merge).toBe(true);
      expect(access.split).toBe(true);
    });

    it("Pro 版应有 OCR 和批量处理权限", () => {
      useStore.getState().setPlan("pro");
      const access = useStore.getState().getFeatureAccess();
      expect(access.ocr).toBe(true);
      expect(access.batchProcess).toBe(true);
      expect(access.maxFiles).toBe(50);
    });

    it("终身版应有所有权限和最大文件数", () => {
      useStore.getState().setPlan("lifetime");
      const access = useStore.getState().getFeatureAccess();
      expect(access.ocr).toBe(true);
      expect(access.batchProcess).toBe(true);
      expect(access.maxFiles).toBe(100);
    });
  });

  describe("processing", () => {
    it("应能设置处理状态", () => {
      useStore.getState().setProcessing(true, 50);
      expect(useStore.getState().isProcessing).toBe(true);
      expect(useStore.getState().processingProgress).toBe(50);
    });

    it("重置处理状态时进度归零", () => {
      useStore.getState().setProcessing(true, 75);
      useStore.getState().setProcessing(false);
      expect(useStore.getState().isProcessing).toBe(false);
      expect(useStore.getState().processingProgress).toBe(0);
    });
  });
});
