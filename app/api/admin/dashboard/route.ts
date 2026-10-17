import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import {
  BlogService,
  ExperienceService,
  ContactService,
  SchoolService,
  ProductService,
} from '@/services';
import { NewsletterSubscriber } from '@/models';
import connectDB from '@/lib/db/mongodb';
import { jsonResponse, errorResponse, successResponse } from '@/lib/api/response';
import { withErrorHandling, handleApiError } from '@/lib/api';
import { HTTP_STATUS, HTTP_MESSAGES, MESSAGES } from '@/constants';

/**
 * GET /api/admin/dashboard
 * Returns dashboard stats including customer enquiries, school aspirants, blogs, etc.
 */
export const GET = withErrorHandling(async (_request: NextRequest) => {
  try {
    await requireAdmin(_request);
    await connectDB();

    const [
      blogsResult,
      experiencesResult,
      productsResult,
      contactsStats,
      recentContactsResult,
      schoolAspirantsResult,
      newSchoolCount,
      subscribersCount,
    ] = await Promise.all([
      BlogService.getBlogs({ page: 1, limit: 1 }).catch(() => ({ pagination: { total: 0 } })),
      ExperienceService.getExperiences({ page: 1, limit: 1 }).catch(() => ({ pagination: { total: 0 } })),
      ProductService.getProducts({ page: 1, limit: 1 }).catch(() => ({ pagination: { total: 0 } })),
      ContactService.getContactsStats().catch(() => ({ total: 0, new: 0, read: 0, replied: 0, archived: 0 })),
      ContactService.getContacts({ page: 1, limit: 8 }).catch(() => ({ data: [] })),
      SchoolService.getAspirants({ page: 1, limit: 6 }).catch(() => ({ pagination: { total: 0 }, data: [] })),
      SchoolService.getNewCount().catch(() => 0),
      NewsletterSubscriber.countDocuments().catch(() => 0),
    ]);

    const totalBlogs = blogsResult.pagination.total;
    const totalExperiences = experiencesResult.pagination.total;
    const totalProducts = productsResult.pagination.total;

    return jsonResponse(
      successResponse('OK', {
        totalBlogs,
        totalExperiences,
        totalProducts,
        totalContacts: contactsStats.total,
        newContactsCount: contactsStats.new,
        contactsStats,
        recentContacts: recentContactsResult.data,
        totalSchoolAspirants: schoolAspirantsResult.pagination.total,
        newSchoolCount,
        recentSchoolAspirants: schoolAspirantsResult.data,
        totalSubscribers: subscribersCount,
      }),
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
});
