/**
 * Request Deduplication Utility
 * 
 * This utility helps prevent duplicate API requests by caching ongoing requests
 * and returning the same promise for identical requests.
 */

interface PendingRequest {
  promise: Promise<any>;
  timestamp: number;
}

class RequestDeduplicator {
  private pendingRequests: Map<string, PendingRequest> = new Map();
  private readonly timeout: number = 5000; // 5 seconds timeout

  /**
   * Generate a unique key for the request
   */
  private generateKey(url: string, method: string = 'GET', params?: any): string {
    return `${method}:${url}:${JSON.stringify(params || {})}`;
  }

  /**
   * Clean up expired pending requests
   */
  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.pendingRequests.forEach((request, key) => {
      if (now - request.timestamp > this.timeout) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => {
      this.pendingRequests.delete(key);
    });
  }

  /**
   * Execute a request with deduplication
   */
  public async execute<T>(
    key: string,
    requestFn: () => Promise<T>
  ): Promise<T> {
    this.cleanup();

    // Check if there's already a pending request for this key
    const existing = this.pendingRequests.get(key);
    if (existing) {
      console.log(`[RequestDeduplicator] Returning existing request for key: ${key}`);
      return existing.promise;
    }

    // Create new request
    console.log(`[RequestDeduplicator] Creating new request for key: ${key}`);
    const promise = requestFn().finally(() => {
      // Remove from pending requests when completed
      this.pendingRequests.delete(key);
    });

    // Store the pending request
    this.pendingRequests.set(key, {
      promise,
      timestamp: Date.now()
    });

    return promise;
  }

  /**
   * Generate a key for API requests
   */
  public generateApiKey(url: string, method: string = 'GET', params?: any): string {
    return this.generateKey(url, method, params);
  }

  /**
   * Clear all pending requests
   */
  public clear(): void {
    this.pendingRequests.clear();
  }
}

// Export a singleton instance
export const requestDeduplicator = new RequestDeduplicator();
export default requestDeduplicator;
