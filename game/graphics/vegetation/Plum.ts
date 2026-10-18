// Sumi-e Ancient Bonsai Plum / Lão Mai Kiểng Cổ Thụ (The Winter Blossom)
// Sharp angular zigzagging branches (Thiết Tuyến 铁线), craggy bark, and vermilion blossom buds

import { drawInkStroke } from '../InkBrush';

export function drawPlum(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    scale: number,
    rng: () => number,
    styleVariant: number = 0 // 0: Red Plum, 1: White Snow Plum, 2: Peach Blossom
) {
    let petalColor = '#b62a28';
    let petalPaleColor = 'rgba(215, 65, 58, 0.85)';

    if (styleVariant === 1) {
        // Bạch Mai Tuyết Sương (Snow White Plum)
        petalColor = 'rgba(248, 246, 238, 0.95)';
        petalPaleColor = 'rgba(235, 230, 220, 0.82)';
    } else if (styleVariant === 2) {
        // Đào Phấn Mùa Xuân (Spring Peach Blossom)
        petalColor = 'rgba(226, 108, 128, 0.92)';
        petalPaleColor = 'rgba(240, 150, 165, 0.78)';
    }

    const INK = {
        deep: '#0f0e0c',
        charcoal: '#22201d',
        barkDry: '#38332c',
        petal: petalColor,
        petalPale: petalPaleColor,
        stamen: '#efece4'
    };

    const treeHeight = (105 + rng() * 30) * scale;
    const lean = (rng() - 0.5) * 45 * scale;

    // --- 1. Craggy Angular Trunk Fractures (Thân Lão Mai Khẳng Khiu Khúc Khuỷu) ---
    // In Chinese painting ("Họa Mai"), the plum trunk never flows smoothly; it twists with hard angular joints
    const trunkSegments = [
        { x: x, y: y, w: 14 * scale },
        { x: x + lean * 0.45 + (rng() - 0.5) * 6 * scale, y: y - treeHeight * 0.28, w: 11 * scale },
        { x: x + lean * 0.95 + (rng() - 0.5) * 8 * scale, y: y - treeHeight * 0.55, w: 8.5 * scale },
        { x: x + lean * 0.40 + (rng() - 0.5) * 6 * scale, y: y - treeHeight * 0.78, w: 6.0 * scale },
        { x: x + lean * 0.65, y: y - treeHeight, w: 3.5 * scale }
    ];

    // Root flaring
    drawInkStroke(ctx, x, y, x - 15 * scale, y + 3 * scale, 6 * scale, INK.deep);
    drawInkStroke(ctx, x, y, x + 16 * scale, y + 2 * scale, 6.5 * scale, INK.deep);

    // Draw fractured trunk segments with rough bark displacement
    for (let i = 0; i < trunkSegments.length - 1; i++) {
        const s1 = trunkSegments[i];
        const s2 = trunkSegments[i + 1];

        // Angular broken stroke with roughness
        const angle = Math.atan2(s2.y - s1.y, s2.x - s1.x);
        const norm = angle + Math.PI / 2;
        const dist = Math.hypot(s2.x - s1.x, s2.y - s1.y);
        const steps = Math.max(3, Math.floor(dist / (4 * scale)));

        const leftPts: { x: number; y: number }[] = [];
        const rightPts: { x: number; y: number }[] = [];

        for (let st = 0; st <= steps; st++) {
            const t = st / steps;
            const cx = s1.x + (s2.x - s1.x) * t;
            const cy = s1.y + (s2.y - s1.y) * t;
            const curW = s1.w + (s2.w - s1.w) * t;

            // Bark roughness noise
            const jL = ((rng() - 0.5) * 2.2 + Math.sin(t * 14 + i) * 1.5) * scale;
            const jR = ((rng() - 0.5) * 2.2 + Math.cos(t * 14 + i) * 1.5) * scale;

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

        // Bark age fissures (Côn pháp thân mai nứt nẻ)
        ctx.strokeStyle = INK.barkDry;
        ctx.lineWidth = 0.9 * scale;
        ctx.beginPath();
        ctx.moveTo((leftPts[1].x + rightPts[1].x)/2, (leftPts[1].y + rightPts[1].y)/2);
        ctx.lineTo((leftPts[steps-1].x + rightPts[steps-1].x)/2 + (rng() - 0.5) * 3 * scale, (leftPts[steps-1].y + rightPts[steps-1].y)/2);
        ctx.stroke();
    }

    // --- 2. Craggy Angular Twigs (Cành Mai Gãy Khúc Thiết Tuyến) ---
    interface BlossomLocation {
        x: number;
        y: number;
        size: number;
        facing: number;
    }
    const blossoms: BlossomLocation[] = [];

    const drawAngularTwig = (
        startX: number,
        startY: number,
        length: number,
        angle: number,
        depth: number,
        thickness: number
    ) => {
        if (depth <= 0) {
            blossoms.push({ x: startX, y: startY, size: (4.2 + rng() * 2.8) * scale, facing: rng() * Math.PI * 2 });
            return;
        }

        // Hard elbow angle deflection (45-75 degrees)
        const elbowX = startX + Math.cos(angle) * (length * 0.55);
        const elbowY = startY + Math.sin(angle) * (length * 0.55);

        const deflection = (rng() * 0.8 + 0.3) * (rng() > 0.5 ? 1 : -1);
        const branchAngle2 = angle + deflection;
        const endX = elbowX + Math.cos(branchAngle2) * (length * 0.55);
        const endY = elbowY + Math.sin(branchAngle2) * (length * 0.55);

        ctx.strokeStyle = INK.charcoal;
        ctx.lineWidth = Math.max(0.9 * scale, thickness);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'miter';

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(elbowX, elbowY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Register blossoms along the elbow
        if (rng() > 0.3) {
            blossoms.push({ x: elbowX, y: elbowY, size: (4.0 + rng() * 2.2) * scale, facing: rng() * Math.PI * 2 });
        }

        // Fork sub-branches with sharp breaks
        const childLen = length * (0.65 + rng() * 0.15);
        const childW = thickness * 0.65;
        drawAngularTwig(endX, endY, childLen, branchAngle2 + (rng() * 0.5 + 0.25), depth - 1, childW);
        if (rng() > 0.25) {
            drawAngularTwig(endX, endY, childLen * 0.85, branchAngle2 - (rng() * 0.5 + 0.25), depth - 1, childW);
        }
    };

    // Major Bonsai Boughs springing from knuckles
    drawAngularTwig(trunkSegments[1].x, trunkSegments[1].y, 38 * scale, -Math.PI * 0.78, 3, 3.2 * scale);
    drawAngularTwig(trunkSegments[2].x, trunkSegments[2].y, 34 * scale, -Math.PI * 0.22, 3, 2.8 * scale);
    drawAngularTwig(trunkSegments[3].x, trunkSegments[3].y, 30 * scale, -Math.PI * 0.65, 2, 2.2 * scale);
    drawAngularTwig(trunkSegments[4].x, trunkSegments[4].y, 28 * scale, -Math.PI * 0.40, 2, 1.8 * scale);
    drawAngularTwig(trunkSegments[4].x, trunkSegments[4].y, 25 * scale, -Math.PI * 0.85, 2, 1.8 * scale);

    // --- 3. Authentic Vermilion Plum Blossoms (Hoa Mai Đỏ 5 Cánh Thủy Mặc) ---
    blossoms.forEach(b => {
        const petals = 5;
        const petRad = b.size * 0.5;

        // Five rounded petals clustered tightly
        for (let p = 0; p < petals; p++) {
            const th = b.facing + (p / petals) * Math.PI * 2;
            const px = b.x + Math.cos(th) * b.size * 0.58;
            const py = b.y + Math.sin(th) * b.size * 0.58;

            ctx.fillStyle = p % 2 === 0 ? INK.petal : INK.petalPale;
            ctx.beginPath();
            ctx.arc(px, py, petRad, 0, Math.PI * 2);
            ctx.fill();

            // Dark ink petal rim for classical woodblock print effect
            ctx.strokeStyle = 'rgba(25, 20, 20, 0.45)';
            ctx.lineWidth = 0.5 * scale;
            ctx.stroke();
        }

        // Pale stamen core dot
        ctx.fillStyle = INK.stamen;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.size * 0.22, 0, Math.PI * 2);
        ctx.fill();

        // 3 tiny dark anther dots
        ctx.fillStyle = '#111';
        for (let a = 0; a < 3; a++) {
            const ath = (a / 3) * Math.PI * 2;
            ctx.fillRect(b.x + Math.cos(ath) * b.size * 0.26 - 0.5, b.y + Math.sin(ath) * b.size * 0.26 - 0.5, 1, 1);
        }
    });
}
