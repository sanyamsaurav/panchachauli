import { NextRequest } from "next/server";
import connectDB from "@/lib/db/mongodb";
import NewsletterSubscriber from "@/models/NewsletterSubscriber";
import { requireAdmin } from "@/lib/auth";
import { jsonResponse, errorResponse, successResponse } from "@/lib/api/response";
import { withErrorHandling, handleApiError } from "@/lib/api";
import { HTTP_STATUS, HTTP_MESSAGES, MESSAGES } from "@/constants";

// GET /api/admin/newsletter - Get all subscribers (admin only)
export const GET = withErrorHandling(async (request: NextRequest) => {
  try {
    await requireAdmin(request);
    await connectDB();

    // Get query params
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status"); // 'active', 'inactive', or null for all
    const search = searchParams.get("search");

    // Build query
    const query: any = {};
    
    if (status === "active") {
      query.isActive = true;
    } else if (status === "inactive") {
      query.isActive = false;
    }

    if (search) {
      query.email = { $regex: search, $options: "i" };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get subscribers
    const subscribers = await NewsletterSubscriber.find(query)
      .sort({ subscribedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count
    const total = await NewsletterSubscriber.countDocuments(query);
    const totalActive = await NewsletterSubscriber.countDocuments({ isActive: true });
    const totalInactive = await NewsletterSubscriber.countDocuments({ isActive: false });

    return jsonResponse(
      successResponse("Subscribers fetched successfully", {
        subscribers,
        stats: {
          totalActive,
          totalInactive,
        },
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      }),
      HTTP_STATUS.OK
    );

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

// DELETE /api/admin/newsletter?id=xxx - Delete/unsubscribe a user
export const DELETE = withErrorHandling(async (request: NextRequest) => {
  try {
    await requireAdmin(request);
    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return jsonResponse(
        errorResponse("Subscriber ID is required"),
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // Soft delete - mark as inactive
    const subscriber = await NewsletterSubscriber.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!subscriber) {
      return jsonResponse(
        errorResponse("Subscriber not found"),
        HTTP_STATUS.NOT_FOUND
      );
    }

    return jsonResponse(
      successResponse("Subscriber removed successfully", subscriber),
      HTTP_STATUS.OK
    );

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
