// Sumi-e Deciduous & Specialty Trees (Thụ Mộc Đa Dạng Thủy Mặc)
// Classical East Asian painting species based on the Mustard Seed Garden Manual (芥子园画谱)
// Built on the BotanicalEngine with rugged Cun Fa trunks, fractal bark, and authentic leaf brushstrokes.

import { renderRuggedTrunk, drawAngularBranch, TrunkJoint } from './BotanicalEngine';
import { drawDryStroke, drawInkStroke } from '../InkBrush';

/**
 * 11: Asian Red Maple (Phong Đỏ Mùa Thu 枫木)
 * Tortuous winding trunk with delicate 5-lobed star leaves in cinnabar-amber ink
 */
export function drawMaple(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    scale: number,
    rng: () => number
) {
    const INK = {
        deep: '#121110',
        branch: '#24201c',
        mapleRed: '#b62a26',
        mapleAmber: '#c95f26',
        mapleCrimson: '#8a1b18',
        mapleWash: 'rgba(180, 50, 40, 0.35)'
    };

    const treeHeight = (115 + rng() * 30) * scale;
    const curveDir = rng() > 0.45 ? 1 : -1;

    // Angular trunk joints
    const joints: TrunkJoint[] = [
        { x: x, y: y, width: 15 * scale },
        { x: x + 10 * curveDir * scale, y: y - treeHeight * 0.28, width: 12 * scale },
        { x: x + 24 * curveDir * scale, y: y - treeHeight * 0.58, width: 9 * scale },
        { x: x + 16 * curveDir * scale, y: y - treeHeight * 0.82, width: 6.5 * scale },
        { x: x + 20 * curveDir * scale, y: y - treeHeight, width: 3.5 * scale }
    ];

    renderRuggedTrunk(ctx, joints, scale, rng, {
        baseWidth: 15 * scale,
        minTopWidth: 3.5 * scale,
        roughness: 2.0,
        barkTexture: 'cun_ma_pi',
        knobCount: 2,
        hollowCount: 1,
        rootSpread: 18
    });

    // Boughs with recursive deer-horn branching
    const endpoints: { x: number; y: number }[] = [];
    const b1 = drawAngularBranch(ctx, joints[2].x, joints[2].y, (38 + rng() * 18) * scale, curveDir > 0 ? -0.3 : Math.PI + 0.3, 3.8 * scale, 3, scale, rng, 'staghorn', INK.branch);
    const b2 = drawAngularBranch(ctx, joints[3].x, joints[3].y, (34 + rng() * 16) * scale, curveDir > 0 ? Math.PI - 0.4 : 0.4, 3.2 * scale, 3, scale, rng, 'staghorn', INK.branch);
    const bTop = drawAngularBranch(ctx, joints[4].x, joints[4].y, (30 + rng() * 14) * scale, -Math.PI * 0.5 + (rng() - 0.5) * 0.6, 2.8 * scale, 2, scale, rng, 'staghorn', INK.branch);

    endpoints.push(...b1, ...b2, ...bTop);

    // Render 5-pointed radiating star maple leaves (Phong diệp 枫叶)
    endpoints.forEach(ep => {
        const leafCount = 9 + Math.floor(rng() * 5);
        for (let l = 0; l < leafCount; l++) {
            const lx = ep.x + (rng() - 0.5) * 26 * scale;
            const ly = ep.y + (rng() - 0.5) * 22 * scale;
            const lSize = (3.5 + rng() * 2.2) * scale;
            const col = rng() > 0.55 ? INK.mapleRed : (rng() > 0.3 ? INK.mapleAmber : INK.mapleCrimson);

            ctx.fillStyle = col;
            for (let pt = 0; pt < 5; pt++) {
                const th = -Math.PI * 0.85 + (pt / 4) * (Math.PI * 0.7);
                ctx.beginPath();
                ctx.ellipse(
                    lx + Math.cos(th) * lSize * 0.8,
                    ly + Math.sin(th) * lSize * 0.8,
                    lSize * 0.42,
                    lSize * 0.18,
                    th,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
            }
        }
    });
}

/**
 * 12: Withered Winter Deadwood (Khô Mộc Hàn Sơn 枯木)
 * Zen landscape subject: Gnarled hollow trunk with sharp crab-claw (Giải trảo) bare boughs
 */
export function drawWitheredTree(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    scale: number,
    rng: () => number
) {
    const INK = {
        deep: '#0e0d0c',
        branch: '#221e1a',
        splinter: '#38322a'
    };

    const treeHeight = (120 + rng() * 35) * scale;
    const lean = (rng() - 0.5) * 42 * scale;

    const joints: TrunkJoint[] = [
        { x: x, y: y, width: 17 * scale },
        { x: x + lean * 0.45, y: y - treeHeight * 0.32, width: 13 * scale },
        { x: x + lean * 0.95, y: y - treeHeight * 0.65, width: 9.5 * scale },
        { x: x + lean * 0.70, y: y - treeHeight * 0.85, width: 6.5 * scale },
        { x: x + lean * 0.85, y: y - treeHeight, width: 3.5 * scale }
    ];

    renderRuggedTrunk(ctx, joints, scale, rng, {
        baseWidth: 17 * scale,
        minTopWidth: 3.5 * scale,
        roughness: 3.0,
        barkTexture: 'cun_phu_phien', // Sharp axe-cut bark
        knobCount: 3,
        hollowCount: 2,
        rootSpread: 22
    });

    // Crab-claw sharp hooking bare twigs
    drawAngularBranch(ctx, joints[2].x, joints[2].y, (44 + rng() * 15) * scale, -Math.PI * 0.75, 4.5 * scale, 4, scale, rng, 'crab_claw', INK.branch);
    drawAngularBranch(ctx, joints[3].x, joints[3].y, (38 + rng() * 14) * scale, -Math.PI * 0.25, 3.8 * scale, 4, scale, rng, 'crab_claw', INK.branch);
    drawAngularBranch(ctx, joints[4].x, joints[4].y, (32 + rng() * 12) * scale, -Math.PI * 0.55, 3.2 * scale, 3, scale, rng, 'crab_claw', INK.branch);
}

/**
 * 13: Ancient Ginkgo Biloba (Ngân Hạnh Cổ Thụ 银杏)
 * Monumental columnar tree with fan-shaped golden-amber foliage rosettes
 */
export function drawGinkgo(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    scale: number,
    rng: () => number
) {
    const INK = {
        deep: '#141210',
        branch: '#26201a',
        gold: 'rgba(225, 175, 45, 0.92)',
        amber: 'rgba(200, 142, 35, 0.8)',
        wash: 'rgba(215, 168, 42, 0.35)'
    };

    const treeHeight = (135 + rng() * 30) * scale;
    const lean = (rng() - 0.5) * 20 * scale;

    const joints: TrunkJoint[] = [
        { x: x, y: y, width: 18 * scale },
        { x: x + lean * 0.3, y: y - treeHeight * 0.35, width: 14 * scale },
        { x: x + lean * 0.7, y: y - treeHeight * 0.70, width: 10 * scale },
        { x: x + lean, y: y - treeHeight, width: 5 * scale }
    ];

    renderRuggedTrunk(ctx, joints, scale, rng, {
        baseWidth: 18 * scale,
        minTopWidth: 5 * scale,
        roughness: 1.8,
        barkTexture: 'cun_ma_pi',
        knobCount: 2,
        rootSpread: 21
    });

    const boughs = 6;
    const leafClusters: { x: number; y: number }[] = [];

    for (let i = 0; i < boughs; i++) {
        const bY = y - treeHeight * (0.35 + (i / boughs) * 0.65);
        const side = i % 2 === 0 ? 1 : -1;
        const bLen = (36 + rng() * 22) * scale;
        const bPts = drawAngularBranch(
            ctx,
            x + lean * 0.5, bY,
            bLen,
            side > 0 ? -0.2 : Math.PI + 0.2,
            3.6 * scale,
            2,
            scale,
            rng,
            'staghorn',
            INK.branch
        );
        leafClusters.push(...bPts);
    }

    // Render fan-shaped Ginkgo leaves in layered rosettes
    leafClusters.forEach(pt => {
        // Soft under-wash
        ctx.fillStyle = INK.wash;
        ctx.beginPath();
        ctx.ellipse(pt.x, pt.y, 16 * scale, 10 * scale, 0, 0, Math.PI * 2);
        ctx.fill();

        const count = 10 + Math.floor(rng() * 5);
        for (let c = 0; c < count; c++) {
            const lx = pt.x + (rng() - 0.5) * 24 * scale;
            const ly = pt.y + (rng() - 0.5) * 16 * scale;
            const s = (3.2 + rng() * 2.2) * scale;
            ctx.fillStyle = rng() > 0.4 ? INK.gold : INK.amber;
            ctx.beginPath();
            ctx.arc(lx, ly, s, -Math.PI * 0.8, -Math.PI * 0.2);
            ctx.lineTo(lx, ly + s * 0.4);
            ctx.closePath();
            ctx.fill();
        }
    });
}

/**
 * 14: Chinese Paulownia / Phoenix Tree (Ngô Đồng 梧桐)
 * Muscular trunk with broad tiered umbrella foliage and soft wash
 */
export function drawPaulownia(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    scale: number,
    rng: () => number
) {
    const INK = {
        deep: '#151311',
        branch: '#28231e',
        leafWash: 'rgba(38, 54, 42, 0.4)',
        leafMid: 'rgba(28, 44, 34, 0.8)',
        leafDeep: 'rgba(16, 28, 20, 0.95)'
    };

    const treeHeight = (120 + rng() * 25) * scale;
    const curveDir = rng() > 0.5 ? 1 : -1;

    const joints: TrunkJoint[] = [
        { x: x, y: y, width: 16 * scale },
        { x: x + 8 * curveDir * scale, y: y - treeHeight * 0.38, width: 12 * scale },
        { x: x + 18 * curveDir * scale, y: y - treeHeight * 0.72, width: 8.5 * scale },
        { x: x + 14 * curveDir * scale, y: y - treeHeight, width: 4.5 * scale }
    ];

    renderRuggedTrunk(ctx, joints, scale, rng, {
        baseWidth: 16 * scale,
        minTopWidth: 4.5 * scale,
        roughness: 1.6,
        barkTexture: 'cun_ma_pi',
        knobCount: 2,
        rootSpread: 19
    });

    const boughs = 5;
    for (let b = 0; b < boughs; b++) {
        const ang = -Math.PI * 0.85 + (b / (boughs - 1)) * (Math.PI * 0.7);
        const len = (40 + rng() * 22) * scale;
        const bPts = drawAngularBranch(ctx, joints[3].x, joints[3].y, len, ang, 3.4 * scale, 2, scale, rng, 'staghorn', INK.branch);

        bPts.forEach(pt => {
            // Umbrella broad leaf clusters
            ctx.fillStyle = INK.leafWash;
            ctx.beginPath();
            ctx.ellipse(pt.x, pt.y, 22 * scale, 12 * scale, 0, 0, Math.PI * 2);
            ctx.fill();

            for (let l = 0; l < 4; l++) {
                const lx = pt.x + (rng() - 0.5) * 18 * scale;
                const ly = pt.y + (rng() - 0.5) * 12 * scale;
                const ls = (9 + rng() * 5) * scale;
                ctx.fillStyle = INK.leafMid;
                ctx.beginPath();
                ctx.ellipse(lx, ly, ls, ls * 0.75, 0, 0, Math.PI * 2);
                ctx.fill();

                ctx.strokeStyle = INK.leafDeep;
                ctx.lineWidth = 0.8 * scale;
                ctx.beginPath();
                ctx.moveTo(lx - ls * 0.8, ly);
                ctx.lineTo(lx + ls * 0.8, ly);
                ctx.stroke();
            }
        });
    }
}

/**
 * 15: Columnar Cypress / Cedar (Bách Diệp Tháp 柏树)
 * Spiral grain trunk with layered flame-feather vertical foliage tiers
 */
export function drawCypress(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    scale: number,
    rng: () => number
) {
    const INK = {
        deep: '#121110',
        needleDeep: 'rgba(16, 28, 18, 0.95)',
        needleMid: 'rgba(30, 48, 34, 0.8)',
        needleWash: 'rgba(46, 64, 50, 0.45)'
    };

    const treeHeight = (135 + rng() * 30) * scale;
    const joints: TrunkJoint[] = [
        { x: x, y: y, width: 14 * scale },
        { x: x + (rng() - 0.5) * 4 * scale, y: y - treeHeight * 0.35, width: 11 * scale },
        { x: x + (rng() - 0.5) * 6 * scale, y: y - treeHeight * 0.70, width: 7.5 * scale },
        { x: x, y: y - treeHeight, width: 3 * scale }
    ];

    renderRuggedTrunk(ctx, joints, scale, rng, {
        baseWidth: 14 * scale,
        minTopWidth: 3 * scale,
        roughness: 1.5,
        barkTexture: 'cun_ma_pi',
        rootSpread: 16
    });

    // Layered flame-feather vertical scale tiers
    const tiers = 9;
    for (let t = 0; t < tiers; t++) {
        const progress = t / tiers;
        const tierY = y - 18 * scale - progress * (treeHeight - 25 * scale);
        const tierWidth = (38 * (1 - progress * 0.78) + rng() * 8) * scale;
        const tierHeight = (24 - progress * 8) * scale;

        ctx.fillStyle = progress > 0.5 ? INK.needleDeep : (t % 2 === 0 ? INK.needleMid : INK.needleWash);
        ctx.beginPath();
        ctx.ellipse(x + (rng() - 0.5) * 4 * scale, tierY, tierWidth * 0.5, tierHeight * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Feather bristles
        ctx.strokeStyle = INK.needleDeep;
        ctx.lineWidth = 0.9 * scale;
        for (let s = -tierWidth * 0.4; s <= tierWidth * 0.4; s += 4.5 * scale) {
            ctx.beginPath();
            ctx.moveTo(x + s, tierY);
            ctx.lineTo(x + s * 1.15, tierY - 5 * scale);
            ctx.stroke();
        }
    }
}

/**
 * 16: Dwarf Rock Bonsai Pine (Thạch Tùng Bám Đá 石松)
 * Low creeping stunted pine with gnarled knee joints hugging ground/rock crags
 */
export function drawRockPine(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    scale: number,
    rng: () => number
) {
    const INK = {
        deep: '#100f0e',
        foliageDeep: 'rgba(15, 25, 18, 0.95)',
        foliageWash: 'rgba(35, 52, 40, 0.4)'
    };

    const spread = (70 + rng() * 25) * scale;
    const dir = rng() > 0.5 ? 1 : -1;

    const joints: TrunkJoint[] = [
        { x: x, y: y, width: 14 * scale },
        { x: x + dir * spread * 0.35, y: y - 18 * scale, width: 11 * scale },
        { x: x + dir * spread * 0.75, y: y - 10 * scale, width: 8 * scale },
        { x: x + dir * spread, y: y - 26 * scale, width: 4 * scale }
    ];

    renderRuggedTrunk(ctx, joints, scale, rng, {
        baseWidth: 14 * scale,
        minTopWidth: 4 * scale,
        roughness: 2.8,
        barkTexture: 'cun_long_lan',
        knobCount: 3,
        rootSpread: 22
    });

    joints.slice(1).forEach(k => {
        ctx.fillStyle = INK.foliageWash;
        ctx.beginPath();
        ctx.ellipse(k.x, k.y, 18 * scale, 10 * scale, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = INK.foliageDeep;
        ctx.beginPath();
        ctx.ellipse(k.x, k.y, 12 * scale, 6.5 * scale, 0, 0, Math.PI * 2);
        ctx.fill();
    });
}

/**
 * 17: Magnolia / Mộc Lan Thủy Mặc (木兰)
 * Bare angular branches bearing upright pale cup-shaped blossoms
 */
export function drawMagnolia(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    scale: number,
    rng: () => number
) {
    const INK = {
        deep: '#161412',
        branch: '#2a241f',
        petalWhite: 'rgba(252, 250, 245, 0.95)',
        petalPink: 'rgba(215, 115, 125, 0.75)',
        petalRim: '#201c18'
    };

    const treeHeight = (110 + rng() * 25) * scale;
    const curveDir = rng() > 0.5 ? 1 : -1;

    const joints: TrunkJoint[] = [
        { x: x, y: y, width: 14 * scale },
        { x: x + 8 * curveDir * scale, y: y - treeHeight * 0.4, width: 10 * scale },
        { x: x + 16 * curveDir * scale, y: y - treeHeight * 0.75, width: 6.5 * scale },
        { x: x + 12 * curveDir * scale, y: y - treeHeight, width: 3.5 * scale }
    ];

    renderRuggedTrunk(ctx, joints, scale, rng, {
        baseWidth: 14 * scale,
        minTopWidth: 3.5 * scale,
        roughness: 1.8,
        barkTexture: 'cun_ma_pi',
        knobCount: 2,
        rootSpread: 17
    });

    const bPts = drawAngularBranch(ctx, joints[3].x, joints[3].y, 35 * scale, -Math.PI * 0.5, 3.2 * scale, 3, scale, rng, 'staghorn', INK.branch);

    bPts.forEach(f => {
        ctx.fillStyle = INK.petalPink;
        ctx.beginPath();
        ctx.ellipse(f.x, f.y, 4.5 * scale, 8 * scale, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = INK.petalWhite;
        ctx.beginPath();
        ctx.ellipse(f.x, f.y - 2.5 * scale, 3.5 * scale, 7 * scale, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = INK.petalRim;
        ctx.lineWidth = 0.6 * scale;
        ctx.stroke();
    });
}

/**
 * 18: Mountain Camellia / Trà Hoa Sơn Mộc (山茶)
 * Glossy dark ink leaves with solitary vibrant crimson flower rosettes
 */
export function drawCamellia(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    scale: number,
    rng: () => number
) {
    const INK = {
        deep: '#141210',
        branch: '#26201a',
        leafDeep: 'rgba(14, 26, 18, 0.95)',
        leafMid: 'rgba(28, 48, 34, 0.78)',
        flowerRed: '#be2422',
        flowerCenter: '#f2e879'
    };

    const treeHeight = (95 + rng() * 20) * scale;
    const joints: TrunkJoint[] = [
        { x: x, y: y, width: 13 * scale },
        { x: x + (rng() - 0.5) * 10 * scale, y: y - treeHeight * 0.5, width: 9 * scale },
        { x: x + (rng() - 0.5) * 12 * scale, y: y - treeHeight, width: 4 * scale }
    ];

    renderRuggedTrunk(ctx, joints, scale, rng, {
        baseWidth: 13 * scale,
        minTopWidth: 4 * scale,
        roughness: 1.8,
        barkTexture: 'cun_ma_pi',
        knobCount: 2,
        rootSpread: 16
    });

    const bPts = drawAngularBranch(ctx, joints[2].x, joints[2].y, 30 * scale, -Math.PI * 0.5, 3.0 * scale, 2, scale, rng, 'staghorn', INK.branch);

    bPts.forEach(pt => {
        // Glossy dark leaf clusters
        for (let l = 0; l < 5; l++) {
            const lx = pt.x + (rng() - 0.5) * 22 * scale;
            const ly = pt.y + (rng() - 0.5) * 16 * scale;
            ctx.fillStyle = INK.leafDeep;
            ctx.beginPath();
            ctx.ellipse(lx, ly, 6 * scale, 3.5 * scale, (rng() - 0.5) * 0.8, 0, Math.PI * 2);
            ctx.fill();
        }

        // Vibrant crimson camellia blossom
        if (rng() > 0.35) {
            ctx.fillStyle = INK.flowerRed;
            for (let p = 0; p < 6; p++) {
                const ang = (p / 6) * Math.PI * 2;
                ctx.beginPath();
                ctx.arc(pt.x + Math.cos(ang) * 4 * scale, pt.y + Math.sin(ang) * 4 * scale, 3.8 * scale, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.fillStyle = INK.flowerCenter;
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 2.2 * scale, 0, Math.PI * 2);
            ctx.fill();
        }
    });
}

/**
 * 19: Staghorn Ancient Oak / Cổ Thụ Lộc Giác (鹿角古木)
 * Sprawling ancient crown with layered pepper-dot (Tiêu điểm 椒点) foliage masses
 */
export function drawStaghornOak(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    scale: number,
    rng: () => number
) {
    const INK = {
        deep: '#0f0e0d',
        branch: '#24201c',
        dotDeep: 'rgba(18, 28, 20, 0.95)',
        dotMid: 'rgba(34, 52, 38, 0.75)',
        dotWash: 'rgba(50, 70, 55, 0.38)'
    };

    const treeHeight = (125 + rng() * 30) * scale;
    const lean = (rng() - 0.5) * 36 * scale;

    const joints: TrunkJoint[] = [
        { x: x, y: y, width: 19 * scale },
        { x: x + lean * 0.4, y: y - treeHeight * 0.32, width: 14 * scale },
        { x: x + lean * 0.85, y: y - treeHeight * 0.62, width: 10 * scale },
        { x: x + lean, y: y - treeHeight, width: 5 * scale }
    ];

    renderRuggedTrunk(ctx, joints, scale, rng, {
        baseWidth: 19 * scale,
        minTopWidth: 5 * scale,
        roughness: 2.8,
        barkTexture: 'cun_phu_phien', // Axe-cut bark
        knobCount: 3,
        hollowCount: 1,
        rootSpread: 24
    });

    // Massive Staghorn limbs
    const b1 = drawAngularBranch(ctx, joints[2].x, joints[2].y, (45 + rng() * 15) * scale, -Math.PI * 0.8, 4.8 * scale, 3, scale, rng, 'staghorn', INK.branch);
    const b2 = drawAngularBranch(ctx, joints[2].x, joints[2].y, (42 + rng() * 15) * scale, -Math.PI * 0.2, 4.5 * scale, 3, scale, rng, 'staghorn', INK.branch);
    const bTop = drawAngularBranch(ctx, joints[3].x, joints[3].y, (35 + rng() * 12) * scale, -Math.PI * 0.5, 3.8 * scale, 2, scale, rng, 'staghorn', INK.branch);

    const allPts = [...b1, ...b2, ...bTop];

    // Classical Pepper-Dots (Tiêu điểm 椒点) foliage clouds
    allPts.forEach(pt => {
        ctx.fillStyle = INK.dotWash;
        ctx.beginPath();
        ctx.ellipse(pt.x, pt.y, 22 * scale, 12 * scale, 0, 0, Math.PI * 2);
        ctx.fill();

        // Stippled ink dots
        const dots = 24 + Math.floor(rng() * 12);
        for (let d = 0; d < dots; d++) {
            const dx = pt.x + (rng() - 0.5) * 28 * scale;
            const dy = pt.y + (rng() - 0.5) * 16 * scale;
            ctx.fillStyle = rng() > 0.4 ? INK.dotDeep : INK.dotMid;
            ctx.beginPath();
            ctx.arc(dx, dy, (1.8 + rng() * 1.6) * scale, 0, Math.PI * 2);
            ctx.fill();
        }
    });
}
