import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { jsonResponse, errorResponse, successResponse } from '@/lib/api/response';
import { withErrorHandling, handleApiError } from '@/lib/api';
import { HTTP_STATUS, HTTP_MESSAGES, MESSAGES, PAGINATION } from '@/constants';
import { BlogService } from '@/services/blog.service';

interface BlogPayload {
  title?: string;
  slug?: string;
  excerpt?: string;
  contentHtml?: string;
  coverImage?: string;
  author?: string;
  tags?: string[];
  status?: 'draft' | 'published';
  metaTitle?: string;
  metaDescription?: string;
  publishedAt?: string | null;
}

interface FieldErrors {
  title?: string;
  slug?: string;
  excerpt?: string;
  contentHtml?: string;
  metaTitle?: string;
  metaDescription?: string;
}

function validateBlogPayload(payload: BlogPayload): FieldErrors {
  const errors: FieldErrors = {};

  if (!payload.title?.trim()) {
    errors.title = 'Title is required';
  } else if (payload.title.length > 200) {
    errors.title = 'Title must not exceed 200 characters';
  }

  if (!payload.slug?.trim()) {
    errors.slug = 'Slug is required';
  } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(payload.slug)) {
    errors.slug = 'Slug must be URL-safe (lowercase letters, numbers, hyphens)';
  }

  if (payload.excerpt && payload.excerpt.length > 500) {
    errors.excerpt = 'Excerpt must not exceed 500 characters';
  }

  if (!payload.contentHtml?.trim()) {
    errors.contentHtml = 'Content is required';
  }

  if (payload.metaTitle && payload.metaTitle.length > 200) {
    errors.metaTitle = 'Meta title must not exceed 200 characters';
  }

  if (payload.metaDescription && payload.metaDescription.length > 300) {
    errors.metaDescription = 'Meta description must not exceed 300 characters';
  }

  return errors;
}

// GET /api/admin/blogs - list blogs (admin only)
export const GET = withErrorHandling(async (request: NextRequest) => {
  try {
    await requireAdmin(request);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || String(PAGINATION.DEFAULT_PAGE));
    const limit = parseInt(searchParams.get('limit') || String(PAGINATION.DEFAULT_LIMIT));
    const search = searchParams.get('search') || undefined;
    const status = (searchParams.get('status') as 'draft' | 'published') || undefined;
    const tag = searchParams.get('tag') || undefined;

    const result = await BlogService.getBlogs({ page, limit, search, status, tag });
    return jsonResponse(result, HTTP_STATUS.OK);
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

// POST /api/admin/blogs - create blog (admin only)
export const POST = withErrorHandling(async (request: NextRequest) => {
  try {
    await requireAdmin(request);
    const payload = await request.json();

    // Validate payload
    const validationErrors = validateBlogPayload(payload);
    if (Object.keys(validationErrors).length > 0) {
      return jsonResponse(
        {
          success: false,
          message: 'Validation failed',
          errors: validationErrors as Record<string, string>,
        },
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const blog = await BlogService.create(payload);
    return jsonResponse(successResponse('Blog created', blog), HTTP_STATUS.CREATED);
  } catch (error: unknown) {
    const err = error as { message?: string; code?: number };
    if (err.message === MESSAGES.AUTH.NO_TOKEN || err.message === MESSAGES.AUTH.INVALID_TOKEN) {
      return jsonResponse(errorResponse(HTTP_MESSAGES.UNAUTHORIZED), HTTP_STATUS.UNAUTHORIZED);
    }
    if (err.message === MESSAGES.AUTH.INSUFFICIENT_PERMISSIONS) {
      return jsonResponse(errorResponse(MESSAGES.AUTH.ADMIN_REQUIRED), HTTP_STATUS.FORBIDDEN);
    }
    // Handle duplicate slug error
    if (err.code === 11000) {
      return jsonResponse(
        {
          success: false,
          message: 'Validation failed',
          errors: { slug: 'This slug is already in use' },
        },
        HTTP_STATUS.BAD_REQUEST
      );
    }
    return handleApiError(error);
  }
});
