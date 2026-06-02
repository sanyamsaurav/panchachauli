import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { jsonResponse, errorResponse, successResponse } from '@/lib/api/response';
import { withErrorHandling, handleApiError } from '@/lib/api';
import { HTTP_STATUS, HTTP_MESSAGES, MESSAGES } from '@/constants';
import { ExperienceService } from '@/services/experience.service';

// GET /api/admin/experiences/slug/[slug] - get experience by slug
export const GET = withErrorHandling(async (_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) => {
  try {
    await requireAdmin(_request);
    const { slug } = await params;
    const experience = await ExperienceService.getBySlug(slug);
    if (!experience) {
      return jsonResponse(errorResponse(HTTP_MESSAGES.NOT_FOUND), HTTP_STATUS.NOT_FOUND);
    }
    return jsonResponse(successResponse('OK', experience), HTTP_STATUS.OK);
  } catch (error: unknown) {
    const err = error as { message?: string };
    if (err.message === MESSAGES.AUTH.NO_TOKEN || err.message === MESSAGES.AUTH.INVALID_TOKEN) {
      return jsonResponse(errorResponse(HTTP_MESSAGES.UNAUTHORIZED), HTTP_STATUS.UNAUTHORIZED);
    }
    if (err.message === MESSAGES.AUTH.INSUFFICIENT_PERMISSIONS) {
      return jsonResponse(errorResponse(MESSAGES.AUTH.ADMIN_REQUIRED), HTTP_STATUS.FORBIDDEN);
    }
    return handleApiError(error);
  }
});
