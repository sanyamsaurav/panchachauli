import { NextRequest } from 'next/server';
import { jsonResponse, errorResponse, successResponse } from '@/lib/api/response';
import { withErrorHandling, handleApiError } from '@/lib/api';
import { HTTP_STATUS, HTTP_MESSAGES } from '@/constants';
import { BlogService } from '@/services/blog.service';

// GET /api/blogs/[slug] - get published blog by slug (public)
export const GET = withErrorHandling(async (_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) => {
  try {
    const { slug } = await params;
    const blog = await BlogService.getBySlug(slug);
    
    // Only return published blogs
    if (!blog || blog.status !== 'published') {
      return jsonResponse(errorResponse(HTTP_MESSAGES.NOT_FOUND), HTTP_STATUS.NOT_FOUND);
    }
    
    return jsonResponse(successResponse('OK', blog), HTTP_STATUS.OK);
  } catch (error: unknown) {
    return handleApiError(error);
  }
});
