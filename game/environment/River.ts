// River.ts - Manages the river water ripples and traditional fishing sampans

import { rand } from '../../core/math';
import { MountainLayer } from './Mountain';

export class BoatManager {
  boats: any[] = [];
  lastSpawn: number = 0;
  waterTime: number = 0;

  constructor() {
      // Initialize with 1 boat ready in view
      const w = typeof window !== 'undefined' ? window.innerWidth : 1200;
      this.boats.push({
          worldX: w * 0.7,
          yBase: 400,
          speed: 0.45,
          scale: 1.0,
          time: Math.random() * 10
      });
  }

  update(width: number, height: number, scrollOffset: number) {
      this.waterTime += 0.02;

      // Maintain 1-2 boats smoothly drifting across the river
      if (this.boats.length < 2 && Date.now() - this.lastSpawn > 8000) {
          this.spawn(width, height, scrollOffset);
      }

      const riverSpeedFactor = 0.3; 
      
      for (let i = this.boats.length - 1; i >= 0; i--) {
          const b = this.boats[i];
          const screenX = b.worldX - (scrollOffset * riverSpeedFactor);
          
          b.time += 0.04;
          b.worldX -= b.speed; 

          if (screenX < -300) {
              this.boats.splice(i, 1);
          }
      }
  }

  spawn(width: number, height: number, scrollOffset: number) {
      const riverSpeedFactor = 0.3;
      const startScreenX = width + rand(100, 300);
      const worldX = startScreenX + (scrollOffset * riverSpeedFactor);
      
      this.boats.push({
          worldX: worldX,
          yBase: height * 0.75, 
          speed: rand(0.3, 0.7), 
          scale: rand(0.85, 1.15),
          time: Math.random() * 10
      });
      this.lastSpawn = Date.now();
  }

  draw(ctx: CanvasRenderingContext2D, width: number, height: number, scrollOffset: number, riverLayer?: MountainLayer) {
      const riverSpeedFactor = 0.3;

      // --- Draw Ambient River Water Ripples (Gợn sóng thủy ba lăn tăn) ---
      if (riverLayer) {
          ctx.save();
          ctx.strokeStyle = 'rgba(70, 70, 70, 0.12)';
          ctx.lineWidth = 1.2;

          for (let rx = 0; rx < width; rx += 140) {
              const effWorldX = (scrollOffset * riverSpeedFactor) + rx;
              const waterY = riverLayer.getHeightAt(effWorldX, height) + 18;
              const rippleOffset = Math.sin(this.waterTime * 2 + rx * 0.02) * 8;
              
              ctx.beginPath();
              ctx.moveTo(rx + rippleOffset, waterY);
              ctx.quadraticCurveTo(rx + 30 + rippleOffset, waterY - 2, rx + 65 + rippleOffset, waterY);
              ctx.stroke();
          }
          ctx.restore();
      }

      // --- Draw Sampans (Thuyền nan câu cá Thủy Mặc) ---
      this.boats.forEach(b => {
          const screenX = b.worldX - (scrollOffset * riverSpeedFactor);
          if (screenX < -200 || screenX > width + 200) return;

          let waterLevel = b.yBase;
          if (riverLayer) {
              const effectiveRiverWorldX = (scrollOffset * riverSpeedFactor) + screenX;
              waterLevel = riverLayer.getHeightAt(effectiveRiverWorldX, height);
              waterLevel += 45; // Sits comfortably in river stream
          }

          const floatY = Math.sin(b.time * 0.6) * 3.5;
          const floatAngle = Math.sin(b.time * 0.4) * 0.025;
          
          ctx.save();
          ctx.translate(screenX, waterLevel - 10 + floatY);
          ctx.rotate(floatAngle);
          ctx.scale(b.scale, b.scale);

          // Boat Hull (Thân thuyền nan cong vút hai đầu)
          ctx.fillStyle = '#181818';
          ctx.beginPath();
          ctx.moveTo(-55, -2);
          ctx.bezierCurveTo(-35, 16, 35, 16, 55, -2);
          ctx.quadraticCurveTo(0, 4, -55, -2);
          ctx.fill();

          // Wooden gunwale / rim
          ctx.strokeStyle = '#2d2d2d';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(-55, -2);
          ctx.quadraticCurveTo(0, 4, 55, -2);
          ctx.stroke();

          // Bamboo Canopy / Roof (Mui thuyền nan đan bằng tre nứa)
          ctx.fillStyle = 'rgba(25, 25, 25, 0.9)';
          ctx.beginPath();
          ctx.moveTo(-18, 0);
          ctx.quadraticCurveTo(2, -22, 22, -2);
          ctx.quadraticCurveTo(2, -18, -18, 0);
          ctx.fill();
          ctx.strokeStyle = '#383838';
          ctx.lineWidth = 1.2;
          ctx.stroke();

          // Old Fisherman (Ngư ông nón lá buông câu)
          // Head
          ctx.fillStyle = '#151515';
          ctx.beginPath();
          ctx.arc(-32, -8, 3.5, 0, Math.PI * 2);
          ctx.fill();

          // Conical hat
          ctx.fillStyle = '#383838';
          ctx.beginPath();
          ctx.moveTo(-40, -8);
          ctx.lineTo(-32, -16);
          ctx.lineTo(-24, -8);
          ctx.closePath();
          ctx.fill();
          
          // Body hunched over
          ctx.strokeStyle = '#151515';
          ctx.lineWidth = 3.5;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(-32, -5);
          ctx.quadraticCurveTo(-36, 0, -38, 8);
          ctx.stroke();

          // Fishing Rod (Cần trúc buông dây câu)
          ctx.strokeStyle = 'rgba(30, 30, 30, 0.6)';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(-32, -3);
          ctx.quadraticCurveTo(-50, -15, -75, -24);
          ctx.stroke();

          // Fishing line dropping into water
          ctx.strokeStyle = 'rgba(50, 50, 50, 0.3)';
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(-75, -24);
          ctx.lineTo(-75, 12);
          ctx.stroke();

          // Lantern on prow (Đèn bão đầu mũi thuyền)
          ctx.fillStyle = 'rgba(200, 160, 80, 0.85)';
          ctx.beginPath();
          ctx.arc(48, -4, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#111';
          ctx.lineWidth = 0.8;
          ctx.stroke();

          ctx.restore();
          
          // Ripple reflections under the hull
          ctx.save();
          ctx.translate(screenX, waterLevel + 4);
          for (let j = 0; j < 2; j++) {
              const rScale = 1 + j * 0.4;
              const rAlpha = (1 - (j/2)) * 0.12 * Math.abs(Math.sin(b.time * 0.5 + j));
              ctx.beginPath();
              ctx.strokeStyle = `rgba(20, 20, 20, ${rAlpha})`;
              ctx.ellipse(0, 4, 48 * rScale, 2.5 * rScale, 0, 0, Math.PI * 2);
              ctx.stroke();
          }
          ctx.restore();
      });
  }
}