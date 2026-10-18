export function drawLantern(ctx: CanvasRenderingContext2D, x: number, y: number, time: number) {
    const bob = Math.sin(time * 0.05) * 5;
    const flicker = 0.8 + Math.random() * 0.2;
    
    ctx.save();
    ctx.translate(x, y + bob);
    
    // Glow
    const glow = ctx.createRadialGradient(0, 0, 5, 0, 0, 50);
    glow.addColorStop(0, `rgba(255, 180, 80, ${0.7 * flicker})`);
    glow.addColorStop(1, "rgba(255, 180, 80, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(-50, -50, 100, 100);

    // Lantern Body
    ctx.fillStyle = "rgba(250, 240, 220, 0.9)"; 
    ctx.strokeStyle = "rgba(139, 69, 19, 0.8)"; 
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.ellipse(0, 0, 15, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Ribs
    ctx.strokeStyle = "rgba(139, 69, 19, 0.4)";
    ctx.beginPath(); ctx.moveTo(-14, -10); ctx.lineTo(14, -10); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-15, 0); ctx.lineTo(15, 0); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-14, 10); ctx.lineTo(14, 10); ctx.stroke();

    // Caps
    ctx.fillStyle = "#332";
    ctx.fillRect(-10, -22, 20, 4);
    ctx.fillRect(-10, 18, 20, 4);
    
    // Tassel
    ctx.strokeStyle = "rgba(200, 50, 50, 0.8)";
    ctx.beginPath();
    ctx.moveTo(0, 22);
    ctx.lineTo(Math.sin(time * 0.1) * 2, 35);
    ctx.stroke();

    ctx.restore();
}

export function drawInkDrop(ctx: CanvasRenderingContext2D, x: number, y: number, time: number) {
    const float = Math.sin(time * 0.1) * 3;
    ctx.save();
    ctx.translate(x, y + float);

    // Ink Drop
    ctx.fillStyle = "#111";
    ctx.beginPath();
    ctx.moveTo(0, -10);
    ctx.quadraticCurveTo(8, 0, 0, 10);
    ctx.quadraticCurveTo(-8, 0, 0, -10);
    ctx.fill();

    // Highlight
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.beginPath();
    ctx.ellipse(-2, -3, 2, 4, 0.5, 0, Math.PI*2);
    ctx.fill();
    
    // Ripple
    const r = (Math.sin(time * 0.1) + 1) * 0.5; 
    ctx.strokeStyle = `rgba(0,0,0,${1-r})`;
    ctx.beginPath();
    ctx.arc(0, 0, 8 + r*12, 0, Math.PI*2);
    ctx.stroke();

    ctx.restore();
}