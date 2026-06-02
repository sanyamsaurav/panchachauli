import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { AuthService } from '@/services';
import { jsonResponse, errorResponse, successResponse } from '@/lib/api/response';
import { withErrorHandling, handleApiError } from '@/lib/api';
import { HTTP_STATUS, MESSAGES } from '@/constants';
import { z } from 'zod';

const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'New password and confirmation do not match',
    path: ['confirmPassword'],
  });

// PATCH /api/admin/password — update admin password (admin only)
export const PATCH = withErrorHandling(async (request: NextRequest) => {
  try {
    const admin = await requireAdmin(request);

    const body = await request.json();
    const parsed = updatePasswordSchema.safeParse(body);

    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return jsonResponse(
        errorResponse(MESSAGES.VALIDATION.ERROR, first.message),
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const { currentPassword, newPassword } = parsed.data;
    await AuthService.updateAdminPassword(admin.id, currentPassword, newPassword);

    return jsonResponse(
      successResponse(MESSAGES.AUTH.PASSWORD_UPDATED),
      HTTP_STATUS.OK
    );
  } catch (error: unknown) {
    if (error instanceof Error && (error.message === MESSAGES.AUTH.NO_TOKEN || error.message === MESSAGES.AUTH.INVALID_TOKEN)) {
      return jsonResponse(errorResponse(MESSAGES.AUTH.INVALID_TOKEN), HTTP_STATUS.UNAUTHORIZED);
    }
    if (error instanceof Error && error.message === MESSAGES.AUTH.INSUFFICIENT_PERMISSIONS) {
      return jsonResponse(errorResponse(MESSAGES.AUTH.ADMIN_REQUIRED), HTTP_STATUS.FORBIDDEN);
    }
    if (error instanceof Error && error.message === MESSAGES.AUTH.CURRENT_PASSWORD_INVALID) {
      return jsonResponse(errorResponse(MESSAGES.AUTH.CURRENT_PASSWORD_INVALID), HTTP_STATUS.BAD_REQUEST);
    }
    if (error instanceof Error && error.message === MESSAGES.AUTH.USER_NOT_FOUND) {
      return jsonResponse(errorResponse(MESSAGES.AUTH.USER_NOT_FOUND), HTTP_STATUS.NOT_FOUND);
    }
    return handleApiError(error);
  }
});
