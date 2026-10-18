// Ancient Asian architectural structures rendered with Sumi-e ink brush aesthetics

import { drawDryStroke, drawInkStroke } from './InkBrush';

/**
 * Roadside Thatched Teahouse (Quán Trà Tranh Ven Đường)
 * A rustic haven with straw roof, bamboo pillars, tea banner, and gentle steam
 */
export function drawThatchedTeahouse(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    scale: number = 1.0,
    time: number = 0
) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    const INK = {
        deep: '#141414',
        dark: '#262626',
        medium: '#4a4a4a',
        light: '#787878',
        wash: 'rgba(50, 50, 50, 0.25)',
        smoke: 'rgba(60, 60, 60, 0.18)'
    };

    // --- Ground dirt mound / terrace ---
    ctx.fillStyle = INK.wash;
    ctx.beginPath();
    ctx.ellipse(0, 0, 90, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // --- Bamboo/Wood Pillars ---
    const pillarH = 75;
    const pX = [-65, -25, 25, 65];
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = INK.dark;
    ctx.lineCap = 'round';

    pX.forEach(px => {
        ctx.beginPath();
        ctx.moveTo(px, 0);
        ctx.lineTo(px, -pillarH + (Math.abs(px) > 40 ? 5 : 0));
        ctx.stroke();

        // Bamboo joints
        ctx.fillStyle = INK.deep;
        for (let j = 1; j <= 3; j++) {
            ctx.fillRect(px - 3, -j * 20, 6, 2);
        }
    });

    // --- Crossbeams ---
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-75, -pillarH + 5);
    ctx.lineTo(75, -pillarH + 5);
    ctx.stroke();

    // --- Thatched Roof (Mái Tranh Nhiều Lớp) ---
    // Lower eave thatch
    ctx.fillStyle = INK.deep;
    ctx.beginPath();
    ctx.moveTo(-95, -pillarH + 12);
    ctx.quadraticCurveTo(0, -pillarH - 5, 95, -pillarH + 12);
    ctx.lineTo(70, -pillarH - 25);
    ctx.quadraticCurveTo(0, -pillarH - 35, -70, -pillarH - 25);
    ctx.closePath();
    ctx.fill();

    // Thatch fringe (straw bristles along roof edge)
    ctx.strokeStyle = INK.dark;
    ctx.lineWidth = 1.6;
    for (let s = -92; s <= 92; s += 4) {
        ctx.beginPath();
        ctx.moveTo(s, -pillarH + 10 + Math.sin(s * 0.1) * 2);
        ctx.lineTo(s + (Math.sin(s) * 3), -pillarH + 18 + Math.random() * 5);
        ctx.stroke();
    }

    // Upper peak of roof
    ctx.fillStyle = INK.dark;
    ctx.beginPath();
    ctx.moveTo(-75, -pillarH - 20);
    ctx.quadraticCurveTo(0, -pillarH - 55, 75, -pillarH - 20);
    ctx.lineTo(60, -pillarH - 38);
    ctx.quadraticCurveTo(0, -pillarH - 62, -60, -pillarH - 38);
    ctx.closePath();
    ctx.fill();

    // Ridge ornament (Đỉnh mái uốn cong)
    ctx.strokeStyle = INK.deep;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-80, -pillarH - 24);
    ctx.quadraticCurveTo(-70, -pillarH - 42, -50, -pillarH - 40);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(80, -pillarH - 24);
    ctx.quadraticCurveTo(70, -pillarH - 42, 50, -pillarH - 40);
    ctx.stroke();

    // --- Interior Teahouse Furniture ---
    // Low bamboo bench
    ctx.fillStyle = INK.dark;
    ctx.fillRect(-50, -18, 38, 4);
    ctx.fillRect(-48, -14, 3, 14);
    ctx.fillRect(-15, -14, 3, 14);

    // Small tea table
    ctx.fillRect(-5, -22, 45, 5);
    ctx.fillRect(0, -17, 3, 17);
    ctx.fillRect(35, -17, 3, 17);

    // Earthen teapot & tiny teacup
    ctx.fillStyle = INK.deep;
    ctx.beginPath();
    ctx.arc(15, -26, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(25, -24, 3, 2); // cup

    // Rising Tea Steam (Làn khói trà lượn lờ)
    ctx.save();
    ctx.strokeStyle = INK.smoke;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    const steamOffset = (time * 0.05) % 30;
    ctx.moveTo(15, -28);
    ctx.quadraticCurveTo(
        15 + Math.sin(time * 0.03) * 6,
        -35 - steamOffset * 0.5,
        15 + Math.cos(time * 0.02) * 8,
        -48 - steamOffset
    );
    ctx.stroke();
    ctx.restore();

    // --- Fluttering Tea Banner (Cờ hiệu quán trà chữ 'Trà' 茶) ---
    const bannerSway = Math.sin(time * 0.04) * 8;
    ctx.strokeStyle = INK.deep;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(70, -pillarH + 5);
    ctx.lineTo(88, -pillarH - 10);
    ctx.stroke();

    // Fabric banner
    ctx.fillStyle = '#f0ede4';
    ctx.strokeStyle = INK.deep;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(88, -pillarH - 10);
    ctx.quadraticCurveTo(100 + bannerSway, -pillarH - 5, 108 + bannerSway, -pillarH + 30);
    ctx.lineTo(86 + bannerSway * 0.6, -pillarH + 34);
    ctx.quadraticCurveTo(86, -pillarH + 10, 88, -pillarH - 10);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Character '茶' (Trà) on the banner
    ctx.save();
    ctx.fillStyle = INK.deep;
    ctx.font = 'bold 16px serif';
    ctx.textAlign = 'center';
    ctx.translate(96 + bannerSway * 0.8, -pillarH + 14);
    ctx.fillText('茶', 0, 0);
    ctx.restore();

    // Hanging Paper Lantern (Đèn lồng tre bên hiên)
    ctx.strokeStyle = INK.medium;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-55, -pillarH + 5);
    ctx.lineTo(-55, -pillarH + 20);
    ctx.stroke();

    // Lantern body
    ctx.fillStyle = 'rgba(240, 225, 195, 0.9)';
    ctx.strokeStyle = INK.deep;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.ellipse(-55, -pillarH + 28, 7, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Lantern ribs
    ctx.beginPath();
    ctx.moveTo(-55, -pillarH + 18);
    ctx.lineTo(-55, -pillarH + 38);
    ctx.stroke();

    ctx.restore();
}

/**
 * Ancient Village Gate / Archway (Cổng Tam Quan / Cổng Làng Cổ)
 * Imposing stone & timber arch with dual-tier swept-up roof eaves and plaque
 */
export function drawVillageGate(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    scale: number = 1.15
) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    const INK = {
        deep: '#101010',
        dark: '#222222',
        stone: '#3d3d3d',
        wash: '#666666',
        ground: 'rgba(30, 30, 30, 0.3)'
    };

    // Ground stone plinth
    ctx.fillStyle = INK.ground;
    ctx.fillRect(-110, -4, 220, 8);

    // Stone Pillar Bases (Chân tảng đá hoa sen)
    [-80, -32, 32, 80].forEach(px => {
        ctx.fillStyle = INK.stone;
        ctx.beginPath();
        ctx.moveTo(px - 14, 0);
        ctx.lineTo(px + 14, 0);
        ctx.lineTo(px + 10, -12);
        ctx.lineTo(px - 10, -12);
        ctx.closePath();
        ctx.fill();
    });

    // Four Grand Wooden Columns (Tứ trụ bằng gỗ lim)
    const hOuter = 110;
    const hInner = 140;

    // Outer Pillars
    ctx.strokeStyle = INK.deep;
    ctx.lineWidth = 7;
    ctx.lineCap = 'square';
    ctx.beginPath();
    ctx.moveTo(-80, -12); ctx.lineTo(-80, -hOuter);
    ctx.moveTo(80, -12); ctx.lineTo(80, -hOuter);
    ctx.stroke();

    // Inner Pillars (taller)
    ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.moveTo(-32, -12); ctx.lineTo(-32, -hInner);
    ctx.moveTo(32, -12); ctx.lineTo(32, -hInner);
    ctx.stroke();

    // Calligraphy Couplets (Liễn đối) on inner pillars
    ctx.fillStyle = '#f5efe0';
    ctx.fillRect(-35, -hInner + 35, 6, 65);
    ctx.fillRect(29, -hInner + 35, 6, 65);
    ctx.fillStyle = INK.deep;
    ctx.font = '7px serif';
    ctx.textAlign = 'center';
    ['V', 'Ạ', 'N', 'C', 'Ổ', 'B', 'Ì', 'N', 'H'].forEach((ch, idx) => {
        ctx.fillText(ch, -32, -hInner + 43 + idx * 6.5);
    });
    ['A', 'N', 'G', 'I', 'A', 'N', 'H', 'Ư', 'Ợ', 'C'].forEach((ch, idx) => {
        ctx.fillText(ch, 32, -hInner + 43 + idx * 6.5);
    });

    // Lower Eaves (Mái phụ hai bên cổng)
    const drawEave = (cx: number, cy: number, w: number, curve: number) => {
        ctx.fillStyle = INK.deep;
        ctx.beginPath();
        ctx.moveTo(cx - w, cy);
        ctx.quadraticCurveTo(cx - w * 0.8, cy - curve * 1.5, cx, cy - curve);
        ctx.quadraticCurveTo(cx + w * 0.8, cy - curve * 1.5, cx + w, cy);
        ctx.lineTo(cx + w * 0.85, cy - curve * 0.6);
        ctx.quadraticCurveTo(cx, cy - curve * 1.3, cx - w * 0.85, cy - curve * 0.6);
        ctx.closePath();
        ctx.fill();

        // Swept upturned roof horn (Đầu đao mái vút cong)
        ctx.strokeStyle = INK.deep;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cx - w, cy);
        ctx.quadraticCurveTo(cx - w - 8, cy - 8, cx - w - 6, cy - 18);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx + w, cy);
        ctx.quadraticCurveTo(cx + w + 8, cy - 8, cx + w + 6, cy - 18);
        ctx.stroke();
    };

    // Sub-roofs
    drawEave(-56, -hOuter, 38, 12);
    drawEave(56, -hOuter, 38, 12);

    // Central Plaque (Hoành phi)
    ctx.fillStyle = '#e8dec8';
    ctx.fillRect(-26, -hInner + 8, 52, 20);
    ctx.strokeStyle = INK.deep;
    ctx.lineWidth = 2;
    ctx.strokeRect(-26, -hInner + 8, 52, 20);

    ctx.fillStyle = INK.deep;
    ctx.font = 'bold 12px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('安 樂 村', 0, -hInner + 18); // An Lac Thon

    // Main Tower Upper Roof (Mái chính trung tâm vút cao)
    drawEave(0, -hInner - 4, 60, 20);

    // Roof ridge ornament (Lưỡng long chầu nguyệt / Hồ lô đỉnh mái)
    ctx.fillStyle = INK.deep;
    ctx.beginPath();
    ctx.arc(0, -hInner - 27, 4.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}

/**
 * Traditional Timber/Stone Arched Bridge (Cầu Gỗ/Đá Uốn Cong)
 * Spans smoothly across the water with rustic piers and balustrades
 */
export function drawArchedBridge(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    span: number = 240,
    archHeight: number = 42
) {
    ctx.save();
    ctx.translate(x, y);

    const INK = {
        deep: '#121212',
        dark: '#282828',
        stone: '#444444',
        shadow: 'rgba(20, 20, 20, 0.45)',
        waterReflect: 'rgba(40, 40, 40, 0.2)'
    };

    const half = span / 2;

    // --- Under-bridge Arch Cavity (Vòm cầu bên dưới) ---
    ctx.fillStyle = INK.deep;
    ctx.beginPath();
    ctx.moveTo(-half + 25, 0);
    ctx.quadraticCurveTo(0, -archHeight + 14, half - 25, 0);
    ctx.lineTo(half, 0);
    ctx.lineTo(-half, 0);
    ctx.closePath();
    ctx.fill();

    // --- Bridge Deck (Mặt sàn cầu uốn lượn) ---
    ctx.fillStyle = INK.stone;
    ctx.beginPath();
    ctx.moveTo(-half, 0);
    ctx.quadraticCurveTo(0, -archHeight, half, 0);
    ctx.lineTo(half, 8);
    ctx.quadraticCurveTo(0, -archHeight + 8, -half, 8);
    ctx.closePath();
    ctx.fill();

    // Wood planks texture across deck
    ctx.strokeStyle = INK.deep;
    ctx.lineWidth = 1.2;
    for (let p = -half + 10; p <= half - 10; p += 12) {
        const t = p / half;
        const archY = -archHeight * (1 - t * t);
        ctx.beginPath();
        ctx.moveTo(p, archY);
        ctx.lineTo(p, archY + 8);
        ctx.stroke();
    }

    // --- Balustrade / Railings (Lan can tay vịn) ---
    const postHeight = 16;
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = INK.dark;

    // Railing upper handrail
    ctx.beginPath();
    ctx.moveTo(-half, -postHeight);
    ctx.quadraticCurveTo(0, -archHeight - postHeight, half, -postHeight);
    ctx.stroke();

    // Railing posts
    const postSpacing = 22;
    for (let p = -half + 10; p <= half - 10; p += postSpacing) {
        const t = p / half;
        const archY = -archHeight * (1 - t * t);
        ctx.beginPath();
        ctx.moveTo(p, archY);
        ctx.lineTo(p, archY - postHeight);
        ctx.stroke();

        // Finial knob on post top
        ctx.fillStyle = INK.deep;
        ctx.beginPath();
        ctx.arc(p, archY - postHeight - 2, 2.5, 0, Math.PI * 2);
        ctx.fill();
    }

    // --- Water Reflection (Bóng đổ mờ ảo dưới mặt nước) ---
    ctx.fillStyle = INK.waterReflect;
    ctx.beginPath();
    ctx.moveTo(-half + 20, 0);
    ctx.quadraticCurveTo(0, archHeight * 0.6, half - 20, 0);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
}

/**
 * Distant Mountain Monastery / Pagoda (Cổ Tự Ẩn Hiện Trên Núi)
 * 5-tier Chinese/Vietnamese pagoda nestled on mountain crags
 */
export function drawMountainTemple(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    scale: number = 0.8,
    opacity: number = 0.7
) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.globalAlpha = opacity;

    const INK = {
        deep: '#202020',
        wash: '#454545'
    };

    // 5 Tiers Pagoda
    const tiers = 5;
    let baseW = 34;
    let currY = 0;

    for (let i = 0; i < tiers; i++) {
        const w = baseW * (1 - i * 0.16);
        const h = 18 - i * 1.5;

        // Walls
        ctx.fillStyle = INK.wash;
        ctx.fillRect(-w * 0.6, currY - h, w * 1.2, h);

        // Window slit
        ctx.fillStyle = INK.deep;
        ctx.fillRect(-2, currY - h + 4, 4, 8);

        // Curved Eaves
        ctx.fillStyle = INK.deep;
        ctx.beginPath();
        ctx.moveTo(-w, currY - h);
        ctx.quadraticCurveTo(0, currY - h - 6, w, currY - h);
        ctx.lineTo(w * 0.8, currY - h - 3);
        ctx.quadraticCurveTo(0, currY - h - 8, -w * 0.8, currY - h - 3);
        ctx.closePath();
        ctx.fill();

        // Swept roof tip bells
        ctx.strokeStyle = INK.deep;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-w, currY - h);
        ctx.lineTo(-w - 3, currY - h - 4);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(w, currY - h);
        ctx.lineTo(w + 3, currY - h - 4);
        ctx.stroke();

        currY -= h + 3;
    }

    // Pagoda Spire (Bảo đao tháp đỉnh)
    ctx.strokeStyle = INK.deep;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, currY);
    ctx.lineTo(0, currY - 26);
    ctx.stroke();

    for (let r = 1; r <= 4; r++) {
        ctx.beginPath();
        ctx.arc(0, currY - r * 5, 2.5 - r * 0.4, 0, Math.PI * 2);
        ctx.stroke();
    }

    ctx.restore();
}

/**
 * Smoldering Campfire (Đống Lửa Tàn)
 * A small hearth of stones and charred branches with ink smoke wisps
 */
export function drawSmolderingCampfire(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    time: number = 0
) {
    ctx.save();
    ctx.translate(x, y);

    // Ash pile
    ctx.fillStyle = 'rgba(40, 40, 40, 0.4)';
    ctx.beginPath();
    ctx.ellipse(0, 0, 18, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Stones around
    ctx.fillStyle = '#2a2a2a';
    [-14, -8, 2, 9, 14].forEach((sx, idx) => {
        ctx.beginPath();
        ctx.arc(sx, (idx % 2 === 0 ? 1 : -1) * 2, 3 + (idx % 3), 0, Math.PI * 2);
        ctx.fill();
    });

    // Crossed charred logs
    ctx.strokeStyle = '#181818';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-10, 2); ctx.lineTo(10, -6);
    ctx.moveTo(-8, -5); ctx.lineTo(11, 3);
    ctx.stroke();

    // Gentle embers glow
    const emberPulse = 0.4 + Math.sin(time * 0.1) * 0.3;
    ctx.fillStyle = `rgba(180, 50, 40, ${emberPulse})`;
    ctx.beginPath();
    ctx.arc(0, -2, 3, 0, Math.PI * 2);
    ctx.fill();

    // Rising ink smoke particles
    ctx.strokeStyle = 'rgba(70, 70, 70, 0.2)';
    ctx.lineWidth = 1.2;
    for (let i = 0; i < 3; i++) {
        const offset = ((time * 0.4 + i * 20) % 60);
        const sx = Math.sin(time * 0.05 + i) * 6;
        ctx.beginPath();
        ctx.moveTo(sx * 0.3, -4);
        ctx.quadraticCurveTo(sx, -15 - offset * 0.5, sx * 1.5, -4 - offset);
        ctx.stroke();
    }

    ctx.restore();
}

/**
 * Weathered Stone Stele / Milestone Marker (Bia Đá Cổ Chỉ Đường)
 * Stone monument with lotus/turtle base and carved calligraphy
 */
export function drawStoneStele(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    scale: number = 1.0,
    title: string = 'TIÊU DAO'
) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    const INK = {
        deep: '#141414',
        stoneDark: '#2c2c2c',
        stoneMid: '#484848',
        stoneWash: 'rgba(50, 50, 50, 0.35)',
        moss: 'rgba(38, 52, 38, 0.45)'
    };

    // Stone base plinth (Bệ đá hoa sen)
    ctx.fillStyle = INK.stoneDark;
    ctx.beginPath();
    ctx.moveTo(-18, 0);
    ctx.lineTo(18, 0);
    ctx.lineTo(14, -8);
    ctx.lineTo(-14, -8);
    ctx.closePath();
    ctx.fill();

    // Ground moss wash
    ctx.fillStyle = INK.moss;
    ctx.beginPath();
    ctx.ellipse(0, 0, 24, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Stele upright body with rounded arched top
    const steleH = 46;
    const steleW = 20;
    ctx.fillStyle = INK.stoneMid;
    ctx.beginPath();
    ctx.moveTo(-steleW * 0.5, -8);
    ctx.lineTo(-steleW * 0.5, -steleH + 10);
    ctx.quadraticCurveTo(0, -steleH - 4, steleW * 0.5, -steleH + 10);
    ctx.lineTo(steleW * 0.5, -8);
    ctx.closePath();
    ctx.fill();

    // Stele border contour
    ctx.strokeStyle = INK.deep;
    ctx.lineWidth = 1.4;
    ctx.stroke();

    // Inner carved text
    ctx.fillStyle = INK.deep;
    ctx.font = 'bold 7px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Vertical text characters
    const chars = title.split('');
    chars.forEach((ch, idx) => {
        ctx.fillText(ch, 0, -steleH + 14 + idx * 7.5);
    });

    ctx.restore();
}

/**
 * Wayside Mountain Shrine (Miếu Thổ Địa / Am Nhỏ Sơn Thần)
 * A rustic stone shrine with curved mini eaves and smoldering incense wisps
 */
export function drawWaysideShrine(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    scale: number = 1.0,
    time: number = 0
) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    const INK = {
        deep: '#101010',
        stone: '#383838',
        wash: 'rgba(40, 40, 40, 0.3)',
        amberIncense: '#c83a2a'
    };

    // Terrace base
    ctx.fillStyle = INK.wash;
    ctx.fillRect(-24, -2, 48, 5);

    // Stone chamber walls
    const h = 32;
    ctx.fillStyle = INK.stone;
    ctx.fillRect(-16, -h, 32, h);

    // Dark alcove / niche inside
    ctx.fillStyle = INK.deep;
    ctx.fillRect(-9, -h + 8, 18, h - 8);

    // Miniature deity stone silhouette
    ctx.fillStyle = '#606060';
    ctx.beginPath();
    ctx.arc(0, -14, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(-4, -10, 8, 8);

    // Curved stone roof eave
    ctx.fillStyle = INK.deep;
    ctx.beginPath();
    ctx.moveTo(-24, -h);
    ctx.quadraticCurveTo(0, -h - 8, 24, -h);
    ctx.lineTo(18, -h - 6);
    ctx.quadraticCurveTo(0, -h - 13, -18, -h - 6);
    ctx.closePath();
    ctx.fill();

    // Incense burner bowl in front
    ctx.fillStyle = INK.deep;
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI);
    ctx.fill();

    // Incense sticks & smoke
    ctx.strokeStyle = INK.amberIncense;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 0); ctx.lineTo(0, -7);
    ctx.stroke();

    // Incense smoke wisps
    ctx.strokeStyle = 'rgba(70, 70, 70, 0.25)';
    ctx.lineWidth = 1.0;
    const smokeOffset = (time * 0.3) % 40;
    const sx = Math.sin(time * 0.04) * 4;
    ctx.beginPath();
    ctx.moveTo(0, -7);
    ctx.quadraticCurveTo(sx, -15 - smokeOffset * 0.5, sx * 1.5, -7 - smokeOffset);
    ctx.stroke();

    ctx.restore();
}

/**
 * Wayside Stone Bench & Charity Water Jar (Ghế Đá & Chum Nước Ven Đường)
 * A quiet resting sanctuary for tired ascetics and wanderers
 */
export function drawStoneBenchAndJar(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    scale: number = 1.0
) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    const INK = {
        deep: '#141414',
        stone: '#3a3a3a',
        jar: '#423428',
        wash: 'rgba(30, 30, 30, 0.3)'
    };

    // Ground terrace
    ctx.fillStyle = INK.wash;
    ctx.fillRect(-35, -2, 70, 4);

    // Rustic Stone Slab Bench
    ctx.fillStyle = INK.stone;
    ctx.fillRect(-30, -12, 34, 4); // Bench seat
    ctx.fillRect(-28, -8, 5, 8);   // Left leg
    ctx.fillRect(-7, -8, 5, 8);    // Right leg

    // Earthen Water Jar (Chum nước ven đường)
    ctx.fillStyle = INK.jar;
    ctx.beginPath();
    ctx.ellipse(18, -12, 9, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Jar rim & wooden lid
    ctx.fillStyle = INK.deep;
    ctx.fillRect(11, -25, 14, 3);
    // Wooden ladle handle
    ctx.strokeStyle = INK.deep;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(18, -25);
    ctx.lineTo(26, -32);
    ctx.stroke();

    ctx.restore();
}

