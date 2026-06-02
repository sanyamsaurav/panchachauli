import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { jsonResponse, errorResponse, successResponse } from '@/lib/api/response';
import { withErrorHandling, handleApiError } from '@/lib/api';
import { HTTP_STATUS, HTTP_MESSAGES, MESSAGES, PAGINATION } from '@/constants';
import { ExperienceService } from '@/services/experience.service';

// GET /api/admin/experiences - list experiences (admin only)
export const GET = withErrorHandling(async (request: NextRequest) => {
  try {
    await requireAdmin(request);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || String(PAGINATION.DEFAULT_PAGE));
    const limit = parseInt(searchParams.get('limit') || String(PAGINATION.DEFAULT_LIMIT));
    const search = searchParams.get('search') || undefined;
    const status = (searchParams.get('status') as 'draft' | 'published') || undefined;

    const result = await ExperienceService.getExperiences({ page, limit, search, status });
    return jsonResponse(result, HTTP_STATUS.OK);
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

// POST /api/admin/experiences - create experience (admin only)
export const POST = withErrorHandling(async (request: NextRequest) => {
  try {
    await requireAdmin(request);
    const payload = await request.json();
    const experience = await ExperienceService.create(payload);
    return jsonResponse(successResponse('Experience created', experience), HTTP_STATUS.CREATED);
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
