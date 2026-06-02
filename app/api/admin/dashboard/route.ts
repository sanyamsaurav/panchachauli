import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { BlogService, ExperienceService } from '@/services';
import { jsonResponse, errorResponse, successResponse } from '@/lib/api/response';
import { withErrorHandling, handleApiError } from '@/lib/api';
import { HTTP_STATUS, HTTP_MESSAGES, MESSAGES } from '@/constants';

/**
 * GET /api/admin/dashboard
 * Returns dashboard stats: total blogs and total experiences count.
 */
export const GET = withErrorHandling(async (_request: NextRequest) => {
  try {
    await requireAdmin(_request);

    const [blogsResult, experiencesResult] = await Promise.all([
      BlogService.getBlogs({ page: 1, limit: 1 }),
      ExperienceService.getExperiences({ page: 1, limit: 1 }),
    ]);

    const totalBlogs = blogsResult.pagination.total;
    const totalExperiences = experiencesResult.pagination.total;

    return jsonResponse(
      successResponse('OK', {
        totalBlogs,
        totalExperiences,
      }),
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
});
