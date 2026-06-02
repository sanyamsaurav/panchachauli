/**
 * Generic timeout wrapper for API route handlers
 * @param handler - The API route handler function
 * @param timeoutMs - Timeout in milliseconds (default: 30 seconds)
 * @returns Wrapped handler with timeout functionality
 */
export function withTimeout<T extends any[]>(
  handler: (...args: T) => Promise<Response>,
  timeoutMs: number = 30000 // 30 seconds default
) {
  return async (...args: T): Promise<Response> => {
    return Promise.race([
      handler(...args),
      new Promise<Response>((_, reject) =>
        setTimeout(
          () => reject(new Error('Request timeout')),
          timeoutMs
        )
      ),
    ]);
  };
}

