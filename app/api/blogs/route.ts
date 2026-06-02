import { NextRequest } from 'next/server';
import { jsonResponse, errorResponse } from '@/lib/api/response';
import { withErrorHandling, handleApiError } from '@/lib/api';
import { HTTP_STATUS, HTTP_MESSAGES, PAGINATION } from '@/constants';
import { BlogService } from '@/services/blog.service';

// GET /api/blogs - list published blogs (public)
export const GET = withErrorHandling(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || String(PAGINATION.DEFAULT_PAGE));
    const limit = parseInt(searchParams.get('limit') || String(PAGINATION.DEFAULT_LIMIT));
    const search = searchParams.get('search') || undefined;
    const tag = searchParams.get('tag') || undefined;

    // Always filter by published status for public API
    const result = await BlogService.getBlogs({ page, limit, search, status: 'published', tag });
    return jsonResponse(result, HTTP_STATUS.OK);
  } catch (error: unknown) {
    return handleApiError(error);
  }
});
