import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { getSettings, updateSettings } from '@/services/settings.service';
import { jsonResponse, errorResponse, successResponse } from '@/lib/api/response';
import { withErrorHandling, handleApiError } from '@/lib/api';
import { HTTP_STATUS, MESSAGES } from '@/constants';
import { z } from 'zod';

const updateSettingsSchema = z.object({
  organizationName: z.string().min(1, 'Organization name is required').max(200, 'Name must not exceed 200 characters').optional(),
  email: z.string().email('Invalid email address').optional(),
  phone: z.string().max(30, 'Phone must not exceed 30 characters').optional(),
  address: z.string().max(500, 'Address must not exceed 500 characters').optional(),
  mapLocationKeyframe: z.string().max(5000, 'Map keyframe must not exceed 5000 characters').optional(),
});

export type UpdateSettingsBody = z.infer<typeof updateSettingsSchema>;

// GET /api/admin/settings — get app settings (admin only)
export const GET = withErrorHandling(async (request: NextRequest) => {
  try {
    await requireAdmin(request);
    const settings = await getSettings();
    const data = {
      id: settings._id.toString(),
      organizationName: settings.organizationName,
      email: settings.email,
      phone: settings.phone,
      address: settings.address,
      mapLocationKeyframe: settings.mapLocationKeyframe,
      updatedAt: settings.updatedAt,
    };
    return jsonResponse(successResponse('OK', data), HTTP_STATUS.OK);
  } catch (error: unknown) {
    if (error instanceof Error && (error.message === MESSAGES.AUTH.NO_TOKEN || error.message === MESSAGES.AUTH.INVALID_TOKEN)) {
      return jsonResponse(errorResponse(MESSAGES.AUTH.INVALID_TOKEN), HTTP_STATUS.UNAUTHORIZED);
    }
    if (error instanceof Error && error.message === MESSAGES.AUTH.INSUFFICIENT_PERMISSIONS) {
      return jsonResponse(errorResponse(MESSAGES.AUTH.ADMIN_REQUIRED), HTTP_STATUS.FORBIDDEN);
    }
    return handleApiError(error);
  }
});

// PATCH /api/admin/settings — update app settings (admin only)
export const PATCH = withErrorHandling(async (request: NextRequest) => {
  try {
    await requireAdmin(request);

    const body = await request.json();
    const parsed = updateSettingsSchema.safeParse(body);

    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return jsonResponse(
        errorResponse(MESSAGES.VALIDATION.ERROR, first.message),
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const data = parsed.data;
    const updated = await updateSettings({
      ...(data.organizationName !== undefined && { organizationName: data.organizationName }),
      ...(data.email !== undefined && { email: data.email }),
      ...(data.phone !== undefined && { phone: data.phone }),
      ...(data.address !== undefined && { address: data.address }),
      ...(data.mapLocationKeyframe !== undefined && { mapLocationKeyframe: data.mapLocationKeyframe }),
    });

    return jsonResponse(
      {
        success: true,
        message: MESSAGES.SETTINGS.UPDATED,
        data: {
          id: updated._id.toString(),
          organizationName: updated.organizationName,
          email: updated.email,
          phone: updated.phone,
          address: updated.address,
          mapLocationKeyframe: updated.mapLocationKeyframe,
          updatedAt: updated.updatedAt,
        },
      },
      HTTP_STATUS.OK
    );
  } catch (error: unknown) {
    if (error instanceof Error && (error.message === MESSAGES.AUTH.NO_TOKEN || error.message === MESSAGES.AUTH.INVALID_TOKEN)) {
      return jsonResponse(errorResponse(MESSAGES.AUTH.INVALID_TOKEN), HTTP_STATUS.UNAUTHORIZED);
    }
    if (error instanceof Error && error.message === MESSAGES.AUTH.INSUFFICIENT_PERMISSIONS) {
      return jsonResponse(errorResponse(MESSAGES.AUTH.ADMIN_REQUIRED), HTTP_STATUS.FORBIDDEN);
    }
    return handleApiError(error);
  }
});
