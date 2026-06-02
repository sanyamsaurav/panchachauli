import { NextRequest } from 'next/server';
import { AuthService } from '@/services';
import { successResponse, errorResponse, jsonResponse } from '@/lib/api/response';
import { withErrorHandling, handleApiError } from '@/lib/api';
import { HTTP_STATUS, HTTP_MESSAGES, MESSAGES } from '@/constants';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

async function POSTHandler(request: NextRequest) {
  const body = await request.json();
  const credentials = loginSchema.parse(body);

  console.log(credentials,"credentialsss");
  const result = await AuthService.login(credentials);

  return jsonResponse(
    successResponse(result.message, {
      token: result.token,
      user: result.user,
    }),
    HTTP_STATUS.OK
  );
}

export const POST = withErrorHandling(async (request: NextRequest) => {
  try {
    return await POSTHandler(request);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return jsonResponse(
        errorResponse(MESSAGES.VALIDATION.ERROR, error.issues[0].message),
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // Check if it's an auth error (should not be masked)
    if (error instanceof Error) {
      const errorMessage = error.message;
      if (
        errorMessage.includes(MESSAGES.AUTH.INVALID_CREDENTIALS) ||
        errorMessage.includes(MESSAGES.AUTH.ACCOUNT_DEACTIVATED)
      ) {
        return jsonResponse(
          errorResponse(errorMessage),
          HTTP_STATUS.UNAUTHORIZED
        );
      }
    }

    // Use error handler for other errors (will mask server errors)
    return handleApiError(error);
  }
});

