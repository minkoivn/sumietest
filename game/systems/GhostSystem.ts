import { lerp } from '../../core/math';
import { MountainLayer } from '../environment/Mountain';
import { Character } from '../entities/Character';

class GhostPlayer {
    id: string;
    x: number;
    y: number;
    vx: number = 0;
    vy: number = 0;
    targetX: number;
    targetY: number;
    state: number; // 0: Idle, 1: Run, 2: Jump, 3: Beg
    lastUpdate: number;
    
    // Animation
    frame: number = 0;
    facingRight: boolean = true;

    constructor(id: string, x: number, y: number) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.targetX = x;
        this.targetY = y;
        this.state = 0;
        this.lastUpdate = Date.now();
    }
}

export class GhostManager {
    ghosts: Map<string, GhostPlayer> = new Map();
    LERP_FACTOR = 0.1;

    updateSnapshots(data: any[]) {
        // data structure: [id, x, y, vx, vy, state]
        const now = Date.now();
        
        data.forEach(p => {
            const [id, x, y, vx, vy, state] = p;

            let ghost = this.ghosts.get(id);
            if (!ghost) {
                ghost = new GhostPlayer(id, x, y);
                this.ghosts.set(id, ghost);
            }

            ghost.targetX = x;
            ghost.targetY = y;
            ghost.vx = vx;
            ghost.vy = vy;
            ghost.state = state;
            ghost.lastUpdate = now;
        });

        // Remove stale ghosts (not in snapshot for > 5 seconds)
        for (const [id, ghost] of this.ghosts) {
            if (now - ghost.lastUpdate > 5000) {
                this.ghosts.delete(id);
            }
        }
    }

    updateAndDraw(ctx: CanvasRenderingContext2D, scrollOffset: number, width: number, height: number, groundLayer: MountainLayer) {
        this.ghosts.forEach(ghost => {
            const prevX = ghost.x;

            // Interpolate X
            ghost.x = lerp(ghost.x, ghost.targetX, this.LERP_FACTOR);
            
            // ALWAYS Calculate Y based on local terrain to ensure they walk/act ON the local ground.
            // Even if jumping (state 2), we stick to local ground Y to prevent floating/sinking due to map differences.
            // The action (jump) is visually represented by 'vy' stretching/effects in drawAvatar.
            const terrainY = groundLayer.getHeightAt(ghost.x, height);
            const groundedY = terrainY - 10; 
            
            ghost.y = lerp(ghost.y, groundedY, 0.2);

            // Update animation frame based on movement
            const dx = ghost.x - prevX;
            if (Math.abs(dx) > 0.1) {
                // Scale animation speed by movement
                ghost.frame += 0.15 * Math.abs(dx * 1.5); 
                ghost.facingRight = dx > 0;
            } else {
                ghost.frame += 0.05; // Idle sway
            }

            const screenX = ghost.x - scrollOffset;

            // Only draw if on screen (with padding)
            if (screenX > -100 && screenX < width + 100) {
                // Reuse Character.drawAvatar
                // Opacity is set to 0.5 for ghost effect
                const shortId = ghost.id.substring(0, 4);
                
                Character.drawAvatar(
                    ctx,
                    screenX,
                    ghost.y,
                    ghost.frame,
                    ghost.facingRight,
                    ghost.vy, // Still pass vy so the "action" (stretch/squash) is visible
                    0.5,
                    shortId
                );
            }
        });
    }
}