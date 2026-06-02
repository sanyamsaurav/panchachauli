import { errorResponse, jsonResponse } from './response';
import { HTTP_STATUS } from '@/constants/http';
import { MESSAGES } from '@/constants/messages';

/**
 * Check if error is a server/internal error that should be masked
 */
function isServerError(error: any): boolean {
  const errorMessage = error?.message?.toLowerCase() || '';
  const errorString = String(error).toLowerCase();

  // List of server error patterns that should be masked
  const serverErrorPatterns = [
    'mongodb',
    'database',
    'connection',
    'timeout',
    'etimedout',
    'enotfound',
    'econnrefused',
    'query',
    'network',
    'socket',
    'internal server',
  ];

  return serverErrorPatterns.some(
    (pattern) =>
      errorMessage.includes(pattern) || errorString.includes(pattern)
  );
}

/**
 * Handle API errors and mask server errors
 * @param error - The error object
 * @param defaultMessage - Default error message to show
 * @returns JSON response with appropriate error message
 */
export function handleApiError(
  error: any,
  defaultMessage: string = MESSAGES.ERROR.INTERNAL_SERVER_ERROR
): Response {
  // Log the actual error for debugging (server-side only)
  console.error('API Error:', error);

  // Check if it's a server error that should be masked
  if (isServerError(error)) {
    return jsonResponse(
      errorResponse(MESSAGES.ERROR.INTERNAL_SERVER_ERROR),
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }

  // For client errors, return the actual error message
  const errorMessage =
    error?.message || error?.toString() || defaultMessage;

  return jsonResponse(
    errorResponse(errorMessage),
    HTTP_STATUS.BAD_REQUEST
  );
}

/**
 * Wrap API route handler with error handling and timeout
 * @param handler - The API route handler function
 * @param timeoutMs - Timeout in milliseconds (default: 30 seconds)
 * @returns Wrapped handler with error handling and timeout
 */
export function withErrorHandling<T extends any[]>(
  handler: (...args: T) => Promise<Response>,
  timeoutMs: number = 30000
) {
  return async (...args: T): Promise<Response> => {
    try {
      // Apply timeout
      const timeoutPromise = new Promise<Response>((_, reject) =>
        setTimeout(
          () => reject(new Error('Request timeout')),
          timeoutMs
        )
      );

      const handlerPromise = handler(...args);

      const response = await Promise.race([
        handlerPromise,
        timeoutPromise,
      ]);

      return response;
    } catch (error: any) {
      // Handle timeout errors
      if (error?.message === 'Request timeout') {
        return jsonResponse(
          errorResponse(MESSAGES.ERROR.REQUEST_TIMEOUT),
          HTTP_STATUS.REQUEST_TIMEOUT
        );
      }

      // Handle other errors
      return handleApiError(error);
    }
  };
}

