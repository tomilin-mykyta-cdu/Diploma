// sseService.ts
export class SSEService {
    private eventSource: EventSource | null = null;
    private listeners: { [key: string]: Function[] } = {};

    constructor(url: string, key: string) {
        console.log(`[Adding ${url}] subscriber by ${key} key into SseService`)
        this.eventSource = new EventSource(url);

        this.eventSource.onopen = () => {
            console.log(`Connected to ${url}`);
        };

        this.eventSource.onmessage = (event) => {
            const parsedData = JSON.parse(event.data);
            this.notifyListeners(parsedData[key], url);
        };

        this.eventSource.onerror = () => {
            console.error(`SSE connection error for ${url}`);
            this.closeEventSource();
        };
    }

    private notifyListeners(data: any, eventKey: string) {
        if (this.listeners[eventKey]) {
            this.listeners[eventKey].forEach((callback) => callback(data));
        }
    }

    public subscribe(eventKey: string, callback: Function) {
        if (!this.listeners[eventKey]) {
            this.listeners[eventKey] = [];
        }
        this.listeners[eventKey].push(callback);
        console.log(`Subscribe ${eventKey} as ${this.listeners[eventKey].length} subscriber`);
    }

    public unsubscribe(eventKey: string, callback: Function) {
        if (this.listeners[eventKey]) {
            this.listeners[eventKey] = this.listeners[eventKey].filter((cb) => cb !== callback);
            // if (this.listeners[eventKey].length === 0) {
            //     delete this.listeners[eventKey];
            // }
        }
    }

    public log() {
        return SERVICES;
    }

    private closeEventSource() {
        if (this.eventSource) {
            console.log('Closing EventSource connection');
            this.eventSource.close();
            this.eventSource = null;
        }
    }
}

const SERVICES: Record<string, SSEService> = {}

export const getService = (url: string, key: string) => {
    if (!SERVICES[url]) {
        SERVICES[url] = new SSEService(url, key);
    }

    return SERVICES[url];
}

// export const sseService = new SSEService();
