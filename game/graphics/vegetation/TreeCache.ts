// TreeCache.ts - High-performance offscreen canvas memoization for 20 distinct Sumi-e tree species

import { mulberry32 } from '../../../core/math';
import { drawPine } from './Pine';
import { drawBamboo } from './Bamboo';
import { drawWillow } from './Willow';
import { drawPlum } from './Plum';
import {
    drawMaple,
    drawWitheredTree,
    drawGinkgo,
    drawPaulownia,
    drawCypress,
    drawRockPine,
    drawMagnolia,
    drawCamellia,
    drawStaghornOak
} from './Deciduous';

export const TREE_SPECIES_COUNT = 20;

export const TreeCache = {
  cache: new Map<string, HTMLCanvasElement>(),
  maxSize: 120,

  getTree: function(seed: number, scale: number, type: number): HTMLCanvasElement {
      const normalizedType = ((type % TREE_SPECIES_COUNT) + TREE_SPECIES_COUNT) % TREE_SPECIES_COUNT;
      const key = `${normalizedType}-${seed}-${scale.toFixed(2)}`;

      if (this.cache.has(key)) return this.cache.get(key)!;
      if (this.cache.size > this.maxSize) {
          this.cache.delete(this.cache.keys().next().value);
      }

      const rng = mulberry32(seed);
      const c = document.createElement('canvas');

      // Ample canvas dimensions to prevent clipping of sprawling boughs
      const w = Math.ceil(420 * scale);
      const h = Math.ceil(360 * scale);
      c.width = w;
      c.height = h;
      const ctx = c.getContext('2d');
      if (!ctx) return c;

      // Consistent root anchor point at horizontal center and firmly grounded near bottom
      const rootX = w / 2;
      const rootY = h - (16 * scale);

      // Dispatch 20 distinct species
      switch (normalizedType) {
          // --- PINES (0 - 3) ---
          case 0:
              drawPine(ctx, rootX, rootY, scale * 1.05, rng, 0); // Tùng Nghinh Phong
              break;
          case 1:
              drawPine(ctx, rootX, rootY, scale * 0.95, rng, 1); // Tùng Bạt Phong
              break;
          case 2:
              drawPine(ctx, rootX, rootY, scale * 1.15, rng, 2); // Tùng Trực Cổ Thụ
              break;
          case 3:
              drawPine(ctx, rootX, rootY, scale * 0.88, rng, 3); // Tùng Thác Đổ (Huyền Nhai)
              break;

          // --- BLOSSOMS (4 - 6) ---
          case 4:
              drawPlum(ctx, rootX, rootY, scale * 1.0, rng, 0); // Lão Mai Hoa Đỏ
              break;
          case 5:
              drawPlum(ctx, rootX, rootY, scale * 0.95, rng, 1); // Bạch Mai Hàn Tuyết
              break;
          case 6:
              drawPlum(ctx, rootX, rootY, scale * 1.05, rng, 2); // Đào Phấn Mùa Xuân
              break;

          // --- WILLOWS (7 - 8) ---
          case 7:
              drawWillow(ctx, rootX, rootY, scale * 1.05, rng); // Dương Liễu Rủ
              break;
          case 8:
              drawWillow(ctx, rootX, rootY, scale * 0.92, rng); // Liễu Cổ Thụ Gốc Rỗng
              break;

          // --- BAMBOOS (9 - 10) ---
          case 9:
              drawBamboo(ctx, rootX, rootY, scale * 1.1, rng); // Trúc Độc Hành
              break;
          case 10:
              drawBamboo(ctx, rootX, rootY, scale * 0.95, rng); // Trúc Bụi Quân Tử
              break;

          // --- DECIDUOUS & SPECIALTY (11 - 19) ---
          case 11:
              drawMaple(ctx, rootX, rootY, scale * 1.0, rng); // Phong Đỏ Mùa Thu
              break;
          case 12:
              drawWitheredTree(ctx, rootX, rootY, scale * 1.05, rng); // Khô Mộc Hàn Sơn
              break;
          case 13:
              drawGinkgo(ctx, rootX, rootY, scale * 1.12, rng); // Ngân Hạnh Cổ Thụ
              break;
          case 14:
              drawPaulownia(ctx, rootX, rootY, scale * 1.0, rng); // Ngô Đồng
              break;
          case 15:
              drawCypress(ctx, rootX, rootY, scale * 1.08, rng); // Bách Diệp Tháp
              break;
          case 16:
              drawRockPine(ctx, rootX, rootY, scale * 0.85, rng); // Thạch Tùng Bám Đá
              break;
          case 17:
              drawMagnolia(ctx, rootX, rootY, scale * 0.98, rng); // Mộc Lan Thủy Mặc
              break;
          case 18:
              drawCamellia(ctx, rootX, rootY, scale * 0.92, rng); // Trà Hoa Sơn Mộc
              break;
          case 19:
          default:
              drawStaghornOak(ctx, rootX, rootY, scale * 1.08, rng); // Cổ Thụ Lộc Giác
              break;
      }

      this.cache.set(key, c);
      return c;
  }
};