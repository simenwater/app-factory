import {
  validateImageFile,
  generateMultiAngleViews,
  removeBackgroundAndReplace,
  resizeToPreset,
} from '@/lib/imageProcessing';
import { SCENE_TEMPLATES, PLATFORM_PRESETS } from '@/lib/constants';

describe('imageProcessing', () => {
  describe('validateImageFile', () => {
    it('should accept valid JPEG files', () => {
      const file = new File(['test'], 'photo.jpg', { type: 'image/jpeg' });
      Object.defineProperty(file, 'size', { value: 1024 * 1024 });
      const result = validateImageFile(file);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept valid PNG files', () => {
      const file = new File(['test'], 'photo.png', { type: 'image/png' });
      Object.defineProperty(file, 'size', { value: 5 * 1024 * 1024 });
      const result = validateImageFile(file);
      expect(result.valid).toBe(true);
    });

    it('should accept valid WebP files', () => {
      const file = new File(['test'], 'photo.webp', { type: 'image/webp' });
      Object.defineProperty(file, 'size', { value: 2 * 1024 * 1024 });
      const result = validateImageFile(file);
      expect(result.valid).toBe(true);
    });

    it('should reject unsupported file types', () => {
      const file = new File(['test'], 'doc.pdf', { type: 'application/pdf' });
      Object.defineProperty(file, 'size', { value: 1024 });
      const result = validateImageFile(file);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('仅支持 JPG、PNG、WebP 格式');
    });

    it('should reject GIF files', () => {
      const file = new File(['test'], 'anim.gif', { type: 'image/gif' });
      Object.defineProperty(file, 'size', { value: 1024 });
      const result = validateImageFile(file);
      expect(result.valid).toBe(false);
    });

    it('should reject files over 10MB', () => {
      const file = new File(['test'], 'large.jpg', { type: 'image/jpeg' });
      Object.defineProperty(file, 'size', { value: 11 * 1024 * 1024 });
      const result = validateImageFile(file);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('文件大小不能超过 10MB');
    });

    it('should accept files exactly at 10MB', () => {
      const file = new File(['test'], 'exact.jpg', { type: 'image/jpeg' });
      Object.defineProperty(file, 'size', { value: 10 * 1024 * 1024 });
      const result = validateImageFile(file);
      expect(result.valid).toBe(true);
    });
  });

  describe('generateMultiAngleViews', () => {
    it('should return 6 angle views', async () => {
      const results = await generateMultiAngleViews('http://example.com/img.jpg');
      expect(results).toHaveLength(6);
    });

    it('should include angle labels for each result', async () => {
      const results = await generateMultiAngleViews('http://example.com/img.jpg');
      results.forEach((result) => {
        expect(result.angle).toBeDefined();
        expect(result.mode).toBe('multi-angle');
        expect(result.id).toBeDefined();
        expect(result.createdAt).toBeDefined();
      });
    });

    it('should use source URL for all results', async () => {
      const sourceUrl = 'http://example.com/product.png';
      const results = await generateMultiAngleViews(sourceUrl);
      results.forEach((result) => {
        expect(result.url).toBe(sourceUrl);
      });
    });
  });

  describe('removeBackgroundAndReplace', () => {
    it('should return a single generated image', async () => {
      const scene = SCENE_TEMPLATES[0];
      const result = await removeBackgroundAndReplace('http://example.com/img.jpg', scene);
      expect(result.id).toBeDefined();
      expect(result.mode).toBe('background-removal');
      expect(result.scene).toBe(scene.name);
    });

    it('should preserve source URL', async () => {
      const sourceUrl = 'http://example.com/product.png';
      const scene = SCENE_TEMPLATES[1];
      const result = await removeBackgroundAndReplace(sourceUrl, scene);
      expect(result.url).toBe(sourceUrl);
    });
  });

  describe('resizeToPreset', () => {
    it('should return result with preset info', async () => {
      const preset = PLATFORM_PRESETS[0];
      const result = await resizeToPreset('http://example.com/img.jpg', preset);
      expect(result.id).toBeDefined();
      expect(result.mode).toBe('resize');
      expect(result.preset).toEqual(preset);
    });

    it('should handle different platform presets', async () => {
      for (const preset of PLATFORM_PRESETS.slice(0, 3)) {
        const result = await resizeToPreset('http://example.com/img.jpg', preset);
        expect(result.preset?.id).toBe(preset.id);
        expect(result.preset?.width).toBe(preset.width);
        expect(result.preset?.height).toBe(preset.height);
      }
    });
  });
});
