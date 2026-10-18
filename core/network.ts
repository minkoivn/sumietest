import { io, Socket } from "socket.io-client";

export class NetworkManager {
    socket: Socket | null = null;
    deviceId: string;
    
    // Callbacks for game loop
    onWorldSnapshot: (data: any[]) => void = () => {};
    onNewLantern: (data: any) => void = () => {};
    onLanternsData: (data: any[]) => void = () => {};

    // Throttling state
    lastUpdate: number = 0;
    updateInterval: number = 50; // Max 20 times/sec (50ms)

    constructor() {
        // Generate or retrieve Device ID
        let id = localStorage.getItem('sumi_device_id');
        if (!id) {
            id = Math.random().toString(36).substring(2, 15);
            localStorage.setItem('sumi_device_id', id);
        }
        this.deviceId = id;
    }

    connect() {
        if (this.socket) return;

        // Backend URL (Assuming localhost for dev as per spec)
        // In production, this should be an env variable
        const BACKEND_URL = "ws://localhost:3000";

        this.socket = io(BACKEND_URL, {
            transports: ["websocket"],
            query: {
                deviceId: this.deviceId
            }
        });

        this.socket.on("connect", () => {
            console.log("Connected to Sumi-e Backend:", this.socket?.id);
        });

        this.socket.on("world_snapshot", (data) => {
            // [id, x, y, vx, vy, state][]
            this.onWorldSnapshot(data);
        });

        this.socket.on("new_lantern_spawned", (data) => {
            this.onNewLantern(data);
        });

        this.socket.on("lanterns_data", (data) => {
            this.onLanternsData(data);
        });
        
        this.socket.on("connect_error", (err) => {
            console.warn("Connection failed (Backend might be offline):", err.message);
        });
    }

    // Upstream: update_pos
    // Payload: [x, y, vx, vy, state]
    sendPosition(x: number, y: number, vx: number, vy: number, state: number) {
        if (!this.socket || !this.socket.connected) return;

        const now = Date.now();
        if (now - this.lastUpdate > this.updateInterval) {
            // Optimize: Round numbers to 1 decimal place to save bandwidth
            this.socket.emit("update_pos", [
                Math.round(x * 10) / 10,
                Math.round(y * 10) / 10,
                Math.round(vx * 10) / 10,
                Math.round(vy * 10) / 10,
                state
            ]);
            this.lastUpdate = now;
        }
    }

    // Upstream: place_lantern
    placeLantern(message: string, x: number, y: number) {
        if (!this.socket || !this.socket.connected) return;
        this.socket.emit("place_lantern", { message, x, y });
    }

    // Upstream: fetch_lanterns
    fetchLanterns(chunkId: number) {
        if (!this.socket || !this.socket.connected) return;
        this.socket.emit("fetch_lanterns", { chunkId });
    }

    getId() {
        return this.socket?.id;
    }
}

export const networkManager = new NetworkManager();