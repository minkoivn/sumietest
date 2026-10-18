// Sumi-e Avian Flock (Đàn Chim Nhạn Nét Phẩy Thủy Mặc)
// Minimalist, poetic calligraphic brush swoops seen in classical landscape handscrolls

export function drawBird(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, flap: number) {
    ctx.save();
    ctx.translate(x, y);

    // Keep scale light and distant (6-12px nominal wing span)
    const wingSpan = Math.max(6, size * 0.9);
    const flapOffset = flap * wingSpan * 0.45;

    // Atmospheric ink wash color with natural distance opacity
    ctx.strokeStyle = 'rgba(28, 28, 28, 0.75)';
    ctx.fillStyle = 'rgba(28, 28, 28, 0.85)';
    ctx.lineWidth = Math.max(1.1, wingSpan * 0.12);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Calligraphic wing swoop: two sweeping arched strokes joined at central body
    ctx.beginPath();
    // Left Wing (Tapered tip to center crest)
    ctx.moveTo(-wingSpan, -flapOffset);
    ctx.quadraticCurveTo(-wingSpan * 0.45, -wingSpan * 0.35 + flapOffset * 0.6, 0, 0);

    // Right Wing (Center crest to tapered right tip)
    ctx.quadraticCurveTo(wingSpan * 0.45, -wingSpan * 0.35 + flapOffset * 0.6, wingSpan, -flapOffset);
    ctx.stroke();

    // Subtle swift brush flick for the bird's torso
    ctx.beginPath();
    ctx.ellipse(0, 0, wingSpan * 0.18, wingSpan * 0.08, 0.1, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}