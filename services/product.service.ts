import connectDB from '@/lib/db/mongodb';
import { Product } from '@/models';
import type { IProduct } from '@/types/models';
import type { PaginatedResponse } from '@/types/api';
import { PAGINATION } from '@/constants';

export interface GetProductsParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: 'draft' | 'published';
}

export interface CreateProductData {
    title: string;
    slug: string;
    category: string;
    price: string;
    image: string;
    description?: string;
    features?: string[];
    hero?: {
        title: string;
        subtitle: string;
        image: string;
    };
    section2?: {
        title: string;
        description: string;
        image: string;
    };
    section3?: {
        title: string;
        description: string;
        image: string;
    };
    status?: 'draft' | 'published';
    order?: number;
}

export type UpdateProductData = Partial<CreateProductData>;

export class ProductService {
    static async getProducts(params: GetProductsParams = {}): Promise<PaginatedResponse<IProduct>> {
        await connectDB();

        const {
            page = PAGINATION.DEFAULT_PAGE,
            limit = PAGINATION.DEFAULT_LIMIT,
            search,
            status,
        } = params;

        const skip = (page - 1) * limit;
        const query: Record<string, unknown> = {};

        if (status) query.status = status;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } },
            ];
        }

        const products = await Product.find(query)
            .sort({ order: 1, createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Product.countDocuments(query);

        return {
            success: true,
            data: products,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    static async getById(id: string): Promise<IProduct | null> {
        await connectDB();
        return Product.findById(id);
    }

    static async getBySlug(slug: string): Promise<IProduct | null> {
        await connectDB();
        return Product.findOne({ slug });
    }

    static async create(data: CreateProductData): Promise<IProduct> {
        await connectDB();

        const exists = await Product.findOne({ slug: data.slug });
        if (exists) {
            throw new Error('Product with this slug already exists');
        }

        const product = await Product.create({
            title: data.title,
            slug: data.slug,
            category: data.category,
            price: data.price,
            image: data.image,
            description: data.description,
            features: data.features || [],
            hero: data.hero || { title: '', subtitle: '', image: '' },
            section2: data.section2 || { title: '', description: '', image: '' },
            section3: data.section3 || { title: '', description: '', image: '' },
            status: data.status ?? 'published',
            order: data.order ?? 0,
        });

        return product;
    }

    static async update(id: string, data: UpdateProductData): Promise<IProduct | null> {
        await connectDB();

        if (data.slug) {
            const exists = await Product.findOne({ slug: data.slug, _id: { $ne: id } });
            if (exists) {
                throw new Error('Another product with this slug already exists');
            }
        }

        const product = await Product.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true, runValidators: true }
        );
        return product;
    }

    static async remove(id: string): Promise<void> {
        await connectDB();
        await Product.findByIdAndDelete(id);
    }
}
