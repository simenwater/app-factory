import { EXPORT_PRESETS } from "@/lib/exportFormats";

describe("Export Presets", () => {
  it("should have presets for shopify, amazon, and custom", () => {
    expect(EXPORT_PRESETS).toHaveProperty("shopify");
    expect(EXPORT_PRESETS).toHaveProperty("amazon");
    expect(EXPORT_PRESETS).toHaveProperty("custom");
  });

  it("should have correct Shopify dimensions", () => {
    const shopify = EXPORT_PRESETS.shopify;
    expect(shopify.width).toBe(2048);
    expect(shopify.height).toBe(2048);
    expect(shopify.fileType).toBe("png");
    expect(shopify.aspectRatio).toBe("1:1");
  });

  it("should have correct Amazon dimensions", () => {
    const amazon = EXPORT_PRESETS.amazon;
    expect(amazon.width).toBe(2000);
    expect(amazon.height).toBe(2000);
    expect(amazon.fileType).toBe("jpg");
    expect(amazon.aspectRatio).toBe("1:1");
  });

  it("should have quality values between 0 and 1", () => {
    Object.values(EXPORT_PRESETS).forEach((preset) => {
      expect(preset.quality).toBeGreaterThan(0);
      expect(preset.quality).toBeLessThanOrEqual(1);
    });
  });

  it("should have file size limits for platform-specific presets", () => {
    expect(EXPORT_PRESETS.shopify.maxFileSize).toBeDefined();
    expect(EXPORT_PRESETS.amazon.maxFileSize).toBeDefined();
    expect(EXPORT_PRESETS.shopify.maxFileSize).toBeGreaterThan(0);
  });

  it("should have descriptive names and descriptions", () => {
    Object.values(EXPORT_PRESETS).forEach((preset) => {
      expect(preset.name.length).toBeGreaterThan(0);
      expect(preset.description.length).toBeGreaterThan(0);
    });
  });
});
