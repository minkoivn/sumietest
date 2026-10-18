// StructureManager.ts - Spawns and manages procedural ancient structures along the traveler's journey
// Eliminates repetitive monotonic rows and floating objects via local terrain elevation sampling

import { MountainLayer } from './Mountain';
import {
    drawThatchedTeahouse,
    drawVillageGate,
    drawArchedBridge,
    drawMountainTemple,
    drawSmolderingCampfire,
    drawStoneStele,
    drawWaysideShrine,
    drawStoneBenchAndJar
} from '../graphics/AncientStructures';

export type StructureType =
    | 'teahouse'
    | 'villageGate'
    | 'bridge'
    | 'mountainTemple'
    | 'waysideShrine'
    | 'stoneStele'
    | 'benchAndJar';

export interface StructureInstance {
    id: string;
    type: StructureType;
    worldX: number;
    layerIndex: number; // 5 for foreground path, 1 or 2 for background mountains
    scale: number;
    depthYOffset?: number; // Spatial depth staggering to avoid 1-row monotony
    hasCampfire?: boolean;
    extraText?: string;
}

export class StructureManager {
    structures: StructureInstance[] = [];
    private generatedUpToChunk: number = -1;
    private readonly CHUNK_SIZE = 3000;

    constructor() {
        // Pre-generate initial chunks up to 30,000 units
        for (let c = 0; c <= 10; c++) {
            this.generateChunk(c);
        }
    }

    private generateChunk(chunkIndex: number) {
        if (chunkIndex <= this.generatedUpToChunk) return;
        this.generatedUpToChunk = chunkIndex;

        const chunkStart = chunkIndex * this.CHUNK_SIZE;
        // Deterministic pseudo-random seed for this chunk
        const seed = Math.abs(Math.sin(chunkIndex * 92.13 + 17.8) * 43758.5453);

        // 1. FOREGROUND PATH STRUCTURES (Varied cultural compositions, non-repeating)
        const sceneType = Math.floor((seed * 10) % 5);

        if (sceneType === 0) {
            // Scene: Wayside Rustic Teahouse Haven
            const tx = chunkStart + 450 + (seed * 500) % 600;
            this.structures.push({
                id: `teahouse_${chunkIndex}`,
                type: 'teahouse',
                worldX: tx,
                layerIndex: 5,
                scale: 0.95 + ((seed * 3) % 1) * 0.15,
                depthYOffset: -4, // Tucked slightly behind path edge
                hasCampfire: true
            });
            // Roadside stone bench and water jar for weary travelers
            this.structures.push({
                id: `bench_${chunkIndex}`,
                type: 'benchAndJar',
                worldX: tx + 160,
                layerIndex: 5,
                scale: 0.9,
                depthYOffset: 4 // Closer to foreground
            });
        } else if (sceneType === 1) {
            // Scene: Ancient Village Entrance
            const gx = chunkStart + 600 + (seed * 600) % 700;
            this.structures.push({
                id: `gate_${chunkIndex}`,
                type: 'villageGate',
                worldX: gx,
                layerIndex: 5,
                scale: 1.05 + ((seed * 5) % 1) * 0.15,
                depthYOffset: 0
            });
            // Flanking milestone stone stele
            this.structures.push({
                id: `stele_${chunkIndex}`,
                type: 'stoneStele',
                worldX: gx - 140,
                layerIndex: 5,
                scale: 0.95,
                depthYOffset: 6,
                extraText: chunkIndex % 2 === 0 ? 'TIÊU DAO' : 'BÌNH AN'
            });
        } else if (sceneType === 2) {
            // Scene: Arched Stream Crossing Bridge
            const bx = chunkStart + 800 + (seed * 700) % 800;
            this.structures.push({
                id: `bridge_${chunkIndex}`,
                type: 'bridge',
                worldX: bx,
                layerIndex: 5,
                scale: 1.0,
                depthYOffset: 0
            });
            // Milestone marker at bridge head
            this.structures.push({
                id: `stele_bridge_${chunkIndex}`,
                type: 'stoneStele',
                worldX: bx - 160,
                layerIndex: 5,
                scale: 0.85,
                depthYOffset: -6,
                extraText: 'THẠCH KIỀU'
            });
        } else if (sceneType === 3) {
            // Scene: Wayside Mountain Shrine & Rest
            const sx = chunkStart + 500 + (seed * 800) % 900;
            this.structures.push({
                id: `shrine_${chunkIndex}`,
                type: 'waysideShrine',
                worldX: sx,
                layerIndex: 5,
                scale: 1.0,
                depthYOffset: -8 // Nestled into mountainside
            });
            this.structures.push({
                id: `stele_shrine_${chunkIndex}`,
                type: 'stoneStele',
                worldX: sx + 90,
                layerIndex: 5,
                scale: 0.8,
                depthYOffset: 2,
                extraText: 'SƠN THẦN'
            });
        } else {
            // Scene: Open Serene Road with Lone Milestone Stele
            const stx = chunkStart + 900 + (seed * 900) % 900;
            this.structures.push({
                id: `stele_solitary_${chunkIndex}`,
                type: 'stoneStele',
                worldX: stx,
                layerIndex: 5,
                scale: 1.0,
                depthYOffset: 4,
                extraText: 'VÔ VI'
            });
        }

        // 2. BACKGROUND MOUNTAIN TEMPLES (Nested on mountain ridges Layer 1 & 2)
        if ((seed * 7) % 1 > 0.35) {
            const mx = chunkStart + 1000 + ((seed * 1300) % 1500);
            this.structures.push({
                id: `mTemple_${chunkIndex}`,
                type: 'mountainTemple',
                worldX: mx,
                layerIndex: chunkIndex % 2 === 0 ? 1 : 2,
                scale: 0.6 + ((seed * 9) % 1) * 0.2
            });
        }
    }

    /**
     * Check current player position and dynamically generate upcoming world chunks
     */
    ensureChunksAhead(playerWorldX: number) {
        const currentChunk = Math.floor(playerWorldX / this.CHUNK_SIZE);
        const targetChunk = currentChunk + 4;
        while (this.generatedUpToChunk < targetChunk) {
            this.generateChunk(this.generatedUpToChunk + 1);
        }
    }

    /**
     * Calculates bridge elevation at worldX so characters walk smoothly up and down the arch
     */
    getBridgeElevation(worldX: number): number {
        const span = 260;
        const archHeight = 36;
        for (const s of this.structures) {
            if (s.type === 'bridge') {
                const dx = worldX - s.worldX;
                if (Math.abs(dx) < span / 2) {
                    const t = dx / (span / 2);
                    return archHeight * (1 - t * t);
                }
            }
        }
        return 0;
    }

    /**
     * Draw background structures (e.g. pagodas and monasteries perched on distant ridges)
     */
    drawBackgroundStructures(
        ctx: CanvasRenderingContext2D,
        width: number,
        height: number,
        scrollOffset: number,
        layerIndex: number,
        mountainLayer: MountainLayer
    ) {
        const bgStructures = this.structures.filter(s => s.layerIndex === layerIndex);
        const speed = mountainLayer.cfg.speed;
        const effScroll = scrollOffset * speed;

        for (const s of bgStructures) {
            const screenX = s.worldX - effScroll;
            if (screenX > -180 && screenX < width + 180) {
                const groundY = mountainLayer.getHeightAt(s.worldX, height);
                if (s.type === 'mountainTemple') {
                    drawMountainTemple(ctx, screenX, groundY + 12, s.scale, mountainLayer.cfg.opacity * 0.85);
                }
            }
        }
    }

    /**
     * Draw foreground roadside structures (Layer 5) with accurate local ground height sampling
     * Absolutely prevents any objects from floating in mid-air
     */
    drawForegroundStructures(
        ctx: CanvasRenderingContext2D,
        width: number,
        height: number,
        scrollOffset: number,
        pathLayer: MountainLayer,
        time: number
    ) {
        // Ensure procedural structures are always ready ahead
        this.ensureChunksAhead(scrollOffset + width);

        const fgStructures = this.structures.filter(s => s.layerIndex === 5);

        for (const s of fgStructures) {
            const screenX = s.worldX - scrollOffset;

            // Viewport culling buffer
            if (screenX > -300 && screenX < width + 300) {
                const depthOffset = s.depthYOffset || 0;
                // Sample local ground elevation at structure's exact world position
                const groundY = pathLayer.getHeightAt(s.worldX, height) + depthOffset;

                switch (s.type) {
                    case 'teahouse': {
                        drawThatchedTeahouse(ctx, screenX, groundY - 6, s.scale, time);
                        if (s.hasCampfire) {
                            // CRITICAL FIX: Sample ground at campfire's exact position to prevent floating
                            const campfireWorldX = s.worldX - 110 * s.scale;
                            const campfireGroundY = pathLayer.getHeightAt(campfireWorldX, height) + depthOffset;
                            const campfireScreenX = screenX - 110 * s.scale;
                            drawSmolderingCampfire(ctx, campfireScreenX, campfireGroundY - 2, time);
                        }
                        break;
                    }

                    case 'villageGate': {
                        drawVillageGate(ctx, screenX, groundY - 5, s.scale);
                        break;
                    }

                    case 'bridge': {
                        drawArchedBridge(ctx, screenX, groundY + 5, 260, 36);
                        break;
                    }

                    case 'waysideShrine': {
                        drawWaysideShrine(ctx, screenX, groundY - 4, s.scale, time);
                        break;
                    }

                    case 'stoneStele': {
                        drawStoneStele(ctx, screenX, groundY - 3, s.scale, s.extraText || 'TIÊU DAO');
                        break;
                    }

                    case 'benchAndJar': {
                        drawStoneBenchAndJar(ctx, screenX, groundY - 3, s.scale);
                        break;
                    }
                }
            }
        }
    }
}
