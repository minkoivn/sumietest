// Ink brush and calligraphy rendering primitives for Sumi-e aesthetic

export function drawInkStroke(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, width: number, color: string) {
    const dist = Math.hypot(x2 - x1, y2 - y1);
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const steps = Math.ceil(dist / 3); 
    const startW = width * 1.15; 
    const endW = width * 0.85;
    const leftPoints = [], rightPoints = [];

    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const cx = x1 + (x2 - x1) * t;
        const cy = y1 + (y2 - y1) * t;
        let currentW = startW * (1 - t) + endW * t;
        const roughness = currentW * 0.2; 
        const noise = (Math.random() - 0.5) * roughness;
        const nx = Math.cos(angle + Math.PI/2);
        const ny = Math.sin(angle + Math.PI/2);
        
        leftPoints.push({x: cx + nx * (currentW/2 + noise), y: cy + ny * (currentW/2 + noise)});
        rightPoints.push({x: cx - nx * (currentW/2 - noise), y: cy - ny * (currentW/2 - noise)});
    }

    ctx.fillStyle = color;
    ctx.beginPath();
    if (leftPoints.length > 0) {
      ctx.moveTo(leftPoints[0].x, leftPoints[0].y);
      for (let p of leftPoints) ctx.lineTo(p.x, p.y);
      if (rightPoints.length > 0) {
          ctx.lineTo(rightPoints[rightPoints.length-1].x, rightPoints[rightPoints.length-1].y);
          for (let i = rightPoints.length - 1; i >= 0; i--) ctx.lineTo(rightPoints[i].x, rightPoints[i].y);
      }
      ctx.closePath();
      ctx.fill();
    }
}

/**
 * Feibai (飞白 - Phi Bạch) / Dry Brush Stroke
 * Simulates dry bristles skimming the rice paper with striations and gaps
 */
export function drawDryStroke(
    ctx: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    width: number,
    color: string = '#1a1a1a',
    bristleCount: number = 6
) {
    const dist = Math.hypot(x2 - x1, y2 - y1);
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const nx = Math.cos(angle + Math.PI / 2);
    const ny = Math.sin(angle + Math.PI / 2);

    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineCap = 'round';

    for (let b = 0; b < bristleCount; b++) {
        // Offset each bristle across the brush width
        const bristleOffset = ((b / (bristleCount - 1)) - 0.5) * width;
        const bristleThickness = Math.max(0.6, (width / bristleCount) * (0.6 + Math.random() * 0.4));
        ctx.lineWidth = bristleThickness;

        // Break stroke into segments with skips for dry effect
        const segments = 4;
        let segStart = 0;
        while (segStart < 1) {
            const segLength = 0.2 + Math.random() * 0.35;
            const segEnd = Math.min(1, segStart + segLength);

            const bx1 = x1 + (x2 - x1) * segStart + nx * (bristleOffset + (Math.random() - 0.5) * 1.5);
            const by1 = y1 + (y2 - y1) * segStart + ny * (bristleOffset + (Math.random() - 0.5) * 1.5);
            const bx2 = x1 + (x2 - x1) * segEnd + nx * (bristleOffset + (Math.random() - 0.5) * 1.5);
            const by2 = y1 + (y2 - y1) * segEnd + ny * (bristleOffset + (Math.random() - 0.5) * 1.5);

            ctx.globalAlpha = 0.35 + Math.random() * 0.45;
            ctx.beginPath();
            ctx.moveTo(bx1, by1);
            ctx.lineTo(bx2, by2);
            ctx.stroke();

            // Random skip (dry gap)
            segStart = segEnd + (Math.random() < 0.3 ? 0.05 + Math.random() * 0.1 : 0);
        }
    }
    ctx.restore();
}

/**
 * Organic Ink Bleed / Water Staining (Mực Loang)
 * Creates a soft radial bleed with fractal ink edges mimicking water on xuan paper
 */
export function drawInkBleed(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    alpha: number = 0.4,
    color: string = '#1a1a1a'
) {
    ctx.save();
    ctx.translate(x, y);

    // Multiple concentric translucent rings with jitter for wet absorption look
    const layers = 3;
    for (let l = 0; l < layers; l++) {
        const r = radius * (0.5 + (l / layers) * 0.5);
        const grad = ctx.createRadialGradient(0, 0, r * 0.2, 0, 0, r);
        grad.addColorStop(0, `rgba(20, 20, 20, ${alpha * 0.8})`);
        grad.addColorStop(0.6, `rgba(30, 30, 30, ${alpha * 0.4})`);
        grad.addColorStop(1, 'rgba(40, 40, 40, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        // Deformed circle with subtle ink blobbiness
        const points = 10;
        for (let i = 0; i <= points; i++) {
            const th = (i / points) * Math.PI * 2;
            const radJitter = r * (0.85 + Math.sin(th * 3 + l) * 0.15);
            const px = Math.cos(th) * radJitter;
            const py = Math.sin(th) * radJitter * 0.6; // Slightly flattened on ground
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
    }

    ctx.restore();
}

/**
 * Cinnabar Red Seal Stamp (Dấu Triện Son Đỏ)
 * Traditional Asian artist seal with weathered edges and archaic glyphs
 */
export function drawCinnabarSeal(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    primaryText: string = '行',
    secondaryText: string = '乞'
) {
    ctx.save();
    ctx.translate(x, y);

    const pad = 2;
    const sealSize = size - pad * 2;

    // Rich cinnabar vermilion gradient with slight texture
    const vermilionGrd = ctx.createLinearGradient(-sealSize/2, -sealSize/2, sealSize/2, sealSize/2);
    vermilionGrd.addColorStop(0, '#a82c2a');
    vermilionGrd.addColorStop(0.5, '#ba3330');
    vermilionGrd.addColorStop(1, '#942220');

    ctx.fillStyle = vermilionGrd;
    ctx.strokeStyle = '#6e1514';
    ctx.lineWidth = 1.8;

    // Weathered stamp border (rounded slightly with edge jitter)
    ctx.beginPath();
    const half = sealSize / 2;
    ctx.rect(-half, -half, sealSize, sealSize);
    ctx.fill();
    ctx.stroke();

    // Inner carved frame
    ctx.strokeStyle = '#e8e4d9'; // Paper color carve
    ctx.lineWidth = 1.2;
    ctx.strokeRect(-half + 3, -half + 3, sealSize - 6, sealSize - 6);

    // Calligraphic Seal Carvings (Archaic Zhuan/Chữ Hán/Nôm style representation)
    ctx.fillStyle = '#e8e4d9';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `bold ${Math.floor(size * 0.38)}px serif`;

    // 2-column or 2-line layout
    ctx.fillText(primaryText, -half * 0.38, 0);
    ctx.fillText(secondaryText, half * 0.38, 0);

    // Micro distress specks on seal
    ctx.fillStyle = '#e8e4d9';
    for (let i = 0; i < 4; i++) {
        const sx = ((i % 2 === 0 ? 1 : -1) * (half * 0.6)) + (Math.sin(i) * 3);
        const sy = (Math.cos(i) * half * 0.5);
        ctx.fillRect(sx, sy, 1.2, 1.2);
    }

    ctx.restore();
}