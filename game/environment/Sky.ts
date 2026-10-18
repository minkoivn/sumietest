// Sumi-e atmospheric ink mist and clouds layer
import { rand } from '../../core/math';

export interface InkMistBand {
    x: number;
    y: number;
    length: number;
    thickness: number;
    speed: number;
    opacity: number;
    wavePhase: number;
    waveSpeed: number;
}

export class CloudLayer {
    mists: InkMistBand[] = [];

    constructor() {
        this.init();
    }

    init() {
        const w = typeof window !== 'undefined' ? window.innerWidth : 1200;
        // Generate 7-10 graceful horizontal drifting ink mist bands
        for (let i = 0; i < 9; i++) {
            this.mists.push(this.createMist(rand(-100, w + 200)));
        }
    }

    createMist(startX: number): InkMistBand {
        return {
            x: startX,
            y: rand(25, 220),
            length: rand(220, 480),
            thickness: rand(18, 38),
            speed: rand(0.12, 0.32),
            opacity: rand(0.18, 0.38),
            wavePhase: Math.random() * Math.PI * 2,
            waveSpeed: rand(0.008, 0.018)
        };
    }

    draw(ctx: CanvasRenderingContext2D, width: number, scrollSpeed: number) {
        ctx.save();

        this.mists.forEach(m => {
            // Drift with natural wind + scroll parallax
            m.x -= (scrollSpeed * 0.12 + m.speed);
            m.wavePhase += m.waveSpeed;

            // Loop smoothly across the screen width
            if (m.x < -m.length) {
                Object.assign(m, this.createMist(width + rand(50, 150)));
            }

            const waveOffset = Math.sin(m.wavePhase) * 6;
            const cy = m.y + waveOffset;
            const halfL = m.length / 2;
            const halfT = m.thickness / 2;

            // Soft translucent ink wash gradient for horizontal mist band
            const mistGrad = ctx.createLinearGradient(m.x - halfL, cy, m.x + halfL, cy);
            mistGrad.addColorStop(0, 'rgba(235, 230, 218, 0)');
            mistGrad.addColorStop(0.2, `rgba(220, 216, 204, ${m.opacity * 0.7})`);
            mistGrad.addColorStop(0.5, `rgba(205, 200, 188, ${m.opacity})`);
            mistGrad.addColorStop(0.8, `rgba(220, 216, 204, ${m.opacity * 0.7})`);
            mistGrad.addColorStop(1, 'rgba(235, 230, 218, 0)');

            ctx.fillStyle = mistGrad;
            ctx.beginPath();
            // Elegant tapered ribbon stroke typical of Chinese/Japanese landscape mists
            ctx.moveTo(m.x - halfL, cy);
            ctx.quadraticCurveTo(m.x - halfL * 0.4, cy - halfT, m.x, cy - halfT * 0.8);
            ctx.quadraticCurveTo(m.x + halfL * 0.4, cy - halfT * 0.6, m.x + halfL, cy);
            ctx.quadraticCurveTo(m.x + halfL * 0.4, cy + halfT * 0.8, m.x, cy + halfT);
            ctx.quadraticCurveTo(m.x - halfL * 0.4, cy + halfT * 0.7, m.x - halfL, cy);
            ctx.closePath();
            ctx.fill();

            // Inner subtle darker vapor core
            ctx.fillStyle = `rgba(160, 155, 145, ${m.opacity * 0.25})`;
            ctx.beginPath();
            ctx.ellipse(m.x, cy, halfL * 0.45, halfT * 0.35, 0, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.restore();
    }
}

/**
 * Dynamic Celestial Body (Sun & Moon)
 * Changes color, opacity, and shape dynamically depending on weather conditions
 */
export function drawCelestialBody(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    weatherType: string,
    time: number
) {
    const cx = width * 0.82;
    const cy = height * 0.22;

    ctx.save();

    if (weatherType === 'snow') {
        // --- Cold Ink Moon (Hàn Nguyệt Tuyết Cảnh) ---
        const moonRadius = 40;

        // Outer misty silver halo
        const haloGrad = ctx.createRadialGradient(cx, cy, moonRadius * 0.7, cx, cy, moonRadius * 2.5);
        haloGrad.addColorStop(0, 'rgba(245, 245, 240, 0.4)');
        haloGrad.addColorStop(0.5, 'rgba(230, 230, 220, 0.15)');
        haloGrad.addColorStop(1, 'rgba(230, 230, 220, 0)');

        ctx.fillStyle = haloGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, moonRadius * 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Moon disc
        ctx.fillStyle = 'rgba(248, 246, 238, 0.95)';
        ctx.beginPath();
        ctx.arc(cx, cy, moonRadius, 0, Math.PI * 2);
        ctx.fill();

        // Subtle ink wash crater shades
        ctx.fillStyle = 'rgba(180, 175, 160, 0.22)';
        ctx.beginPath();
        ctx.arc(cx - 8, cy - 6, 12, 0, Math.PI * 2);
        ctx.arc(cx + 10, cy + 8, 14, 0, Math.PI * 2);
        ctx.fill();

    } else {
        // --- Traditional Vermilion Red Sun (Đan Dương Thủy Mặc) ---
        let opacity = 0.85;
        let radius = 48;

        if (weatherType === 'storm') {
            opacity = 0.18; // Obscured by thunderous clouds
            radius = 38;
        } else if (weatherType === 'rain') {
            opacity = 0.38; // Dimmed by rainfall
            radius = 42;
        }

        // Diffused atmospheric red glow
        const glowGrad = ctx.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius * 1.8);
        glowGrad.addColorStop(0, `rgba(185, 45, 42, ${opacity * 0.9})`);
        glowGrad.addColorStop(0.6, `rgba(195, 55, 48, ${opacity * 0.4})`);
        glowGrad.addColorStop(1, 'rgba(195, 55, 48, 0)');

        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, radius * 1.8, 0, Math.PI * 2);
        ctx.fill();

        // Solid painterly vermilion disc
        ctx.fillStyle = `rgba(180, 42, 40, ${opacity})`;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.restore();
}