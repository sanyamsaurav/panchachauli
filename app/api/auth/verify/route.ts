import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { AuthService } from '@/services';
import { successResponse, errorResponse, jsonResponse } from '@/lib/api/response';
import { withErrorHandling, handleApiError } from '@/lib/api';
import { HTTP_STATUS, MESSAGES } from '@/constants';

export const GET = withErrorHandling(async (request: NextRequest) => {
  try {
    const userPayload = await requireAuth(request);
    const user = await AuthService.verifyToken(userPayload.userId);

    return jsonResponse(
      successResponse(MESSAGES.AUTH.TOKEN_VALID, { user }),
      HTTP_STATUS.OK
    );
  } catch (error: any) {
    // Check if it's an auth error (should not be masked)
    if (
      error.message?.includes(MESSAGES.AUTH.USER_NOT_FOUND) ||
      error.message?.includes(MESSAGES.AUTH.NO_TOKEN) ||
      error.message?.includes(MESSAGES.AUTH.INVALID_TOKEN)
    ) {
      const statusCode = error.message?.includes(MESSAGES.AUTH.USER_NOT_FOUND)
        ? HTTP_STATUS.NOT_FOUND
        : HTTP_STATUS.UNAUTHORIZED;
      return jsonResponse(
        errorResponse(error.message || MESSAGES.AUTH.AUTHENTICATION_FAILED),
        statusCode
      );
    }

    // Use error handler for other errors (will mask server errors)
    return handleApiError(error);
  }
});

