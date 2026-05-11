/**
 * @fileoverview PDF 工具函数的单元测试
 */

import { parsePageRanges, generateId } from "@/lib/pdf-utils";

describe("parsePageRanges", () => {
  it("应正确解析单个页码", () => {
    const result = parsePageRanges("3", 10);
    expect(result).toEqual([2]);
  });

  it("应正确解析连续范围", () => {
    const result = parsePageRanges("1-3", 10);
    expect(result).toEqual([0, 1, 2]);
  });

  it("应正确解析混合范围", () => {
    const result = parsePageRanges("1-3,5,7-9", 10);
    expect(result).toEqual([0, 1, 2, 4, 6, 7, 8]);
  });

  it("应过滤超出范围的页码", () => {
    const result = parsePageRanges("1-3,15,20", 10);
    expect(result).toEqual([0, 1, 2]);
  });

  it("应处理重复页码", () => {
    const result = parsePageRanges("1,1,2,2-3", 10);
    expect(result).toEqual([0, 1, 2]);
  });

  it("应处理空字符串", () => {
    const result = parsePageRanges("", 10);
    expect(result).toEqual([]);
  });

  it("应处理无效输入", () => {
    const result = parsePageRanges("abc,xyz", 10);
    expect(result).toEqual([]);
  });

  it("应自动排序结果", () => {
    const result = parsePageRanges("5,1,3", 10);
    expect(result).toEqual([0, 2, 4]);
  });

  it("应正确处理边界值", () => {
    const result = parsePageRanges("1,10", 10);
    expect(result).toEqual([0, 9]);
  });

  it("应忽略页码 0 和负数", () => {
    const result = parsePageRanges("0,-1,1", 10);
    expect(result).toEqual([0]);
  });
});

describe("generateId", () => {
  it("应生成唯一 ID", () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).not.toBe(id2);
  });

  it("ID 应为字符串类型", () => {
    expect(typeof generateId()).toBe("string");
  });

  it("ID 应有合理长度", () => {
    const id = generateId();
    expect(id.length).toBeGreaterThan(5);
  });
});
