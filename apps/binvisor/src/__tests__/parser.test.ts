/**
 * @fileoverview 协议解析器单元测试
 */

import {
  parseProtocol,
  getExampleProtocol,
  getIPv4Example,
  getUDPExample,
} from "@/lib/parser";

describe("parseProtocol", () => {
  describe("空输入处理", () => {
    it("空字符串应返回失败", () => {
      const result = parseProtocol("");
      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("纯空白应返回失败", () => {
      const result = parseProtocol("   \n  \n  ");
      expect(result.success).toBe(false);
    });
  });

  describe("简单格式解析", () => {
    it("应解析带括号位宽的字段", () => {
      const input = `Source Port: uint16(16) Source port number
Destination Port: uint16(16) Dest port`;
      const result = parseProtocol(input);
      expect(result.success).toBe(true);
      expect(result.structure!.fields).toHaveLength(2);
      expect(result.structure!.fields[0].name).toBe("Source Port");
      expect(result.structure!.fields[0].type).toBe("uint16");
      expect(result.structure!.fields[0].bits).toBe(16);
      expect(result.structure!.fields[0].description).toBe("Source port number");
    });

    it("应解析不带位宽的字段（使用默认值）", () => {
      const input = "MyField: uint32";
      const result = parseProtocol(input);
      expect(result.success).toBe(true);
      expect(result.structure!.fields[0].bits).toBe(32);
    });

    it("应解析空格分隔的位宽", () => {
      const input = "Flags: flags 9 bits Control flags";
      const result = parseProtocol(input);
      expect(result.success).toBe(true);
      expect(result.structure!.fields[0].bits).toBe(9);
      expect(result.structure!.fields[0].type).toBe("flags");
    });
  });

  describe("表格格式解析", () => {
    it("应解析 Markdown 表格", () => {
      const input = `| Field | Type | Bits | Description |
|-------|------|------|-------------|
| Version | uint8 | 4 | IP version |
| IHL | uint8 | 4 | Header length |
| Total Length | uint16 | 16 | Packet length |`;
      const result = parseProtocol(input);
      expect(result.success).toBe(true);
      expect(result.structure!.fields).toHaveLength(3);
      expect(result.structure!.fields[0].name).toBe("Version");
      expect(result.structure!.fields[0].bits).toBe(4);
      expect(result.structure!.fields[2].name).toBe("Total Length");
    });
  });

  describe("C-like 格式解析", () => {
    it("应解析 C 风格字段声明", () => {
      const input = `uint16 source_port; // Source port
uint16 dest_port; // Destination port
uint32 sequence; // Sequence number`;
      const result = parseProtocol(input);
      expect(result.success).toBe(true);
      expect(result.structure!.fields).toHaveLength(3);
      expect(result.structure!.fields[0].name).toBe("source_port");
      expect(result.structure!.fields[0].type).toBe("uint16");
      expect(result.structure!.fields[0].bits).toBe(16);
    });

    it("应解析数组语法", () => {
      const input = "uint8 data[4]; // Payload data";
      const result = parseProtocol(input);
      expect(result.success).toBe(true);
      expect(result.structure!.fields[0].bits).toBe(32);
    });
  });

  describe("元数据解析", () => {
    it("应提取协议名称", () => {
      const input = `# Protocol: My Custom Protocol
Field1: uint8(8)`;
      const result = parseProtocol(input);
      expect(result.success).toBe(true);
      expect(result.structure!.name).toBe("My Custom Protocol");
    });

    it("应提取字节序", () => {
      const input = `# Endianness: Little
Field1: uint16(16)`;
      const result = parseProtocol(input);
      expect(result.success).toBe(true);
      expect(result.structure!.endianness).toBe("little");
    });

    it("默认字节序为大端序", () => {
      const input = "Field1: uint8(8)";
      const result = parseProtocol(input);
      expect(result.structure!.endianness).toBe("big");
    });
  });

  describe("类型别名", () => {
    it("应识别 byte 别名", () => {
      const input = "Data: byte(8)";
      const result = parseProtocol(input);
      expect(result.success).toBe(true);
      expect(result.structure!.fields[0].type).toBe("uint8");
    });

    it("应识别 double 别名", () => {
      const input = "Value: double(64)";
      const result = parseProtocol(input);
      expect(result.success).toBe(true);
      expect(result.structure!.fields[0].type).toBe("float64");
    });
  });

  describe("总位数计算", () => {
    it("应正确计算总位数", () => {
      const input = `A: uint8(8)
B: uint16(16)
C: uint32(32)`;
      const result = parseProtocol(input);
      expect(result.structure!.totalBits).toBe(56);
    });
  });

  describe("颜色分配", () => {
    it("应为每个字段分配颜色", () => {
      const input = `A: uint8(8)
B: uint8(8)
C: uint8(8)`;
      const result = parseProtocol(input);
      result.structure!.fields.forEach((field) => {
        expect(field.color).toBeDefined();
        expect(field.color).toMatch(/^#[0-9a-f]{6}$/i);
      });
    });
  });

  describe("示例协议", () => {
    it("TCP 示例应解析成功", () => {
      const result = parseProtocol(getExampleProtocol());
      expect(result.success).toBe(true);
      expect(result.structure!.fields.length).toBeGreaterThan(0);
      expect(result.structure!.name).toContain("TCP");
    });

    it("IPv4 示例应解析成功", () => {
      const result = parseProtocol(getIPv4Example());
      expect(result.success).toBe(true);
      expect(result.structure!.fields.length).toBeGreaterThan(0);
    });

    it("UDP 示例应解析成功", () => {
      const result = parseProtocol(getUDPExample());
      expect(result.success).toBe(true);
      expect(result.structure!.fields).toHaveLength(4);
    });
  });
});
