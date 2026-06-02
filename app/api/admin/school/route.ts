import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { SchoolService } from '@/services';
import { jsonResponse, errorResponse, successResponse } from '@/lib/api/response';
import { withErrorHandling, handleApiError } from '@/lib/api';
import { HTTP_STATUS, HTTP_MESSAGES, MESSAGES, PAGINATION } from '@/constants';
import { z } from 'zod';

// GET /api/admin/school - list school aspirants (admin only)
export const GET = withErrorHandling(async (request: NextRequest) => {
  try {
    await requireAdmin(request);

    const { searchParams } = new URL(request.url);
    const page = parseInt(
      searchParams.get('page') || String(PAGINATION.DEFAULT_PAGE),
      10
    );
    const limit = parseInt(
      searchParams.get('limit') || String(PAGINATION.DEFAULT_LIMIT),
      10
    );
    const status = (searchParams.get('status') as
      | 'new'
      | 'contacted'
      | 'enrolled'
      | 'rejected') || undefined;
    const email = searchParams.get('email') || undefined;
    const name = searchParams.get('name') || undefined;

    const result = await SchoolService.getAspirants({
      page,
      limit,
      status,
      email,
      name,
    });

    return jsonResponse(result, HTTP_STATUS.OK);
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

// PATCH /api/admin/school - update aspirant status and notes (admin only)
const updateSchema = z.object({
  id: z.string(),
  status: z.enum(['new', 'contacted', 'enrolled', 'rejected']).optional(),
  notes: z.string().max(1000, 'Notes must not exceed 1000 characters').optional(),
});

export const PATCH = withErrorHandling(async (request: NextRequest) => {
  try {
    await requireAdmin(request);

    const body = await request.json();
    const data = updateSchema.parse(body);

    const aspirant = await SchoolService.updateAspirant(data.id, {
      status: data.status,
      notes: data.notes,
    });

    if (!aspirant) {
      return jsonResponse(
        errorResponse('Aspirant not found'),
        HTTP_STATUS.NOT_FOUND
      );
    }

    return jsonResponse(
      successResponse('Aspirant updated successfully', aspirant),
      HTTP_STATUS.OK
    );
  } catch (error: unknown) {
    const err = error as { message?: string };
    if (error instanceof z.ZodError) {
      return jsonResponse(
        errorResponse(MESSAGES.VALIDATION.ERROR, error.issues[0].message),
        HTTP_STATUS.BAD_REQUEST
      );
    }
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
