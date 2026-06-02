import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { SchoolService } from '@/services';
import { jsonResponse, errorResponse, successResponse } from '@/lib/api/response';
import { withErrorHandling, handleApiError } from '@/lib/api';
import { HTTP_STATUS, HTTP_MESSAGES, MESSAGES } from '@/constants';

// DELETE /api/admin/school/[id] - delete a school aspirant (admin only)
export const DELETE = withErrorHandling(
  async (
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
  ) => {
    try {
      await requireAdmin(request);

      const { id } = await context.params;
      if (!id) {
        return jsonResponse(
          errorResponse('Aspirant id is required'),
          HTTP_STATUS.BAD_REQUEST
        );
      }

      const deleted = await SchoolService.deleteAspirant(id);

      if (!deleted) {
        return jsonResponse(
          errorResponse('Aspirant not found'),
          HTTP_STATUS.NOT_FOUND
        );
      }

      return jsonResponse(
        successResponse('Aspirant deleted successfully'),
        HTTP_STATUS.OK
      );
    } catch (error: unknown) {
      const err = error as { message?: string };
      if (
        err.message === MESSAGES.AUTH.NO_TOKEN ||
        err.message === MESSAGES.AUTH.INVALID_TOKEN
      ) {
        return jsonResponse(
          errorResponse(HTTP_MESSAGES.UNAUTHORIZED),
          HTTP_STATUS.UNAUTHORIZED
        );
      }
      if (err.message === MESSAGES.AUTH.INSUFFICIENT_PERMISSIONS) {
        return jsonResponse(
          errorResponse(MESSAGES.AUTH.ADMIN_REQUIRED),
          HTTP_STATUS.FORBIDDEN
        );
      }
      return handleApiError(error);
    }
  }
);
