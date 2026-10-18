import React, { useRef, useEffect, useState } from 'react';
import { MountainLayer, WeatherSystem, Character, BoatManager, CloudLayer, ItemManager, GhostManager, StructureManager, SealManager, drawCelestialBody } from '../game/entities';
import { soundManager } from '../core/audio';
import { networkManager } from '../core/network';

interface GameCanvasProps {
  onGameStart: () => void;
  gameStarted: boolean;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ onGameStart, gameStarted }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const [distance, setDistance] = useState(0);
  
  // Game Entities Refs (persisted across renders)
  const entities = useRef({
    char: new Character(),
    weather: new WeatherSystem(),
    boatManager: new BoatManager(),
    itemManager: new ItemManager(),
    ghostManager: new GhostManager(),
    clouds: new CloudLayer(),
    structures: new StructureManager(),
    sealManager: new SealManager(),
    layers: [] as MountainLayer[],
    scrollOffset: 0,
    currentSpeed: 0,
    time: 0,
    currentChunk: 0,
    keys: { left: false, right: false, up: false, run: false, interact: false }
  });

  /* Disabled Lantern Logic
  const handlePostMessage = () => {
    if (myMessage.trim().length === 0) return;
    const game = entities.current;
    
    // Convert ink to lantern
    game.char.inkCount -= 3;
    const charWorldX = game.char.x + game.scrollOffset;
    
    // Send to server
    networkManager.placeLantern(myMessage, charWorldX, game.char.y);
    
    // Spawn locally immediately for feedback
    game.itemManager.spawnLocalLantern(charWorldX, myMessage);
    
    setWritingMessage(false);
    setMyMessage("");
    setInkCount(game.char.inkCount);
  };
  */

  useEffect(() => {
    // Connect to backend
    networkManager.connect();

    // Register Network Callbacks
    networkManager.onWorldSnapshot = (data) => {
        // Filter out self if server returns it (though server usually filters)
        const myId = networkManager.getId();
        const others = data.filter(p => p[0] !== myId);
        entities.current.ghostManager.updateSnapshots(others);
    };

    /* Disabled Lantern Network Listeners
    networkManager.onNewLantern = (data) => {
        entities.current.itemManager.addLantern(data);
    };

    networkManager.onLanternsData = (data) => {
        entities.current.itemManager.setLanterns(data);
    };
    */

    const handleKeyDown = (e: KeyboardEvent) => {
        const k = entities.current.keys;
        if (e.code === 'ArrowLeft' || e.code === 'KeyA') k.left = true;
        if (e.code === 'ArrowRight' || e.code === 'KeyD') k.right = true;
        if (e.code === 'Space' || e.code === 'ArrowUp') k.up = true;
        if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') k.run = true;
        
        /* Disabled Interaction Key
        if (e.code === 'KeyE') {
            const game = entities.current;
            const charWorldX = game.char.x + game.scrollOffset;
            const lantern = game.itemManager.getNearbyLantern(charWorldX, game.scrollOffset);
            
            if (lantern) {
                setReadingMessage(lantern.message);
            } else if (game.char.inkCount >= 3) {
                 setWritingMessage(true);
            }
        }
        */
    };
    const handleKeyUp = (e: KeyboardEvent) => {
        const k = entities.current.keys;
        if (e.code === 'ArrowLeft' || e.code === 'KeyA') k.left = false;
        if (e.code === 'ArrowRight' || e.code === 'KeyD') k.right = false;
        if (e.code === 'Space' || e.code === 'ArrowUp') k.up = false;
        if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') k.run = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // --- INIT LAYERS ---
    const initGame = (w: number, h: number) => {
        const game = entities.current;
        game.layers = [];
        
        // Background Mountains
        const bgCount = 5;
        for(let i=0; i<bgCount; i++) {
            const t = i / (bgCount - 1); 
            game.layers.push(new MountainLayer(
               { 
                   roughness: 0.7 + t * 0.1, 
                   color: `rgba(${160 - t*140}, ${160 - t*140}, ${160 - t*140}, 1.0)`,
                   opacity: 1.0, 
                   yOffset: 0.4 + t * 0.3, 
                   blur: 15 - i * 2, 
                   speed: 0.05 + t * 0.1, 
                   hasTrees: false
               }, 
               w, h
           ));
       }
       // River (Layer Index 4)
       game.layers.push(new MountainLayer(
           { 
               roughness: 0.02, 
               color: '#b0b0b0', 
               opacity: 0.8, 
               yOffset: 0.75, 
               blur: 4, 
               speed: 0.3, 
               hasTrees: false 
           }, 
           w, h
       ));
       // Foreground Path (Layer Index 5)
       game.layers.push(new MountainLayer(
           { 
               roughness: 0.15, 
               color: '#1a1a1a', 
               opacity: 1.0, 
               yOffset: 0.8, 
               blur: 2, 
               speed: 1.0, 
               hasTrees: true, 
               treeProb: 0.35 
           }, 
           w, h
       ));

       game.char.x = w / 3;
       
       // Sync audio with weather
       game.weather.onWeatherChange = (type) => {
           soundManager.setWeather(type);
       };
    };

    // Resize Handler
    const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initGame(canvas.width, canvas.height);
    };
    window.addEventListener('resize', resize);
    resize();

    // --- GAME LOOP ---
    const render = () => {
        if (!gameStarted) return;
        
        const game = entities.current;
        const width = canvas.width;
        const height = canvas.height;

        // Background Color Transition
        const body = document.body;
        let currentBgColor = '#e8e4d9';
        if (game.weather.type === 'storm') currentBgColor = '#666'; 
        else if (game.weather.type === 'rain') currentBgColor = '#cfccc3';
        else if (game.weather.type === 'snow') currentBgColor = '#f0f0eb'; 
        body.style.backgroundColor = currentBgColor;

        ctx.clearRect(0, 0, width, height);
        
        game.time += 0.8;

        // Movement Logic
        const baseSpeed = game.keys.run ? 9 : 4;
        let targetSpeed = 0;
        if(game.keys.right) targetSpeed = baseSpeed;
        else if(game.keys.left) targetSpeed = -baseSpeed;
        game.currentSpeed += (targetSpeed - game.currentSpeed) * 0.1;

        game.scrollOffset += game.currentSpeed;
        const charWorldX = game.char.x + game.scrollOffset;
        
        // --- CHUNK LOGIC (Network) ---
        const chunkId = Math.floor(charWorldX / 2000);
        if (chunkId !== game.currentChunk) {
            game.currentChunk = chunkId;
            // networkManager.fetchLanterns(chunkId); // Disabled
        }

        // --- SEND POS TO SERVER ---
        if (Math.abs(game.currentSpeed) > 0.1 || game.char.state === 2 || game.char.state === 3) {
            networkManager.sendPosition(
                charWorldX, 
                game.char.y, 
                game.currentSpeed, 
                game.char.vy, 
                game.char.state
            );
        }

        // Update Stats
        if (Math.abs(game.currentSpeed) > 0.1) {
            setDistance(d => d + Math.abs(game.currentSpeed) / 100);
        }

        game.boatManager.update(width, height, game.scrollOffset);
        game.clouds.draw(ctx, width, game.currentSpeed);

        // Dynamic Celestial Body (Vermilion Red Sun / Cold Moon based on weather)
        drawCelestialBody(ctx, width, height, game.weather.type, game.time);

        // Draw Layers with integrated Ancient Structures
        for(let i=0; i<game.layers.length; i++) {
            // Draw mountain temples on distant mountain layers (Layer 1 & 2)
            if (i === 1 || i === 2) {
                game.structures.drawBackgroundStructures(ctx, width, height, game.scrollOffset, i, game.layers[i]);
            }

            // Layer 4 is River, Layer 5 is Path.
            // Draw boats before the Path (index 5) but after River (index 4)
            if (i === game.layers.length - 1) {
                // Get the river layer (index 4, or length-2)
                const riverLayer = game.layers[game.layers.length - 2];
                game.boatManager.draw(ctx, width, height, game.scrollOffset, riverLayer);
            }

            // Render mountain/terrain layer with dynamic weather background color
            game.layers[i].draw(ctx, width, height, game.scrollOffset, currentBgColor);

            // Draw foreground structures (Teahouse, Village Gate, Bridge) on Path (Layer 5)
            if (i === game.layers.length - 1) {
                game.structures.drawForegroundStructures(ctx, width, height, game.scrollOffset, game.layers[i], game.time);
            }
        }

        // Get ground height (incorporating bridge arch elevation)
        const pathLayer = game.layers[game.layers.length - 1];
        const bridgeLift = game.structures.getBridgeElevation(charWorldX);
        const groundY = pathLayer.getHeightAt(charWorldX, height) - bridgeLift;
        
        // Draw footstep ink bleeds on paper before characters
        game.char.drawFootsteps(ctx, game.scrollOffset);

        // Update & Draw Other Players (Ghosts)
        game.ghostManager.updateAndDraw(ctx, game.scrollOffset, width, height, pathLayer);

        // Update & Draw Beggar Character
        game.char.update(groundY, game.currentSpeed, game.keys, game.scrollOffset);
        game.char.draw(ctx);

        // Weather effects (rain, snow, storm)
        game.weather.update(width, height, game.currentSpeed);
        game.weather.draw(ctx, width, height);

        // Cinnabar Seal & Milestone achievement system
        game.sealManager.update(Math.floor(distance));
        game.sealManager.draw(ctx, width, height);

        animationRef.current = requestAnimationFrame(render);
    };

    if (gameStarted) {
        render();
    }

    return () => {
        window.removeEventListener('resize', resize);
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [gameStarted]);

  return (
    <>
        <canvas ref={canvasRef} className="block filter contrast-[1.05] brightness-[0.98]" />
        
        {/* HUD - Poetic Calligraphic Layout (No pills) */}
        {gameStarted && (
            <div className="absolute top-5 left-20 pointer-events-none z-20 flex flex-col drop-shadow-sm select-none">
                <div className="flex items-baseline gap-2 text-gray-800 font-ink font-bold text-2xl tracking-wide">
                    <span>Hành Trình:</span>
                    <span className="font-mono text-xl tracking-tight text-gray-900">{Math.floor(distance)}</span>
                    <span className="text-base font-normal text-gray-600">trượng</span>
                </div>
                <div className="text-xs text-gray-600 font-ink tracking-wider flex items-center gap-1.5 opacity-80">
                    <span>Độc Bộ Hành Khất</span>
                    <span>·</span>
                    <span>Lữ Khách #{networkManager.deviceId.substring(0, 5)}</span>
                </div>
            </div>
        )}
    </>
  );
};

export default GameCanvas;