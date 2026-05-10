import {
  generateId,
  formatDate,
  formatFileSize,
  formatPrice,
  getCurrentMonth,
  truncate,
  validateImageFile,
  getImageLimit,
} from "@/lib/utils";

describe("generateId", () => {
  it("should return a non-empty string", () => {
    const id = generateId();
    expect(typeof id).toBe("string");
    expect(id.length).toBeGreaterThan(0);
  });

  it("should generate unique IDs", () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()));
    expect(ids.size).toBe(100);
  });
});

describe("formatDate", () => {
  it("should format a date string", () => {
    const result = formatDate("2025-06-15T00:00:00.000Z");
    expect(result).toContain("Jun");
    expect(result).toContain("15");
    expect(result).toContain("2025");
  });
});

describe("formatFileSize", () => {
  it("should format 0 bytes", () => {
    expect(formatFileSize(0)).toBe("0 B");
  });

  it("should format kilobytes", () => {
    expect(formatFileSize(1024)).toBe("1 KB");
  });

  it("should format megabytes", () => {
    expect(formatFileSize(5 * 1024 * 1024)).toBe("5 MB");
  });

  it("should format with decimal precision", () => {
    expect(formatFileSize(1536)).toBe("1.5 KB");
  });
});

describe("formatPrice", () => {
  it("should format price with dollar sign and two decimals", () => {
    expect(formatPrice(9.9)).toBe("$9.90");
    expect(formatPrice(0)).toBe("$0.00");
    expect(formatPrice(19.99)).toBe("$19.99");
  });
});

describe("getCurrentMonth", () => {
  it("should return YYYY-MM format", () => {
    const month = getCurrentMonth();
    expect(month).toMatch(/^\d{4}-\d{2}$/);
  });
});

describe("truncate", () => {
  it("should not truncate short strings", () => {
    expect(truncate("hello", 10)).toBe("hello");
  });

  it("should truncate long strings with ellipsis", () => {
    const result = truncate("this is a long string", 10);
    expect(result.length).toBe(10);
    expect(result.endsWith("…")).toBe(true);
  });

  it("should handle exact length", () => {
    expect(truncate("12345", 5)).toBe("12345");
  });
});

describe("validateImageFile", () => {
  it("should accept valid PNG file", () => {
    const file = new File(["data"], "test.png", { type: "image/png" });
    expect(validateImageFile(file)).toEqual({ valid: true });
  });

  it("should accept valid JPEG file", () => {
    const file = new File(["data"], "test.jpg", { type: "image/jpeg" });
    expect(validateImageFile(file)).toEqual({ valid: true });
  });

  it("should accept valid WebP file", () => {
    const file = new File(["data"], "test.webp", { type: "image/webp" });
    expect(validateImageFile(file)).toEqual({ valid: true });
  });

  it("should reject invalid file types", () => {
    const file = new File(["data"], "test.pdf", { type: "application/pdf" });
    const result = validateImageFile(file);
    expect(result.valid).toBe(false);
    expect(result.error).toContain("PNG");
  });

  it("should reject files exceeding size limit", () => {
    const largeData = new Uint8Array(11 * 1024 * 1024);
    const file = new File([largeData], "large.png", { type: "image/png" });
    const result = validateImageFile(file);
    expect(result.valid).toBe(false);
    expect(result.error).toContain("10MB");
  });

  it("should accept custom size limit", () => {
    const data = new Uint8Array(3 * 1024 * 1024);
    const file = new File([data], "medium.png", { type: "image/png" });
    const result = validateImageFile(file, 2);
    expect(result.valid).toBe(false);
  });
});

describe("getImageLimit", () => {
  it("should return 3 for free tier", () => {
    expect(getImageLimit("free")).toBe(3);
  });

  it("should return 50 for starter tier", () => {
    expect(getImageLimit("starter")).toBe(50);
  });

  it("should return -1 (unlimited) for pro tier", () => {
    expect(getImageLimit("pro")).toBe(-1);
  });
});
