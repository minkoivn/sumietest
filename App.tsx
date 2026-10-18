import React, { useState, useEffect } from 'react';
import GameCanvas from './components/GameCanvas';
import { soundManager } from './core/audio';

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [weatherInfo, setWeatherInfo] = useState("Tạnh ráo");
  const [isMuted, setIsMuted] = useState(false);

  // Hook into the weather system to update UI
  useEffect(() => {
    // This is a bit of a hack to connect the non-React class to React state
    // In a production app, we might use a dedicated store.
    const interval = setInterval(() => {
        // We can't easily access the internal instance created in GameCanvas 
        // without lifting state up significantly. 
        // For visual simplicity, we will let the GameCanvas handle the loop, 
        // but we'll recreate the weather text logic here based on visual observation or 
        // improve the architecture if needed. 
        // Ideally, GameCanvas calls a prop.
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const startGame = async () => {
    await soundManager.init();
    setGameStarted(true);
  };

  const toggleMute = () => {
      const muted = soundManager.toggleMute();
      setIsMuted(muted);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-paper transition-colors duration-[800ms] ease-in-out">
      {/* Paper Texture Overlay */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.08] z-10 bg-noise mix-blend-multiply"></div>

      {/* Game Layer */}
      <GameCanvas onGameStart={() => {}} gameStarted={gameStarted} />

      {/* Start Screen Overlay */}
      {!gameStarted && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-paper/95 backdrop-blur-sm select-none px-4">
          <div className="relative flex flex-col items-center">
            {/* Visual Seal Stamp Indicator */}
            <div className="w-12 h-12 mb-3 border-2 border-red-800 bg-red-800/90 rounded flex items-center justify-center shadow-sm">
                <span className="font-serif text-white font-bold text-xl tracking-tighter">無為</span>
            </div>

            <h1 className="font-ink text-6xl md:text-8xl text-gray-900 mb-2 drop-shadow-sm text-center">
              Hành Khất Thủy Mặc
            </h1>
            <h2 className="font-ink text-2xl md:text-3xl text-gray-700 mb-8 italic text-center">
              Phong Vân Biến Sắc · Nhất Bát Cô Hành
            </h2>
            
            <button 
              onClick={startGame}
              className="px-10 py-3.5 bg-gray-900 text-paper font-ink text-2xl md:text-3xl rounded hover:bg-gray-800 hover:scale-105 active:scale-95 transition-all shadow-md tracking-wider"
            >
              Khai Mở Hành Trình
            </button>
            
            <p className="mt-8 text-gray-600 font-ink text-lg max-w-lg text-center leading-relaxed">
              "Đeo tai nghe để lắng nghe tiếng gió rít, tiếng mưa rơi và từng bước chân gieo vết mực trên thớ giấy xuyến chỉ."
            </p>
          </div>
        </div>
      )}

      {/* UI Overlay */}
      {gameStarted && (
        <>
            <div className="absolute top-5 right-5 z-20 flex gap-3">
                <button 
                    onClick={toggleMute} 
                    className="font-ink font-bold text-gray-800 bg-paper/80 border border-gray-700/25 px-4 py-1 rounded hover:bg-paper hover:border-gray-800 transition shadow-sm text-lg"
                >
                    {isMuted ? "Bật Âm Điệu" : "Tắt Âm Điệu"}
                </button>
            </div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 bg-paper/80 backdrop-blur-sm px-6 py-1.5 rounded-full border border-gray-500/25 text-center shadow-sm select-none pointer-events-none">
                <p className="font-ink text-gray-800 text-lg md:text-xl tracking-wider flex items-center gap-3">
                    <span><strong className="font-sans font-bold text-sm bg-gray-800 text-paper px-1.5 py-0.5 rounded mr-1">A / D</strong> Hành Tiến</span>
                    <span className="text-gray-400">·</span>
                    <span><strong className="font-sans font-bold text-sm bg-gray-800 text-paper px-1.5 py-0.5 rounded mr-1">Shift</strong> Phi Thân</span>
                    <span className="text-gray-400">·</span>
                    <span><strong className="font-sans font-bold text-sm bg-gray-800 text-paper px-1.5 py-0.5 rounded mr-1">Space</strong> Vượt Ghềnh</span>
                </p>
            </div>
        </>
      )}
    </div>
  );
}