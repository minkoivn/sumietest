// Sumi-e Gnarled Ancient Bonsai Pine (Tùng Kiểng Cổ Thụ Thủy Mặc)
// Features 4 distinct classical styles with dragon-scale cun (Long lân côn), knobby burls, and layered needle clouds

import { renderRuggedTrunk, TrunkJoint } from './BotanicalEngine';

export function drawPine(
    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    scale: number,
    rng: () => number,
    style: number = 0 // 0: Nghinh Phong, 1: Bạt Phong, 2: Trực Cổ Thụ, 3: Thác Đổ (Huyền Nhai)
) {
    const INK = {
        deep: '#0f0e0d',
        charcoal: '#1f1c1a',
        barkDry: '#332d28',
        barkWash: 'rgba(40, 35, 30, 0.45)',
        needleDeep: 'rgba(14, 22, 16, 0.95)',
        needleMid: 'rgba(28, 42, 32, 0.8)',
        needleWash: 'rgba(42, 58, 46, 0.35)'
    };

    const treeHeight = (120 + rng() * 35) * scale;
    const curveDir = rng() > 0.5 ? 1 : -1;
    const joints: TrunkJoint[] = [];
    const clusters: { x: number; y: number; radius: number }[] = [];

    let curX = startX;
    let curY = startY;

    if (style === 1) {
        // --- 1. TÙNG BẠT PHONG (Gale-swept Pine) ---
        // Trunk whipped powerfully in one direction by mountain storms
        joints.push({ x: curX, y: curY, width: 16 * scale });
        const windDir = curveDir;
        const offsets = [
            { dx: 22 * windDir * scale, dy: -treeHeight * 0.18 },
            { dx: 36 * windDir * scale, dy: -treeHeight * 0.22 },
            { dx: 38 * windDir * scale, dy: -treeHeight * 0.22 },
            { dx: 30 * windDir * scale, dy: -treeHeight * 0.20 },
            { dx: 24 * windDir * scale, dy: -treeHeight * 0.18 }
        ];
        offsets.forEach((off, idx) => {
            curX += off.dx;
            curY += off.dy;
            const progress = (idx + 1) / offsets.length;
            joints.push({ x: curX, y: curY, width: Math.max(3 * scale, 16 * (1 - progress * 0.75) * scale) });
        });
    } else if (style === 2) {
        // --- 2. TÙNG TRỰC CỔ THỤ (Monumental Upright Pine) ---
        // Stately, powerful pillar trunk with subtle zigzags and majestic tiered balance
        joints.push({ x: curX, y: curY, width: 22 * scale });
        const offsets = [
            { dx: (rng() - 0.5) * 8 * scale, dy: -treeHeight * 0.22 },
            { dx: (rng() - 0.5) * 12 * scale, dy: -treeHeight * 0.22 },
            { dx: (rng() - 0.5) * 10 * scale, dy: -treeHeight * 0.20 },
            { dx: (rng() - 0.5) * 8 * scale, dy: -treeHeight * 0.18 },
            { dx: (rng() - 0.5) * 6 * scale, dy: -treeHeight * 0.18 }
        ];
        offsets.forEach((off, idx) => {
            curX += off.dx;
            curY += off.dy;
            const progress = (idx + 1) / offsets.length;
            joints.push({ x: curX, y: curY, width: Math.max(4 * scale, 22 * (1 - progress * 0.72) * scale) });
        });
    } else if (style === 3) {
        // --- 3. TÙNG THÁC ĐỔ / HUYỀN NHAI (Cascading Cliff Pine) ---
        // Trunk rises briefly, then arches sharply and plunges downward like a waterfall
        joints.push({ x: curX, y: curY, width: 17 * scale });
        const dropDir = curveDir;
        const offsets = [
            { dx: 14 * dropDir * scale, dy: -treeHeight * 0.25 }, // Vươn lên mép đá
            { dx: 35 * dropDir * scale, dy: -treeHeight * 0.08 }, // Uốn qua bờ vực
            { dx: 45 * dropDir * scale, dy: treeHeight * 0.28 },  // Đổ lao xuống
            { dx: 30 * dropDir * scale, dy: treeHeight * 0.32 },  // Thác nước
            { dx: 18 * dropDir * scale, dy: treeHeight * 0.15 }   // Ngóc đầu đón gió
        ];
        offsets.forEach((off, idx) => {
            curX += off.dx;
            curY += off.dy;
            const progress = (idx + 1) / offsets.length;
            joints.push({ x: curX, y: curY, width: Math.max(3.2 * scale, 17 * (1 - progress * 0.74) * scale) });
        });
    } else {
        // --- 0. TÙNG NGHINH PHONG (Wind-welcoming Bonsai Pine) ---
        // Classic S-curve zigzag trunk with horizontal welcoming bough
        joints.push({ x: curX, y: curY, width: 17 * scale });
        const offsets = [
            { dx: (14 + rng() * 12) * curveDir * scale, dy: -treeHeight * 0.18 },
            { dx: (26 + rng() * 15) * curveDir * scale, dy: -treeHeight * 0.20 },
            { dx: (-12 + rng() * 10) * curveDir * scale, dy: -treeHeight * 0.18 },
            { dx: (-20 + rng() * 12) * curveDir * scale, dy: -treeHeight * 0.16 },
            { dx: (12 + rng() * 10) * curveDir * scale, dy: -treeHeight * 0.14 },
            { dx: (16 + rng() * 8) * curveDir * scale, dy: -treeHeight * 0.14 }
        ];
        offsets.forEach((off, idx) => {
            curX += off.dx;
            curY += off.dy;
            const progress = (idx + 1) / offsets.length;
            joints.push({ x: curX, y: curY, width: Math.max(3.0 * scale, 17 * (1 - progress * 0.76) * scale) });
        });
    }

    // Render solid trunk with Dragon-Scale Cun & Knobby Burls
    renderRuggedTrunk(ctx, joints, scale, rng, {
        baseWidth: joints[0].width,
        minTopWidth: joints[joints.length - 1].width,
        roughness: 2.2,
        barkTexture: 'cun_long_lan',
        knobCount: style === 2 ? 3 : 2,
        hollowCount: style === 2 ? 1 : 0,
        rootSpread: style === 2 ? 24 : 19
    });

    // Helper for craggy branching
    const drawCraggyBranch = (
        bx1: number, by1: number,
        targetAngle: number,
        totalLen: number,
        thickness: number
    ): { endX: number; endY: number } => {
        let cx = bx1;
        let cy = by1;
        const branchSteps = 3;
        const stepLen = totalLen / branchSteps;
        let curAngle = targetAngle;

        ctx.strokeStyle = INK.deep;
        ctx.lineCap = 'round';

        for (let bs = 0; bs < branchSteps; bs++) {
            curAngle += (rng() - 0.5) * 0.45;
            const nx = cx + Math.cos(curAngle) * stepLen;
            const ny = cy + Math.sin(curAngle) * stepLen * 0.75;

            ctx.lineWidth = Math.max(1.2 * scale, thickness * (1 - (bs / branchSteps) * 0.6));
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(nx, ny);
            ctx.stroke();

            // Sub-branchlet fork
            if (bs === 1 && rng() > 0.35) {
                const subAngle = curAngle + (rng() > 0.5 ? 0.65 : -0.65);
                const subLen = stepLen * 1.2;
                const subX = cx + Math.cos(subAngle) * subLen;
                const subY = cy + Math.sin(subAngle) * subLen * 0.7;
                ctx.lineWidth = Math.max(1.0 * scale, thickness * 0.4);
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.lineTo(subX, subY);
                ctx.stroke();
                clusters.push({ x: subX, y: subY, radius: (13 + rng() * 6) * scale });
            }

            cx = nx;
            cy = ny;
        }

        return { endX: cx, endY: cy };
    };

    // Branching patterns customized per style
    if (style === 1) {
        // Gale-swept: All branches blown eastward
        const windDir = curveDir;
        for (let j = 1; j < joints.length; j++) {
            const b = drawCraggyBranch(
                joints[j].x, joints[j].y,
                windDir > 0 ? (rng() - 0.5) * 0.4 : Math.PI + (rng() - 0.5) * 0.4,
                (42 + rng() * 25) * scale,
                3.6 * scale
            );
            clusters.push({ x: b.endX, y: b.endY, radius: (18 + rng() * 6) * scale });
        }
    } else if (style === 2) {
        // Upright monumental: Symmetrical grand tiers left and right
        for (let j = 1; j < joints.length; j++) {
            const side = (j % 2 === 0 ? 1 : -1);
            const b = drawCraggyBranch(
                joints[j].x, joints[j].y,
                side > 0 ? 0.2 : Math.PI - 0.2,
                (46 - j * 4 + rng() * 15) * scale,
                4.0 * scale
            );
            clusters.push({ x: b.endX, y: b.endY, radius: (19 + rng() * 6) * scale });
        }
        const crown = joints[joints.length - 1];
        clusters.push({ x: crown.x, y: crown.y - 12 * scale, radius: 22 * scale });
    } else if (style === 3) {
        // Cascading cliff: Clusters along the descending cascade
        for (let j = 1; j < joints.length; j++) {
            const b = drawCraggyBranch(
                joints[j].x, joints[j].y,
                (rng() - 0.5) * 0.6,
                (35 + rng() * 18) * scale,
                3.4 * scale
            );
            clusters.push({ x: b.endX, y: b.endY, radius: (16 + rng() * 5) * scale });
        }
    } else {
        // Wind-welcoming Nghinh Phong
        const b1Origin = joints[2];
        const b1 = drawCraggyBranch(
            b1Origin.x, b1Origin.y,
            curveDir > 0 ? 0.15 : Math.PI - 0.15,
            (52 + rng() * 18) * scale,
            4.2 * scale
        );
        clusters.push({ x: b1.endX, y: b1.endY, radius: (20 + rng() * 6) * scale });

        const b2Origin = joints[3];
        const b2 = drawCraggyBranch(
            b2Origin.x, b2Origin.y,
            curveDir > 0 ? Math.PI - 0.35 : 0.35,
            (40 + rng() * 16) * scale,
            3.5 * scale
        );
        clusters.push({ x: b2.endX, y: b2.endY, radius: (17 + rng() * 6) * scale });

        const b3Origin = joints[4];
        const b3 = drawCraggyBranch(
            b3Origin.x, b3Origin.y,
            curveDir > 0 ? 0.3 : Math.PI - 0.3,
            (36 + rng() * 14) * scale,
            3.0 * scale
        );
        clusters.push({ x: b3.endX, y: b3.endY, radius: (16 + rng() * 5) * scale });

        const crown = joints[joints.length - 1];
        clusters.push({ x: crown.x, y: crown.y - 12 * scale, radius: 20 * scale });
        clusters.push({ x: crown.x + 14 * scale * curveDir, y: crown.y - 6 * scale, radius: 15 * scale });
    }

    // --- Render Layered Pine Needle Clusters (松针云团) ---
    clusters.forEach(c => {
        const rad = c.radius;

        // Soft ink cloud wash
        ctx.fillStyle = INK.needleWash;
        ctx.beginPath();
        ctx.ellipse(c.x, c.y, rad * 1.25, rad * 0.65, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = INK.needleMid;
        ctx.beginPath();
        ctx.ellipse(c.x, c.y, rad * 0.95, rad * 0.45, 0, 0, Math.PI * 2);
        ctx.fill();

        // Radiating sharp needle fans
        ctx.strokeStyle = INK.needleDeep;
        ctx.lineWidth = Math.max(0.75, 0.9 * scale);
        ctx.lineCap = 'round';

        const fans = 3 + Math.floor(rng() * 2);
        for (let f = 0; f < fans; f++) {
            const fanX = c.x + (rng() - 0.5) * rad * 1.1;
            const fanY = c.y + (rng() - 0.5) * rad * 0.4;
            const needleCount = 7 + Math.floor(rng() * 3);
            const baseNeedleLen = (10 + rng() * 5) * scale;

            for (let n = 0; n < needleCount; n++) {
                const spreadAngle = (style === 1)
                    ? (curveDir > 0 ? -0.4 : Math.PI + 0.4) + (n / (needleCount - 1)) * 0.8 - 0.4
                    : -Math.PI * 0.9 + (n / (needleCount - 1)) * (Math.PI * 0.8) + (rng() - 0.5) * 0.12;
                const nLen = baseNeedleLen * (0.8 + rng() * 0.4);

                ctx.beginPath();
                ctx.moveTo(fanX, fanY);
                ctx.lineTo(
                    fanX + Math.cos(spreadAngle) * nLen,
                    fanY + Math.sin(spreadAngle) * nLen * 0.7
                );
                ctx.stroke();
            }
        }
    });
}