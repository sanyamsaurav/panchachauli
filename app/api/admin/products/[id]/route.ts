import { NextRequest } from 'next/server';
import { jsonResponse } from '@/lib/api/response';
import { withErrorHandling, handleApiError } from '@/lib/api';
import { HTTP_STATUS } from '@/constants';
import { ProductService, type UpdateProductData } from '@/services';

// GET /api/admin/products/[id]
export const GET = withErrorHandling(
    async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
        try {
            const resolvedParams = await params;
            const product = await ProductService.getById(resolvedParams.id);
            if (!product) {
                return jsonResponse(
                    { success: false, message: 'Product not found', error: 'NOT_FOUND' },
                    HTTP_STATUS.NOT_FOUND
                );
            }
            return jsonResponse({ success: true, message: 'Product found', data: product }, HTTP_STATUS.OK);
        } catch (error: unknown) {
            return handleApiError(error);
        }
    }
);

// PUT /api/admin/products/[id]
export const PUT = withErrorHandling(
    async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
        try {
            const resolvedParams = await params;
            const body: UpdateProductData = await request.json();
            const product = await ProductService.update(resolvedParams.id, body);

            if (!product) {
                return jsonResponse(
                    { success: false, message: 'Product not found', error: 'NOT_FOUND' },
                    HTTP_STATUS.NOT_FOUND
                );
            }

            return jsonResponse(
                { success: true, message: 'Product updated successfully', data: product },
                HTTP_STATUS.OK
            );
        } catch (error: unknown) {
            return handleApiError(error);
        }
    }
);

// DELETE /api/admin/products/[id]
export const DELETE = withErrorHandling(
    async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
        try {
            const resolvedParams = await params;
            await ProductService.remove(resolvedParams.id);
            return jsonResponse(
                { success: true, message: 'Product deleted successfully' },
                HTTP_STATUS.OK
            );
        } catch (error: unknown) {
            return handleApiError(error);
        }
    }
);
