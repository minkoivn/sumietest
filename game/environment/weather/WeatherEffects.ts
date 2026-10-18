import { rand } from '../../../core/math';

export function createLightningBolt(startX: number, startY: number, endX: number, endY: number) {
    const points = [{x: startX, y: startY}, {x: endX, y: endY}];
    const generations = 6;
    let offset = 100;
    for (let i = 0; i < generations; i++) {
        for (let j = 0; j < points.length - 1; j += 2) {
            const p1 = points[j]; const p2 = points[j+1];
            const midX = (p1.x + p2.x) / 2; const midY = (p1.y + p2.y) / 2;
            const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
            const perp = angle + Math.PI/2;
            const disp = (Math.random() - 0.5) * offset;
            points.splice(j + 1, 0, {
                x: midX + Math.cos(perp) * disp, y: midY + Math.sin(perp) * disp
            });
        }
        offset /= 2;
    }
    return points;
}

export function createParticle(w: number, h: number, type: string) {
    const startX = rand(-w, w * 2); 
    const p: any = { x: startX, y: -20, life: rand(150, 300) };
    if (type === 'rain' || type === 'storm') {
        p.vx = -3; p.vy = rand(12, 18); p.len = rand(15, 25); p.kind = 'rain';
    } else if (type === 'snow') {
        p.vx = -1; p.vy = rand(1, 3); p.size = rand(2, 4); p.kind = 'snow';
    } else if (type === 'wind') {
        p.x = rand(-w, w*2); p.y = rand(0, h); 
        p.vx = rand(-8, -12); p.vy = rand(-1, 1);
        p.kind = 'leaf'; p.rotation = rand(0, Math.PI);
    }
    return p;
}

export function drawWeatherParticles(ctx: CanvasRenderingContext2D, particles: any[], width: number) {
    ctx.fillStyle = "#111"; ctx.strokeStyle = "rgba(30, 30, 30, 0.6)";
    particles.forEach(p => {
        if (p.x < -100 || p.x > width + 200) return;
        if (p.kind === 'rain') {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - 3, p.y + p.len); ctx.stroke();
        } else if (p.kind === 'snow') {
            ctx.fillStyle = "rgba(255, 255, 255, 0.9)"; ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI*2); ctx.fill();
        } else if (p.kind === 'leaf') {
            ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rotation + p.life * 0.1);
            ctx.fillStyle = "rgba(40, 40, 40, 0.8)"; ctx.beginPath();
            ctx.ellipse(0, 0, 6, 3, 0, 0, Math.PI*2); ctx.fill(); ctx.restore();
        } else if (p.kind === 'gust') {
           ctx.strokeStyle = "rgba(100, 100, 100, 0.3)";
           ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - 20, p.y); ctx.stroke();
        }
    });
}

export function drawLightning(ctx: CanvasRenderingContext2D, width: number, height: number, flash: any) {
    if (flash.o > 0) {
        ctx.fillStyle = `rgba(255, 255, 255, ${flash.o})`;
        ctx.fillRect(0, 0, width, height);
    }
    if (flash.t === 1 && flash.points) {
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 3;
        ctx.shadowBlur = 15; ctx.shadowColor = "rgba(255,255,255,0.8)";
        ctx.lineJoin = "round"; ctx.beginPath();
        ctx.moveTo(flash.points[0].x, flash.points[0].y);
        for(let i=1; i<flash.points.length; i++) ctx.lineTo(flash.points[i].x, flash.points[i].y);
        ctx.stroke();
        const endP = flash.points[flash.points.length-1];
        const grad = ctx.createRadialGradient(endP.x, endP.y, 0, endP.x, endP.y, 60);
        grad.addColorStop(0, "rgba(255,255,255,1)"); grad.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(endP.x, endP.y, 60, 0, Math.PI*2); ctx.fill();
        ctx.shadowBlur = 0; 
    }
}
