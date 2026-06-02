import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { jsonResponse, errorResponse, successResponse } from '@/lib/api/response';
import { withErrorHandling, handleApiError } from '@/lib/api';
import { HTTP_STATUS, HTTP_MESSAGES, MESSAGES } from '@/constants';
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
  [key: string]: string | undefined;
}

function validateBlogPayload(payload: BlogPayload, isUpdate: boolean = false): FieldErrors {
  const errors: FieldErrors = {};

  // For updates, only validate fields that are present
  if (!isUpdate || payload.title !== undefined) {
    if (!payload.title?.trim()) {
      errors.title = 'Title is required';
    } else if (payload.title.length > 200) {
      errors.title = 'Title must not exceed 200 characters';
    }
  }

  if (!isUpdate || payload.slug !== undefined) {
    if (!payload.slug?.trim()) {
      errors.slug = 'Slug is required';
    } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(payload.slug)) {
      errors.slug = 'Slug must be URL-safe (lowercase letters, numbers, hyphens)';
    }
  }

  if (payload.excerpt && payload.excerpt.length > 500) {
    errors.excerpt = 'Excerpt must not exceed 500 characters';
  }

  if (!isUpdate || payload.contentHtml !== undefined) {
    if (!payload.contentHtml?.trim()) {
      errors.contentHtml = 'Content is required';
    }
  }

  if (payload.metaTitle && payload.metaTitle.length > 200) {
    errors.metaTitle = 'Meta title must not exceed 200 characters';
  }

  if (payload.metaDescription && payload.metaDescription.length > 300) {
    errors.metaDescription = 'Meta description must not exceed 300 characters';
  }

  return errors;
}

// GET /api/admin/blogs/[id] - get blog by id
export const GET = withErrorHandling(async (_request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    await requireAdmin(_request);
    const { id } = await params;
    const blog = await BlogService.getById(id);
    if (!blog) {
      return jsonResponse(errorResponse(HTTP_MESSAGES.NOT_FOUND), HTTP_STATUS.NOT_FOUND);
    }
    return jsonResponse(successResponse('OK', blog), HTTP_STATUS.OK);
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

// PUT /api/admin/blogs/[id] - update blog
export const PUT = withErrorHandling(async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    await requireAdmin(request);
    const { id } = await params;
    const payload = await request.json();

    // Validate payload for update
    const validationErrors = validateBlogPayload(payload, true);
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

    const updated = await BlogService.update(id, payload);
    if (!updated) {
      return jsonResponse(errorResponse(HTTP_MESSAGES.NOT_FOUND), HTTP_STATUS.NOT_FOUND);
    }
    return jsonResponse(successResponse('Blog updated', updated), HTTP_STATUS.OK);
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

// DELETE /api/admin/blogs/[id] - delete blog
export const DELETE = withErrorHandling(async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    await requireAdmin(request);
    const { id } = await params;
    await BlogService.remove(id);
    return jsonResponse(successResponse('Blog deleted'), HTTP_STATUS.OK);
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
