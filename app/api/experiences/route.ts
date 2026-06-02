import { NextRequest } from 'next/server';
import { jsonResponse } from '@/lib/api/response';
import { withErrorHandling, handleApiError } from '@/lib/api';
import { HTTP_STATUS, PAGINATION } from '@/constants';
import { ExperienceService } from '@/services/experience.service';

// GET /api/experiences - list published experiences (public)
export const GET = withErrorHandling(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || String(PAGINATION.DEFAULT_PAGE));
    const limit = parseInt(searchParams.get('limit') || String(PAGINATION.DEFAULT_LIMIT));
    const search = searchParams.get('search') || undefined;

    // Always filter by published status for public API
    const result = await ExperienceService.getExperiences({ page, limit, search, status: 'published' });
    return jsonResponse(result, HTTP_STATUS.OK);
  } catch (error: unknown) {
    return handleApiError(error);
  }
});
