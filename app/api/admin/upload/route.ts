import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { jsonResponse, errorResponse, successResponse } from '@/lib/api/response';
import { withErrorHandling, handleApiError } from '@/lib/api';
import { HTTP_STATUS, HTTP_MESSAGES, MESSAGES } from '@/constants';
import { uploadToS3 } from '@/lib/s3/upload';

export const POST = withErrorHandling(async (request: NextRequest) => {
  try {
    await requireAdmin(request);

    const form = await request.formData();
    const file = form.get('file') as File | null;
    if (!file) {
      return jsonResponse(errorResponse('No file uploaded'), HTTP_STATUS.BAD_REQUEST);
    }

    // Upload to S3
    const result = await uploadToS3(file);

    if (!result.success) {
      return jsonResponse(errorResponse(result.error || 'Upload failed'), HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }

    return jsonResponse(successResponse('Uploaded', { url: result.url, key: result.key }), HTTP_STATUS.CREATED);
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
