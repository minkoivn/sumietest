// Sumi-e Bonsai Weeping Willow / Liễu Kiểng Cổ Thụ (Cascading Silk Willow)
// Weathered hollowed trunk, angular bough knuckles, and cascading wind-drifted leaf curtains

import { drawInkStroke } from '../InkBrush';

export function drawWillow(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    scale: number,
    rng: () => number
) {
    const INK = {
        deep: '#121110',
        charcoal: '#26221e',
        barkDry: '#3a342c',
        leafDeep: 'rgba(22, 36, 26, 0.92)',
        leafMid: 'rgba(38, 54, 42, 0.7)',
        leafWash: 'rgba(52, 70, 56, 0.38)',
        tendril: 'rgba(30, 40, 32, 0.55)'
    };

    const treeHeight = (110 + rng() * 30) * scale;
    const archDir = rng() > 0.45 ? 1 : -1;
    const archSweep = (44 + rng() * 22) * scale * archDir;

    // --- 1. Weathered Knobby Trunk with Fractures (Thân Liễu Già Gồ Ghề Uốn Lượn) ---
    // Broken segments with bark displacements instead of sterile splines
    const trunkSegments = [
        { x: x, y: y, w: 15 * scale },
        { x: x + archSweep * 0.45 + (rng() - 0.5) * 6 * scale, y: y - treeHeight * 0.3, w: 12 * scale },
        { x: x + archSweep * 0.95 + (rng() - 0.5) * 8 * scale, y: y - treeHeight * 0.62, w: 9 * scale },
        { x: x + archSweep * 0.80, y: y - treeHeight, w: 5 * scale }
    ];

    // Root claws grasping the ground
    drawInkStroke(ctx, x, y, x - 16 * scale, y + 4 * scale, 6 * scale, INK.deep);
    drawInkStroke(ctx, x, y, x + 18 * scale, y + 3 * scale, 7 * scale, INK.deep);

    // Render textured fractured trunk
    for (let i = 0; i < trunkSegments.length - 1; i++) {
        const s1 = trunkSegments[i];
        const s2 = trunkSegments[i + 1];
        const dist = Math.hypot(s2.x - s1.x, s2.y - s1.y);
        const steps = Math.max(3, Math.floor(dist / (4 * scale)));
        const angle = Math.atan2(s2.y - s1.y, s2.x - s1.x);
        const norm = angle + Math.PI / 2;

        const leftPts: { x: number; y: number }[] = [];
        const rightPts: { x: number; y: number }[] = [];

        for (let st = 0; st <= steps; st++) {
            const t = st / steps;
            const cx = s1.x + (s2.x - s1.x) * t;
            const cy = s1.y + (s2.y - s1.y) * t;
            const curW = s1.w + (s2.w - s1.w) * t;

            // Bark roughness noise
            const jL = ((rng() - 0.5) * 2.4 + Math.sin(t * 12 + i) * 1.8) * scale;
            const jR = ((rng() - 0.5) * 2.4 + Math.cos(t * 12 + i) * 1.8) * scale;

            leftPts.push({ x: cx + Math.cos(norm) * (curW * 0.5 + jL), y: cy + Math.sin(norm) * (curW * 0.5 + jL) });
            rightPts.push({ x: cx - Math.cos(norm) * (curW * 0.5 + jR), y: cy - Math.sin(norm) * (curW * 0.5 + jR) });
        }

        ctx.fillStyle = INK.deep;
        ctx.beginPath();
        ctx.moveTo(leftPts[0].x, leftPts[0].y);
        leftPts.forEach(p => ctx.lineTo(p.x, p.y));
        for (let r = rightPts.length - 1; r >= 0; r--) ctx.lineTo(rightPts[r].x, rightPts[r].y);
        ctx.closePath();
        ctx.fill();

        // Bark age fissures
        ctx.strokeStyle = INK.barkDry;
        ctx.lineWidth = 0.9 * scale;
        ctx.beginPath();
        ctx.moveTo((leftPts[1].x + rightPts[1].x)/2, (leftPts[1].y + rightPts[1].y)/2);
        ctx.lineTo((leftPts[steps-1].x + rightPts[steps-1].x)/2, (leftPts[steps-1].y + rightPts[steps-1].y)/2);
        ctx.stroke();
    }

    // Hollow knot in trunk (Hốc cây liễu cổ)
    const hollowY = y - treeHeight * 0.45;
    const hollowX = x + archSweep * 0.65;
    ctx.fillStyle = '#0a0908';
    ctx.beginPath();
    ctx.ellipse(hollowX, hollowY, 3.5 * scale, 6 * scale, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // --- 2. Angular Bough Knuckles (Các cành chính vòm gãy góc) ---
    const crown = trunkSegments[trunkSegments.length - 1];
    const boughCount = 6;
    const tendrilAnchors: { x: number; y: number; lengthMod: number }[] = [];

    for (let b = 0; b < boughCount; b++) {
        const spreadAngle = -Math.PI * 0.88 + (b / (boughCount - 1)) * (Math.PI * 0.8);
        const bLen = (38 + rng() * 26) * scale;

        // Arching bough with sharp elbow
        const elbowX = crown.x + Math.cos(spreadAngle) * (bLen * 0.55);
        const elbowY = crown.y - (14 + rng() * 10) * scale;
        const endX = crown.x + Math.cos(spreadAngle) * bLen;
        const endY = crown.y - Math.sin(spreadAngle) * bLen * 0.4 + 4 * scale;

        ctx.strokeStyle = INK.charcoal;
        ctx.lineWidth = Math.max(1.1 * scale, (2.8 - b * 0.3) * scale);
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(crown.x, crown.y);
        ctx.lineTo(elbowX, elbowY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        tendrilAnchors.push({ x: endX, y: endY, lengthMod: 1.0 });
        tendrilAnchors.push({ x: elbowX, y: elbowY, lengthMod: 0.85 });
    }

    // --- 3. Cascading Weeping Tendrils & Varied Leaf Dabs (Cành Tơ Liễu Buông Rủ) ---
    tendrilAnchors.forEach(ta => {
        const subCount = 2 + Math.floor(rng() * 2);
        for (let sc = 0; sc < subCount; sc++) {
            const startX = ta.x + (sc - subCount / 2) * 7 * scale;
            const startY = ta.y + (rng() - 0.5) * 5 * scale;
            const tendrilLen = (70 + rng() * 50) * scale * ta.lengthMod;
            const sway = (rng() - 0.4) * 22 * scale;

            // Organic wave droop
            ctx.strokeStyle = INK.tendril;
            ctx.lineWidth = Math.max(0.65, 0.85 * scale);
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.bezierCurveTo(
                startX + sway * 0.4, startY + tendrilLen * 0.35,
                startX - sway * 0.25, startY + tendrilLen * 0.72,
                startX + sway, startY + tendrilLen
            );
            ctx.stroke();

            // Varied ink leaf dabs along tendril
            const leaves = 7 + Math.floor(rng() * 4);
            for (let l = 1; l <= leaves; l++) {
                const tr = l / (leaves + 1);
                const omt = 1 - tr;
                const lx = omt*omt*omt*startX + 3*omt*omt*tr*(startX + sway * 0.4) + 3*omt*tr*tr*(startX - sway * 0.25) + tr*tr*tr*(startX + sway);
                const ly = omt*omt*omt*startY + 3*omt*omt*tr*(startY + tendrilLen * 0.35) + 3*omt*tr*tr*(startY + tendrilLen * 0.72) + tr*tr*tr*(startY + tendrilLen);

                const side = l % 2 === 0 ? 1 : -1;
                ctx.fillStyle = l % 3 === 0 ? INK.leafWash : (l % 2 === 0 ? INK.leafDeep : INK.leafMid);
                ctx.beginPath();
                // Teardrop willow leaf dab
                ctx.ellipse(
                    lx + side * 2.2 * scale,
                    ly,
                    (3.2 + rng() * 1.2) * scale,
                    (1.1 + rng() * 0.4) * scale,
                    side * 0.42,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
            }
        }
    });
}