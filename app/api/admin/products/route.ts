import { NextRequest } from 'next/server';
import { jsonResponse } from '@/lib/api/response';
import { withErrorHandling, handleApiError } from '@/lib/api';
import { HTTP_STATUS, PAGINATION } from '@/constants';
import { ProductService, type CreateProductData } from '@/services';

// GET /api/admin/products
export const GET = withErrorHandling(async (request: NextRequest) => {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || String(PAGINATION.DEFAULT_PAGE));
        const limit = parseInt(searchParams.get('limit') || String(PAGINATION.DEFAULT_LIMIT));
        const search = searchParams.get('search') || undefined;
        const statusRaw = searchParams.get('status');
        const status = (statusRaw === 'draft' || statusRaw === 'published') ? statusRaw : undefined;

        const result = await ProductService.getProducts({ page, limit, search, status });
        return jsonResponse(result, HTTP_STATUS.OK);
    } catch (error: unknown) {
        return handleApiError(error);
    }
});

// POST /api/admin/products
export const POST = withErrorHandling(async (request: NextRequest) => {
    try {
        const body: CreateProductData = await request.json();
        const product = await ProductService.create(body);
        return jsonResponse(
            { success: true, message: 'Product created successfully', data: product },
            HTTP_STATUS.CREATED
        );
    } catch (error: unknown) {
        return handleApiError(error);
    }
});
