import { io, Socket } from 'socket.io-client';

export type WebSocketEvent =
    | 'order:created'
    | 'order:updated'
    | 'stock:updated'
    | 'product:updated'
    | 'category:updated'
    | 'customer:updated';

class WebSocketService {
    private socket: Socket | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectDelay = 1000; // Start with 1 second

    constructor() {
        this.initialize();
    }

    private initialize() {
        try {
            this.socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:3001', {
                reconnection: true,
                reconnectionAttempts: this.maxReconnectAttempts,
                reconnectionDelay: this.reconnectDelay,
            });

            this.setupEventListeners();
        } catch (error) {
            console.error('WebSocket initialization failed:', error);
        }
    }

    private setupEventListeners() {
        if (!this.socket) return;

        this.socket.on('connect', () => {
            console.log('WebSocket connected');
            this.reconnectAttempts = 0;
        });

        this.socket.on('connect_error', (error) => {
            console.error('WebSocket connection error:', error);
            this.handleReconnect();
        });

        this.socket.on('disconnect', (reason) => {
            console.log('WebSocket disconnected:', reason);
            if (reason === 'io server disconnect') {
                this.connect();
            }
        });
    }

    private handleReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
            setTimeout(() => this.connect(), delay);
        } else {
            console.error('Max reconnection attempts reached');
        }
    }

    connect() {
        if (this.socket) {
            this.socket.connect();
        } else {
            this.initialize();
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }

    subscribe<T>(event: WebSocketEvent, callback: (data: T) => void) {
        if (this.socket) {
            this.socket.on(event, callback);
        }
    }

    unsubscribe(event: WebSocketEvent) {
        if (this.socket) {
            this.socket.off(event);
        }
    }

    emit<T>(event: WebSocketEvent, data: T) {
        if (this.socket) {
            this.socket.emit(event, data);
        }
    }
}

export const webSocketService = new WebSocketService();
