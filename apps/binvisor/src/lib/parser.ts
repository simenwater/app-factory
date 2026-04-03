/**
 * @fileoverview 文本协议规范解析器
 * 支持多种文本格式描述的二进制协议规范，将其解析为结构化的 ProtocolStructure。
 *
 * 支持的格式：
 * 1. 简单格式: `字段名: 类型(位宽) [描述]`
 * 2. 表格格式: `| 字段名 | 类型 | 位宽 | 描述 |`
 * 3. C-like 格式: `uint16 field_name; // 描述`
 */

import type {
  ProtocolField,
  ParseResult,
  FieldType,
  Endianness,
} from "@/types";

/** 预定义的字段颜色调色板 */
const FIELD_COLORS = [
  "#6366f1", // indigo
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#f43f5e", // rose
  "#f97316", // orange
  "#eab308", // yellow
  "#22c55e", // green
  "#14b8a6", // teal
  "#06b6d4", // cyan
  "#3b82f6", // blue
];

/** 有效的字段类型列表 */
const VALID_TYPES: FieldType[] = [
  "uint8", "uint16", "uint32", "uint64",
  "int8", "int16", "int32", "int64",
  "float32", "float64",
  "bytes", "string", "bool", "reserved", "flags", "enum",
];

/**
 * 从类型字符串推断默认位宽
 * @param {string} type - 字段类型
 * @returns {number} 默认位宽
 */
function defaultBitsForType(type: FieldType): number {
  const map: Record<string, number> = {
    uint8: 8, int8: 8, bool: 8,
    uint16: 16, int16: 16,
    uint32: 32, int32: 32, float32: 32,
    uint64: 64, int64: 64, float64: 64,
  };
  return map[type] ?? 8;
}

/**
 * 规范化类型字符串
 * @param {string} raw - 原始类型字符串
 * @returns {FieldType | null} 规范化后的类型，无效则返回 null
 */
function normalizeType(raw: string): FieldType | null {
  const lower = raw.toLowerCase().trim();
  if (VALID_TYPES.includes(lower as FieldType)) return lower as FieldType;

  const aliases: Record<string, FieldType> = {
    byte: "uint8",
    char: "uint8",
    short: "int16",
    ushort: "uint16",
    int: "int32",
    uint: "uint32",
    long: "int64",
    ulong: "uint64",
    float: "float32",
    double: "float64",
    boolean: "bool",
    bit: "bool",
    pad: "reserved",
    padding: "reserved",
    flag: "flags",
    str: "string",
  };

  return aliases[lower] ?? null;
}

/**
 * 尝试以"简单格式"解析一行
 * 格式: `字段名: 类型(位宽) [描述]` 或 `字段名: 类型 位宽bits [描述]`
 * @param {string} line - 待解析的行
 * @returns {ProtocolField | null}
 */
function parseSimpleLine(line: string): ProtocolField | null {
  // 匹配: name : type(bits) description
  const pattern1 = /^(\w[\w\s]*?)\s*:\s*(\w+)\s*\(\s*(\d+)\s*(?:bits?)?\s*\)\s*(.*)?$/i;
  const m1 = line.match(pattern1);
  if (m1) {
    const type = normalizeType(m1[2]);
    if (!type) return null;
    return {
      name: m1[1].trim(),
      type,
      bits: parseInt(m1[3], 10),
      description: m1[4]?.trim() || undefined,
    };
  }

  // 匹配: name : type bits描述
  const pattern2 = /^(\w[\w\s]*?)\s*:\s*(\w+)\s+(\d+)\s*(?:bits?)?\s*(.*)?$/i;
  const m2 = line.match(pattern2);
  if (m2) {
    const type = normalizeType(m2[2]);
    if (!type) return null;
    return {
      name: m2[1].trim(),
      type,
      bits: parseInt(m2[3], 10),
      description: m2[4]?.trim() || undefined,
    };
  }

  // 匹配: name : type  (无显式位宽，使用默认值)
  const pattern3 = /^(\w[\w\s]*?)\s*:\s*(\w+)\s*$/i;
  const m3 = line.match(pattern3);
  if (m3) {
    const type = normalizeType(m3[2]);
    if (!type) return null;
    return {
      name: m3[1].trim(),
      type,
      bits: defaultBitsForType(type),
    };
  }

  return null;
}

/**
 * 尝试以 C-like 格式解析一行
 * 格式: `uint16 field_name; // 描述`
 * @param {string} line - 待解析的行
 * @returns {ProtocolField | null}
 */
function parseCLikeLine(line: string): ProtocolField | null {
  const pattern = /^\s*(\w+)\s+(\w+)\s*(?:\[\s*(\d+)\s*\])?\s*;\s*(?:\/\/\s*(.*))?$/;
  const m = line.match(pattern);
  if (!m) return null;

  const type = normalizeType(m[1]);
  if (!type) return null;

  const arraySize = m[3] ? parseInt(m[3], 10) : 1;
  const baseBits = defaultBitsForType(type);

  return {
    name: m[2],
    type: arraySize > 1 ? "bytes" : type,
    bits: baseBits * arraySize,
    description: m[4]?.trim() || undefined,
  };
}

/**
 * 解析表格格式的协议描述
 * @param {string[]} lines - 所有行
 * @returns {ProtocolField[]}
 */
function parseTableFormat(lines: string[]): ProtocolField[] {
  const fields: ProtocolField[] = [];
  let headerFound = false;
  const colIndices = { name: -1, type: -1, bits: -1, desc: -1 };

  for (const line of lines) {
    if (!line.includes("|")) continue;

    const cells = line
      .split("|")
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    // 跳过分隔行
    if (cells.every((c) => /^[-:]+$/.test(c))) continue;

    if (!headerFound) {
      const lowerCells = cells.map((c) => c.toLowerCase());
      colIndices.name = lowerCells.findIndex((c) =>
        ["name", "field", "字段", "字段名", "名称"].includes(c)
      );
      colIndices.type = lowerCells.findIndex((c) =>
        ["type", "类型", "数据类型"].includes(c)
      );
      colIndices.bits = lowerCells.findIndex((c) =>
        ["bits", "size", "width", "位宽", "大小", "长度", "bytes"].includes(c)
      );
      colIndices.desc = lowerCells.findIndex((c) =>
        ["description", "desc", "描述", "说明", "备注"].includes(c)
      );

      if (colIndices.name >= 0 && colIndices.type >= 0) {
        headerFound = true;
      }
      continue;
    }

    const getName = (i: number) => (i >= 0 && i < cells.length ? cells[i] : "");
    const name = getName(colIndices.name);
    const rawType = getName(colIndices.type);
    const rawBits = getName(colIndices.bits);
    const desc = getName(colIndices.desc);

    if (!name || !rawType) continue;

    const type = normalizeType(rawType);
    if (!type) continue;

    const bits = rawBits ? parseInt(rawBits, 10) : defaultBitsForType(type);

    fields.push({
      name,
      type,
      bits: isNaN(bits) ? defaultBitsForType(type) : bits,
      description: desc || undefined,
    });
  }

  return fields;
}

/**
 * 解析元数据行（协议名称、字节序等）
 * @param {string} line - 待解析的行
 * @returns {{ key: string; value: string } | null}
 */
function parseMetaLine(line: string): { key: string; value: string } | null {
  const metaPattern = /^#\s*(protocol|name|endian|endianness|byte\s*order|协议名?|字节序)\s*[:：]\s*(.+)$/i;
  const m = line.match(metaPattern);
  if (!m) return null;
  return { key: m[1].toLowerCase().trim(), value: m[2].trim() };
}

/**
 * 主解析函数：解析文本协议规范
 * @param {string} input - 原始文本输入
 * @returns {ParseResult} 解析结果
 */
export function parseProtocol(input: string): ParseResult {
  if (!input || !input.trim()) {
    return { success: false, errors: ["输入不能为空"] };
  }

  const lines = input.split("\n").map((l) => l.trim());
  const errors: string[] = [];

  let protocolName = "Untitled Protocol";
  let endianness: Endianness = "big";
  let description: string | undefined;

  // 提取元数据
  for (const line of lines) {
    const meta = parseMetaLine(line);
    if (!meta) continue;
    const key = meta.key;
    if (["protocol", "name", "协议名", "协议"].includes(key)) {
      protocolName = meta.value;
    }
    if (["endian", "endianness", "byte order", "字节序"].includes(key)) {
      endianness = meta.value.toLowerCase().includes("little") ? "little" : "big";
    }
  }

  // 提取描述（以 ## 或 # Description 开头）
  for (const line of lines) {
    const descMatch = line.match(/^#+\s*(?:description|描述)\s*[:：]\s*(.+)$/i);
    if (descMatch) {
      description = descMatch[1].trim();
    }
  }

  let fields: ProtocolField[] = [];

  // 检测是否有表格格式
  const hasTable = lines.some(
    (l) => l.includes("|") && l.split("|").filter((c) => c.trim()).length >= 3
  );

  if (hasTable) {
    fields = parseTableFormat(lines);
  }

  // 如果表格没有解析出字段，尝试逐行解析
  if (fields.length === 0) {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!line || line.startsWith("#") || line.startsWith("//")) continue;

      const field = parseSimpleLine(line) || parseCLikeLine(line);
      if (field) {
        fields.push(field);
      }
    }
  }

  if (fields.length === 0) {
    return {
      success: false,
      errors: ["无法解析出任何字段。请检查格式是否正确。"],
    };
  }

  // 分配颜色
  fields = fields.map((f, i) => ({
    ...f,
    color: f.color || FIELD_COLORS[i % FIELD_COLORS.length],
  }));

  const totalBits = fields.reduce((sum, f) => sum + f.bits, 0);

  return {
    success: true,
    structure: {
      name: protocolName,
      description,
      endianness,
      fields,
      totalBits,
    },
    errors,
  };
}

/**
 * 生成示例协议文本
 * @returns {string} 示例文本
 */
export function getExampleProtocol(): string {
  return `# Protocol: TCP Header
# Endianness: Big

Source Port: uint16(16) Source port number
Destination Port: uint16(16) Destination port number
Sequence Number: uint32(32) Sequence number
Acknowledgment Number: uint32(32) Acknowledgment number
Data Offset: uint8(4) Data offset
Reserved: reserved(3) Reserved bits
Flags: flags(9) Control flags (NS, CWR, ECE, URG, ACK, PSH, RST, SYN, FIN)
Window Size: uint16(16) Window size
Checksum: uint16(16) Checksum
Urgent Pointer: uint16(16) Urgent pointer`;
}

/**
 * 生成 IPv4 示例
 * @returns {string}
 */
export function getIPv4Example(): string {
  return `# Protocol: IPv4 Header
# Endianness: Big

| Field | Type | Bits | Description |
|-------|------|------|-------------|
| Version | uint8 | 4 | IP version (4) |
| IHL | uint8 | 4 | Internet Header Length |
| DSCP | uint8 | 6 | Differentiated Services |
| ECN | uint8 | 2 | Explicit Congestion Notification |
| Total Length | uint16 | 16 | Total packet length |
| Identification | uint16 | 16 | Fragment identification |
| Flags | flags | 3 | Fragmentation flags |
| Fragment Offset | uint16 | 13 | Fragment offset |
| TTL | uint8 | 8 | Time to Live |
| Protocol | uint8 | 8 | Protocol number |
| Header Checksum | uint16 | 16 | Header checksum |
| Source Address | uint32 | 32 | Source IP address |
| Destination Address | uint32 | 32 | Destination IP address |`;
}

/**
 * 生成 C-like 格式示例
 * @returns {string}
 */
export function getUDPExample(): string {
  return `// UDP Header (C-like format)
// # Protocol: UDP Header
// # Endianness: Big

uint16 source_port; // Source port
uint16 dest_port; // Destination port
uint16 length; // Datagram length
uint16 checksum; // Checksum`;
}
