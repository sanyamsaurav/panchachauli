import { NextRequest } from 'next/server';
import { AuthService } from '@/services';
import { successResponse, errorResponse, jsonResponse } from '@/lib/api/response';
import { withErrorHandling, handleApiError } from '@/lib/api';
import { HTTP_STATUS, HTTP_MESSAGES, MESSAGES } from '@/constants';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['volunteer', 'user']).optional().default('user'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits').optional().or(z.literal('')),
  address: z.string().max(500, 'Address must not exceed 500 characters').optional().or(z.literal('')),
  skills: z.array(z.string()).max(10, 'You can select up to 10 skills').optional(),
  availability: z.array(z.enum(['weekdays', 'weekends', 'mornings', 'afternoons', 'evenings'])).max(5, 'You can select up to 5 availability options').optional(),
});

async function POSTHandler(request: NextRequest) {
  const body = await request.json();
  const data = registerSchema.parse(body);

  const result = await AuthService.register(data);

  return jsonResponse(
    successResponse(result.message, {
      token: result.token,
      user: result.user,
    }),
    HTTP_STATUS.CREATED
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

    // Check if it's a user exists error (should not be masked)
    if (error instanceof Error && error.message.includes(MESSAGES.AUTH.USER_EXISTS)) {
      return jsonResponse(
        errorResponse(MESSAGES.AUTH.USER_EXISTS),
        HTTP_STATUS.CONFLICT
      );
    }

    // Use error handler for other errors (will mask server errors)
    return handleApiError(error);
  }
});

