/**
 * @fileoverview 导出功能单元测试
 */

import {
  generateSVG,
  exportToJSON,
  exportToMarkdown,
} from "@/lib/exporter";
import type { ProtocolStructure } from "@/types";

/** 测试用协议结构 */
const mockStructure: ProtocolStructure = {
  name: "Test Protocol",
  description: "A test protocol",
  endianness: "big",
  totalBits: 64,
  fields: [
    {
      name: "Source Port",
      type: "uint16",
      bits: 16,
      description: "Source port number",
      color: "#6366f1",
    },
    {
      name: "Dest Port",
      type: "uint16",
      bits: 16,
      description: "Destination port",
      color: "#8b5cf6",
    },
    {
      name: "Length",
      type: "uint16",
      bits: 16,
      description: "Datagram length",
      color: "#ec4899",
    },
    {
      name: "Checksum",
      type: "uint16",
      bits: 16,
      description: "Checksum",
      color: "#f43f5e",
    },
  ],
};

describe("generateSVG", () => {
  it("应生成有效的 SVG 字符串", () => {
    const svg = generateSVG(mockStructure);
    expect(svg).toContain("<svg");
    expect(svg).toContain("</svg>");
    expect(svg).toContain("xmlns");
  });

  it("应包含协议名称", () => {
    const svg = generateSVG(mockStructure);
    expect(svg).toContain("Test Protocol");
  });

  it("应包含字段名称", () => {
    const svg = generateSVG(mockStructure);
    expect(svg).toContain("Source Port");
    expect(svg).toContain("Dest Port");
  });

  it("应包含字段颜色", () => {
    const svg = generateSVG(mockStructure);
    expect(svg).toContain("#6366f1");
    expect(svg).toContain("#8b5cf6");
  });
});

describe("exportToJSON", () => {
  it("应生成有效的 JSON", () => {
    const json = exportToJSON(mockStructure);
    const parsed = JSON.parse(json);
    expect(parsed.name).toBe("Test Protocol");
    expect(parsed.fields).toHaveLength(4);
  });

  it("应包含所有字段信息", () => {
    const json = exportToJSON(mockStructure);
    const parsed = JSON.parse(json);
    expect(parsed.fields[0].name).toBe("Source Port");
    expect(parsed.fields[0].type).toBe("uint16");
    expect(parsed.fields[0].bits).toBe(16);
  });

  it("JSON 应包含总位数", () => {
    const json = exportToJSON(mockStructure);
    const parsed = JSON.parse(json);
    expect(parsed.totalBits).toBe(64);
  });
});

describe("exportToMarkdown", () => {
  it("应生成 Markdown 标题", () => {
    const md = exportToMarkdown(mockStructure);
    expect(md).toContain("# Test Protocol");
  });

  it("应包含字段表格", () => {
    const md = exportToMarkdown(mockStructure);
    expect(md).toContain("| Offset (bits)");
    expect(md).toContain("| 0 | Source Port | uint16 | 16 |");
    expect(md).toContain("| 16 | Dest Port | uint16 | 16 |");
  });

  it("应包含描述信息", () => {
    const md = exportToMarkdown(mockStructure);
    expect(md).toContain("A test protocol");
  });

  it("应包含总大小信息", () => {
    const md = exportToMarkdown(mockStructure);
    expect(md).toContain("64 bits");
    expect(md).toContain("8 bytes");
  });

  it("应包含字节序信息", () => {
    const md = exportToMarkdown(mockStructure);
    expect(md).toContain("Big Endian");
  });
});
