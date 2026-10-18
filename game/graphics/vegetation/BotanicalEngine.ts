// BotanicalEngine.ts - Procedural Botanical Formula Engine for Classical Sumi-e Trees
// Grounded in the Mustard Seed Garden Manual (Giới Tử Viên Họa Phổ 芥子园画谱) & fractal calculus

import { drawDryStroke, drawInkStroke } from '../InkBrush';

export interface TrunkJoint {
    x: number;
    y: number;
    width: number;
    angle?: number;
}

export interface TrunkOptions {
    baseWidth: number;
    minTopWidth: number;
    roughness: number;         // Amplitude of fractal bark noise (0.8 - 3.5)
    barkTexture: 'cun_ma_pi' | 'cun_phu_phien' | 'cun_long_lan' | 'smooth_bamboo'; // Traditional Cun Fa textures
    knobCount?: number;        // Number of knobby burls/bì bướu
    hollowCount?: number;      // Number of hollow clefts/hốc cây
    rootSpread?: number;       // Root flare width
    colorDeep?: string;
    colorCharcoal?: string;
    colorDry?: string;
}

/**
 * Procedurally generates a rugged, gnarled tree trunk with authentic Cun Fa bark contour
 * Never generates sterile straight lines; respects organic mass conservation and tortuosity.
 */
export function renderRuggedTrunk(
    ctx: CanvasRenderingContext2D,
    joints: TrunkJoint[],
    scale: number,
    rng: () => number,
    opts: TrunkOptions
) {
    const INK = {
        deep: opts.colorDeep || '#121110',
        charcoal: opts.colorCharcoal || '#24201d',
        dry: opts.colorDry || '#3a342c'
    };

    const leftContour: { x: number; y: number }[] = [];
    const rightContour: { x: number; y: number }[] = [];

    const rootSpread = (opts.rootSpread !== undefined ? opts.rootSpread : 18) * scale;
    const startX = joints[0].x;
    const startY = joints[0].y;

    // --- 1. Authentic Root Claws (Kê trảo căn 鸡爪根) ---
    // Powerful claw roots clutching the soil
    leftContour.push({ x: startX - rootSpread * 1.1, y: startY + 4 * scale });
    leftContour.push({ x: startX - rootSpread * 0.7, y: startY + 1 * scale });
    rightContour.push({ x: startX + rootSpread * 1.1, y: startY + 4 * scale });
    rightContour.push({ x: startX + rootSpread * 0.7, y: startY + 1 * scale });

    // --- 2. Dual-Octave Fractal Bark Contour Generation ---
    for (let j = 0; j < joints.length - 1; j++) {
        const j1 = joints[j];
        const j2 = joints[j + 1];
        const dist = Math.hypot(j2.x - j1.x, j2.y - j1.y);
        const subSteps = Math.max(3, Math.floor(dist / (4 * scale)));

        const angle = Math.atan2(j2.y - j1.y, j2.x - j1.x);
        const normAngle = angle + Math.PI / 2;

        for (let s = (j === 0 ? 1 : 0); s <= subSteps; s++) {
            const t = s / subSteps;
            const globalT = (j + t) / (joints.length - 1);
            const bx = j1.x + (j2.x - j1.x) * t;
            const by = j1.y + (j2.y - j1.y) * t;
            
            // Linear width taper + organic swelling
            const baseW = j1.width + (j2.width - j1.width) * t;

            // Dual-octave fractal noise: low frequency bark undulation + high frequency fiber grain
            const oct1 = Math.sin(globalT * Math.PI * 6 + j * 2.3) * (opts.roughness * 1.8);
            const oct2 = Math.cos(globalT * Math.PI * 14 + s * 1.5) * (opts.roughness * 0.8);
            const jitterL = ((rng() - 0.5) * 1.6 + oct1 + oct2) * scale;
            const jitterR = ((rng() - 0.5) * 1.6 - oct1 + oct2) * scale;

            // Knobby burls (mấu mắt cây)
            let burlL = 0;
            let burlR = 0;
            if (opts.knobCount && opts.knobCount > 0) {
                if (Math.abs(globalT - 0.35) < 0.08) burlL += 4.5 * scale * opts.roughness;
                if (Math.abs(globalT - 0.65) < 0.08) burlR += 4.0 * scale * opts.roughness;
            }

            leftContour.push({
                x: bx + Math.cos(normAngle) * (baseW * 0.5 + jitterL + burlL),
                y: by + Math.sin(normAngle) * (baseW * 0.5 + jitterL + burlL)
            });
            rightContour.push({
                x: bx - Math.cos(normAngle) * (baseW * 0.5 + jitterR + burlR),
                y: by - Math.sin(normAngle) * (baseW * 0.5 + jitterR + burlR)
            });
        }
    }

    // Top apex cap
    const topJoint = joints[joints.length - 1];
    leftContour.push({ x: topJoint.x, y: topJoint.y });

    // --- 3. Fill Solid Ink Trunk ---
    ctx.fillStyle = INK.deep;
    ctx.beginPath();
    ctx.moveTo(leftContour[0].x, leftContour[0].y);
    leftContour.forEach(p => ctx.lineTo(p.x, p.y));
    for (let r = rightContour.length - 1; r >= 0; r--) {
        ctx.lineTo(rightContour[r].x, rightContour[r].y);
    }
    ctx.closePath();
    ctx.fill();

    // --- 4. Traditional Cun Fa Texture Fissures (Côn Pháp 皴法) ---
    if (opts.barkTexture === 'cun_ma_pi') {
        // Hemp-fiber cun (Ma bì côn 麻皮皴): Longitudinal curving fibrous fissures
        ctx.strokeStyle = INK.dry;
        ctx.lineWidth = 1.0 * scale;
        const fissureCount = 4;
        for (let f = 0; f < fissureCount; f++) {
            ctx.beginPath();
            const startIdx = Math.floor(rng() * 4) + 1;
            const endIdx = Math.min(leftContour.length - 2, startIdx + 8 + Math.floor(rng() * 6));
            if (startIdx < endIdx) {
                const pStart = leftContour[startIdx];
                const pRStart = rightContour[startIdx];
                const ratio = 0.25 + f * 0.18;
                ctx.moveTo(pStart.x * (1 - ratio) + pRStart.x * ratio, pStart.y * (1 - ratio) + pRStart.y * ratio);
                for (let k = startIdx + 1; k <= endIdx; k++) {
                    const pL = leftContour[k];
                    const pR = rightContour[k];
                    const wobble = (rng() - 0.5) * 2 * scale;
                    ctx.lineTo(pL.x * (1 - ratio) + pR.x * ratio + wobble, pL.y * (1 - ratio) + pR.y * ratio);
                }
                ctx.stroke();
            }
        }
    } else if (opts.barkTexture === 'cun_phu_phien') {
        // Axe-cut cun (Phủ phiến côn 斧劈皴): Sharp angular triangular gouges
        ctx.fillStyle = INK.charcoal;
        const cutCount = 5 + Math.floor(rng() * 4);
        for (let c = 0; c < cutCount; c++) {
            const idx = Math.floor(rng() * (leftContour.length - 4)) + 2;
            const pL = leftContour[idx];
            const pR = rightContour[idx];
            const midX = (pL.x + pR.x) / 2 + (rng() - 0.5) * 6 * scale;
            const midY = (pL.y + pR.y) / 2;
            const cutW = (3 + rng() * 4) * scale;
            const cutH = (5 + rng() * 8) * scale;
            ctx.beginPath();
            ctx.moveTo(midX, midY - cutH * 0.5);
            ctx.lineTo(midX + cutW, midY);
            ctx.lineTo(midX - cutW * 0.5, midY + cutH * 0.5);
            ctx.closePath();
            ctx.fill();
        }
    } else if (opts.barkTexture === 'cun_long_lan') {
        // Dragon-scale cun (Long lân côn 龙鳞皴): Round overlapping pine bark plates
        ctx.strokeStyle = INK.dry;
        ctx.lineWidth = 1.1 * scale;
        const plateCount = 8 + Math.floor(rng() * 6);
        for (let p = 0; p < plateCount; p++) {
            const idx = Math.floor(rng() * (leftContour.length - 4)) + 2;
            const pL = leftContour[idx];
            const pR = rightContour[idx];
            const px = pL.x * 0.4 + pR.x * 0.6 + (rng() - 0.5) * 4 * scale;
            const py = (pL.y + pR.y) / 2;
            ctx.beginPath();
            ctx.arc(px, py, (3.5 + rng() * 3.5) * scale, 0.1, Math.PI - 0.1);
            ctx.stroke();
        }
    }

    // --- 5. Ancient Hollow Clefts (Hốc cây cổ thụ rỗng ruột) ---
    if (opts.hollowCount && opts.hollowCount > 0) {
        ctx.fillStyle = '#0a0908';
        for (let h = 0; h < opts.hollowCount; h++) {
            const hY = startY - (30 + h * 45 + rng() * 15) * scale;
            const hX = startX + (rng() - 0.5) * 8 * scale;
            ctx.beginPath();
            ctx.ellipse(hX, hY, 3.5 * scale, 8 * scale, (rng() - 0.5) * 0.4, 0, Math.PI * 2);
            ctx.fill();
            // Dry wash rim
            ctx.strokeStyle = INK.dry;
            ctx.lineWidth = 0.8 * scale;
            ctx.stroke();
        }
    }

    // Secondary root spurs on the ground
    drawDryStroke(ctx, startX - rootSpread * 0.7, startY + 1 * scale, startX - rootSpread * 1.5, startY + 6 * scale, 4 * scale, INK.deep);
    drawDryStroke(ctx, startX + rootSpread * 0.7, startY + 1 * scale, startX + rootSpread * 1.6, startY + 5 * scale, 4.5 * scale, INK.deep);
}

/**
 * Classical Recursive Branching Formula (Giải trảo 蟹爪 & Lộc giác 鹿角)
 * Builds angular, expressive limbs obeying Da Vinci's area rule
 */
export function drawAngularBranch(
    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    length: number,
    angle: number,
    width: number,
    depth: number,
    scale: number,
    rng: () => number,
    style: 'crab_claw' | 'staghorn' | 'cascading' | 'thorn',
    color: string = '#1a1816'
): { x: number; y: number }[] {
    const endpoints: { x: number; y: number }[] = [];
    if (depth <= 0) {
        endpoints.push({ x: startX, y: startY });
        return endpoints;
    }

    // Angular elbow deflection
    const elbowRatio = 0.5 + (rng() - 0.5) * 0.2;
    const midX = startX + Math.cos(angle) * (length * elbowRatio);
    const midY = startY + Math.sin(angle) * (length * elbowRatio);

    // Direction fracture
    let deflect = (rng() - 0.5) * 0.45;
    if (style === 'crab_claw') {
        // Downward curving claw hooks
        deflect += 0.25;
    } else if (style === 'staghorn') {
        // Upward thrusting antlers
        deflect -= 0.25;
    } else if (style === 'cascading') {
        // Weeping drape
        deflect += 0.45;
    }

    const endX = midX + Math.cos(angle + deflect) * (length * (1 - elbowRatio));
    const endY = midY + Math.sin(angle + deflect) * (length * (1 - elbowRatio));

    // Render branch segment with ink stroke
    drawInkStroke(ctx, startX, startY, midX, midY, width, color);
    drawInkStroke(ctx, midX, midY, endX, endY, width * 0.8, color);

    if (depth <= 1) {
        endpoints.push({ x: endX, y: endY });
        return endpoints;
    }

    // Fork branches (Da Vinci rule: childWidth ≈ parentWidth * 0.7)
    const childWidth = Math.max(1.2 * scale, width * 0.72);
    const forkAngle1 = angle + (style === 'thorn' ? 0.85 : 0.45 + (rng() - 0.5) * 0.3);
    const forkAngle2 = angle - (style === 'thorn' ? 0.85 : 0.45 + (rng() - 0.5) * 0.3);
    const childLen1 = length * (0.68 + rng() * 0.15);
    const childLen2 = length * (0.60 + rng() * 0.15);

    const pts1 = drawAngularBranch(ctx, endX, endY, childLen1, forkAngle1, childWidth, depth - 1, scale, rng, style, color);
    const pts2 = drawAngularBranch(ctx, endX, endY, childLen2, forkAngle2, childWidth, depth - 1, scale, rng, style, color);

    return endpoints.concat(pts1, pts2);
}
