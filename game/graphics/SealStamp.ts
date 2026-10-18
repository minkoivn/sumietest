// SealStamp.ts - Manages the traditional cinnabar red seal and milestone stamps

import { drawCinnabarSeal } from './InkBrush';

export interface MilestoneStamp {
    textTop: string;
    textBottom: string;
    distance: number;
    title: string;
    achieved: boolean;
    displayTimer: number; // For banner notification animation
}

export class SealManager {
    milestones: MilestoneStamp[] = [
        { textTop: '初', textBottom: '步', distance: 100, title: 'Sơ Bước Phong Trần (100 Trượng)', achieved: false, displayTimer: 0 },
        { textTop: '行', textBottom: '乞', distance: 300, title: 'Hành Khất Nhập Đạo (300 Trượng)', achieved: false, displayTimer: 0 },
        { textTop: '渡', textBottom: 'Giang', distance: 600, title: 'Bình Giang Lữ Khách (600 Trượng)', achieved: false, displayTimer: 0 },
        { textTop: '無', textBottom: '為', distance: 1000, title: 'Vô Vi Đắc Ngộ (1000 Trượng)', achieved: false, displayTimer: 0 },
        { textTop: '大', textBottom: '道', distance: 2000, title: 'Đại Đạo Độc Hành (2000 Trượng)', achieved: false, displayTimer: 0 }
    ];

    lastStampNotification: MilestoneStamp | null = null;

    update(currentDistance: number) {
        for (const m of this.milestones) {
            if (!m.achieved && currentDistance >= m.distance) {
                m.achieved = true;
                m.displayTimer = 220; // ~3.5 seconds
                this.lastStampNotification = m;
            }
        }

        if (this.lastStampNotification) {
            this.lastStampNotification.displayTimer--;
            if (this.lastStampNotification.displayTimer <= 0) {
                this.lastStampNotification = null;
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D, width: number, height: number) {
        // --- 1. Permanent Traditional Artist Seal in Corner ---
        // Top-left master seal "Vô Vi"
        drawCinnabarSeal(ctx, 42, 42, 38, '無', '為');

        // --- 2. Milestone Stamp Banner (When achieved) ---
        if (this.lastStampNotification) {
            const m = this.lastStampNotification;
            const progress = Math.min(1, (220 - m.displayTimer) / 20); // Fade in
            const fadeOut = m.displayTimer < 30 ? m.displayTimer / 30 : 1;
            const alpha = progress * fadeOut;

            ctx.save();
            ctx.globalAlpha = alpha;
            const bannerX = width / 2;
            const bannerY = 85;

            // Soft rice paper banner backing with calligraphic border
            ctx.fillStyle = 'rgba(238, 234, 222, 0.92)';
            ctx.strokeStyle = '#222222';
            ctx.lineWidth = 1.5;
            
            const bWidth = 320;
            const bHeight = 54;
            ctx.beginPath();
            ctx.rect(bannerX - bWidth / 2, bannerY - bHeight / 2, bWidth, bHeight);
            ctx.fill();
            ctx.stroke();

            // Inner hairline border
            ctx.strokeStyle = '#8c867a';
            ctx.lineWidth = 0.8;
            ctx.strokeRect(bannerX - bWidth / 2 + 3, bannerY - bHeight / 2 + 3, bWidth - 6, bHeight - 6);

            // Stamp on left of banner
            drawCinnabarSeal(ctx, bannerX - bWidth / 2 + 32, bannerY, 34, m.textTop, m.textBottom);

            // Text
            ctx.fillStyle = '#1c1c1c';
            ctx.font = "bold 18px 'Dancing Script', serif";
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(m.title, bannerX - bWidth / 2 + 58, bannerY);

            ctx.restore();
        }
    }
}
