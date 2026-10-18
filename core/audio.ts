export class SoundManager {
    ctx: AudioContext | null = null;
    
    // Nodes
    masterGain: GainNode | null = null;
    rainGain: GainNode | null = null;
    windGain: GainNode | null = null;
    musicGain: GainNode | null = null;

    bgmAudio: HTMLAudioElement | null = null;
    
    // State
    isMuted: boolean = false;

    constructor() {}

    async init() {
        if (this.ctx) {
            if (this.ctx.state === 'suspended') {
                await this.ctx.resume();
            }
            // Ensure music plays if initialized but stopped/paused
            if (this.bgmAudio && this.bgmAudio.paused && !this.isMuted) {
                this.bgmAudio.play().catch(e => console.warn("Resume play failed", e));
            }
            return;
        }
        
        // AudioContext
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        this.ctx = new AudioContextClass();
        
        // Master Gain
        this.masterGain = this.ctx.createGain();
        this.masterGain.connect(this.ctx.destination);

        // --- NOISE GENERATION (Dùng cho Mưa & Gió) ---
        // Tạo 2 giây nhiễu trắng (white noise)
        const bufferSize = 2 * this.ctx.sampleRate;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        // --- RAIN SETUP (Tiếng Mưa) ---
        const rainSrc = this.ctx.createBufferSource();
        rainSrc.buffer = noiseBuffer;
        rainSrc.loop = true;
        
        this.rainGain = this.ctx.createGain();
        this.rainGain.gain.value = 0; // Mặc định tắt

        // Lọc bớt tần số cao để tiếng mưa nghe đầm hơn
        const rainFilter = this.ctx.createBiquadFilter();
        rainFilter.type = 'lowpass';
        rainFilter.frequency.value = 800; 

        rainSrc.connect(rainFilter);
        rainFilter.connect(this.rainGain);
        this.rainGain.connect(this.masterGain);
        rainSrc.start();

        // --- WIND SETUP (Tiếng Gió) ---
        const windSrc = this.ctx.createBufferSource();
        windSrc.buffer = noiseBuffer;
        windSrc.loop = true;

        this.windGain = this.ctx.createGain();
        this.windGain.gain.value = 0;

        // Lọc tần số thấp và cộng hưởng để tạo tiếng rít
        const windFilter = this.ctx.createBiquadFilter();
        windFilter.type = 'bandpass';
        windFilter.frequency.value = 400; 
        windFilter.Q.value = 1; // Độ cộng hưởng
        
        windSrc.connect(windFilter);
        windFilter.connect(this.windGain);
        this.windGain.connect(this.masterGain);
        windSrc.start();

        // Biến thiên tần số gió ngẫu nhiên để tạo cảm giác tự nhiên
        this.modulateWind(windFilter);

        // --- MUSIC (Nhạc nền MP3) ---
        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.value = 0.6; // Âm lượng nhạc nền
        this.musicGain.connect(this.masterGain);

        // NOTE: In most bundlers (Vite/CRA), files in 'public' are served at root.
        // We try 'bgm.mp3' first. 
        const mp3Url = "https://res.cloudinary.com/dge6dyc8e/video/upload/v1768208874/bgm_e54egv.mp3"; 

        this.bgmAudio = new Audio();
        this.bgmAudio.src = mp3Url;
        this.bgmAudio.crossOrigin = "anonymous";
        this.bgmAudio.loop = true;
        
        // Error handling for loading
        this.bgmAudio.onerror = (e) => {
            console.error("Lỗi tải nhạc nền. Hãy chắc chắn file 'bgm.mp3' nằm trong thư mục public.", e);
        };

        // Kết nối thẻ Audio vào hệ thống Web Audio API để quản lý Gain (âm lượng) chung
        // createMediaElementSource requires the element to be playable.
        const source = this.ctx.createMediaElementSource(this.bgmAudio);
        source.connect(this.musicGain);

        try {
            await this.bgmAudio.play();
        } catch (e) {
            console.warn("Không thể tự động phát nhạc, cần tương tác người dùng.", e);
        }
    }

    // Hàm tạo tiếng gió rít lên xuống ngẫu nhiên
    modulateWind(filterNode: BiquadFilterNode) {
        setInterval(() => {
            if(this.ctx && !this.isMuted) {
                const now = this.ctx.currentTime;
                // Thay đổi tần số trung tâm của bộ lọc gió
                const randomFreq = 300 + Math.random() * 300; 
                filterNode.frequency.exponentialRampToValueAtTime(randomFreq, now + 2);
            }
        }, 3000);
    }

    setWeather(type: string) {
        if (!this.ctx) return;
        const t = this.ctx.currentTime;
        
        let rv = 0, wv = 0;
        
        switch(type) {
            case 'rain': 
                rv = 0.3; wv = 0.1; 
                break;
            case 'storm': 
                rv = 0.6; wv = 0.5; 
                break;
            case 'wind': 
                rv = 0; wv = 0.5; 
                break;
            case 'snow': 
                rv = 0; wv = 0.2; // Gió tuyết nhẹ
                break;
            default: // clear
                rv = 0; wv = 0.05; // Gió hiu hiu nền
                break; 
        }

        // Chuyển đổi âm lượng mượt mà (Fade in/out)
        this.rainGain?.gain.setTargetAtTime(rv, t, 0.5);
        this.windGain?.gain.setTargetAtTime(wv, t, 0.5);
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.ctx) {
            if (this.isMuted) {
                this.ctx.suspend();
                if (this.bgmAudio) this.bgmAudio.pause();
            } else {
                this.ctx.resume();
                if (this.bgmAudio) {
                    this.bgmAudio.play().catch(e => console.error("Resume play failed", e));
                }
            }
        }
        return this.isMuted;
    }
}

export const soundManager = new SoundManager();