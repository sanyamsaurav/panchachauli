import type { ApiResponse, PaginatedResponse } from '@/types/api';

/**
 * Create a success API response
 */
export function successResponse<T>(
  message: string,
  data?: T
): ApiResponse<T> {
  return {
    success: true,
    message,
    data,
  };
}

/**
 * Create an error API response
 */
export function errorResponse(
  message: string,
  error?: string
): ApiResponse {
  return {
    success: false,
    message,
    error,
  };
}

/**
 * Create a paginated response
 */
export function paginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number
): PaginatedResponse<T> {
  return {
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Send JSON response with status code
 */
export function jsonResponse<T>(
  data: ApiResponse<T> | PaginatedResponse<T>,
  status: number = 200
): Response {
  return Response.json(data, { status });
}

