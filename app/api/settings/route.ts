import { getSettings } from '@/services/settings.service';
import { successResponse, jsonResponse } from '@/lib/api/response';
import { withErrorHandling, handleApiError } from '@/lib/api';
import { HTTP_STATUS } from '@/constants';

/** Public site settings (no auth) for footer and public pages */
// GET /api/settings
export const GET = withErrorHandling(async () => {
  try {
    const settings = await getSettings();
    const data = {
      organizationName: settings.organizationName,
      email: settings.email,
      phone: settings.phone,
      address: settings.address,
      mapLocationKeyframe: settings.mapLocationKeyframe ?? '',
    };
    return jsonResponse(successResponse('OK', data), HTTP_STATUS.OK);
  } catch (error) {
    return handleApiError(error);
  }
});
