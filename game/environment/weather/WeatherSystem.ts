import { rand } from '../../../core/math';
import { drawBird } from '../../graphics';
import { createLightningBolt, createParticle, drawLightning, drawWeatherParticles } from './WeatherEffects';

export class WeatherSystem {
  type: string = 'clear';
  particles: any[] = [];
  birds: any[] = [];
  timer: number = 0;
  lightningTimer: number = 0;
  flashQueue: any[] = [];
  
  // Callback to change background/audio in react component
  onWeatherChange?: (type: string) => void;

  constructor() {
      this.changeType();
  }

  changeType() {
      const types = ['clear', 'wind', 'rain', 'storm', 'snow', 'clear'];
      const next = types[Math.floor(Math.random() * types.length)];
      this.type = next;
      if (this.onWeatherChange) this.onWeatherChange(next);
  }

  update(width: number, height: number, speed: number) {
      this.timer++;
      if (this.timer > 900) { 
          this.changeType(); this.timer = 0;
      }
      
      if (this.birds.length < 8 && Math.random() < 0.008) { 
          const leaderY = rand(40, 180);
          const leaderSpeed = rand(-0.9, -1.6);
          const flockCount = Math.random() < 0.65 ? Math.floor(rand(2, 4)) : 1;
          for (let k = 0; k < flockCount; k++) {
              this.birds.push({
                  x: width + 50 + k * rand(22, 38), 
                  y: leaderY + (k % 2 === 0 ? 1 : -1) * (k * rand(10, 18)), 
                  vx: leaderSpeed, 
                  size: rand(7, 12), 
                  flapSpeed: rand(0.006, 0.012),
                  flapPhase: rand(0, Math.PI)
              });
          }
      }
      for(let i=this.birds.length-1; i>=0; i--) {
          const b = this.birds[i];
          b.x += b.vx - speed * 0.5 * b.size/15;
          b.y += Math.sin(Date.now() * 0.001 + b.x * 0.01) * 0.5;
          if (b.x < -50) this.birds.splice(i, 1);
      }
      if (this.type !== 'clear') {
          let rate = 1;
          if (this.type === 'rain') rate = 5;
          if (this.type === 'storm') rate = 12;
          if (this.type === 'snow') rate = 2;
          if (this.type === 'wind') rate = 0.5;
          for(let i=0; i<rate; i++) this.particles.push(createParticle(width, height, this.type));
          if (this.type === 'wind' && Math.random() < 0.05) {
              this.particles.push({
                  x: width + 100, y: rand(100, height - 100), vx: rand(-10, -15),
                  life: 100, maxLife: 100, kind: 'gust', curveScale: rand(30, 60)
              });
          }
      }
      for (let i = this.particles.length - 1; i >= 0; i--) {
          const p = this.particles[i];
          p.x += p.vx - speed * 1.5; p.y += (p.vy || 0); p.life--;
          if (this.type === 'snow' || (this.type === 'wind' && p.kind === 'leaf')) {
              p.x += Math.sin(p.life * 0.1) * 0.5;
          }
          if (p.life <= 0 || p.y > height || p.x < -width || p.x > width * 2) this.particles.splice(i, 1);
      }
      if (this.type === 'storm') {
          if (this.lightningTimer > 0) this.lightningTimer--;
          else if (Math.random() < 0.008) { 
              this.lightningTimer = rand(150, 350);
              const tx = rand(100, width - 100);
              const boltPoints = createLightningBolt(rand(tx - 200, tx + 200), -50, tx, height * 0.75);
              this.flashQueue = [
                  {o: 0.8, t: 0}, {o: 0, t: 0}, {o: 0.5, t: 0}, {o: 0.1, t: 0},
                  {o: 1.0, t: 1, points: boltPoints}, {o: 0.7, t: 1, points: boltPoints},
                  {o: 0.4, t: 0}, {o: 0.2, t: 0}, {o: 0, t: 0}
              ];
          }
      }
  }

  draw(ctx: CanvasRenderingContext2D, width: number, height: number) {
      if (this.flashQueue.length > 0) {
          const flash = this.flashQueue.shift(); 
          drawLightning(ctx, width, height, flash);
      }
      this.birds.forEach(b => {
          const flap = Math.sin(Date.now() * b.flapSpeed + b.flapPhase);
          drawBird(ctx, b.x, b.y, b.size, flap);
      });
      
      drawWeatherParticles(ctx, this.particles, width);
  }
}