import { MountainConfig } from '../../types';
import { TreeCache } from '../graphics';

function generateMountainPath(roughness: number, heightScale: number) {
  const iterations = 9;
  const size = Math.pow(2, iterations);
  let points = new Array(size + 1).fill(0);
  
  const edgeHeight = (Math.random() - 0.5) * heightScale;
  points[0] = edgeHeight;
  points[size] = edgeHeight;

  for (let i = 0; i < iterations; i++) {
      const step = Math.pow(2, iterations - i);
      const halfStep = step / 2;
      const magnitude = step * roughness;

      for (let j = halfStep; j < size; j += step) {
          const avg = (points[j - halfStep] + points[j + halfStep]) / 2;
          points[j] = avg + (Math.random() * 2 - 1) * magnitude;
      }
  }
  return points;
}

function renderPathToContext(ctx: CanvasRenderingContext2D, points: number[], startX: number, baseY: number, pathWidth: number) {
  const totalPoints = points.length;
  const segmentWidth = pathWidth / (totalPoints - 1);

  ctx.lineTo(startX, baseY + points[0]);
  for (let i = 1; i < totalPoints; i++) {
      ctx.lineTo(startX + i * segmentWidth, baseY + points[i]);
  }
}

export class MountainLayer {
  cfg: MountainConfig;
  pathWidth: number;
  points: number[];
  bgColor: string;

  constructor(config: MountainConfig, w: number, h: number) {
      this.cfg = config;
      this.pathWidth = w * 2; 
      this.points = generateMountainPath(this.cfg.roughness, h * 0.25);
      this.bgColor = '#e8e4d9'; 
  }

  getHeightAt(worldX: number, h: number) {
      const totalPoints = this.points.length;
      const segmentWidth = this.pathWidth / (totalPoints - 1);
      
      let localX = worldX % this.pathWidth;
      if (localX < 0) localX += this.pathWidth;

      const index = Math.floor(localX / segmentWidth);
      const t = (localX % segmentWidth) / segmentWidth;

      const p1 = this.points[index];
      const p2 = this.points[Math.min(index + 1, totalPoints - 1)];
      const pointY = p1 + (p2 - p1) * t;

      const baseY = h * this.cfg.yOffset;
      return baseY + pointY;
  }

  draw(ctx: CanvasRenderingContext2D, w: number, h: number, scrollOffset: number, dynamicBgColor?: string) {
      const layer = this.cfg;
      const scrollX = (scrollOffset * layer.speed) % this.pathWidth;
      const activeBgColor = dynamicBgColor || this.bgColor;

      ctx.save();
      ctx.shadowBlur = layer.blur;
      ctx.shadowColor = layer.color;
      ctx.globalAlpha = layer.opacity;

      ctx.beginPath();
      ctx.moveTo(-scrollX, h + 100);

      const baseY = h * layer.yOffset;
      renderPathToContext(ctx, this.points, -scrollX, baseY, this.pathWidth);
      renderPathToContext(ctx, this.points, -scrollX + this.pathWidth, baseY, this.pathWidth);

      ctx.lineTo(w + 100, h + 100);
      ctx.closePath();

      const inkGrd = ctx.createLinearGradient(0, h * layer.yOffset - 150, 0, h);
      inkGrd.addColorStop(0, layer.color);
      inkGrd.addColorStop(0.5, layer.color);
      inkGrd.addColorStop(1, activeBgColor); 

      ctx.fillStyle = inkGrd;
      ctx.fill();

      const mistGrd = ctx.createLinearGradient(0, h * layer.yOffset, 0, h * layer.yOffset + 150);
      mistGrd.addColorStop(0, 'rgba(232, 228, 217, 0)');
      mistGrd.addColorStop(1, activeBgColor);
      
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = mistGrd;
      ctx.fillRect(0, h * layer.yOffset, w, h - h * layer.yOffset);

      ctx.restore();

      if(this.cfg.hasTrees && this.cfg.treeProb) {
          const speed = layer.speed;
          const effScroll = scrollOffset * speed;
          // Non-uniform organic spacing with Poisson-like jitter
          const spacing = 140; 
          const start = Math.floor(effScroll / spacing) - 1;
          const end = Math.floor((effScroll + w) / spacing) + 1;
          
          for(let i = start; i <= end; i++) {
              const seed = Math.abs(Math.sin(i * 12.9898 + 43.12) * 43758.5453);
              const prob = (seed % 1);
              if (prob < this.cfg.treeProb) {
                  // Organic horizontal positioning with clustered probability
                  const wx = i * spacing + ((seed * 1000) % (spacing * 0.85));
                  const sx = wx - effScroll;
                  
                  // Viewport culling buffer
                  if (sx < -200 || sx > w + 200) continue;

                  // Sample terrain elevation & slope
                  const ty = this.getHeightAt(wx, h);
                  const slope = (this.getHeightAt(wx + 12, h) - this.getHeightAt(wx - 12, h)) / 24;

                  // Depth Staggering: 3 depth planes (Foreground verge, Midground path, Background verge)
                  const depthSeed = ((seed * 73) % 1);
                  let depthYOffset = 0;
                  let depthAlpha = 1.0;
                  let scaleMod = 1.0;

                  if (depthSeed < 0.28) {
                      // Front verge (closer to camera)
                      depthYOffset = 6 + depthSeed * 8;
                      scaleMod = 1.15;
                      depthAlpha = 1.0;
                  } else if (depthSeed > 0.68) {
                      // Back verge (further away into mist)
                      depthYOffset = -8 - (depthSeed - 0.68) * 12;
                      scaleMod = 0.85;
                      depthAlpha = 0.82;
                  }

                  let scale = 1.45 * scaleMod * (0.85 + ((seed * 13) % 1) * 0.35);

                  // Intelligent Species Selection across all 20 botanical types
                  let speciesIndex = 0;
                  const speciesRoll = ((seed * 317) % 1);

                  if (Math.abs(slope) > 0.32) {
                      // Steep crags / Cliff face biomes
                      const cliffPool = [
                          3,  // Tùng Thác Đổ / Huyền Nhai
                          16, // Thạch Tùng Bám Đá
                          12, // Khô Mộc Hàn Sơn
                          1,  // Tùng Bạt Phong
                          15  // Bách Diệp Tháp
                      ];
                      speciesIndex = cliffPool[Math.floor(speciesRoll * cliffPool.length)];
                  } else {
                      // Rich gentle slopes & roadside path: Select from all 20 species
                      speciesIndex = Math.floor(speciesRoll * 20);
                  }

                  const treeCvs = TreeCache.getTree(Math.floor(seed * 10000), scale, speciesIndex);
                  
                  // Root anchor alignment: treeCache anchor is at (w/2, h - 16*scale)
                  const rootAnchorY = treeCvs.height - (16 * scale);
                  const drawX = sx - treeCvs.width / 2;
                  const drawY = ty + depthYOffset - rootAnchorY;

                  ctx.save();
                  if (depthAlpha < 1.0) {
                      ctx.globalAlpha = (ctx.globalAlpha || 1.0) * depthAlpha;
                  }
                  ctx.drawImage(treeCvs, drawX, drawY);
                  ctx.restore();
              }
          }
      }
  }
}