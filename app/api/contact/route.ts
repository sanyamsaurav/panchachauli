import { NextRequest } from 'next/server';
import { ContactService } from '@/services';
import { successResponse, errorResponse, jsonResponse } from '@/lib/api/response';
import { withErrorHandling, handleApiError } from '@/lib/api';
import { HTTP_STATUS, HTTP_MESSAGES, MESSAGES } from '@/constants';
import { z } from 'zod';

const contactSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  mobileNumber: z
    .string()
    .trim()
    .regex(/^\+?[0-9]{10,15}$/, 'Mobile number must be 10-15 digits'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  message: z.string().min(2, 'Message must be at least 2 characters').max(2000, 'Message must not exceed 2000 characters'),
});

async function POSTHandler(request: NextRequest) {
  const body = await request.json();
  const data = contactSchema.parse(body);

  // Save contact message to database
  const contact = await ContactService.createContact({
    fullName: data.fullName,
    mobileNumber: data.mobileNumber,
    email: data.email || undefined,
    message: data.message,
  });

  return jsonResponse(
    successResponse(MESSAGES.CONTACT.SENT, {
      id: contact._id.toString(),
      fullName: contact.fullName,
      mobileNumber: contact.mobileNumber,
      email: contact.email,
      status: contact.status,
    }),
    HTTP_STATUS.CREATED
  );
}

export const POST = withErrorHandling(async (request: NextRequest) => {
  try {
    return await POSTHandler(request);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return jsonResponse(
        errorResponse(MESSAGES.VALIDATION.ERROR, error.issues[0].message),
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // Use error handler for other errors (will mask server errors)
    return handleApiError(error);
  }
});

