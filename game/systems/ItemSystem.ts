import { rand } from '../../core/math';
import { drawLantern, drawInkDrop } from '../graphics';
import { MountainLayer } from '../environment/Mountain';
import { Character } from '../entities/Character';

export class ItemManager {
    inkDrops: any[] = [];
    lanterns: any[] = [];
    lastDropSpawn: number = 0;
    
    constructor() {
        // Initial setup if needed
    }

    setLanterns(data: any[]) {
        // Replace current list with server data
        // Convert plain objects if necessary or filter duplicates
        this.lanterns = data.map(l => ({
            ...l,
            worldX: l.x, // Map 'x' from server to 'worldX' used in logic
            id: l.id || Math.random().toString(36)
        }));
    }

    addLantern(lantern: any) {
        // Check duplicate
        if (this.lanterns.find(l => l.id === lantern.id)) return;
        this.lanterns.push({
            ...lantern,
            worldX: lantern.x
        });
    }

    spawnLocalLantern(wx: number, message: string) {
        // Optimistic UI update, will be reconciled with server later
        this.lanterns.push({
            worldX: wx,
            message: message,
            isUser: true,
            id: "temp_" + Date.now()
        });
    }

    update(width: number, height: number, scrollOffset: number, groundLayer: MountainLayer, char: Character) {
        // Spawn Ink Drops (Client side logic for now, could be server side later)
        if (Date.now() - this.lastDropSpawn > 4000) {
            if (Math.random() < 0.6) {
                const spawnX = scrollOffset + width + 100;
                // Random height above ground
                const groundY = groundLayer.getHeightAt(spawnX, height);
                const y = groundY - rand(80, 200);
                this.inkDrops.push({ worldX: spawnX, y: y, collected: false });
            }
            this.lastDropSpawn = Date.now();
        }

        // Cleanup and Collisions for Ink Drops
        for (let i = this.inkDrops.length - 1; i >= 0; i--) {
            const drop = this.inkDrops[i];
            if (drop.collected) continue;

            // Simple Circle Collision with Char
            const screenX = drop.worldX - scrollOffset;
            const dx = screenX - char.x;
            const dy = drop.y - (char.y - 40); // char center approx
            if (dx*dx + dy*dy < 2500) { // 50px radius squared
                drop.collected = true;
                char.inkCount = Math.min(char.inkCount + 1, 5); // Max 5 ink
                this.inkDrops.splice(i, 1);
            } else if (screenX < -100) {
                this.inkDrops.splice(i, 1);
            }
        }
        
        // Cleanup lanterns that are far behind to save memory (Server handles source of truth)
        for (let i = this.lanterns.length - 1; i >= 0; i--) {
            if (this.lanterns[i].worldX - scrollOffset < -1000) {
                this.lanterns.splice(i, 1);
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D, width: number, height: number, scrollOffset: number, groundLayer: MountainLayer, time: number) {
        // Draw Lanterns
        this.lanterns.forEach(l => {
            const sx = l.worldX - scrollOffset;
            if (sx > -100 && sx < width + 100) {
                // If Y is not provided by server, clamp to ground
                const gy = l.y ? l.y : groundLayer.getHeightAt(l.worldX, height);
                drawLantern(ctx, sx, gy, time);
            }
        });

        // Draw Ink Drops
        this.inkDrops.forEach(d => {
            const sx = d.worldX - scrollOffset;
            if (sx > -100 && sx < width + 100) {
                drawInkDrop(ctx, sx, d.y, time);
            }
        });
    }

    getNearbyLantern(charWorldX: number, scrollOffset: number): any | null {
        for(let l of this.lanterns) {
            if (Math.abs(l.worldX - charWorldX) < 80) {
                return l;
            }
        }
        return null;
    }
}