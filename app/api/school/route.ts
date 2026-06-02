import { NextRequest } from 'next/server';
import { SchoolService } from '@/services';
import { successResponse, errorResponse, jsonResponse } from '@/lib/api/response';
import { withErrorHandling, handleApiError } from '@/lib/api';
import { HTTP_STATUS, MESSAGES } from '@/constants';
import { z } from 'zod';

const schoolAspirantSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must not exceed 100 characters'),
  location: z.string().min(2, 'Location must be at least 2 characters').max(200, 'Location must not exceed 200 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 digits').max(20, 'Phone must not exceed 20 characters'),
  message: z.string().min(2, 'Message must be at least 2 characters').max(2000, 'Message must not exceed 2000 characters'),
});

async function POSTHandler(request: NextRequest) {
  const body = await request.json();
  const data = schoolAspirantSchema.parse(body);

  // Save school aspirant inquiry to database
  const aspirant = await SchoolService.createAspirant({
    name: data.name,
    location: data.location,
    email: data.email,
    phone: data.phone,
    message: data.message,
  });

  return jsonResponse(
    successResponse('Your inquiry has been submitted successfully. We will contact you soon!', {
      id: aspirant._id.toString(),
      name: aspirant.name,
      email: aspirant.email,
      status: aspirant.status,
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
