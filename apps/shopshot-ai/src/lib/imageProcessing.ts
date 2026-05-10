import type { ViewAngle, SceneType, GeneratedImage } from "@/types";
import { generateId } from "./utils";

/**
 * @description 模拟背景移除处理。
 *   MVP 阶段在客户端使用 Canvas 进行简单的颜色阈值抠图，
 *   生产环境应替换为服务端 AI 模型（如 rembg / SAM）。
 * @param {string} imageDataUrl - 原始图片 Data URL
 * @returns {Promise<string>} 处理后的 Data URL（带透明背景）
 */
export async function removeBackground(imageDataUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      const cornerPixels = [
        { x: 0, y: 0 },
        { x: canvas.width - 1, y: 0 },
        { x: 0, y: canvas.height - 1 },
        { x: canvas.width - 1, y: canvas.height - 1 },
      ];

      let bgR = 0, bgG = 0, bgB = 0;
      for (const p of cornerPixels) {
        const idx = (p.y * canvas.width + p.x) * 4;
        bgR += data[idx];
        bgG += data[idx + 1];
        bgB += data[idx + 2];
      }
      bgR = Math.round(bgR / 4);
      bgG = Math.round(bgG / 4);
      bgB = Math.round(bgB / 4);

      const threshold = 60;
      for (let i = 0; i < data.length; i += 4) {
        const dr = Math.abs(data[i] - bgR);
        const dg = Math.abs(data[i + 1] - bgG);
        const db = Math.abs(data[i + 2] - bgB);
        const distance = Math.sqrt(dr * dr + dg * dg + db * db);
        if (distance < threshold) {
          data[i + 3] = 0;
        }
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.src = imageDataUrl;
  });
}

/**
 * @description 场景背景的渐变/颜色配置
 */
const SCENE_BACKGROUNDS: Record<SceneType, { type: "solid" | "gradient"; colors: string[] }> = {
  "studio-white": { type: "solid", colors: ["#ffffff"] },
  "studio-gradient": { type: "gradient", colors: ["#f8fafc", "#e2e8f0"] },
  "lifestyle-desk": { type: "gradient", colors: ["#d4a574", "#8b6914"] },
  "lifestyle-nature": { type: "gradient", colors: ["#86efac", "#22c55e"] },
  "lifestyle-kitchen": { type: "gradient", colors: ["#fef3c7", "#f59e0b"] },
  "lifestyle-bathroom": { type: "gradient", colors: ["#e0f2fe", "#7dd3fc"] },
  "festive-christmas": { type: "gradient", colors: ["#dc2626", "#166534"] },
  "festive-valentines": { type: "gradient", colors: ["#fda4af", "#fb7185"] },
  "minimal-shadow": { type: "gradient", colors: ["#f1f5f9", "#cbd5e1"] },
  "minimal-marble": { type: "gradient", colors: ["#f8f8f8", "#e8e8e8"] },
  custom: { type: "solid", colors: ["#f0f0f0"] },
};

/**
 * @description 在画布上绘制场景背景
 * @param {CanvasRenderingContext2D} ctx - 画布上下文
 * @param {number} width - 画布宽度
 * @param {number} height - 画布高度
 * @param {SceneType} scene - 场景类型
 */
function drawSceneBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  scene: SceneType
): void {
  const bg = SCENE_BACKGROUNDS[scene] ?? SCENE_BACKGROUNDS["studio-white"];
  if (bg.type === "solid") {
    ctx.fillStyle = bg.colors[0];
    ctx.fillRect(0, 0, width, height);
  } else {
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, bg.colors[0]);
    gradient.addColorStop(1, bg.colors[1]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  if (scene === "minimal-shadow") {
    ctx.fillStyle = "rgba(0,0,0,0.06)";
    ctx.beginPath();
    ctx.ellipse(width / 2, height * 0.85, width * 0.35, height * 0.04, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

/**
 * @description 模拟 3D 旋转变换，通过水平缩放和偏移实现视角变化。
 *   生产环境应替换为真正的 3D 渲染或 AI 多视角生成模型。
 * @param {CanvasRenderingContext2D} ctx - 画布上下文
 * @param {HTMLImageElement} img - 产品图片
 * @param {number} canvasWidth - 画布宽度
 * @param {number} canvasHeight - 画布高度
 * @param {ViewAngle} angle - 旋转角度
 */
function applyAngleTransform(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  canvasWidth: number,
  canvasHeight: number,
  angle: ViewAngle
): void {
  const padding = 0.15;
  const maxW = canvasWidth * (1 - padding * 2);
  const maxH = canvasHeight * (1 - padding * 2);
  const scale = Math.min(maxW / img.width, maxH / img.height);
  const drawW = img.width * scale;
  const drawH = img.height * scale;

  ctx.save();

  const radians = (angle * Math.PI) / 180;
  const scaleX = Math.cos(radians);
  const skewFactor = Math.sin(radians) * 0.15;

  const cx = canvasWidth / 2;
  const cy = canvasHeight / 2;

  ctx.translate(cx, cy);
  ctx.transform(Math.abs(scaleX) || 0.15, skewFactor, 0, 1, 0, 0);
  ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
  ctx.restore();
}

/**
 * @description 为产品图生成指定场景和角度的合成图
 * @param {string} productImageData - 产品图 Data URL（最好已移除背景）
 * @param {SceneType} scene - 场景类型
 * @param {ViewAngle} angle - 旋转角度
 * @param {{ width: number; height: number }} size - 输出尺寸
 * @returns {Promise<GeneratedImage>} 生成的图片对象
 */
export async function generateProductImage(
  productImageData: string,
  scene: SceneType,
  angle: ViewAngle,
  size: { width: number; height: number } = { width: 1024, height: 1024 }
): Promise<GeneratedImage> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = size.width;
      canvas.height = size.height;
      const ctx = canvas.getContext("2d")!;

      drawSceneBackground(ctx, canvas.width, canvas.height, scene);
      applyAngleTransform(ctx, img, canvas.width, canvas.height, angle);

      const resultData = canvas.toDataURL("image/png");
      resolve({
        id: generateId(),
        originalImageData: productImageData,
        resultImageData: resultData,
        scene,
        angle,
        width: size.width,
        height: size.height,
        status: "completed",
        createdAt: new Date().toISOString(),
      });
    };
    img.src = productImageData;
  });
}

/**
 * @description 批量生成产品图（多场景 × 多角度）
 * @param {string} productImageData - 产品图 Data URL
 * @param {SceneType[]} scenes - 场景列表
 * @param {ViewAngle[]} angles - 角度列表
 * @param {(progress: number, total: number) => void} [onProgress] - 进度回调
 * @returns {Promise<GeneratedImage[]>} 生成的图片列表
 */
export async function batchGenerate(
  productImageData: string,
  scenes: SceneType[],
  angles: ViewAngle[],
  onProgress?: (progress: number, total: number) => void
): Promise<GeneratedImage[]> {
  const total = scenes.length * angles.length;
  const results: GeneratedImage[] = [];
  let completed = 0;

  for (const scene of scenes) {
    for (const angle of angles) {
      const image = await generateProductImage(productImageData, scene, angle);
      results.push(image);
      completed++;
      onProgress?.(completed, total);
    }
  }

  return results;
}
