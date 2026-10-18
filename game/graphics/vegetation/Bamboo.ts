// Sumi-e Graceful Bamboo / Trúc Quân Tử Kiểng Thủy Mặc
// Tapered segmented culms with swollen joint knuckles and calligraphic 'Ge' (个) & 'Jie' (介) leaves

import { drawInkStroke } from '../InkBrush';

export function drawBamboo(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    scale: number,
    rng: () => number
) {
    const INK = {
        culm: 'rgba(20, 28, 22, 0.95)',
        culmJoint: '#111812',
        jointLine: '#0a0d0a',
        leafDeep: 'rgba(16, 28, 18, 0.96)',
        leafMid: 'rgba(28, 44, 32, 0.82)',
        leafWash: 'rgba(42, 60, 46, 0.5)'
    };

    const stalkCount = Math.floor(rng() * 2) + 3; // Cluster of 3-4 culms

    for (let k = 0; k < stalkCount; k++) {
        const stalkOffsetX = (k - stalkCount / 2) * 16 * scale + (rng() - 0.5) * 8 * scale;
        const stalkScale = 0.85 + rng() * 0.28;
        const stalkHeight = (150 + rng() * 70) * scale * stalkScale;
        // Natural wind-bowed flex
        const flexDirection = (rng() - 0.46) * 16 * scale;

        const segments = 6;
        const segLen = stalkHeight / segments;

        let curX = x + stalkOffsetX;
        let curY = y;
        const baseCulmW = (4.0 * scale * stalkScale);

        // Ground bamboo root shoots
        drawInkStroke(ctx, curX, curY, curX - 6 * scale, curY + 2 * scale, 3 * scale, INK.culm);
        drawInkStroke(ctx, curX, curY, curX + 7 * scale, curY + 2 * scale, 3.5 * scale, INK.culm);

        for (let i = 0; i < segments; i++) {
            const nextX = curX + (flexDirection / segments) * (1 + (i / segments) * 0.8);
            const nextY = curY - segLen;
            const currentW = baseCulmW * (1 - (i / segments) * 0.35);

            // Bamboo segment: Slight waist taper (thắt eo ở giữa đốt, phình nhẹ hai đầu)
            const midX = (curX + nextX) / 2;
            const midY = (curY + nextY) / 2;
            const waistW = currentW * 0.85;

            // Draw lower half of culm
            drawInkStroke(ctx, curX, curY - 1, midX, midY, (currentW + waistW) * 0.5, INK.culm);
            // Draw upper half of culm
            drawInkStroke(ctx, midX, midY, nextX, nextY + 1, (currentW + waistW) * 0.5, INK.culm);

            // Culm Joint Node (Khớp Mắt Trúc Phình Nhẹ Có Đường Viền Trăng Khuyết)
            ctx.fillStyle = INK.culmJoint;
            ctx.fillRect(curX - currentW * 0.8, curY - 1.5, currentW * 1.6, 2.5);
            ctx.strokeStyle = INK.jointLine;
            ctx.lineWidth = 1.0;
            ctx.beginPath();
            ctx.moveTo(curX - currentW * 0.9, curY - 0.5);
            ctx.quadraticCurveTo(curX, curY - 2.5, curX + currentW * 0.9, curY - 0.5);
            ctx.stroke();

            // Branchlets and classic 'Ge' (个) / 'Jie' (介) leaf groups from joints
            if (i >= 2) {
                const branchDir = (i % 2 === 0 ? 1 : -1);
                const branchLen = (20 + rng() * 14) * scale;
                const branchAngle = (branchDir * (38 + rng() * 26)) * (Math.PI / 180);
                const bEndX = curX + Math.sin(branchAngle) * branchLen;
                const bEndY = curY - Math.cos(branchAngle) * branchLen * 0.5;

                // Slender twig with springy bow
                ctx.strokeStyle = INK.culm;
                ctx.lineWidth = Math.max(0.8, 1.2 * scale);
                ctx.beginPath();
                ctx.moveTo(curX, curY);
                ctx.quadraticCurveTo(curX + branchDir * 6, curY - 4, bEndX, bEndY);
                ctx.stroke();

                // Calligraphic Bamboo Leaves (Tụ tán lá trúc chữ '个' và '介')
                const leafCount = 3 + (rng() > 0.45 ? 1 : 0);
                for (let l = 0; l < leafCount; l++) {
                    const leafAngle = branchAngle + ((l - leafCount / 2) * 0.32) + (rng() - 0.5) * 0.14;
                    const leafLength = (24 + rng() * 14) * scale;
                    const leafWidth = (4.6 + rng() * 1.6) * scale;

                    ctx.save();
                    ctx.translate(bEndX, bEndY);
                    ctx.rotate(leafAngle - Math.PI / 2);

                    ctx.fillStyle = l === 0 ? INK.leafDeep : (l % 2 === 0 ? INK.leafMid : INK.leafWash);
                    ctx.beginPath();
                    // Sharp tapered calligraphy bamboo leaf (Đầu nhọn, bụng phình, cuống thanh)
                    ctx.moveTo(0, 0);
                    ctx.quadraticCurveTo(leafWidth * 0.65, leafLength * 0.42, 0, leafLength);
                    ctx.quadraticCurveTo(-leafWidth * 0.65, leafLength * 0.42, 0, 0);
                    ctx.closePath();
                    ctx.fill();

                    // Central leaf vein line
                    ctx.strokeStyle = 'rgba(10, 15, 10, 0.4)';
                    ctx.lineWidth = 0.5 * scale;
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.lineTo(0, leafLength * 0.85);
                    ctx.stroke();

                    ctx.restore();
                }
            }

            curX = nextX;
            curY = nextY;
        }
    }
}