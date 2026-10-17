import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { ContactService } from '@/services';
import { jsonResponse, errorResponse, successResponse } from '@/lib/api/response';
import { withErrorHandling, handleApiError } from '@/lib/api';
import { HTTP_STATUS, HTTP_MESSAGES, MESSAGES } from '@/constants';

// DELETE /api/admin/contacts/[id] - delete a contact message (admin only)
export const DELETE = withErrorHandling(
  async (
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
  ) => {
    try {
      await requireAdmin(request);

      const { id } = await context.params;
      if (!id) {
        return jsonResponse(
          errorResponse('Contact id is required'),
          HTTP_STATUS.BAD_REQUEST
        );
      }

      const deleted = await ContactService.deleteContact(id);

      if (!deleted) {
        return jsonResponse(
          errorResponse('Contact not found'),
          HTTP_STATUS.NOT_FOUND
        );
      }

      return jsonResponse(
        successResponse('Contact deleted successfully'),
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
  }
);

// PATCH /api/admin/contacts/[id] - update contact status (admin only)
export const PATCH = withErrorHandling(
  async (
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
  ) => {
    try {
      await requireAdmin(request);

      const { id } = await context.params;
      if (!id) {
        return jsonResponse(
          errorResponse('Contact id is required'),
          HTTP_STATUS.BAD_REQUEST
        );
      }

      const body = await request.json();
      const { status } = body;

      if (!status || !['new', 'read', 'replied', 'archived'].includes(status)) {
        return jsonResponse(
          errorResponse('Valid status is required (new, read, replied, archived)'),
          HTTP_STATUS.BAD_REQUEST
        );
      }

      const updated = await ContactService.updateContactStatus(id, status);

      if (!updated) {
        return jsonResponse(
          errorResponse('Contact not found'),
          HTTP_STATUS.NOT_FOUND
        );
      }

      return jsonResponse(
        successResponse('Contact status updated successfully', updated),
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
  }
);

