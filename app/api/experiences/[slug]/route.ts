import { NextRequest } from 'next/server';
import { jsonResponse, errorResponse, successResponse } from '@/lib/api/response';
import { withErrorHandling, handleApiError } from '@/lib/api';
import { HTTP_STATUS, HTTP_MESSAGES } from '@/constants';
import { ExperienceService } from '@/services/experience.service';

// GET /api/experiences/[slug] - get published experience by slug (public)
export const GET = withErrorHandling(async (_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) => {
  try {
    const { slug } = await params;
    const experience = await ExperienceService.getBySlug(slug);
    
    // Only return published experiences
    if (!experience || experience.status !== 'published') {
      return jsonResponse(errorResponse(HTTP_MESSAGES.NOT_FOUND), HTTP_STATUS.NOT_FOUND);
    }
    
    return jsonResponse(successResponse('OK', experience), HTTP_STATUS.OK);
  } catch (error: unknown) {
    return handleApiError(error);
  }
});
