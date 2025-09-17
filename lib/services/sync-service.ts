interface RetryConfig {
    maxAttempts: number;
    delayMs: number;
    backoffRate: number;
}

interface CacheItem<T> {
    data: T;
    timestamp: number;
    version: number;
}

export class SyncService {
    private cache: Map<string, CacheItem<unknown>> = new Map();
    // private pendingUpdates: Map<string, Promise<unknown>> = new Map();
    private defaultRetryConfig: RetryConfig = {
        maxAttempts: 3,
        delayMs: 1000,
        backoffRate: 2,
    };

    constructor(private apiBaseUrl: string) { }

    private assertType<T>(value: unknown): T {
        return value as T;
    }

    async fetchWithRetry<T>(
        endpoint: string,
        options: RequestInit = {},
        retryConfig: Partial<RetryConfig> = {}
    ): Promise<T> {
        const config = { ...this.defaultRetryConfig, ...retryConfig };
        let lastError: Error | null = null;

        for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
            try {
                const response = await fetch(`${this.apiBaseUrl}${endpoint}`, options);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return await response.json();
            } catch (error) {
                lastError = error as Error;
                if (attempt < config.maxAttempts) {
                    await this.delay(config.delayMs * Math.pow(config.backoffRate, attempt - 1));
                }
            }
        }

        throw new Error(`Failed after ${config.maxAttempts} attempts: ${lastError?.message}`);
    }

    async optimisticUpdate<T>(
        key: string,
        updateFn: () => Promise<T>,
        optimisticData: T
    ): Promise<T> {
        // Store the optimistic update
        this.updateCache(key, optimisticData);

        try {
            // Perform the actual update
            const result = await updateFn();
            // Update cache with real data
            this.updateCache(key, result);
            return result;
        } catch (error) {
            // Revert optimistic update on error
            const previousData = this.cache.get(key)?.data;
            if (previousData) {
                this.updateCache(key, previousData);
            }
            throw error;
        }
    }

    private updateCache<T>(key: string, data: T) {
        const existing = this.cache.get(key);
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            version: (existing?.version || 0) + 1,
        });
    }

    getCachedData<T>(key: string): T | null {
        const cached = this.cache.get(key);
        return cached ? this.assertType<T>(cached.data) : null;
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async pollResource<T>(
        key: string,
        fetchFn: () => Promise<T>,
        intervalMs: number = 5000,
        condition?: (data: T) => boolean
    ): Promise<void> {
        const poll = async () => {
            try {
                const data = await fetchFn();
                this.updateCache(key, data);

                if (condition && condition(data)) {
                    return; // Stop polling if condition is met
                }

                setTimeout(poll, intervalMs);
            } catch (error) {
                console.error(`Polling error for ${key}:`, error);
                // Retry with exponential backoff
                setTimeout(poll, intervalMs * 2);
            }
        };

        await poll();
    }

    async syncBidirectional<T>(
        key: string,
        localChanges: T,
        serverFetch: () => Promise<T>,
        serverUpdate: (data: T) => Promise<T>
    ): Promise<T> {
        try {
            // Get latest server data
            const serverData = await serverFetch();

            // Merge local and server changes
            const mergedData = this.mergeChanges(serverData, localChanges);

            // Update server with merged data
            const result = await serverUpdate(mergedData);

            // Update local cache
            this.updateCache(key, result);

            return result;
        } catch (error) {
            console.error('Bidirectional sync failed:', error);
            throw error;
        }
    }

    private mergeChanges<T>(serverData: T, localData: T): T {
        // Implement your merging strategy here
        // This is a simple example that prioritizes local changes
        return { ...serverData, ...localData };
    }
}
