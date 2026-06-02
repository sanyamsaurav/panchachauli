import { NextRequest } from 'next/server';
import { jsonResponse } from '@/lib/api/response';
import { withErrorHandling, handleApiError } from '@/lib/api';
import { HTTP_STATUS } from '@/constants';
import { ProductService } from '@/services/product.service';

// GET /api/products/[slug] - get published product by slug (public)
export const GET = withErrorHandling(
    async (request: NextRequest, { params }: { params: Promise<{ slug: string }> }) => {
        try {
            const resolvedParams = await params;
            const product = await ProductService.getBySlug(resolvedParams.slug);

            if (!product || product.status !== 'published') {
                return jsonResponse(
                    { success: false, message: 'Product not found', error: 'NOT_FOUND' },
                    HTTP_STATUS.NOT_FOUND
                );
            }

            return jsonResponse({ success: true, message: 'Product fetched successfully', data: product }, HTTP_STATUS.OK);
        } catch (error: unknown) {
            return handleApiError(error);
        }
    }
);
