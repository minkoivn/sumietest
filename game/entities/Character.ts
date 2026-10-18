import { InputState } from '../../types';
import { drawDryStroke, drawInkBleed } from '../graphics/InkBrush';

export interface FootstepBleed {
    worldX: number;
    y: number;
    radius: number;
    alpha: number;
    maxAlpha: number;
    age: number;
}

export class Character {
  x: number = 0;
  y: number = 0;
  vy: number = 0;
  frame: number = 0;
  facingRight: boolean = true;
  onGround: boolean = false;
  popupTimer: number = 0;
  currentPopup: any = null;
  nextPopupIn: number = Math.random() * 200 + 100;
  inkCount: number = 0;
  state: number = 0; // 0: Idle, 1: Run, 2: Jump, 3: Beg

  // Footstep ink bleed stains left on paper
  footsteps: FootstepBleed[] = [];
  lastStepDist: number = 0;

  update(groundY: number, scrollSpeed: number, input: InputState, scrollOffset: number) {
      const wasInAir = !this.onGround;

      // Input Logic
      if (input.up && this.onGround) { 
          this.vy = -15; 
          this.onGround = false; 
      }
      
      this.vy += 0.8;
      this.y += this.vy;
      
      if (this.y > groundY - 10) { 
          this.y = groundY - 10; 
          this.vy = 0; 
          this.onGround = true; 

          // Just landed with dry brush & impact bleed
          if (wasInAir) {
              const charWorldX = this.x + scrollOffset;
              this.addFootstep(charWorldX, groundY, 13, 0.65);
          }
      }

      if (scrollSpeed !== 0) {
          this.frame += 0.15 * Math.abs(scrollSpeed / 3);
          this.facingRight = scrollSpeed > 0;
          
          // Leave footstep ink bleeds on paper rhythmically
          const charWorldX = this.x + scrollOffset;
          if (this.onGround && Math.abs(charWorldX - this.lastStepDist) > 36) {
              this.lastStepDist = charWorldX;
              this.addFootstep(charWorldX, groundY, Math.abs(scrollSpeed) > 5 ? 9 : 6, 0.4);
          }
      } else {
          this.frame += 0.05;
      }

      // Determine State
      if (!this.onGround) this.state = 2; // Jump
      else if (Math.abs(scrollSpeed) > 0.1) this.state = 1; // Run
      else this.state = 0; // Idle

      // Update footsteps decay
      for (let i = this.footsteps.length - 1; i >= 0; i--) {
          const step = this.footsteps[i];
          step.age++;
          step.alpha = step.maxAlpha * (1 - step.age / 180); // Fades over ~3 seconds
          if (step.age >= 180) {
              this.footsteps.splice(i, 1);
          }
      }

      // Popup logic
      this.popupTimer++;
      if (this.popupTimer > this.nextPopupIn) {
          this.triggerRandomPopup();
          this.popupTimer = 0;
          this.nextPopupIn = Math.random() * 400 + 300; 
      }
  }

  addFootstep(worldX: number, y: number, radius: number, alpha: number) {
      this.footsteps.push({
          worldX,
          y,
          radius,
          alpha,
          maxAlpha: alpha,
          age: 0
      });
      // Cap max footsteps to keep performance high
      if (this.footsteps.length > 45) {
          this.footsteps.shift();
      }
  }

  drawFootsteps(ctx: CanvasRenderingContext2D, scrollOffset: number) {
      for (const step of this.footsteps) {
          const sx = step.worldX - scrollOffset;
          if (sx > -60 && sx < ctx.canvas.width + 60 && step.alpha > 0.02) {
              drawInkBleed(ctx, sx, step.y - 2, step.radius, step.alpha);
          }
      }
  }

  triggerRandomPopup() {
      const options = [
          { type: 'speech', content: "Tôi ... đói quá ..." },
          { type: 'speech', content: "Lạy ông đi qua ..." },
          { type: 'speech', content: "Lạy bà đi lại ..." },
          { type: 'speech', content: "Xin chén cơm nguội ..." },
          { type: 'speech', content: "Gió lạnh quá..." },
          { type: 'speech', content: "Mỏi gối chồn chân..." },
          { type: 'thought', content: 'food' },
          { type: 'thought', content: 'coin' }
      ];
      this.currentPopup = options[Math.floor(Math.random() * options.length)];
      setTimeout(() => this.currentPopup = null, 2500);
  }

  // Draw current instance
  draw(ctx: CanvasRenderingContext2D) {
      Character.drawAvatar(ctx, this.x, this.y, this.frame, this.facingRight, this.vy, 1.0, null);
      if (this.currentPopup) this.drawPopup(ctx);
  }

  /**
   * Redesigned Poetic Calligraphic Silhouette Avatar (Bóng Dáng Hành Khất Thanh Thoát)
   * Elegant flowing robes, natural gait, weathered straw hat, slender bamboo cane, and alms bowl.
   */
  static drawAvatar(
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      frame: number,
      facingRight: boolean,
      vy: number,
      opacity: number,
      name: string | null
  ) {
      const bob = Math.sin(frame) * 2.2;
      const stride = Math.sin(frame) * 11;
      const isRunning = Math.abs(stride) > 1.2;

      ctx.save();
      ctx.translate(x, y + bob);
      
      // Name Tag (Ghost)
      if (name) {
          ctx.save();
          ctx.fillStyle = `rgba(70, 70, 70, ${opacity})`;
          ctx.font = "bold 15px 'Charm', serif";
          ctx.textAlign = "center";
          ctx.fillText(name, 0, -65);
          ctx.restore();
      }

      if (!facingRight) ctx.scale(-1, 1);
      
      ctx.globalAlpha = opacity;

      const INK = {
          black: "#111111",
          deep: "#202020",
          charcoal: "#333333",
          wash: "rgba(35, 35, 35, 0.45)",
          shadow: "rgba(20, 20, 20, 0.25)"
      };

      const flowX = isRunning ? -Math.abs(stride) * 1.5 : -3;
      const flowY = vy * -1.0;

      // --- 1. Legs (Chân lữ khách thanh thoát) ---
      ctx.strokeStyle = INK.deep;
      ctx.lineWidth = 2.8;
      ctx.lineCap = "round";

      // Back Leg (Chân sau nhấc gót)
      const backLegX = -Math.sin(frame) * 9;
      ctx.beginPath();
      ctx.moveTo(-2, 4);
      ctx.quadraticCurveTo(-2 + backLegX * 0.4, 12, backLegX, 18);
      ctx.stroke();

      // Front Leg (Chân trước vươn sải)
      ctx.beginPath();
      ctx.moveTo(3, 4);
      ctx.quadraticCurveTo(3 + stride * 0.4, 11, stride, 18);
      ctx.stroke();

      // --- 2. Undergarment Wash (Lớp áo trong mờ ảo) ---
      ctx.fillStyle = INK.wash;
      ctx.beginPath();
      ctx.moveTo(-2, -26);
      ctx.quadraticCurveTo(-12 + flowX * 0.5, -4, -18 + flowX * 0.8, 12 + flowY);
      ctx.lineTo(8 + stride * 0.3, 12 + flowY);
      ctx.quadraticCurveTo(6, -6, 2, -26);
      ctx.closePath();
      ctx.fill();

      // --- 3. Flowing Ascetic Robe Silhouette (Tà Áo Dài Thủy Mặc Buông Rủ) ---
      // A painterly, continuous calligraphic brush drape
      ctx.fillStyle = INK.deep;
      ctx.beginPath();
      // Start at back of neck
      ctx.moveTo(-1, -30);
      // Sweeping back shoulder & cape drape
      ctx.quadraticCurveTo(-14 + flowX * 0.4, -12, -16 + flowX, 10 + flowY);
      // Ripple hemline
      ctx.quadraticCurveTo(-8 + flowX * 0.5, 12 + flowY, 0, 11 + flowY);
      ctx.quadraticCurveTo(6 + stride * 0.2, 12 + flowY, 10 + stride * 0.3, 8 + flowY);
      // Front chest drape
      ctx.quadraticCurveTo(8, -8, 5, -26);
      ctx.quadraticCurveTo(2, -32, -1, -30);
      ctx.closePath();
      ctx.fill();

      // Delicate calligraphic crease line on robe
      ctx.strokeStyle = INK.black;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(2, -24);
      ctx.quadraticCurveTo(1, -6, -4 + flowX * 0.3, 8 + flowY);
      ctx.stroke();

      // --- 4. Slender Bamboo Walking Staff (Gậy Trúc Đả Cẩu) ---
      // Naturally planted or swaying with walking rhythm
      const staffAngle = Math.sin(frame) * 0.12 + (isRunning ? 0.22 : 0.06);
      ctx.save();
      ctx.translate(14, -8);
      ctx.rotate(staffAngle);
      ctx.strokeStyle = INK.black;
      ctx.lineWidth = 2.2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(0, -22);
      ctx.lineTo(2, 28);
      ctx.stroke();

      // Bamboo nodes (Mắt trúc)
      ctx.fillStyle = INK.black;
      ctx.fillRect(-1.2, -8, 4.4, 1.4);
      ctx.fillRect(-0.2, 8, 4.4, 1.4);
      ctx.restore();

      // --- 5. Head & Quiet Face Silhouette ---
      ctx.fillStyle = INK.deep;
      ctx.beginPath();
      ctx.arc(8, -26, 4.5, 0, Math.PI * 2);
      ctx.fill();

      // --- 6. Conical Straw Hat (Nón Lá Cổ Thanh Nhã) ---
      const hatY = -34;
      // Hat body with graceful sweeping rim
      ctx.fillStyle = INK.charcoal;
      ctx.beginPath();
      ctx.moveTo(1, hatY - 14); // Hat peak
      ctx.lineTo(24, hatY + 1); // Front rim
      ctx.quadraticCurveTo(3, hatY + 6, -18, hatY - 2); // Under brim arch
      ctx.closePath();
      ctx.fill();

      // Subtle under-hat ink shadow
      ctx.fillStyle = INK.black;
      ctx.beginPath();
      ctx.ellipse(6, hatY + 3, 10, 3, 0.1, 0, Math.PI * 2);
      ctx.fill();

      // Delicate woven lines on hat
      ctx.strokeStyle = INK.deep;
      ctx.lineWidth = 0.6;
      for (let i = 0; i < 4; i++) {
          ctx.beginPath();
          ctx.moveTo(1, hatY - 14);
          ctx.lineTo(-12 + i * 9, hatY + 1);
          ctx.stroke();
      }

      // --- 7. Beggar's Ceramic Bowl (Bát Sành Khất Thực) ---
      const bowlX = 18 + Math.sin(frame) * 1.5;
      const bowlY = -10 + Math.cos(frame) * 1.0;
      // Bowl body
      ctx.fillStyle = INK.black;
      ctx.beginPath();
      ctx.arc(bowlX, bowlY, 4.5, 0, Math.PI);
      ctx.closePath();
      ctx.fill();
      // Bowl rim line
      ctx.strokeStyle = INK.charcoal;
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      ctx.moveTo(bowlX - 4.5, bowlY);
      ctx.lineTo(bowlX + 4.5, bowlY);
      ctx.stroke();

      // --- 8. Light Ink Dust when Sprinting ---
      if (isRunning) {
          ctx.fillStyle = "rgba(40, 40, 40, 0.35)";
          for (let i = 0; i < 2; i++) {
              ctx.beginPath();
              ctx.arc(-14 + flowX - Math.random() * 8, 12 + Math.random() * 6, Math.random() * 1.5 + 0.5, 0, Math.PI * 2);
              ctx.fill();
          }
      }

      ctx.restore();
  }

  drawPopup(ctx: CanvasRenderingContext2D) {
      const colors = { black: "#111111", gray: "#333333", light: "#555555", ghost: "#888888" };
      ctx.save();
      ctx.translate(this.x, this.y + Math.sin(this.frame)*2);
      if (!this.facingRight) ctx.scale(-1, 1);
      
      const px = 25;
      const py = -70;

      if (this.currentPopup && this.currentPopup.type === 'speech') {
          ctx.font = "italic bold 17px 'Charm', serif";
          ctx.textAlign = "left";
          ctx.fillStyle = colors.ghost;
          ctx.fillText(this.currentPopup.content, px + 1, py + 1);
          ctx.fillStyle = colors.black;
          ctx.fillText(this.currentPopup.content, px, py);
      } else if (this.currentPopup) {
          ctx.fillStyle = colors.gray;
          ctx.beginPath(); ctx.arc(px, py, 14, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.arc(px - 11, py + 11, 5.5, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.arc(px - 16, py + 18, 2.8, 0, Math.PI * 2); ctx.fill();

          ctx.strokeStyle = "white";
          ctx.lineWidth = 1.4;
          if (this.currentPopup && this.currentPopup.content === 'coin') {
              ctx.beginPath(); ctx.arc(px, py, 6.5, 0, Math.PI * 2); ctx.stroke();
              ctx.strokeRect(px - 2, py - 2, 4, 4); 
          } else {
              ctx.beginPath(); ctx.arc(px, py + 2, 5.5, 0, Math.PI); ctx.stroke();
              ctx.moveTo(px - 5.5, py + 2); ctx.lineTo(px + 5.5, py + 2); ctx.stroke();
          }
      }
      ctx.restore();
  }
}