import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { ContactService } from '@/services';
import { jsonResponse, errorResponse } from '@/lib/api/response';
import { withErrorHandling, handleApiError } from '@/lib/api';
import { HTTP_STATUS, HTTP_MESSAGES, MESSAGES, PAGINATION } from '@/constants';

// GET /api/admin/contacts - list contact messages (admin only)
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
      | 'read'
      | 'replied'
      | 'archived') || undefined;
    const email = searchParams.get('email') || undefined;

    const result = await ContactService.getContacts({
      page,
      limit,
      status,
      email,
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

